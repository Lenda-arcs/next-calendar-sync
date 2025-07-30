'use client'

import { useSupabaseQuery, useSupabaseMutation } from './useQueryWithSupabase'
import { queryKeys } from '../query-keys'
import { QUERY_CONFIGS } from '../query-constants'
import * as dataAccess from '../server/data-access'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { 
  User, 
  Tag, TagInsert, TagUpdate,
  Event,
  CalendarFeed,
  Invoice,
  InvoiceWithDetails,
  UserUpdate
} from '../types'

// Import types defined in data-access.ts
import type {
  UserInvitation,
  TagRuleWithTag,
  AllTagsResult,
  EventFilters,
  RecentActivityResult,
  PublicEvent,
  PublicEventsOptions,
  TeacherStudioRelationship,
  InvitationData,
  InvitationResult,
  CalendarSelection,
  MarkInvitationUsedResult,
  InvoiceStatus,
  CreateEventData,
  CreateEventResult,
  UpdateEventData
} from '../server/data-access'
import type { Database } from '../../../database-generated.types'

/**
 * Application-specific query hooks using TanStack Query
 * These are the main hooks developers should use in components
 * 
 * Note: Only includes functions that exist in data-access layer
 */

// ===== USER QUERIES =====

export function useUserProfile(userId: string, options?: { enabled?: boolean }) {
  // ✅ Using shared constants - guaranteed to match preload functions
  const config = QUERY_CONFIGS.userProfile
  return useSupabaseQuery<User>(
    config.queryKey(userId),
    (supabase) => config.queryFn(supabase, userId),
    { 
      enabled: options?.enabled ?? !!userId, 
      staleTime: config.staleTime 
    }
  )
}

export function useUserRole(userId: string, options?: { enabled?: boolean }) {
  // ✅ Using shared constants - guaranteed to match preload functions
  const config = QUERY_CONFIGS.userRole
  return useSupabaseQuery<Database['public']['Enums']['user_role']>(
    config.queryKey(userId),
    (supabase) => config.queryFn(supabase, userId),
    { 
      enabled: options?.enabled ?? !!userId, 
      staleTime: config.staleTime 
    }
  )
}

// ===== TAG QUERIES =====

export function useAllTags(userId: string, options?: { enabled?: boolean }) {
  // ✅ Using shared constants - guaranteed to match preload functions
  const config = QUERY_CONFIGS.allTags
  return useSupabaseQuery<AllTagsResult>(
    config.queryKey(userId),
    (supabase) => config.queryFn(supabase, userId),
    { 
      enabled: options?.enabled ?? !!userId,
      staleTime: config.staleTime 
    }
  )
}

export function useTagRules(userId: string, options?: { enabled?: boolean }) {
  // ✅ Using shared constants - guaranteed to match preload functions
  const config = QUERY_CONFIGS.tagRules
  return useSupabaseQuery<TagRuleWithTag[]>(
    config.queryKey(userId),
    (supabase) => config.queryFn(supabase, userId),
    { 
      enabled: options?.enabled ?? !!userId,
      staleTime: config.staleTime 
    }
  )
}

// ===== EVENT QUERIES =====

export function useEvents(userId: string, options?: { enabled?: boolean }) {
  // ✅ Using shared constants - guaranteed to match preload functions
  const config = QUERY_CONFIGS.events
  return useSupabaseQuery<Event[]>(
    config.queryKey(userId),
    (supabase) => config.queryFn(supabase, userId),
    { 
      enabled: options?.enabled ?? !!userId, 
      staleTime: config.staleTime 
    }
  )
}

export function usePublicEvents(userId: string, options?: PublicEventsOptions & { enabled?: boolean }) {
  // ✅ Using shared constants - guaranteed to match preload functions
  const config = QUERY_CONFIGS.publicEvents
  return useSupabaseQuery<PublicEvent[]>(
    config.queryKey(userId, options as Record<string, unknown>),
    (supabase) => config.queryFn(supabase, userId, options as Record<string, unknown>),
    { 
      enabled: options?.enabled ?? !!userId, 
      staleTime: config.staleTime 
    }
  )
}

