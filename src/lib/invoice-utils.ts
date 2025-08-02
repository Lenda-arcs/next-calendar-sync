import { createClient } from '@/lib/supabase'
import { Event, Invoice, InvoiceInsert, UserInvoiceSettings, BillingEntity, BillingEntityInsert, BillingEntityUpdate, RateConfig, RateConfigFlat, RateConfigPerStudent, RateConfigTiered, RecipientInfo, BankingInfo, PDFTemplateConfig, PDFTemplateTheme } from '@/lib/types'

// Extended Event interface for substitute teaching  
export interface ExtendedEvent extends Omit<Event, 'invoice_type' | 'substitute_notes' | 'substitute_teacher_entity_id'> {
  invoice_type: 'studio_invoice' | 'teacher_invoice' | null
  substitute_notes: string | null
  substitute_teacher_entity_id: string | null
}

// Event with billing entity relationship
export interface EventWithBillingEntity extends Event {
  billing_entity: BillingEntity | null
}

// For backward compatibility, keep the studio interface (maps to billing entity)
export interface EventWithStudio extends Event {
  studio: BillingEntity | null
}

// New interface for events with substitute teacher info
export interface EventWithSubstituteTeacher extends Event {
  studio: BillingEntity | null // Rate source (original studio)
  substitute_teacher: BillingEntity | null // Payment recipient (teacher)
}

export interface InvoiceWithDetails extends Invoice {
  studio: BillingEntity
  substitute_teacher?: BillingEntity | null // For substitute invoices
  events: Event[]
  event_count: number
}

/**
 * Generate a unique invoice number
 */
export function generateInvoiceNumber(userPrefix: string = "INV"): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const timestamp = now.getTime().toString().slice(-6)
  
  return `${userPrefix}-${year}${month}-${timestamp}`
}

// Note: RateTier interface is now defined in types.ts as part of RateConfigTiered

/**
 * Calculate payout for a single event based on billing entity rules
 * Enhanced calculation supports:
 * - Tiered rate system (different rates for different student count ranges)
 * - Online student ceiling (limit bonuses for online students)
 * - Flat rate with thresholds
 * - Per-student rates
 * 
 * Note: Teachers don't have their own rate configs, they use the studio's rates
 */
export function calculateEventPayout(event: Event, billingEntity: BillingEntity): number {
  const studioStudents = event.students_studio || 0
  const onlineStudents = event.students_online || 0
  
  // Properly cast the JSON rate_config field to RateConfig type
  const rateConfig = billingEntity.rate_config as RateConfig | null
  
  if (!rateConfig) {
    // Teachers don't have rate configs, this should use the studio's rates
    // This function should be called with the studio entity for rate calculations
    return 0
  }
  
  switch (rateConfig.type) {
    case 'tiered':
      return calculateTieredRatePayout(studioStudents, onlineStudents, rateConfig)
    case 'per_student':
      return calculatePerStudentRatePayout(studioStudents, onlineStudents, rateConfig)
    case 'flat':
    default:
      return calculateFlatRatePayout(studioStudents, onlineStudents, rateConfig)
  }
}

/**
 * Calculate payout using tiered rate system
 */
function calculateTieredRatePayout(studioStudents: number, onlineStudents: number, rateConfig: RateConfigTiered): number {
  const totalStudents = studioStudents + onlineStudents
  
  // Find the appropriate tier for the student count
  const tier = rateConfig.tiers.find(tier => {
    return totalStudents >= tier.min && 
           (tier.max === null || totalStudents <= tier.max)
  })
  
  if (!tier) {
    // No matching tier found, return 0
    return 0
  }
  
  let payout = tier.rate
  
  // Apply online bonus with ceiling if configured
  if (rateConfig.online_bonus_per_student && onlineStudents > 0) {
    const eligibleOnlineStudents = rateConfig.online_bonus_ceiling 
      ? Math.min(onlineStudents, rateConfig.online_bonus_ceiling)
      : onlineStudents
    
    payout += eligibleOnlineStudents * rateConfig.online_bonus_per_student
  }
  
  return Math.max(payout, 0)
}

/**
 * Calculate payout using per-student rate system
 */
function calculatePerStudentRatePayout(studioStudents: number, onlineStudents: number, rateConfig: RateConfigPerStudent): number {
  const totalStudents = studioStudents + onlineStudents
  let payout = totalStudents * rateConfig.rate_per_student
  
  // Apply online bonus with ceiling if configured
  if (rateConfig.online_bonus_per_student && onlineStudents > 0) {
    const eligibleOnlineStudents = rateConfig.online_bonus_ceiling 
      ? Math.min(onlineStudents, rateConfig.online_bonus_ceiling)
      : onlineStudents
    
    payout += eligibleOnlineStudents * rateConfig.online_bonus_per_student
  }
  
  return Math.max(payout, 0)
}

/**
 * Calculate payout using flat rate system with thresholds
 */
