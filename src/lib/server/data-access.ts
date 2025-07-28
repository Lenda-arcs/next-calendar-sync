import { createServerClient } from '@/lib/supabase-server'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../../../database-generated.types'

// Types
type SupabaseClient = ReturnType<typeof createServerClient> | ReturnType<typeof createBrowserClient>

/**
 * Server-side data access functions that can be used in:
 * 1. Server Components (using createServerClient)
 * 2. API routes (using createServerClient) 
 * 3. Client-side via TanStack Query (using createBrowserClient)
 * 
 * These functions are the single source of truth for data fetching logic.
 */

// ===== USER DATA ACCESS =====

export async function getUserProfile(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export async function getUserRole(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data.role
}

export async function updateUserProfile(
  supabase: SupabaseClient, 
  userId: string, 
  updates: Partial<Database['public']['Tables']['users']['Update']>
) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ===== TAGS DATA ACCESS =====

export async function getAllTags(supabase: SupabaseClient, userId: string) {
  // Get both user tags and global tags in parallel
  const [userTagsResult, globalTagsResult] = await Promise.all([
    supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .order('name'),
    supabase
      .from('tags')
      .select('*')
      .is('user_id', null)
      .order('name')
  ])

  if (userTagsResult.error) throw userTagsResult.error
  if (globalTagsResult.error) throw globalTagsResult.error

  const userTags = userTagsResult.data || []
  const globalTags = globalTagsResult.data || []
  const allTags = [...userTags, ...globalTags]

  return { allTags, userTags, globalTags }
}

export async function getTagRules(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('tag_rules')
    .select(`
      *,
      tag:tags(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function createTag(
  supabase: SupabaseClient,
  tagData: Omit<Database['public']['Tables']['tags']['Insert'], 'id' | 'created_at' | 'updated_at'>
) {
  const { data, error } = await supabase
    .from('tags')
    .insert(tagData)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateTag(
  supabase: SupabaseClient,
  tagId: string,
  updates: Partial<Database['public']['Tables']['tags']['Update']>
) {
  const { data, error } = await supabase
    .from('tags')
    .update(updates)
    .eq('id', tagId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteTag(supabase: SupabaseClient, tagId: string) {
  const { data, error } = await supabase
    .from('tags')
    .delete()
    .eq('id', tagId)
    .select()
  
  if (error) throw error
  return data
}

// ===== EVENTS DATA ACCESS =====

export async function getUserEvents(
  supabase: SupabaseClient, 
  userId: string, 
  filters?: {
    isPublic?: boolean
    variant?: string
    limit?: number
    offset?: number
  }
) {
  let query = supabase
    .from('events')
    .select('*')  // ✅ Fixed: Simple select without problematic joins
    .eq('user_id', userId)

  if (filters?.isPublic !== undefined) {
    query = query.eq('is_public', filters.isPublic)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
  }

  query = query.order('start_time', { ascending: true, nullsLast: true })  // ✅ Fixed: Match working pattern

  const { data, error } = await query

  if (error) throw error
  return data || []  // ✅ Fixed: Ensure we return empty array if no data
}

export async function getEventById(supabase: SupabaseClient, eventId: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')  // ✅ Fixed: Simple select without problematic joins
    .eq('id', eventId)
    .single()
  
  if (error) throw error
  return data
}

export async function updateEvent(
  supabase: SupabaseClient,
  eventId: string,
  updates: Partial<Database['public']['Tables']['events']['Update']>
) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', eventId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ===== CALENDAR FEEDS DATA ACCESS =====

export async function getUserCalendarFeeds(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('calendar_feeds')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getCalendarFeedById(supabase: SupabaseClient, feedId: string) {
  const { data, error } = await supabase
    .from('calendar_feeds')
    .select('*')
    .eq('id', feedId)
    .single()
  
  if (error) throw error
  return data
}

// ===== STUDIOS DATA ACCESS =====

export async function getUserStudios(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('teacher_studio_relationships')
    .select('*')  // ✅ Fixed: Simple select without problematic studio join
    .eq('teacher_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getStudioById(supabase: SupabaseClient, studioId: string) {
  const { data, error } = await supabase
    .from('studios')
    .select('*')
    .eq('id', studioId)
    .single()
  
  if (error) throw error
  return data
}

// ===== INVOICES DATA ACCESS =====

export async function getUserInvoices(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')  // ✅ Fixed: Simple select without problematic joins
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getUninvoicedEvents(
  supabase: SupabaseClient, 
  userId: string, 
  studioId?: string
) {
  let query = supabase
    .from('events')
    .select('*')  // ✅ Fixed: Simple select without problematic studio join
    .eq('user_id', userId)
    .is('invoice_id', null) // Not yet invoiced

  if (studioId) {
    query = query.eq('studio_id', studioId)
  }

  query = query.order('start_time', { ascending: false })

  const { data, error } = await query

  if (error) throw error
  return data
}

// ===== ADMIN DATA ACCESS =====

export async function getAllUsers(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getAllInvitations(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('user_invitations')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// ===== CALENDAR & OAUTH DATA ACCESS =====

export async function getAvailableCalendars(supabase: SupabaseClient, userId: string) {
  // Get OAuth integration for this user
  const { data: oauthIntegration, error: oauthError } = await supabase
    .from('oauth_calendar_integrations')
    .select('*')
    .eq('user_id', userId)
    .eq('provider', 'google')
    .single()

  if (oauthError) throw oauthError
  return oauthIntegration
}

export async function updateCalendarSelection(
  supabase: SupabaseClient, 
  userId: string, 
  selections: { calendarId: string; selected: boolean }[]
) {
  // This would typically update the calendar_feeds table or a selections table
  // Implementation depends on your database schema
  const updates = selections.map(selection => ({
    user_id: userId,
    calendar_id: selection.calendarId,
    selected: selection.selected,
    updated_at: new Date().toISOString()
  }))

  const { data, error } = await supabase
    .from('calendar_selections')
    .upsert(updates)
    .select()

  if (error) throw error
  return data
}

export async function importCalendarEvents(
  supabase: SupabaseClient, 
  userId: string, 
  calendarData: { calendarId: string; events: unknown[] }
) {
  // Import events from external calendar
  const eventsToInsert = calendarData.events.map(eventData => {
    const event = eventData as {
      id?: string
      summary?: string
      description?: string
      location?: string
      start?: { dateTime?: string; date?: string }
      end?: { dateTime?: string; date?: string }
    }
    
    return {
      user_id: userId,
      title: event.summary,
      description: event.description,
      start_time: event.start?.dateTime || event.start?.date,
      end_time: event.end?.dateTime || event.end?.date,
      location: event.location,
      external_id: event.id,
      external_calendar_id: calendarData.calendarId,
      created_at: new Date().toISOString()
    }
  })

  const { data, error } = await supabase
    .from('events')
    .insert(eventsToInsert)
    .select()

  if (error) throw error
  return data
}

// ===== ADVANCED EVENT QUERIES =====

export async function getEventsByDateRange(
  supabase: SupabaseClient, 
  userId: string, 
  startDate: string, 
  endDate: string
) {
  const { data, error } = await supabase
    .from('events')
    .select('*')  // ✅ Fixed: Simple select without problematic joins
    .eq('user_id', userId)
    .gte('start_time', startDate)
    .lte('start_time', endDate)
    .order('start_time', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getEventsByStudio(
  supabase: SupabaseClient, 
  userId: string, 
  studioId: string
) {
  const { data, error } = await supabase
    .from('events')
    .select('*')  // ✅ Fixed: Simple select without problematic joins
    .eq('user_id', userId)
    .eq('studio_id', studioId)
    .order('start_time', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getRecentActivity(supabase: SupabaseClient, userId: string) {
  // Get recent events, tags created, studios added, etc.
  const [recentEvents, recentTags] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, created_at, start_time')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('tags')
      .select('id, name, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  if (recentEvents.error) throw recentEvents.error
  if (recentTags.error) throw recentTags.error

  return {
    events: recentEvents.data,
    tags: recentTags.data
  }
}

// ===== ADMIN DATA ACCESS =====

export async function updateUserRole(
  supabase: SupabaseClient, 
  userId: string, 
  role: string
) {
  const { data, error } = await supabase
    .from('users')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteUser(supabase: SupabaseClient, userId: string) {
  // This should cascade delete related data according to your database schema
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId)
    .select()

  if (error) throw error
  return data
}

// ===== EVENT MANAGEMENT VIA API ROUTES =====
// These functions call internal API routes that handle complex logic
// including Google Calendar integration

export async function createEventViaAPI(eventData: {
  summary: string
  description?: string
  start: { dateTime: string; timeZone?: string }
  end: { dateTime: string; timeZone?: string }
  location?: string
  custom_tags?: string[]
  visibility?: string
}) {
  const response = await fetch('/api/calendar/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to create event')
  }

  return await response.json()
}

export async function updateEventViaAPI(eventData: {
  eventId: string
  summary?: string
  description?: string
  start?: { dateTime: string; timeZone?: string }
  end?: { dateTime: string; timeZone?: string }
  location?: string
  custom_tags?: string[]
  visibility?: string
}) {
  const response = await fetch('/api/calendar/events', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to update event')
  }

  return await response.json()
}

export async function deleteEventViaAPI(eventId: string) {
  const response = await fetch(`/api/calendar/events?eventId=${eventId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to delete event')
  }

  return await response.json()
}

// ===== INVOICE OPERATIONS =====

export async function updateInvoiceStatus(
  supabase: SupabaseClient,
  invoiceId: string, 
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled',
  timestamp?: string
) {
  const updates: Partial<{ status: string; sent_at?: string; paid_at?: string }> = { status }
  
  // Set appropriate timestamp based on status
  if (status === 'sent' && timestamp) {
    updates.sent_at = timestamp
  } else if (status === 'paid' && timestamp) {
    updates.paid_at = timestamp
  }

  const { data, error } = await supabase
    .from("invoices")
    .update(updates)
    .eq('id', invoiceId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function generateInvoicePDF(
  supabase: SupabaseClient,
  invoiceId: string, 
  language: 'en' | 'de' | 'es' = 'en'
) {
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

export async function deleteInvoice(supabase: SupabaseClient, invoiceId: string) {
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
      // Extract file path from URL - assuming it follows the pattern /storage/v1/object/public/bucket/path
      const url = new URL(invoice.pdf_url)
      const pathParts = url.pathname.split('/')
      const fileName = pathParts[pathParts.length - 1]
      const filePath = `invoices/${invoice.user_id}/${fileName}`
      
      const { error: deleteFileError } = await supabase.storage
        .from('invoice-pdfs')
        .remove([filePath])
        
      if (deleteFileError) {
        console.warn('Failed to delete PDF file:', deleteFileError)
        // Continue with invoice deletion even if file deletion fails
      }
    } catch (urlError) {
      console.warn('Failed to parse PDF URL for deletion:', urlError)
      // Continue with invoice deletion even if file deletion fails
    }
  }

  // Delete the invoice from database
  const { data, error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", invoiceId)
    .select()

  if (error) throw error
  return data
}

// ===== TEACHER STUDIO RELATIONSHIPS =====

export async function getTeacherStudioRelationships(supabase: SupabaseClient, teacherId: string) {
  const { data, error } = await supabase
    .from('studio_teacher_requests')
    .select('*')  // ✅ Fixed: Simple select without problematic studio join
    .eq('teacher_id', teacherId)
    .eq('status', 'approved')
    .order('processed_at', { ascending: false })

  if (error) {
    console.error('Error fetching teacher-studio relationships:', error)
    return []
  }

  return data || []
} 