export function useEventActivity(userId: string, options?: { enabled?: boolean }) {
  // ✅ Using shared constants - guaranteed to match preload functions
  const config = QUERY_CONFIGS.eventActivity
  return useSupabaseQuery<RecentActivityResult>(
    config.queryKey(userId),
    (supabase) => config.queryFn(supabase, userId),
    { 
      enabled: options?.enabled ?? !!userId, 
      staleTime: config.staleTime 
    }
  )
}

export function useCalendarFeeds(userId: string, options?: { enabled?: boolean }) {
  // ✅ Using shared constants - guaranteed to match preload functions
  const config = QUERY_CONFIGS.userCalendarFeeds
  return useSupabaseQuery<CalendarFeed[]>(
    config.queryKey(userId),
    (supabase) => config.queryFn(supabase, userId),
    { 
      enabled: options?.enabled ?? !!userId, 
      staleTime: config.staleTime 
    }
  )
}

// ===== STUDIO QUERIES =====

export function useUserStudios(userId: string, options?: { enabled?: boolean }) {
  // ✅ Using shared constants - guaranteed to match preload functions
  const config = QUERY_CONFIGS.userStudios
  return useSupabaseQuery<TeacherStudioRelationship[]>(
    config.queryKey(userId),
    (supabase) => config.queryFn(supabase, userId),
    { 
      enabled: options?.enabled ?? !!userId, 
      staleTime: config.staleTime 
    }
  )
}

// ===== INVOICE QUERIES =====

export function useInvoices(userId: string, options?: { enabled?: boolean }) {
  // ✅ Using shared constants - guaranteed to match preload functions
  const config = QUERY_CONFIGS.userInvoices
  return useSupabaseQuery<InvoiceWithDetails[]>(
    config.queryKey(userId),
    (supabase) => config.queryFn(supabase, userId),
    { 
      enabled: options?.enabled ?? !!userId, 
      staleTime: config.staleTime 
    }
  )
}

export function useUninvoicedEvents(userId: string, options?: { enabled?: boolean }) {
  // ✅ Using shared constants - guaranteed to match preload functions
  const config = QUERY_CONFIGS.uninvoicedEvents
  return useSupabaseQuery<Event[]>(
    config.queryKey(userId),
    (supabase) => config.queryFn(supabase, userId),
    { 
      enabled: options?.enabled ?? !!userId, 
      staleTime: config.staleTime 
    }
  )
}

// ===== MUTATIONS =====

export function useCreateTag() {
  return useSupabaseMutation<Tag, TagInsert>(
    async (supabase: SupabaseClient, tagData: TagInsert) => {
      return dataAccess.createTag(supabase, tagData)
    }
  )
}

export function useUpdateTag() {
  return useSupabaseMutation<Tag, { tagId: string; updates: TagUpdate }>(
    async (supabase: SupabaseClient, { tagId, updates }: { tagId: string; updates: TagUpdate }) => {
      return dataAccess.updateTag(supabase, tagId, updates)
    }
  )
}

export function useDeleteTag() {
  return useSupabaseMutation<Tag[], string>(
    async (supabase: SupabaseClient, tagId: string) => {
      return dataAccess.deleteTag(supabase, tagId)
    }
  )
}

// ===== EVENT MUTATIONS =====

export function useCreateEvent() {
  return useSupabaseMutation<CreateEventResult, CreateEventData>(
    async (_supabase: SupabaseClient, eventData: CreateEventData) => {
      return dataAccess.createEventViaAPI(eventData)
    }
  )
}

export function useUpdateEvent() {
  return useSupabaseMutation<CreateEventResult, UpdateEventData>(
    async (_supabase: SupabaseClient, eventData: UpdateEventData) => {
      return dataAccess.updateEventViaAPI(eventData)
    }
  )
}

export function useDeleteEvent() {
  return useSupabaseMutation<CreateEventResult, string>(
    async (_supabase: SupabaseClient, eventId: string) => {
      return dataAccess.deleteEventViaAPI(eventId)
    }
  )
}

// ===== CALENDAR SYNC MUTATION =====

