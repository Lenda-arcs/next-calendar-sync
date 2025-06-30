import { createClient } from '@/lib/supabase'
import { Event, Invoice, InvoiceInsert, UserInvoiceSettings, BillingEntity, BillingEntityInsert, BillingEntityUpdate } from '@/lib/types'

// Extended Event interface for substitute teaching  
export interface ExtendedEvent extends Omit<Event, 'invoice_type' | 'substitute_notes'> {
  invoice_type: 'studio_invoice' | 'teacher_invoice' | null
  substitute_notes: string | null
}

// Event with billing entity relationship
export interface EventWithBillingEntity extends Event {
  billing_entity: BillingEntity | null
}

// For backward compatibility, keep the studio interface (maps to billing entity)
export interface EventWithStudio extends Event {
  studio: BillingEntity | null
}

export interface InvoiceWithDetails extends Invoice {
  studio: BillingEntity
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

/**
 * Calculate payout for a single event based on billing entity rules
 */
export function calculateEventPayout(event: Event, billingEntity: BillingEntity): number {
  if (!billingEntity.base_rate) return 0

  let payout = billingEntity.base_rate

  if (billingEntity.rate_type === "per_student") {
    // For per-student rates, we might apply different logic
    // For now, just use base rate as minimum
    return payout
  }

  // Apply penalties if configured
  if (billingEntity.studio_penalty_per_student && event.students_studio !== null) {
    const threshold = billingEntity.student_threshold || 0
    if (event.students_studio < threshold) {
      const missingStudents = threshold - event.students_studio
      payout -= missingStudents * billingEntity.studio_penalty_per_student
    }
  }

  if (billingEntity.online_penalty_per_student && event.students_online) {
    payout -= event.students_online * billingEntity.online_penalty_per_student
  }

  // Apply maximum discount limit
  if (billingEntity.max_discount) {
    const minimumPayout = billingEntity.base_rate - billingEntity.max_discount
    payout = Math.max(payout, minimumPayout)
  }

  return Math.max(payout, 0) // Never negative
}

/**
 * Calculate total payout for multiple events
 */
export function calculateTotalPayout(events: Event[], billingEntity: BillingEntity): number {
  return events.reduce((total, event) => total + calculateEventPayout(event, billingEntity), 0)
}

/**
 * Get uninvoiced events for a user
 * Excludes events marked as excluded from billing entity matching
 */
export async function getUninvoicedEvents(userId: string): Promise<EventWithStudio[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      studio:billing_entities(*)
    `)
    .eq("user_id", userId)
    .lt("end_time", new Date().toISOString()) // Events that have ended
    .is("invoice_id", null) // Not yet invoiced
    .not("studio_id", "is", null) // Has billing entity assigned (studio OR teacher)
    .or("exclude_from_studio_matching.eq.false,invoice_type.eq.teacher_invoice") // Studio events OR teacher invoice events
    .order("end_time", { ascending: false })

  if (error) {
    console.error("Error fetching uninvoiced events:", error)
    throw new Error(`Failed to fetch uninvoiced events: ${error.message}`)
  }

  return (data || []) as EventWithStudio[]
}

/**
 * Get uninvoiced events grouped by billing entity
 */
export async function getUninvoicedEventsByStudio(userId: string): Promise<Record<string, EventWithStudio[]>> {
  const events = await getUninvoicedEvents(userId)
  
  return events.reduce((acc, event) => {
    const studioId = event.studio_id!
    if (!acc[studioId]) {
      acc[studioId] = []
    }
    acc[studioId].push(event)
    return acc
  }, {} as Record<string, EventWithStudio[]>)
}

/**
 * Get user invoices with details
 */
export async function getUserInvoices(userId: string): Promise<InvoiceWithDetails[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      studio:billing_entities(*),
      events(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user invoices:", error)
    throw new Error(`Failed to fetch invoices: ${error.message}`)
  }

  return (data || []).map(invoice => ({
    ...invoice,
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
      studio:billing_entities(*),
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
export async function generateInvoicePDF(invoiceId: string): Promise<{ pdf_url: string }> {
  const supabase = createClient()
  
  const { data, error } = await supabase.functions.invoke('generate-invoice-pdf', {
    body: { invoiceId }
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
 * Delete an invoice and free all associated events
 * Also removes the PDF file from storage if it exists
 */
export async function deleteInvoice(invoiceId: string): Promise<void> {
  const supabase = createClient()
  
  // First, get the invoice details to check for PDF file
  const { data: invoice, error: fetchError } = await supabase
    .from("invoices")
    .select("pdf_url, user_id")
    .eq("id", invoiceId)
    .single()

  if (fetchError) {
    console.error("Error fetching invoice for deletion:", fetchError)
    throw new Error(`Failed to fetch invoice: ${fetchError.message}`)
  }

  // Delete PDF file from storage if it exists
  if (invoice?.pdf_url) {
    try {
      // Extract file path from URL or reconstruct it
      // PDF files are stored as: invoices/{user_id}/{invoice_id}/filename.pdf
      const userId = invoice.user_id
      const folderPath = `invoices/${userId}/${invoiceId}`
      
      // List all files in the invoice folder
      const { data: fileList, error: listError } = await supabase.storage
        .from('invoice-pdfs')
        .list(folderPath)

      if (!listError && fileList && fileList.length > 0) {
        // Delete all files in the invoice folder
        const filesToDelete = fileList.map(file => `${folderPath}/${file.name}`)
        
        const { error: storageDeleteError } = await supabase.storage
          .from('invoice-pdfs')
          .remove(filesToDelete)

        if (storageDeleteError) {
          console.warn("Warning: Failed to delete PDF files from storage:", storageDeleteError)
          // Don't throw error here - continue with database deletion
        }
      }
    } catch (storageError) {
      console.warn("Warning: Error during PDF file cleanup:", storageError)
      // Don't throw error here - continue with database deletion
    }
  }

  // Unlink all events from this invoice
  const { error: unlinkError } = await supabase
    .from("events")
    .update({ invoice_id: null })
    .eq("invoice_id", invoiceId)

  if (unlinkError) {
    console.error("Error unlinking events from invoice:", unlinkError)
    throw new Error(`Failed to unlink events: ${unlinkError.message}`)
  }

  // Finally, delete the invoice record
  const { error: deleteError } = await supabase
    .from("invoices")
    .delete()
    .eq("id", invoiceId)

  if (deleteError) {
    console.error("Error deleting invoice:", deleteError)
    throw new Error(`Failed to delete invoice: ${deleteError.message}`)
  }
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

  return data || []
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
  
  const { data, error } = await supabase
    .from("billing_entities")
    .insert(entityData)
    .select()
    .single()

  if (error) {
    console.error("Error creating billing entity:", error)
    throw new Error(`Failed to create billing entity: ${error.message}`)
  }

  return data
}

/**
 * Update an existing billing entity
 */
export async function updateStudio(entityId: string, entityData: BillingEntityUpdate): Promise<BillingEntity> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("billing_entities")
    .update(entityData)
    .eq("id", entityId)
    .select()
    .single()

  if (error) {
    console.error("Error updating billing entity:", error)
    throw new Error(`Failed to update billing entity: ${error.message}`)
  }

  return data
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
    .eq("recipient_type", "studio") // Only match to studio entities
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
  let existingEntityQuery = supabase
    .from("billing_entities")
    .select("id")
    .eq("user_id", userId)
    .eq("recipient_type", recipient.type === 'internal' ? 'internal_teacher' : 'external_teacher')

  if (recipient.type === 'internal') {
    existingEntityQuery = existingEntityQuery.eq("recipient_user_id", recipient.userId)
  } else {
    existingEntityQuery = existingEntityQuery
      .eq("recipient_name", recipient.name)
      .eq("recipient_email", recipient.email)
  }

  const { data: existingEntity, error: searchError } = await existingEntityQuery.single()

  // If we found an existing entity, return its ID
  if (!searchError && existingEntity) {
    return existingEntity.id
  }

  // No existing entity found, create a new one
  const entityName = recipient.type === 'internal' 
    ? `Teacher (Internal: ${recipient.userId})`
    : `Teacher: ${recipient.name}`

  const insertData: BillingEntityInsert = {
    user_id: userId,
    entity_name: entityName,
    recipient_type: recipient.type === 'internal' ? 'internal_teacher' : 'external_teacher',
    notes: `Substitute teacher recipient - ${recipient.type}`
  }

  if (recipient.type === 'internal') {
    insertData.recipient_user_id = recipient.userId
  } else {
    // External teacher details
    insertData.recipient_name = recipient.name
    insertData.recipient_email = recipient.email
    insertData.billing_email = recipient.email
    insertData.address = recipient.address || null
    insertData.recipient_phone = recipient.phone || null
    
    // Tax information
    if (recipient.taxInfo) {
      insertData.tax_id = recipient.taxInfo.taxId || null
      insertData.vat_id = recipient.taxInfo.vatId || null
      insertData.iban = recipient.taxInfo.iban || null
      insertData.bic = recipient.taxInfo.bic || null
    }
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
 */
export async function setupSubstituteEventWithExistingEntity(
  eventId: string,
  billingEntityId: string,
  substituteNotes?: string
): Promise<void> {
  const supabase = createClient()

  // Update the event to reference the existing billing entity and mark as teacher invoice
  const { error } = await supabase
    .from("events")
    .update({
      studio_id: billingEntityId, // Reference the existing billing entity
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

  // Update the event to reference the billing entity and mark as teacher invoice
  const { error } = await supabase
    .from("events")
    .update({
      studio_id: billingEntityId, // Reference the billing entity
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
  if (entity.recipient_name) {
    return entity.recipient_name
  }
  return entity.entity_name
}

/**
 * Get the email for a billing entity
 */
export function getBillingEntityEmail(entity: BillingEntity): string | null {
  return entity.recipient_email || entity.billing_email || null
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
    .in("recipient_type", ["internal_teacher", "external_teacher"])
    .order("entity_name")

  if (error) {
    console.error("Error fetching teacher billing entities:", error)
    throw new Error(`Failed to fetch teacher billing entities: ${error.message}`)
  }

  return data || []
}

/**
 * Revert teacher invoice events back to studio invoicing
 * This will re-match the events to studios based on location patterns
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

  // First, get the user_id from one of the events
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("user_id")
    .in("id", eventIds)
    .limit(1)
    .single()

  if (eventError || !eventData || !eventData.user_id) {
    console.error("Error fetching event data:", eventError)
    throw new Error("Failed to fetch event data for reverting")
  }

  const userId = eventData.user_id

  // Step 1: Reset the events to studio_invoice type and clear substitute data
  const { error: resetError } = await supabase
    .from("events")
    .update({
      invoice_type: 'studio_invoice',
      substitute_notes: null,
      studio_id: null, // Clear current studio assignment so they can be re-matched
      exclude_from_studio_matching: false // Enable studio matching again
    })
    .in("id", eventIds)

  if (resetError) {
    console.error("Error resetting events:", resetError)
    throw new Error(`Failed to reset events: ${resetError.message}`)
  }

  // Step 2: Re-match the events to studios based on location patterns
  const matchResults = await matchEventsToStudios(userId)

  return {
    revertedEvents: eventIds.length,
    matchedEvents: matchResults.matchedEvents,
    studios: matchResults.studios
  }
} 