import { createServerClient } from '@/lib/supabase-server'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../../../database-generated.types'
import type { 
  User, UserUpdate,
  Tag, TagInsert, TagUpdate,
  Event, EventUpdate,
  CalendarFeed,
  Invoice,
  Studio
} from '../types'
import { deleteInvoiceWithCleanup } from './rpc-utils'

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

export async function getUserProfile(supabase: SupabaseClient, userId: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export async function getUserRole(supabase: SupabaseClient, userId: string): Promise<Database['public']['Enums']['user_role']> {
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
  updates: UserUpdate
): Promise<User> {
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

export interface AllTagsResult {
  allTags: Tag[]
  userTags: Tag[]
  globalTags: Tag[]
}

export async function getAllTags(supabase: SupabaseClient, userId: string): Promise<AllTagsResult> {
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

export interface TagRuleWithTag {
  id: string
  keyword: string | null
  keywords: string[] | null
  location_keywords: string[] | null
  tag_id: string
  updated_at: string | null
  user_id: string
  tag: Tag
}

export async function getTagRules(supabase: SupabaseClient, userId: string): Promise<TagRuleWithTag[]> {
  const { data, error } = await supabase
    .from('tag_rules')
    .select(`
      *,
      tag:tags(*)
    `)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  
  if (error) throw error
  return data as TagRuleWithTag[]
}

export async function createTag(
  supabase: SupabaseClient,
  tagData: TagInsert
): Promise<Tag> {
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
  updates: TagUpdate
): Promise<Tag> {
  const { data, error } = await supabase
    .from('tags')
    .update(updates)
    .eq('id', tagId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteTag(supabase: SupabaseClient, tagId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .delete()
    .eq('id', tagId)
    .select()
  
  if (error) throw error
  return data
}

// ===== EVENTS DATA ACCESS =====

export interface EventFilters {
  isPublic?: boolean
  variant?: string
  limit?: number
  offset?: number
  futureOnly?: boolean
}

export async function getUserEvents(
  supabase: SupabaseClient, 
  userId: string, 
  filters?: EventFilters
): Promise<Event[]> {
  const now = new Date().toISOString()
  
  let query = supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)

  if (filters?.isPublic !== undefined) {
    query = query.eq('is_public', filters.isPublic)
  }

  // ✨ Filter for future events only (for dashboard preview)
  if (filters?.futureOnly) {
    query = query.gte('start_time', now)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
  }

  query = query.order('start_time', { ascending: true, nullsFirst: false })

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getEventById(supabase: SupabaseClient, eventId: string): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()
  
  if (error) throw error
  return data
}

export async function updateEvent(
  supabase: SupabaseClient,
  eventId: string,
  updates: EventUpdate
): Promise<Event> {
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

export async function getUserCalendarFeeds(supabase: SupabaseClient, userId: string): Promise<CalendarFeed[]> {
  const { data, error } = await supabase
    .from('calendar_feeds')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getCalendarFeedById(supabase: SupabaseClient, feedId: string): Promise<CalendarFeed> {
  const { data, error } = await supabase
    .from('calendar_feeds')
    .select('*')
    .eq('id', feedId)
    .single()
  
  if (error) throw error
  return data
}

// ===== STUDIOS DATA ACCESS =====

export type TeacherStudioRelationship = Database['public']['Tables']['studio_teacher_requests']['Row']

export async function getUserStudios(supabase: SupabaseClient, userId: string): Promise<TeacherStudioRelationship[]> {
  const { data, error } = await supabase
    .from('teacher_studio_relationships')
    .select('*')
    .eq('teacher_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getStudioById(supabase: SupabaseClient, studioId: string): Promise<Studio> {
  const { data, error } = await supabase
    .from('studios')
    .select('*')
    .eq('id', studioId)
    .single()
  
  if (error) throw error
  return data
}

// ===== INVOICES DATA ACCESS =====

export async function getUserInvoices(supabase: SupabaseClient, userId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getUninvoicedEvents(
  supabase: SupabaseClient, 
  userId: string, 
  studioId?: string
): Promise<Event[]> {
  let query = supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .is('invoice_id', null) // Not yet invoiced

  if (studioId) {
    query = query.eq('studio_id', studioId)
  }

  query = query.order('start_time', { ascending: false })

  const { data, error } = await query

  if (error) throw error
  return data || []
}

// ===== ADMIN DATA ACCESS =====

export async function getAllUsers(supabase: SupabaseClient): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export type UserInvitation = Database['public']['Tables']['user_invitations']['Row']

export async function getAllInvitations(supabase: SupabaseClient): Promise<UserInvitation[]> {
  const { data, error } = await supabase
    .from('user_invitations')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

// ===== CALENDAR & OAUTH DATA ACCESS =====

export type OAuthIntegration = Database['public']['Tables']['oauth_calendar_integrations']['Row']

export async function getAvailableCalendars(supabase: SupabaseClient, userId: string): Promise<OAuthIntegration> {
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

export interface CalendarSelection {
  calendarId: string
  selected: boolean
}

export async function updateCalendarSelection(
  supabase: SupabaseClient, 
  userId: string, 
  selections: CalendarSelection[]
): Promise<{ success: boolean; message: string }> {
  // This is a placeholder implementation since calendar_selections table doesn't exist
  // In a real implementation, this would update user preferences or calendar_feeds
  try {
    // For now, just return success
    console.log('Calendar selection updated for user:', userId, selections)
    return { success: true, message: 'Calendar selection updated successfully' }
  } catch {
    throw new Error('Failed to update calendar selection')
  }
}

export interface ImportEventData {
  id?: string
  summary?: string
  description?: string
  location?: string
  start?: { dateTime?: string; date?: string }
  end?: { dateTime?: string; date?: string }
}

export interface CalendarImportData {
  calendarId: string
  events: ImportEventData[]
}

export async function importCalendarEvents(
  supabase: SupabaseClient, 
  userId: string, 
  calendarData: CalendarImportData
): Promise<Event[]> {
  // Import events from external calendar
  const eventsToInsert = calendarData.events.map(eventData => ({
    user_id: userId,
    title: eventData.summary,
    description: eventData.description,
    start_time: eventData.start?.dateTime || eventData.start?.date,
    end_time: eventData.end?.dateTime || eventData.end?.date,
    location: eventData.location,
    external_id: eventData.id,
    external_calendar_id: calendarData.calendarId,
    created_at: new Date().toISOString()
  }))

  const { data, error } = await supabase
    .from('events')
    .insert(eventsToInsert)
    .select()

  if (error) throw error
  return data || []
}

// ===== ADVANCED EVENT QUERIES =====

export async function getEventsByDateRange(
  supabase: SupabaseClient, 
  userId: string, 
  startDate: string, 
  endDate: string
): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
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
): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .eq('studio_id', studioId)
    .order('start_time', { ascending: false })

  if (error) throw error
  return data || []
}

export interface RecentActivityResult {
  events: Pick<Event, 'id' | 'title' | 'updated_at' | 'start_time'>[]
  tags: Pick<Tag, 'id' | 'name' | 'updated_at'>[]
}

export async function getRecentActivity(supabase: SupabaseClient, userId: string): Promise<RecentActivityResult> {
  // Get recent events, tags created, studios added, etc.
  const [recentEvents, recentTags] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, updated_at, start_time')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(10),
    supabase
      .from('tags')
      .select('id, name, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(5)
  ])

  if (recentEvents.error) throw recentEvents.error
  if (recentTags.error) throw recentTags.error

  return {
    events: recentEvents.data || [],
    tags: recentTags.data || []
  }
}

// ===== ADMIN DATA ACCESS =====

export async function updateUserRole(
  supabase: SupabaseClient, 
  userId: string, 
  role: Database['public']['Enums']['user_role']
): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteUser(supabase: SupabaseClient, userId: string): Promise<User[]> {
  // This should cascade delete related data according to your database schema
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId)
    .select()

  if (error) throw error
  return data || []
}

// ===== EVENT MANAGEMENT VIA API ROUTES =====
// These functions call internal API routes that handle complex logic
// including Google Calendar integration

export interface CreateEventData {
  summary: string
  description?: string
  start: { dateTime: string; timeZone?: string }
  end: { dateTime: string; timeZone?: string }
  location?: string
  custom_tags?: string[]
  visibility?: string
}

export interface CreateEventResult {
  success: boolean
  event?: Event
  error?: string
}

export async function createEventViaAPI(eventData: CreateEventData): Promise<CreateEventResult> {
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

export interface UpdateEventData {
  eventId: string
  summary?: string
  description?: string
  start?: { dateTime: string; timeZone?: string }
  end?: { dateTime: string; timeZone?: string }
  location?: string
  custom_tags?: string[]
  visibility?: string
}

export async function updateEventViaAPI(eventData: UpdateEventData): Promise<CreateEventResult> {
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

export async function deleteEventViaAPI(eventId: string): Promise<CreateEventResult> {
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

export type InvoiceStatus = Database['public']['Enums']['invoice_status']

export interface InvoiceUpdateResult {
  status: InvoiceStatus
  sent_at?: string
  paid_at?: string
}

export async function updateInvoiceStatus(
  supabase: SupabaseClient,
  invoiceId: string, 
  status: InvoiceStatus,
  timestamp?: string
): Promise<Invoice> {
  const updates: Partial<InvoiceUpdateResult> = { status }
  
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

export interface GeneratePDFResult {
  pdf_url: string
}

export async function generateInvoicePDF(
  supabase: SupabaseClient,
  invoiceId: string, 
  language: 'en' | 'de' | 'es' = 'en'
): Promise<GeneratePDFResult> {
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

export async function deleteInvoice(supabase: SupabaseClient, invoiceId: string): Promise<Invoice[]> {
  // Use the reusable type-safe RPC utility
  const deleteResult = await deleteInvoiceWithCleanup(supabase, invoiceId)

  // Handle PDF file cleanup if there was a PDF URL
  if (deleteResult.pdf_url) {
    try {
      const userId = deleteResult.user_id
      if (userId) {
        const folderPath = `invoices/${userId}/${invoiceId}`
        
        // List all files in the invoice folder
        const { data: fileList, error: listError } = await supabase.storage
          .from('invoice-pdfs')
          .list(folderPath)

        if (!listError && fileList && fileList.length > 0) {
          // Delete all files in the invoice folder
          const filesToDelete = fileList.map((file: { name: string }) => `${folderPath}/${file.name}`)
          
          const { error: storageDeleteError } = await supabase.storage
            .from('invoice-pdfs')
            .remove(filesToDelete)

          if (storageDeleteError) {
            console.warn("Warning: Failed to delete PDF files from storage:", storageDeleteError)
            // Don't throw error here - the invoice was already deleted successfully
          }
        }
      }
    } catch (storageError) {
      console.warn("Warning: Error during PDF file cleanup:", storageError)
      // Don't throw error here - the invoice was already deleted successfully
    }
  }  
  // Return empty array since the invoice was deleted
  // Return empty array since the invoice was deleted
  return []
}

// ===== TEACHER STUDIO RELATIONSHIPS =====

export async function getTeacherStudioRelationships(supabase: SupabaseClient, teacherId: string): Promise<TeacherStudioRelationship[]> {
  const { data, error } = await supabase
    .from('studio_teacher_requests')
    .select('*')
    .eq('teacher_id', teacherId)
    .eq('status', 'approved')
    .order('processed_at', { ascending: false })

  if (error) {
    console.error('Error fetching teacher-studio relationships:', error)
    return []
  }

  return data || []
}

// ===== PUBLIC EVENTS DATA ACCESS =====

export type PublicEvent = Database['public']['Views']['public_events']['Row']

export interface PublicEventsOptions {
  limit?: number
  offset?: number
  startDate?: string
  endDate?: string
  // Server-side filtering options
  studioIds?: string[]
  yogaStyles?: string[]
  // weekdays removed - simplified to date ranges only
}

export async function getPublicEvents(
  supabase: SupabaseClient, 
  userId: string,
  options?: PublicEventsOptions
): Promise<PublicEvent[]> {
  const now = new Date()
  const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate())
  
  let query = supabase
    .from('public_events')
    .select('*')
    .eq('user_id', userId)
    .gte('start_time', options?.startDate || now.toISOString())
    .lte('start_time', options?.endDate || threeMonthsFromNow.toISOString())

  // Studio filtering
  if (options?.studioIds && options.studioIds.length > 0) {
    query = query.in('studio_id', options.studioIds)
  }

  // Tags filtering (yoga styles) - using array contains
  if (options?.yogaStyles && options.yogaStyles.length > 0) {
    // For array contains, we need to check if any of the yoga styles exist in the tags array
    query = query.overlaps('tags', options.yogaStyles)
  }

  query = query.order('start_time', { ascending: true })

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1)
  }

  const { data, error } = await query

  if (error) throw error
  
  // Weekdays filtering removed - simplified to basic date ranges only

  return data || []
}

// ===== ADMIN MUTATIONS (VIA API) =====

export interface InvitationData {
  email: string
  invited_name?: string
  personal_message?: string
  expiry_days: number
  notes?: string
}

export interface InvitationResult {
  success: boolean
  invitation?: UserInvitation
  invitationLink?: string
  error?: string
}

export async function createInvitation(
  supabase: SupabaseClient,
  invitationData: InvitationData
): Promise<InvitationResult> {
  // This will need to call the API since invitation creation involves email sending
  const response = await fetch('/api/invitations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invitationData)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create invitation')
  }

  return await response.json()
}

export async function cancelInvitation(supabase: SupabaseClient, invitationId: string): Promise<InvitationResult> {
  const response = await fetch(`/api/invitations/${invitationId}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to cancel invitation')
  }

  return await response.json()
}

// ===== CALENDAR IMPORT DATA ACCESS =====

export interface ImportableCalendar {
  id: string
  name: string
  description?: string
  primary?: boolean
}

export async function getImportableCalendars(): Promise<ImportableCalendar[]> {
  const response = await fetch('/api/calendar/import')
  
  if (!response.ok) {
    throw new Error('Failed to fetch available calendars')
  }
  
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch calendars')
  }
  
  return data.calendars || []
}

export interface CalendarImportRequest {
  source: 'google' | 'ics'
  calendarId?: string
  icsContent?: string
  selectedEvents?: string[]
}

export interface CalendarImportResult {
  success: boolean
  imported?: number
  skipped?: number
  errors?: string[]
}

export async function importCalendarData(
  importData: CalendarImportRequest
): Promise<CalendarImportResult> {
  const response = await fetch('/api/calendar/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(importData)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to import calendar data')
  }

  return await response.json()
}

export async function uploadICSFile(
  icsContent: string
): Promise<CalendarImportResult> {
  const response = await fetch('/api/calendar/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: 'ics',
      icsContent,
      action: 'preview'
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to process ICS file')
  }

  return await response.json()
}

export interface CalendarSelectionRequest {
  selections: CalendarSelection[]
  syncApproach?: string
}

export async function saveCalendarSelection(
  selections: CalendarSelection[],
  syncApproach: string = 'yoga_only'
): Promise<CalendarImportResult> {
  const response = await fetch('/api/calendar-selection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      selections,
      sync_approach: syncApproach
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to save calendar selection')
  }

  return await response.json()
}

export interface YogaCalendarOptions {
  timeZone?: string
  syncApproach?: string
}

export async function createYogaCalendar(
  options: YogaCalendarOptions = {}
): Promise<CalendarImportResult> {
  const response = await fetch('/api/calendar/create-yoga-calendar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timeZone: options.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      sync_approach: options.syncApproach || 'yoga_only'
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create yoga calendar')
  }

  return await response.json()
}

// ===== AUTH DATA ACCESS =====

export interface MarkInvitationUsedResult {
  success: boolean
  message?: string
}

export async function markInvitationAsUsed(
  supabase: SupabaseClient,
  token: string,
  userId: string
): Promise<MarkInvitationUsedResult> {
  const response = await fetch('/api/invitations/mark-used', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, userId })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to mark invitation as used')
  }

  return await response.json()
} 