export function useSyncAllCalendarFeeds() {
  return useSupabaseMutation<{ successfulSyncs: number; totalFeeds: number; totalEvents: number }, string>(
    async (supabase: SupabaseClient, userId: string) => {
      // Import the function dynamically to avoid circular dependency issues
      const { syncAllUserCalendarFeeds } = await import('../calendar-feeds')
      return syncAllUserCalendarFeeds(supabase, userId)
    }
  )
}

export function useDeleteInvoice() {
  return useSupabaseMutation<Invoice[], string>(
    async (supabase: SupabaseClient, invoiceId: string) => {
      return dataAccess.deleteInvoice(supabase, invoiceId)
    }
  )
}

// ===== ADMIN QUERIES =====

export function useAllUsers(options?: { enabled?: boolean }) {
  return useSupabaseQuery<User[]>(
    queryKeys.admin.users(),
    (supabase) => dataAccess.getAllUsers(supabase),
    { enabled: options?.enabled ?? true, staleTime: 5 * 60 * 1000 }
  )
}

export function useAllInvitations(options?: { enabled?: boolean }) {
  return useSupabaseQuery<UserInvitation[]>(
    queryKeys.admin.invitations(),
    (supabase) => dataAccess.getAllInvitations(supabase),
    { enabled: options?.enabled ?? true, staleTime: 2 * 60 * 1000 }
  )
}

export function useCreateUserInvitation() {
  return useSupabaseMutation<InvitationResult, InvitationData>(
    async (supabase: SupabaseClient, invitationData: InvitationData) => {
      return dataAccess.createInvitation(supabase, invitationData)
    }
  )
}

export function useDeleteUser() {
  return useSupabaseMutation<User[], string>(
    async (supabase: SupabaseClient, userId: string) => {
      return dataAccess.deleteUser(supabase, userId)
    }
  )
}

export function useUpdateUserRole() {
  return useSupabaseMutation<User, { userId: string; role: Database['public']['Enums']['user_role'] }>(
    async (supabase: SupabaseClient, { userId, role }: { userId: string; role: Database['public']['Enums']['user_role'] }) => {
      return dataAccess.updateUserRole(supabase, userId, role)
    }
  )
}

// Note: Other functions like billing entities, some invoice operations, tag rules, etc.
// are not included because they don't exist in the data-access layer yet.
// These can be added when the corresponding data-access functions are implemented.

// ===== COMPATIBILITY ALIASES =====
// These provide compatibility for components that haven't been updated yet

export function useUserEvents(userId: string, filters?: EventFilters, options?: { enabled?: boolean }) {
  // ✅ Using shared constants - guaranteed to match preload functions
  const config = QUERY_CONFIGS.userEvents
  return useSupabaseQuery<Event[]>(
    config.queryKey(userId, filters as Record<string, unknown>),
    (supabase) => config.queryFn(supabase, userId, filters as Record<string, unknown>),
    { 
      enabled: options?.enabled ?? !!userId, 
      staleTime: config.staleTime 
    }
  )
}

export function useMarkInvitationAsUsed() {
  return useSupabaseMutation<MarkInvitationUsedResult, { token: string; userId: string }>(
    async (supabase: SupabaseClient, { token, userId }: { token: string; userId: string }) => {
      return dataAccess.markInvitationAsUsed(supabase, token, userId)
    }
  )
}

export function useSaveCalendarSelection() {
  return useSupabaseMutation<{ success: boolean; message: string }, { 
    selections: CalendarSelection[];
  }>(
    async (supabase: SupabaseClient, { selections }: { 
      selections: CalendarSelection[];
    }) => {
      return dataAccess.updateCalendarSelection(supabase, '', selections) // Note: userId needs to be passed differently
    }
  )
}

export function useUpdateUserProfile() {
  return useSupabaseMutation<User, { userId: string; profileData: UserUpdate }>(
    async (supabase: SupabaseClient, { userId, profileData }: { 
      userId: string; 
      profileData: UserUpdate 
    }) => {
      return dataAccess.updateUserProfile(supabase, userId, profileData)
    }
  )
}

