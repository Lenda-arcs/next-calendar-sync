import { createClient } from '@/lib/supabase'
import { Event, Studio, Invoice, InvoiceInsert, UserInvoiceSettings, StudioInsert, StudioUpdate } from '@/lib/types'

export interface EventWithStudio extends Event {
  studio: Studio | null
}

export interface InvoiceWithDetails extends Invoice {
  studio: Studio
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
 * Calculate payout for a single event based on studio rules
 */
export function calculateEventPayout(event: Event, studio: Studio): number {
  if (!studio.base_rate) return 0

  let payout = studio.base_rate

  if (studio.rate_type === "per_student") {
    // For per-student rates, we might apply different logic
    // For now, just use base rate as minimum
    return payout
  }

  // Apply penalties if configured
  if (studio.studio_penalty_per_student && event.students_studio !== null) {
    const threshold = studio.student_threshold || 0
    if (event.students_studio < threshold) {
      const missingStudents = threshold - event.students_studio
      payout -= missingStudents * studio.studio_penalty_per_student
    }
  }

  if (studio.online_penalty_per_student && event.students_online) {
    payout -= event.students_online * studio.online_penalty_per_student
  }

  // Apply maximum discount limit
  if (studio.max_discount) {
    const minimumPayout = studio.base_rate - studio.max_discount
    payout = Math.max(payout, minimumPayout)
  }

  return Math.max(payout, 0) // Never negative
}

/**
 * Calculate total payout for multiple events
 */
export function calculateTotalPayout(events: Event[], studio: Studio): number {
  return events.reduce((total, event) => total + calculateEventPayout(event, studio), 0)
}

/**
 * Get uninvoiced events for a user
 */
export async function getUninvoicedEvents(userId: string): Promise<EventWithStudio[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      studio:studios(*)
    `)
    .eq("user_id", userId)
    .lt("end_time", new Date().toISOString()) // Events that have ended
    .is("invoice_id", null) // Not yet invoiced
    .not("studio_id", "is", null) // Has studio assigned
    .order("end_time", { ascending: false })

  if (error) {
    console.error("Error fetching uninvoiced events:", error)
    throw new Error(`Failed to fetch uninvoiced events: ${error.message}`)
  }

  return data || []
}

/**
 * Get uninvoiced events grouped by studio
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
      studio:studios(*),
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
 * Get user studios
 */
export async function getUserStudios(userId: string): Promise<Studio[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("studios")
    .select("*")
    .eq("user_id", userId)
    .order("studio_name", { ascending: true })

  if (error) {
    console.error("Error fetching user studios:", error)
    throw new Error(`Failed to fetch studios: ${error.message}`)
  }

  return data || []
}

/**
 * Get events that have no studio assigned (unmatched events)
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
    .order("end_time", { ascending: false })

  if (error) {
    console.error("Error fetching unmatched events:", error)
    throw new Error(`Failed to fetch unmatched events: ${error.message}`)
  }

  return data || []
}

/**
 * Create a new studio
 */
export async function createStudio(studioData: StudioInsert): Promise<Studio> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("studios")
    .insert(studioData)
    .select()
    .single()

  if (error) {
    console.error("Error creating studio:", error)
    throw new Error(`Failed to create studio: ${error.message}`)
  }

  return data
}

/**
 * Update an existing studio
 */
export async function updateStudio(studioId: string, studioData: StudioUpdate): Promise<Studio> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("studios")
    .update(studioData)
    .eq("id", studioId)
    .select()
    .single()

  if (error) {
    console.error("Error updating studio:", error)
    throw new Error(`Failed to update studio: ${error.message}`)
  }

  return data
}

/**
 * Delete a studio
 */
export async function deleteStudio(studioId: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from("studios")
    .delete()
    .eq("id", studioId)

  if (error) {
    console.error("Error deleting studio:", error)
    throw new Error(`Failed to delete studio: ${error.message}`)
  }
}

/**
 * Match events to studios based on location patterns
 */
export async function matchEventsToStudios(userId: string): Promise<{
  matchedEvents: number;
  studios: { studioId: string; studioName: string; matchedCount: number }[];
}> {
  const supabase = createClient()
  
  // Get all user studios
  const studios = await getUserStudios(userId);
  
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
        studioName: studio.studio_name,
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
  const locations = [...new Set(data.map(event => event.location).filter((location): location is string => Boolean(location)))]
  return locations.sort()
} 