function calculateFlatRatePayout(studioStudents: number, onlineStudents: number, rateConfig: RateConfigFlat): number {
  const totalStudents = studioStudents + onlineStudents
  let payout = rateConfig.base_rate
  
  // Check minimum student threshold
  if (rateConfig.minimum_threshold && totalStudents < rateConfig.minimum_threshold) {
    // Below minimum threshold - in the new system we don't apply penalties, just use base rate
    // Could add penalty logic here if needed in the future
  }

  // Check bonus student threshold and add bonus payments
  if (rateConfig.bonus_threshold && rateConfig.bonus_per_student && 
      totalStudents > rateConfig.bonus_threshold) {
    const bonusStudents = totalStudents - rateConfig.bonus_threshold
    payout += bonusStudents * rateConfig.bonus_per_student
  }

  // Apply online bonus with ceiling
  if (rateConfig.online_bonus_per_student && onlineStudents > 0) {
    const eligibleOnlineStudents = rateConfig.online_bonus_ceiling 
      ? Math.min(onlineStudents, rateConfig.online_bonus_ceiling)
      : onlineStudents
    
    payout += eligibleOnlineStudents * rateConfig.online_bonus_per_student
  }

  // Apply maximum discount limit to prevent excessive penalties
  if (rateConfig.max_discount) {
    const minimumPayout = rateConfig.base_rate - rateConfig.max_discount
    payout = Math.max(payout, minimumPayout)
  }

  return Math.max(payout, 0)
}



/**
 * Calculate total payout for multiple events
 */
export function calculateTotalPayout(events: Event[], billingEntity: BillingEntity): number {
  return events.reduce((total, event) => total + calculateEventPayout(event, billingEntity), 0)
}

/**
 * Generate rate calculation examples for display purposes
 * Supports tiered rates, per-student rates, and flat rates with thresholds
 */
export function generateRateCalculationExamples(billingEntity: BillingEntity): {
  belowMinimum?: string;
  betweenThresholds?: string;
  aboveBonus?: string;
  tieredExamples?: string[];
} {
  const currency = billingEntity.currency || 'EUR'
  const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency
  const rateConfig = billingEntity.rate_config as RateConfig
  
  if (!rateConfig) {
    return {}
  }
  
  switch (rateConfig.type) {
    case 'tiered':
      return generateTieredRateExamples(rateConfig, symbol)
    case 'per_student':
      return generatePerStudentRateExamples(rateConfig, symbol)
    case 'flat':
    default:
      return generateFlatRateExamples(rateConfig, symbol)
  }
}

/**
 * Generate examples for tiered rate system
 */
function generateTieredRateExamples(rateConfig: RateConfigTiered, symbol: string): {
  tieredExamples: string[];
} {
  const tieredExamples: string[] = []
  
  rateConfig.tiers.forEach((tier) => {
    const exampleStudents = tier.min + Math.floor((tier.max ? tier.max - tier.min : 2) / 2)
    let exampleText = `${exampleStudents} students: ${symbol}${tier.rate.toFixed(2)}`
    
    // Add online bonus example if configured
    if (rateConfig.online_bonus_per_student) {
      const onlineStudents = Math.min(2, exampleStudents) // Example with 2 online students
      const eligibleOnlineStudents = rateConfig.online_bonus_ceiling 
        ? Math.min(onlineStudents, rateConfig.online_bonus_ceiling)
        : onlineStudents
      
      if (eligibleOnlineStudents > 0) {
        const onlineBonus = eligibleOnlineStudents * rateConfig.online_bonus_per_student
        const totalPayout = tier.rate + onlineBonus
        exampleText += ` + ${symbol}${onlineBonus.toFixed(2)} online bonus = ${symbol}${totalPayout.toFixed(2)}`
      }
    }
    
    // Add tier range description
    const rangeText = tier.max 
      ? `(${tier.min}-${tier.max} students)`
      : `(${tier.min}+ students)`
    exampleText += ` ${rangeText}`
    
    tieredExamples.push(exampleText)
  })
  
  return { tieredExamples }
}

/**
 * Generate examples for per-student rate system
 */
function generatePerStudentRateExamples(rateConfig: RateConfigPerStudent, symbol: string): {
  belowMinimum?: string;
  betweenThresholds?: string;
  aboveBonus?: string;
} {
  let exampleText = `${symbol}${rateConfig.rate_per_student.toFixed(2)} per student`
  
  if (rateConfig.online_bonus_per_student) {
    exampleText += ` + ${symbol}${rateConfig.online_bonus_per_student.toFixed(2)} online bonus`
    if (rateConfig.online_bonus_ceiling) {
      exampleText += ` (max ${rateConfig.online_bonus_ceiling} students)`
    }
  }
  
  return {
    betweenThresholds: `Example: 10 students = ${symbol}${(rateConfig.rate_per_student * 10).toFixed(2)} ${exampleText}`
  }
}

/**
 * Generate examples for flat rate system
 */