// ===== ADDITIONAL MISSING HOOKS =====
// Adding hooks that were missing from the simplified version

export function useCreateInvitation() {
  return useCreateUserInvitation() // Alias
}

export function useCancelInvitation() {
  return useSupabaseMutation<InvitationResult, string>(
    async (supabase: SupabaseClient, invitationId: string) => {
      return dataAccess.cancelInvitation(supabase, invitationId)
    }
  )
}

export function useUserInvoices(userId: string, options?: { enabled?: boolean }) {
  return useInvoices(userId, options) // Alias
}

// Calendar import types
interface ImportableCalendar {
  id: string
  name: string
  description?: string
  primary?: boolean
}

interface CalendarPreviewResult {
  events: Event[]
  total: number
}

// Calendar import hooks (API-based)
export function useGetAvailableCalendars(options?: { enabled?: boolean }) {
  return useSupabaseQuery<ImportableCalendar[]>(
    ['calendar', 'import', 'available'],
    async () => {
      const response = await fetch('/api/calendar/import')
      if (!response.ok) throw new Error('Failed to fetch available calendars')
      const data = await response.json()
      if (!data.success) throw new Error(data.error || 'Failed to fetch calendars')
      return data.calendars || []
    },
    { enabled: options?.enabled ?? true }
  )
}

export function usePreviewCalendarImport() {
  return useSupabaseMutation<CalendarPreviewResult, {
    source: 'google' | 'ics';
    sourceCalendarId?: string;
    icsContent?: string;
  }>(
    async (_supabase: SupabaseClient, { source, sourceCalendarId, icsContent }: {
      source: 'google' | 'ics';
      sourceCalendarId?: string;
      icsContent?: string;
    }) => {
      const response = await fetch('/api/calendar/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'preview',
          source,
          ...(source === 'google' ? { sourceCalendarId } : { icsContent })
        })
      })
      
      const data = await response.json()
      if (!data.success) throw new Error(data.error || `Failed to preview ${source} events`)
      return data.preview
    }
  )
}

export function useImportCalendarEvents() {
  return useSupabaseMutation<{ imported: number; skipped: number; errors: string[] }, {
    source: 'google' | 'ics';
    events: unknown[];
  }>(
    async (_supabase: SupabaseClient, { source, events }: {
      source: 'google' | 'ics';
      events: unknown[];
    }) => {
      const response = await fetch('/api/calendar/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'import',
          source,
          events
        })
      })
      
      const data = await response.json()
      if (!data.success) throw new Error(data.error || 'Failed to import events')
      return {
        imported: data.imported,
        skipped: data.skipped,
        errors: data.errors || []
      }
    }
  )
}

interface YogaCalendarResult {
  success: boolean
  calendarId?: string
  message?: string
}

export function useCreateYogaCalendar() {
  return useSupabaseMutation<YogaCalendarResult, { timeZone?: string; syncApproach?: string }>(
    async (_supabase: SupabaseClient, { timeZone, syncApproach }: { timeZone?: string; syncApproach?: string }) => {
      const response = await fetch('/api/calendar/create-yoga-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeZone: timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          sync_approach: syncApproach || 'yoga_only'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create yoga calendar')
      }

      return await response.json()
    }
  )
}

export function useUpdateInvoiceStatus() {
  return useSupabaseMutation<Invoice, {
    invoiceId: string
    status: InvoiceStatus
    timestamp?: string
  }>(
    async (supabase: SupabaseClient, { invoiceId, status, timestamp }: {
      invoiceId: string
      status: InvoiceStatus
      timestamp?: string
    }) => {
      return dataAccess.updateInvoiceStatus(supabase, invoiceId, status, timestamp)
    }
  )
}

export function useGenerateInvoicePDF() {
  return useSupabaseMutation<{ pdf_url: string }, {
    invoiceId: string
    language?: 'en' | 'de' | 'es'
  }>(
    async (supabase: SupabaseClient, { invoiceId, language }: {
      invoiceId: string
      language?: 'en' | 'de' | 'es'
    }) => {
      return dataAccess.generateInvoicePDF(supabase, invoiceId, language)
    }
  )
} 