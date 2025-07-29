'use client'

import { useSupabaseQuery, useSupabaseMutation } from './useQueryWithSupabase'
import { queryKeys } from '../query-keys'
import * as dataAccess from '../server/data-access'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Application-specific query hooks using TanStack Query
 * These are the main hooks developers should use in components
 * 
 * Note: Only includes functions that exist in data-access layer
 */

// ===== USER QUERIES =====

export function useUserProfile(userId: string, options?: { enabled?: boolean }) {
  return useSupabaseQuery(
    queryKeys.users.profile(userId),
    (supabase) => dataAccess.getUserProfile(supabase, userId),
    { enabled: options?.enabled ?? !!userId }
  )
}

export function useUserRole(userId: string, options?: { enabled?: boolean }) {
  return useSupabaseQuery(
    queryKeys.users.role(userId),
    (supabase) => dataAccess.getUserRole(supabase, userId),
    { enabled: options?.enabled ?? !!userId }
  )
}

// ===== TAG QUERIES =====

export function useAllTags(userId: string, options?: { enabled?: boolean }) {
  return useSupabaseQuery(
    queryKeys.tags.allForUser(userId),
    (supabase) => dataAccess.getAllTags(supabase, userId),
    { enabled: options?.enabled ?? !!userId }
  )
}

export function useTagRules(userId: string, options?: { enabled?: boolean }) {
  return useSupabaseQuery(
    queryKeys.tags.tagRules(userId),
    (supabase) => dataAccess.getTagRules(supabase, userId),
    { enabled: options?.enabled ?? !!userId }
  )
}

// ===== EVENT QUERIES =====

export function useEvents(userId: string, options?: { enabled?: boolean }) {
  return useSupabaseQuery(
    queryKeys.events.list(userId),
    (supabase) => dataAccess.getUserEvents(supabase, userId),
    { enabled: options?.enabled ?? !!userId, staleTime: 30 * 1000 }
  )
}

export function usePublicEvents(userId: string, options?: { startDate?: string; endDate?: string; enabled?: boolean }) {
  return useSupabaseQuery(
    queryKeys.events.public(userId, options),
    (supabase) => dataAccess.getPublicEvents(supabase, userId, options),
    { enabled: options?.enabled ?? !!userId, staleTime: 60 * 1000 }
  )
}

export function useEventActivity(userId: string, options?: { enabled?: boolean }) {
  return useSupabaseQuery(
    queryKeys.events.recentActivity(userId),
    (supabase) => dataAccess.getRecentActivity(supabase, userId),
    { enabled: options?.enabled ?? !!userId, staleTime: 2 * 60 * 1000 }
  )
}

export function useCalendarFeeds(userId: string, options?: { enabled?: boolean }) {
  return useSupabaseQuery(
    queryKeys.calendarFeeds.userFeeds(userId),
    (supabase) => dataAccess.getUserCalendarFeeds(supabase, userId),
    { enabled: options?.enabled ?? !!userId, staleTime: 5 * 60 * 1000 }
  )
}

// ===== STUDIO QUERIES =====

export function useUserStudios(userId: string, options?: { enabled?: boolean }) {
  return useSupabaseQuery(
    queryKeys.studios.userStudios(userId),
    (supabase) => dataAccess.getUserStudios(supabase, userId),
    { enabled: options?.enabled ?? !!userId, staleTime: 5 * 60 * 1000 }
  )
}

// ===== INVOICE QUERIES =====

export function useInvoices(userId: string, options?: { enabled?: boolean }) {
  return useSupabaseQuery(
    queryKeys.invoices.userInvoices(userId),
    (supabase) => dataAccess.getUserInvoices(supabase, userId),
    { enabled: options?.enabled ?? !!userId, staleTime: 2 * 60 * 1000 }
  )
}

export function useUninvoicedEvents(userId: string, options?: { enabled?: boolean }) {
  return useSupabaseQuery(
    queryKeys.invoices.uninvoicedEvents(userId),
    (supabase) => dataAccess.getUninvoicedEvents(supabase, userId),
    { enabled: options?.enabled ?? !!userId, staleTime: 30 * 1000 }
  )
}

// ===== MUTATIONS =====

export function useCreateTag() {
  return useSupabaseMutation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (supabase: SupabaseClient, tagData: any) => {
      return dataAccess.createTag(supabase, tagData)
    }
  )
}

export function useUpdateTag() {
  return useSupabaseMutation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (supabase: SupabaseClient, { tagId, updates }: { tagId: string; updates: any }) => {
      return dataAccess.updateTag(supabase, tagId, updates)
    }
  )
}