function generateFlatRateExamples(rateConfig: RateConfigFlat, symbol: string): {
  belowMinimum?: string;
  betweenThresholds?: string;
  aboveBonus?: string;
} {
  const examples: { belowMinimum?: string; betweenThresholds?: string; aboveBonus?: string } = {}
  
  const minimumThreshold = rateConfig.minimum_threshold || 0
  const bonusThreshold = rateConfig.bonus_threshold
  const baseRate = rateConfig.base_rate
  const bonusPerStudent = rateConfig.bonus_per_student || 0
  
  // Below minimum threshold example
  if (minimumThreshold > 0) {
    const exampleStudents = Math.max(1, minimumThreshold - 1)
    let finalPayout = baseRate
    
    // Add online bonus example
    let exampleText = `${exampleStudents} students: ${symbol}${baseRate.toFixed(2)} (base rate)`
    
    if (rateConfig.online_bonus_per_student && exampleStudents > 0) {
      const onlineStudents = Math.min(1, exampleStudents)
      const eligibleOnlineStudents = rateConfig.online_bonus_ceiling 
        ? Math.min(onlineStudents, rateConfig.online_bonus_ceiling)
        : onlineStudents
      
      if (eligibleOnlineStudents > 0) {
        const onlineBonus = eligibleOnlineStudents * rateConfig.online_bonus_per_student
        finalPayout += onlineBonus
        exampleText += ` + ${symbol}${onlineBonus.toFixed(2)} online = ${symbol}${finalPayout.toFixed(2)}`
      }
    }
    
    examples.belowMinimum = exampleText
  }
  
  // Between thresholds example (if applicable)
  if (minimumThreshold > 0 || bonusThreshold) {
    const exampleStudents = bonusThreshold ? Math.max(minimumThreshold + 1, bonusThreshold - 2) : minimumThreshold + 2
    let exampleText = `${exampleStudents} students: ${symbol}${baseRate.toFixed(2)} (base rate)`
    
    // Add online bonus example
    if (rateConfig.online_bonus_per_student) {
      const onlineStudents = Math.min(2, exampleStudents)
      const eligibleOnlineStudents = rateConfig.online_bonus_ceiling 
        ? Math.min(onlineStudents, rateConfig.online_bonus_ceiling)
        : onlineStudents
      
      if (eligibleOnlineStudents > 0) {
        const onlineBonus = eligibleOnlineStudents * rateConfig.online_bonus_per_student
        const totalPayout = baseRate + onlineBonus
        exampleText += ` + ${symbol}${onlineBonus.toFixed(2)} online = ${symbol}${totalPayout.toFixed(2)}`
      }
    }
    
    examples.betweenThresholds = exampleText
  }
  
  // Above bonus threshold example
  if (bonusThreshold && bonusPerStudent > 0) {
    const exampleStudents = bonusThreshold + 2
    const bonusStudents = exampleStudents - bonusThreshold
    const bonusAmount = bonusStudents * bonusPerStudent
    let finalPayout = baseRate + bonusAmount
    let exampleText = `${exampleStudents} students: ${symbol}${baseRate} + (${bonusStudents} × ${symbol}${bonusPerStudent}) = ${symbol}${finalPayout.toFixed(2)}`
    
    // Add online bonus example
    if (rateConfig.online_bonus_per_student) {
      const onlineStudents = Math.min(2, exampleStudents)
      const eligibleOnlineStudents = rateConfig.online_bonus_ceiling 
        ? Math.min(onlineStudents, rateConfig.online_bonus_ceiling)
        : onlineStudents
      
      if (eligibleOnlineStudents > 0) {
        const onlineBonus = eligibleOnlineStudents * rateConfig.online_bonus_per_student
        finalPayout += onlineBonus
        exampleText += ` + ${symbol}${onlineBonus.toFixed(2)} online = ${symbol}${finalPayout.toFixed(2)}`
      }
    }
    
    examples.aboveBonus = exampleText
  }
  
  return examples
}

/**
 * Get uninvoiced events for a user
 * Excludes events marked as excluded from billing entity matching
 * FIXED: Now studio_id always points to the rate source (original studio)
 */
export async function getUninvoicedEvents(userId: string): Promise<EventWithSubstituteTeacher[]> {
  const supabase = createClient()
  
  // First get the events
  const { data: eventsData, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", userId)
    .lt("end_time", new Date().toISOString()) // Events that have ended
    .is("invoice_id", null) // Not yet invoiced
    .not("studio_id", "is", null) // Has billing entity assigned
    .or("exclude_from_studio_matching.eq.false,invoice_type.eq.teacher_invoice") // Studio events OR teacher invoice events
    .order("end_time", { ascending: false })

  if (error) {
    console.error("Error fetching uninvoiced events:", error)
    throw new Error(`Failed to fetch uninvoiced events: ${error.message}`)
  }

  if (!eventsData || eventsData.length === 0) {
    return []
  }

  // Get all unique studio IDs and substitute teacher entity IDs
  const studioIds = new Set<string>()
  const substituteTeacherIds = new Set<string>()
  
  eventsData.forEach(event => {
    if (event.studio_id) studioIds.add(event.studio_id)
    if (event.substitute_teacher_entity_id) substituteTeacherIds.add(event.substitute_teacher_entity_id)
  })

  // Fetch all needed billing entities in one query
  const allEntityIds = [...studioIds, ...substituteTeacherIds]
  const { data: entitiesData, error: entitiesError } = await supabase
    .from("billing_entities")
    .select("*")
    .in("id", allEntityIds)

  if (entitiesError) {
    console.error("Error fetching billing entities:", entitiesError)
    throw new Error(`Failed to fetch billing entities: ${entitiesError.message}`)
  }

  // Create a map for quick lookup
  const entitiesMap = new Map<string, BillingEntity>()
  entitiesData?.forEach(entity => {
    entitiesMap.set(entity.id, entity as BillingEntity)
  })

  // Combine events with their billing entities
  const data = eventsData.map(event => ({
    ...event,
    studio: event.studio_id ? entitiesMap.get(event.studio_id) || null : null,
    substitute_teacher: event.substitute_teacher_entity_id ? entitiesMap.get(event.substitute_teacher_entity_id) || null : null,
  }))

  return data as EventWithSubstituteTeacher[]
}

/**
 * Get uninvoiced events grouped by billing entity
 * Groups by substitute teacher when present, otherwise by studio
 */
export async function getUninvoicedEventsByStudio(userId: string): Promise<Record<string, EventWithSubstituteTeacher[]>> {
  const events = await getUninvoicedEvents(userId)
  
  return events.reduce((acc, event) => {
    // Group by substitute teacher if present, otherwise by studio
    const groupingId = event.substitute_teacher_entity_id || event.studio_id!
    if (!acc[groupingId]) {
      acc[groupingId] = []
    }
    acc[groupingId].push(event)
    return acc
  }, {} as Record<string, EventWithSubstituteTeacher[]>)
}

/**
 * Get user invoices with details
 */
export async function getUserInvoices(userId: string): Promise<InvoiceWithDetails[]> {
  const supabase = createClient()
  
  // First get invoices
  const { data: invoices, error: invoiceError } = await supabase
    .from("invoices")
    .select("*, events(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (invoiceError) {
    console.error("Error fetching user invoices:", invoiceError)
    throw new Error(`Failed to fetch invoices: ${invoiceError.message}`)
  }

  if (!invoices || invoices.length === 0) {
    return []
  }

  // Get all unique billing entity IDs
  const studioIds = new Set<string>()
  const substituteTeacherIds = new Set<string>()
  
  invoices.forEach(invoice => {
    if (invoice.studio_id) studioIds.add(invoice.studio_id)
    if (invoice.substitute_teacher_entity_id) substituteTeacherIds.add(invoice.substitute_teacher_entity_id)
  })

  // Fetch all needed billing entities
  const allEntityIds = [...studioIds, ...substituteTeacherIds]
  const { data: entities, error: entitiesError } = await supabase
    .from("billing_entities")
    .select("*")
    .in("id", allEntityIds)

  if (entitiesError) {
    console.error("Error fetching billing entities:", entitiesError)
    throw new Error(`Failed to fetch billing entities: ${entitiesError.message}`)
  }

  // Create lookup map
  const entitiesMap = new Map<string, BillingEntity>()
  entities?.forEach(entity => {
    entitiesMap.set(entity.id, entity as BillingEntity)
  })

  // Combine data
  return invoices.map(invoice => ({
    ...invoice,
    studio: invoice.studio_id ? entitiesMap.get(invoice.studio_id)! : {} as BillingEntity,
    substitute_teacher: invoice.substitute_teacher_entity_id ? entitiesMap.get(invoice.substitute_teacher_entity_id) || null : null,
    events: invoice.events || [],
    event_count: invoice.events?.length || 0,
  }))
}

/**
 * Create a new invoice
 */
export async function createInvoice(invoiceData: InvoiceInsert): Promise<Invoice> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("invoices")
    .insert(invoiceData)
    .select()
    .single()

  if (error) {
    console.error("Error creating invoice:", error)
    throw new Error(`Failed to create invoice: ${error.message}`)
  }

  return data
}

/**
 * Update an existing invoice
 */
export async function updateInvoice(invoiceId: string, updates: Partial<InvoiceInsert>): Promise<Invoice> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("invoices")
    .update(updates)
    .eq("id", invoiceId)
    .select()
    .single()

  if (error) {
    console.error("Error updating invoice:", error)
    throw new Error(`Failed to update invoice: ${error.message}`)
  }

  return data
}

/**
 * Get a single invoice with details by ID
 */