export function useDeleteTag() {
  return useSupabaseMutation(
    async (supabase: SupabaseClient, tagId: string) => {
      return dataAccess.deleteTag(supabase, tagId)
    }
  )
}

export function useDeleteInvoice() {
  return useSupabaseMutation(
    async (supabase: SupabaseClient, invoiceId: string) => {
      return dataAccess.deleteInvoice(supabase, invoiceId)
    }
  )
}

// ===== ADMIN QUERIES =====

export function useAllUsers(options?: { enabled?: boolean }) {
  return useSupabaseQuery(
    queryKeys.admin.users(),
    (supabase) => dataAccess.getAllUsers(supabase),
    { enabled: options?.enabled ?? true, staleTime: 5 * 60 * 1000 }
  )
}

export function useAllInvitations(options?: { enabled?: boolean }) {
  return useSupabaseQuery(
    queryKeys.admin.invitations(),
    (supabase) => dataAccess.getAllInvitations(supabase),
    { enabled: options?.enabled ?? true, staleTime: 2 * 60 * 1000 }
  )
}

export function useCreateUserInvitation() {
  return useSupabaseMutation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (supabase: SupabaseClient, invitationData: any) => {
      return dataAccess.createInvitation(supabase, invitationData)
    }
  )
}

export function useDeleteUser() {
  return useSupabaseMutation(
    async (supabase: SupabaseClient, userId: string) => {
      return dataAccess.deleteUser(supabase, userId)
    }
  )
}

export function useUpdateUserRole() {
  return useSupabaseMutation(
    async (supabase: SupabaseClient, { userId, role }: { userId: string; role: string }) => {
      return dataAccess.updateUserRole(supabase, userId, role)
    }
  )
}

// Note: Other functions like billing entities, some invoice operations, tag rules, etc.
// are not included because they don't exist in the data-access layer yet.
// These can be added when the corresponding data-access functions are implemented.

// ===== COMPATIBILITY ALIASES =====
// These provide compatibility for components that haven't been updated yet

export function useUserEvents(userId: string, filters?: {
  limit?: number
  futureOnly?: boolean
  isPublic?: boolean
  variant?: string
  offset?: number
}, options?: { enabled?: boolean }) {
  return useSupabaseQuery(
    queryKeys.events.list(userId, filters),
    (supabase) => dataAccess.getUserEvents(supabase, userId, filters),
    { enabled: options?.enabled ?? !!userId, staleTime: 30 * 1000 }
  )
}

export function useMarkInvitationAsUsed() {
  return useSupabaseMutation(
    async (supabase: SupabaseClient, { token, userId }: { token: string; userId: string }) => {
      return dataAccess.markInvitationAsUsed(supabase, token, userId)
    }
  )
}

export function useSaveCalendarSelection() {
  return useSupabaseMutation(
    async (_, { selections, syncApproach }: { 
      selections: { calendarId: string; selected: boolean }[];
      syncApproach?: string;
    }) => {
      return dataAccess.saveCalendarSelection(selections, syncApproach)
    }
  )
}

export function useUpdateUserProfile() {
  return useSupabaseMutation(
    async (supabase: SupabaseClient, { userId, profileData }: { 
      userId: string; 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      profileData: any 
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
  return useSupabaseMutation(
    async (supabase: SupabaseClient, invitationId: string) => {
      return dataAccess.cancelInvitation(supabase, invitationId)
    }
  )
}

export function useUserInvoices(userId: string, options?: { enabled?: boolean }) {
  return useInvoices(userId, options) // Alias
}

// Calendar import hooks (API-based)
export function useGetAvailableCalendars(options?: { enabled?: boolean }) {
  return useSupabaseQuery(
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
  return useSupabaseMutation(
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
  return useSupabaseMutation(
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

export function useCreateYogaCalendar() {
  return useSupabaseMutation(
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
  return useSupabaseMutation(
    async (supabase: SupabaseClient, { invoiceId, status, timestamp }: {
      invoiceId: string
      status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
      timestamp?: string
    }) => {
      return dataAccess.updateInvoiceStatus(supabase, invoiceId, status, timestamp)
    }
  )
}

export function useGenerateInvoicePDF() {
  return useSupabaseMutation(
    async (supabase: SupabaseClient, { invoiceId, language }: {
      invoiceId: string
      language?: 'en' | 'de' | 'es'
    }) => {
      return dataAccess.generateInvoicePDF(supabase, invoiceId, language)
    }
  )
} 