export async function getInvoiceById(invoiceId: string): Promise<InvoiceWithDetails | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      studio:billing_entities!invoices_studio_id_fkey(*),
      substitute_teacher:billing_entities!invoices_substitute_teacher_entity_id_fkey(*),
      events(*)
    `)
    .eq("id", invoiceId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error("Error fetching invoice:", error)
    throw new Error(`Failed to fetch invoice: ${error.message}`)
  }

  return {
    ...data,
    studio: data.studio as BillingEntity,
    substitute_teacher: data.substitute_teacher as BillingEntity | null,
    events: data.events || [],
    event_count: data.events?.length || 0,
  }
}

/**
 * Unlink events from their current invoice
 */
export async function unlinkEventsFromInvoice(eventIds: string[]): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from("events")
    .update({ invoice_id: null })
    .in("id", eventIds)

  if (error) {
    console.error("Error unlinking events from invoice:", error)
    throw new Error(`Failed to unlink events from invoice: ${error.message}`)
  }
}

/**
 * Update invoice status
 */
export async function updateInvoiceStatus(
  invoiceId: string, 
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled',
  timestamp?: string
): Promise<Invoice> {
  const supabase = createClient()
  
  const updates: Partial<InvoiceInsert> = { status }
  
  // Set appropriate timestamp based on status
  if (status === 'sent' && timestamp) {
    updates.sent_at = timestamp
  } else if (status === 'paid' && timestamp) {
    updates.paid_at = timestamp
  }

  const { data, error } = await supabase
    .from("invoices")
    .update(updates)
    .eq("id", invoiceId)
    .select()
    .single()

  if (error) {
    console.error("Error updating invoice status:", error)
    throw new Error(`Failed to update invoice status: ${error.message}`)
  }

  return data
}

/**
 * Generate a PDF for an invoice using Supabase Edge Function
 */
export async function generateInvoicePDF(invoiceId: string, language: 'en' | 'de' | 'es' = 'en'): Promise<{ pdf_url: string }> {
  const supabase = createClient()
  
  const { data, error } = await supabase.functions.invoke('generate-invoice-pdf', {
    body: { invoiceId, language }
  })

  if (error) {
    console.error('Error generating PDF:', error)
    throw new Error(`Failed to generate PDF: ${error.message}`)
  }

  if (!data.success) {
    throw new Error(data.error || 'Failed to generate PDF')
  }

  return { pdf_url: data.pdf_url }
}

/**
 * Generate a PDF preview with custom template configuration
 */
export async function generatePDFPreview(
  templateConfig: PDFTemplateConfig | null,
  templateTheme: PDFTemplateTheme,
  userSettings?: { kleinunternehmerregelung: boolean } | null,
  language: 'en' | 'de' | 'es' = 'en'
): Promise<{ pdf_url: string }> {
  const supabase = createClient()
  
  const { data, error } = await supabase.functions.invoke('generate-invoice-pdf', {
    body: { 
      isPreview: true,
      templateConfig,
      templateTheme,
      userSettings,
      language 
    }
  })

  if (error) {
    console.error('Error generating PDF preview:', error)
    throw new Error(`Failed to generate PDF preview: ${error.message}`)
  }

  if (!data.success) {
    throw new Error(data.error || 'Failed to generate PDF preview')
  }

  return { pdf_url: data.pdf_url }
}



/**
 * Link events to an invoice
 */
export async function linkEventsToInvoice(eventIds: string[], invoiceId: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from("events")
    .update({ invoice_id: invoiceId })
    .in("id", eventIds)

  if (error) {
    console.error("Error linking events to invoice:", error)
    throw new Error(`Failed to link events to invoice: ${error.message}`)
  }
}

/**
 * Get user invoice settings
 */
export async function getUserInvoiceSettings(userId: string): Promise<UserInvoiceSettings | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("user_invoice_settings")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error("Error fetching user invoice settings:", error)
    throw new Error(`Failed to fetch invoice settings: ${error.message}`)
  }

  return data
}

/**
 * Get user billing entities (studios and teachers)
 */
export async function getUserStudios(userId: string): Promise<BillingEntity[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("billing_entities")
    .select("*")
    .eq("user_id", userId)
    .order("entity_name", { ascending: true })

  if (error) {
    console.error("Error fetching user billing entities:", error)
    throw new Error(`Failed to fetch billing entities: ${error.message}`)
  }

  return (data || []) as BillingEntity[]
}

/**
 * Get events that have no studio assigned (unmatched events)
 * Excludes events marked as excluded from studio matching
 */
export async function getUnmatchedEvents(userId: string): Promise<Event[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", userId)
    .lt("end_time", new Date().toISOString()) // Events that have ended
    .is("invoice_id", null) // Not yet invoiced
    .is("studio_id", null) // No studio assigned
    .eq("exclude_from_studio_matching", false) // Not excluded from studio matching
    .order("end_time", { ascending: false })

  if (error) {
    console.error("Error fetching unmatched events:", error)
    throw new Error(`Failed to fetch unmatched events: ${error.message}`)
  }

  return data || []
}

/**
 * Create a new billing entity (studio or teacher)
 */
export async function createStudio(entityData: BillingEntityInsert): Promise<BillingEntity> {
  const supabase = createClient()
  
  // Convert TypeScript objects to JSON for database insertion
  const dbData = {
    ...entityData,
    rate_config: entityData.rate_config ? JSON.parse(JSON.stringify(entityData.rate_config)) : null,
    recipient_info: entityData.recipient_info ? JSON.parse(JSON.stringify(entityData.recipient_info)) : null,
    banking_info: entityData.banking_info ? JSON.parse(JSON.stringify(entityData.banking_info)) : null,
    custom_rate_override: entityData.custom_rate_override ? JSON.parse(JSON.stringify(entityData.custom_rate_override)) : null,
  }
  
  const { data, error } = await supabase
    .from("billing_entities")
    .insert(dbData)
    .select()
    .single()

  if (error) {
    console.error("Error creating billing entity:", error)
    throw new Error(`Failed to create billing entity: ${error.message}`)
  }

  return data as BillingEntity
}

/**
 * Update an existing billing entity
 */
export async function updateStudio(entityId: string, entityData: BillingEntityUpdate): Promise<BillingEntity> {
  const supabase = createClient()
  
  // Convert TypeScript objects to JSON for database update
  const dbData = {
    ...entityData,
    rate_config: entityData.rate_config ? JSON.parse(JSON.stringify(entityData.rate_config)) : null,
    recipient_info: entityData.recipient_info ? JSON.parse(JSON.stringify(entityData.recipient_info)) : null,
    banking_info: entityData.banking_info ? JSON.parse(JSON.stringify(entityData.banking_info)) : null,
    custom_rate_override: entityData.custom_rate_override ? JSON.parse(JSON.stringify(entityData.custom_rate_override)) : null,
  }
  
  const { data, error } = await supabase
    .from("billing_entities")
    .update(dbData)
    .eq("id", entityId)
    .select()
    .single()

  if (error) {
    console.error("Error updating billing entity:", error)
    throw new Error(`Failed to update billing entity: ${error.message}`)
  }

  return data as BillingEntity
}

/**
 * Delete a billing entity
 */
export async function deleteStudio(entityId: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from("billing_entities")
    .delete()
    .eq("id", entityId)

  if (error) {
    console.error("Error deleting billing entity:", error)
    throw new Error(`Failed to delete billing entity: ${error.message}`)
  }
}

/**
 * Match events to billing entities based on location patterns
 */
export async function matchEventsToStudios(userId: string): Promise<{
  matchedEvents: number;
  studios: { studioId: string; studioName: string; matchedCount: number }[];
}> {
  const supabase = createClient()
  
  // Get only studio-type billing entities (not teacher entities)
  const { data: allEntities, error: entitiesError } = await supabase
    .from("billing_entities")
    .select("*")
    .eq("user_id", userId)
    .eq("entity_type", "studio") // Only match to studio entities
    .order("entity_name", { ascending: true })

  if (entitiesError) {
    console.error("Error fetching studio entities:", entitiesError)
    throw new Error(`Failed to fetch studio entities: ${entitiesError.message}`)
  }

  const studios = allEntities || [];
  
  let totalMatchedEvents = 0;
  const studioMatches: { studioId: string; studioName: string; matchedCount: number }[] = [];

  for (const studio of studios) {
    // Skip studios with no location patterns
    if (!studio.location_match || studio.location_match.length === 0) {
      continue;
    }

    // Find events that match any of this studio's location patterns
    const matchingEvents: { id: string }[] = [];
    
    for (const locationPattern of studio.location_match) {
      const { data: events, error } = await supabase
        .from("events")
        .select("id")
        .eq("user_id", userId)
        .is("studio_id", null) // Only match unassigned events
        .eq("exclude_from_studio_matching", false) // Not excluded from studio matching
        .ilike("location", `%${locationPattern}%`);

      if (error) {
        console.error(`Error matching events for studio ${studio.id} with pattern "${locationPattern}":`, error);
        continue;
      }

      if (events) {
        // Add events to our matching list, avoiding duplicates
        for (const event of events) {
          if (!matchingEvents.find(e => e.id === event.id)) {
            matchingEvents.push(event);
          }
        }
      }
    }

    if (matchingEvents && matchingEvents.length > 0) {
      // Update the matched events with the studio_id
      const { error: updateError } = await supabase
        .from("events")
        .update({ studio_id: studio.id })
        .in("id", matchingEvents.map(event => event.id));

      if (updateError) {
        console.error(`Error updating events for studio ${studio.id}:`, updateError);
        continue;
      }

      totalMatchedEvents += matchingEvents.length;
      studioMatches.push({
        studioId: studio.id,
        studioName: studio.entity_name,
        matchedCount: matchingEvents.length,
      });
    }
  }

  return {
    matchedEvents: totalMatchedEvents,
    studios: studioMatches,
  };
}

/**
 * Mark an event as excluded from studio matching
 */
export async function markEventAsExcluded(eventId: string, excluded: boolean = true): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from("events")
    .update({ exclude_from_studio_matching: excluded })
    .eq("id", eventId)

  if (error) {
    console.error("Error updating event exclusion status:", error)
    throw new Error(`Failed to update event: ${error.message}`)
  }
}

/**
 * Get events that are excluded from studio matching
 */
export async function getExcludedEvents(userId: string): Promise<Event[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", userId)
    .lt("end_time", new Date().toISOString()) // Events that have ended
    .is("invoice_id", null) // Not yet invoiced
    .eq("exclude_from_studio_matching", true) // Explicitly excluded
    .not("invoice_type", "eq", "teacher_invoice") // But not teacher invoices (those go in main list)
    .order("end_time", { ascending: false })

  if (error) {
    console.error("Error fetching excluded events:", error)
    throw new Error(`Failed to fetch excluded events: ${error.message}`)
  }

  return data || []
}

/**
 * Toggle the exclude_from_studio_matching setting for an event
 */
export async function toggleEventExclusion(eventId: string): Promise<{ excluded: boolean }> {
  const supabase = createClient()
  
  // First get the current state
  const { data: currentEvent, error: fetchError } = await supabase
    .from("events")
    .select("exclude_from_studio_matching")
    .eq("id", eventId)
    .single()

  if (fetchError) {
    console.error("Error fetching event for exclusion toggle:", fetchError)
    throw new Error(`Failed to fetch event: ${fetchError.message}`)
  }

  const newExclusionState = !currentEvent.exclude_from_studio_matching

  const { error } = await supabase
    .from("events")
    .update({ exclude_from_studio_matching: newExclusionState })
    .eq("id", eventId)

  if (error) {
    console.error("Error toggling event exclusion status:", error)
    throw new Error(`Failed to toggle event exclusion: ${error.message}`)
  }

  return { excluded: newExclusionState }
}

// Types for invoice recipients
export interface InternalRecipient {
  type: 'internal'
  userId: string
}

export interface ExternalRecipient {
  type: 'external'
  name: string
  email: string
  address?: string
  phone?: string
  taxInfo?: {
    taxId?: string
    vatId?: string
    iban?: string
    bic?: string
  }
}

export type InvoiceRecipient = InternalRecipient | ExternalRecipient

/**
 * Create or find a billing entity for a teacher recipient
 * This creates a billing_entities record for substitute teaching scenarios
 */
export async function createTeacherBillingEntity(
  userId: string,
  recipient: InvoiceRecipient
): Promise<string> {
  const supabase = createClient()
  
  if (!recipient) {
    throw new Error('Recipient is undefined in createTeacherBillingEntity')
  }
  
  if (!recipient.type) {
    throw new Error('Recipient type is undefined in createTeacherBillingEntity')
  }
  
  // First, check if a billing entity already exists for this recipient
  // We'll search based on the recipient info JSON structure
  const { data: existingEntities, error: searchError } = await supabase
    .from("billing_entities")
    .select("id, recipient_info")
    .eq("user_id", userId)
    .eq("entity_type", "teacher")

  if (searchError) {
    console.error("Error searching for existing teacher entity:", searchError)
  }

  // Look for existing entity based on recipient info
  if (existingEntities) {
    for (const entity of existingEntities) {
      if (entity.recipient_info && typeof entity.recipient_info === 'object') {
        const info = entity.recipient_info as Record<string, unknown>
        if (info.type === 'internal_teacher' && recipient.type === 'internal' && 
            info.internal_user_id === recipient.userId) {
          return entity.id
        }
        if (info.type === 'external_teacher' && recipient.type === 'external' && 
            info.name === recipient.name && info.email === recipient.email) {
          return entity.id
        }
      }
    }
  }

  // No existing entity found, create a new one
  const entityName = recipient.type === 'internal' 
    ? `Teacher (Internal: ${recipient.userId})`
    : `Teacher: ${recipient.name}`

  const recipientInfo: RecipientInfo = {
    type: recipient.type === 'internal' ? 'internal_teacher' : 'external_teacher',
    name: recipient.type === 'internal' ? `Internal Teacher: ${recipient.userId}` : recipient.name,
    email: recipient.type === 'external' ? recipient.email : undefined,
    phone: recipient.type === 'external' ? recipient.phone : undefined,
    address: recipient.type === 'external' ? recipient.address : undefined,
    internal_user_id: recipient.type === 'internal' ? recipient.userId : undefined,
  }

  const bankingInfo: BankingInfo | null = recipient.type === 'external' && recipient.taxInfo ? {
    iban: recipient.taxInfo.iban,
    bic: recipient.taxInfo.bic,
    tax_id: recipient.taxInfo.taxId,
    vat_id: recipient.taxInfo.vatId,
  } : null

  // Convert objects to JSON format for database insertion
  const insertData = {
    user_id: userId,
    entity_name: entityName,
    entity_type: 'teacher',
    rate_config: null, // Teachers don't have their own rate configs
    recipient_info: JSON.parse(JSON.stringify(recipientInfo)),
    banking_info: bankingInfo ? JSON.parse(JSON.stringify(bankingInfo)) : null,
    notes: `Substitute teacher recipient - ${recipient.type}`
  }

  const { data: newEntity, error: createError } = await supabase
    .from("billing_entities")
    .insert(insertData)
    .select("id")
    .single()

  if (createError) {
    throw new Error(`Failed to create teacher billing entity: ${createError.message}`)
  }

  return newEntity.id
}

/**
 * Set up an event for teacher-to-teacher invoicing using an existing billing entity
 * FIXED: Now keeps studio_id for rate calculations and uses substitute_teacher_entity_id for payment recipient
 */
export async function setupSubstituteEventWithExistingEntity(
  eventId: string,
  billingEntityId: string,
  substituteNotes?: string
): Promise<void> {
  const supabase = createClient()

  // Update the event to track substitute teacher while keeping original studio for rates
  const { error } = await supabase
    .from("events")
    .update({
      // Keep studio_id unchanged - it's used for rate calculations
      substitute_teacher_entity_id: billingEntityId, // NEW: Track who gets paid
      invoice_type: 'teacher_invoice',
      substitute_notes: substituteNotes || null,
      exclude_from_studio_matching: true // Exclude from automatic studio matching
    })
    .eq("id", eventId)

  if (error) {
    console.error("Error setting up substitute event with existing entity:", error)
    throw new Error(`Failed to setup substitute event: ${error.message}`)
  }
}

/**
 * Set up an event for teacher-to-teacher invoicing (substitute scenario)
 * Creates a billing entity for the recipient and links the event to it
 * FIXED: Now keeps studio_id for rate calculations and uses substitute_teacher_entity_id for payment recipient
 */
export async function setupSubstituteEvent(
  eventId: string, 
  recipient: InvoiceRecipient,
  substituteNotes?: string
): Promise<void> {
  const supabase = createClient()
  
  // First get the event to know which user owns it
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("user_id")
    .eq("id", eventId)
    .single()

  if (eventError) {
    throw new Error(`Failed to find event: ${eventError.message}`)
  }

  if (!event.user_id) {
    throw new Error('Event has no associated user')
  }

  // Create or find the billing entity for this recipient
  const billingEntityId = await createTeacherBillingEntity(event.user_id, recipient)

  // Update the event to track substitute teacher while keeping original studio for rates
  const { error } = await supabase
    .from("events")
    .update({
      // Keep studio_id unchanged - it's used for rate calculations
      substitute_teacher_entity_id: billingEntityId, // NEW: Track who gets paid
      invoice_type: 'teacher_invoice',
      substitute_notes: substituteNotes || null,
      exclude_from_studio_matching: true // Exclude from automatic studio matching
    })
    .eq("id", eventId)

  if (error) {
    console.error("Error setting up substitute event:", error)
    throw new Error(`Failed to setup substitute event: ${error.message}`)
  }
}

/**
 * Get the display name for a billing entity
 */
export function getBillingEntityDisplayName(entity: BillingEntity): string {
  const recipientInfo = entity.recipient_info as RecipientInfo
  if (recipientInfo?.name) {
    return recipientInfo.name
  }
  return entity.entity_name
}

/**
 * Get the email for a billing entity
 */
export function getBillingEntityEmail(entity: BillingEntity): string | null {
  const recipientInfo = entity.recipient_info as RecipientInfo
  return recipientInfo?.email || null
}

/**
 * Get events that need teacher-to-teacher invoicing (substitute events)
 */
export async function getSubstituteEvents(userId: string): Promise<Event[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", userId) // Events taught by this user
    .eq("invoice_type", "teacher_invoice") // Teacher-to-teacher invoicing
    .lt("end_time", new Date().toISOString()) // Events that have ended
    .is("invoice_id", null) // Not yet invoiced
    .order("end_time", { ascending: false })

  if (error) {
    console.error("Error fetching substitute events:", error)
    throw new Error(`Failed to fetch substitute events: ${error.message}`)
  }

  return data || []
}

/**
 * Get unique event locations for a user (for studio location matching)
 */
export async function getUserEventLocations(userId: string): Promise<string[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("events")
    .select("location")
    .eq("user_id", userId)
    .not("location", "is", null)

  if (error) {
    console.error("Error fetching event locations:", error)
    throw new Error(`Failed to fetch event locations: ${error.message}`)
  }

  // Get unique locations and filter out null/empty strings
  const locationSet = new Set(data.map(event => event.location).filter((location): location is string => Boolean(location)))
  const locations = Array.from(locationSet)
  return locations.sort()
}

/**
 * Get all teacher billing entities for a user (both internal and external teachers)
 */
export async function getTeacherBillingEntities(userId: string): Promise<BillingEntity[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("billing_entities")
    .select("*")
    .eq("user_id", userId)
    .eq("entity_type", "teacher")
    .order("entity_name")

  if (error) {
    console.error("Error fetching teacher billing entities:", error)
    throw new Error(`Failed to fetch teacher billing entities: ${error.message}`)
  }

  return (data || []).map(entity => entity as BillingEntity)
}

/**
 * Revert teacher invoice events back to studio invoicing
 * FIXED: Now clears substitute_teacher_entity_id while keeping original studio_id for rate calculations
 */
export async function revertEventsToStudioInvoicing(eventIds: string[]): Promise<{
  revertedEvents: number;
  matchedEvents: number;
  studios: { studioId: string; studioName: string; matchedCount: number }[];
}> {
  const supabase = createClient()
  
  if (!eventIds || eventIds.length === 0) {
    return { revertedEvents: 0, matchedEvents: 0, studios: [] }
  }

  // Get studio information for the events being reverted
  const { data: eventsData, error: eventsError } = await supabase
    .from("events")
    .select("id, studio_id")
    .in("id", eventIds)

  if (eventsError) {
    console.error("Error fetching events data:", eventsError)
    throw new Error("Failed to fetch events data for reverting")
  }

  // Get studio information separately
  const studioIds = [...new Set(eventsData.map(event => event.studio_id).filter((id): id is string => id !== null))]
  const { data: studiosData, error: studiosError } = await supabase
    .from("billing_entities")
    .select("id, entity_name")
    .in("id", studioIds)

  if (studiosError) {
    console.error("Error fetching studios data:", studiosError)
    throw new Error("Failed to fetch studios data for reverting")
  }

  // Step 1: Reset the events to studio_invoice type and clear substitute data
  // FIXED: Keep studio_id unchanged, only clear substitute_teacher_entity_id
  const { error: resetError } = await supabase
    .from("events")
    .update({
      invoice_type: 'studio_invoice',
      substitute_notes: null,
      substitute_teacher_entity_id: null, // Clear substitute teacher (NEW LOGIC)
      exclude_from_studio_matching: false // Enable studio matching again
    })
    .in("id", eventIds)

  if (resetError) {
    console.error("Error resetting events:", resetError)
    throw new Error(`Failed to reset events: ${resetError.message}`)
  }

  // Step 2: Prepare studio summary (no re-matching needed since studio_id is preserved)
  const studiosMap = new Map(studiosData?.map(studio => [studio.id, studio.entity_name]) || [])
  const studioSummary = eventsData.reduce((acc, event) => {
    if (event.studio_id && studiosMap.has(event.studio_id)) {
      const studioId = event.studio_id
      const studioName = studiosMap.get(studioId)!
      
      if (!acc[studioId]) {
        acc[studioId] = { studioId, studioName, matchedCount: 0 }
      }
      acc[studioId].matchedCount++
    }
    return acc
  }, {} as Record<string, { studioId: string; studioName: string; matchedCount: number }>)

  return {
    revertedEvents: eventIds.length,
    matchedEvents: eventIds.length, // All events remain matched since studio_id is preserved
    studios: Object.values(studioSummary)
  }
}

/**
 * Update event student counts
 */
export async function updateEventStudentCounts(
  eventId: string, 
  studentsStudio: number | null, 
  studentsOnline: number | null
): Promise<Event> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("events")
    .update({ 
      students_studio: studentsStudio,
      students_online: studentsOnline,
      updated_at: new Date().toISOString()
    })
    .eq("id", eventId)
    .select()
    .single()

  if (error) {
    console.error("Error updating event student counts:", error)
    throw new Error(`Failed to update event student counts: ${error.message}`)
  }

  return data
}

/**
 * Bulk update student counts for multiple events
 */
export async function bulkUpdateEventStudentCounts(
  updates: Array<{ eventId: string; studentsStudio: number | null; studentsOnline: number | null }>
): Promise<Event[]> {
  const updatedEvents: Event[] = []
  
  for (const update of updates) {
    try {
      const updatedEvent = await updateEventStudentCounts(
        update.eventId, 
        update.studentsStudio, 
        update.studentsOnline
      )
      updatedEvents.push(updatedEvent)
    } catch (error) {
      console.error(`Failed to update event ${update.eventId}:`, error)
      throw error
    }
  }
  
  return updatedEvents
} 