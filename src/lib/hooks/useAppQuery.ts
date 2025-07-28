'use client'

import { useUnifiedQuery, useUnifiedMutation } from './useUnifiedQuery'
import { queryKeys } from '../query-keys'
import * as dataAccess from '../server/data-access'

/**
 * Application-specific query hooks that use our unified system
 * These are the main hooks developers should use in components
 */

// ===== USER QUERIES =====

export function useUserProfile(userId: string, options?: { enabled?: boolean }) {
  return useUnifiedQuery({
    queryKey: queryKeys.users.profile(userId),
    fetcher: (supabase) => dataAccess.getUserProfile(supabase, userId),
    enabled: options?.enabled ?? !!userId,
  })
}

export function useUserRole(userId: string, options?: { enabled?: boolean }) {
  return useUnifiedQuery({
    queryKey: queryKeys.users.role(userId),
    fetcher: (supabase) => dataAccess.getUserRole(supabase, userId),
    enabled: options?.enabled ?? !!userId,
  })
}

// ===== TAG QUERIES =====

export function useAllTags(userId: string, options?: { enabled?: boolean }) {
  return useUnifiedQuery({
    queryKey: queryKeys.tags.allForUser(userId),
    fetcher: (supabase) => dataAccess.getAllTags(supabase, userId),
    enabled: options?.enabled ?? !!userId,
  })
}

export function useTagRules(userId: string, options?: { enabled?: boolean }) {
  return useUnifiedQuery({
    queryKey: queryKeys.tags.tagRules(userId),
    fetcher: (supabase) => dataAccess.getTagRules(supabase, userId),
    enabled: options?.enabled ?? !!userId,
  })
}

// ===== EVENT QUERIES =====

export function useUserEvents(
  userId: string, 
  filters?: Parameters<typeof dataAccess.getUserEvents>[2],
  options?: { enabled?: boolean }
) {
  return useUnifiedQuery({
    queryKey: queryKeys.events.list(userId, filters),
    fetcher: (supabase) => dataAccess.getUserEvents(supabase, userId, filters),
    enabled: options?.enabled ?? !!userId,
  })
}

export function useEventById(eventId: string, options?: { enabled?: boolean }) {
  return useUnifiedQuery({
    queryKey: queryKeys.events.detail(eventId),
    fetcher: (supabase) => dataAccess.getEventById(supabase, eventId),
    enabled: options?.enabled ?? !!eventId,
  })
}

// ===== CALENDAR FEED QUERIES =====

export function useUserCalendarFeeds(userId: string, options?: { enabled?: boolean }) {
  return useUnifiedQuery({
    queryKey: queryKeys.calendarFeeds.userFeeds(userId),
    fetcher: (supabase) => dataAccess.getUserCalendarFeeds(supabase, userId),
    enabled: options?.enabled ?? !!userId,
  })
}

// ===== STUDIO QUERIES =====

export function useUserStudios(userId: string, options?: { enabled?: boolean }) {
  return useUnifiedQuery({
    queryKey: queryKeys.studios.userStudios(userId),
    fetcher: (supabase) => dataAccess.getUserStudios(supabase, userId),
    enabled: options?.enabled ?? !!userId,
  })
}

// ===== INVOICE QUERIES =====

export function useUserInvoices(userId: string, options?: { enabled?: boolean }) {
  return useUnifiedQuery({
    queryKey: queryKeys.invoices.userInvoices(userId),
    fetcher: (supabase) => dataAccess.getUserInvoices(supabase, userId),
    enabled: options?.enabled ?? !!userId,
  })
}

export function useUninvoicedEvents(
  userId: string, 
  studioId?: string, 
  options?: { enabled?: boolean }
) {
  return useUnifiedQuery({
    queryKey: queryKeys.invoices.uninvoicedEvents(userId, studioId),
    fetcher: (supabase) => dataAccess.getUninvoicedEvents(supabase, userId, studioId),
    enabled: options?.enabled ?? !!userId,
  })
}

// ===== SIMPLE MUTATION HOOKS =====
// Simplified versions to avoid complex TypeScript issues for now

export function useCreateTag() {
  return useUnifiedMutation({
    mutationFn: (supabase, tagData: Parameters<typeof dataAccess.createTag>[1]) => 
      dataAccess.createTag(supabase, tagData),
    onSuccess: () => {
      // For now, we'll handle invalidation manually in components
      // This can be improved later with better typing
    },
  })
}

export function useUpdateTag() {
  return useUnifiedMutation({
    mutationFn: (supabase, { tagId, updates }: { 
      tagId: string; 
      updates: Parameters<typeof dataAccess.updateTag>[2] 
    }) => dataAccess.updateTag(supabase, tagId, updates),
    onSuccess: () => {
      // Manual invalidation for now
    },
  })
}

export function useDeleteTag() {
  return useUnifiedMutation({
    mutationFn: (supabase, { tagId }: { tagId: string }) => 
      dataAccess.deleteTag(supabase, tagId),
    onSuccess: () => {
      // Manual invalidation for now
    },
  })
}

// ===== CALENDAR & OAUTH HOOKS =====

export function useAvailableCalendars(userId: string, options?: { enabled?: boolean }) {
  return useUnifiedQuery({
    queryKey: queryKeys.oauth.availableCalendars(userId),
    fetcher: (supabase) => dataAccess.getAvailableCalendars(supabase, userId),
    enabled: options?.enabled ?? !!userId,
  })
}

export function useUpdateCalendarSelection() {
  return useUnifiedMutation({
    mutationFn: (supabase, { userId, selections }: { 
      userId: string; 
      selections: { calendarId: string; selected: boolean }[] 
    }) => dataAccess.updateCalendarSelection(supabase, userId, selections),
    onSuccess: () => {
      // Manual invalidation for now
    },
  })
}

export function useImportCalendar() {
  return useUnifiedMutation({
    mutationFn: (supabase, { userId, calendarData }: { 
      userId: string; 
      calendarData: { calendarId: string; events: unknown[] }
    }) => dataAccess.importCalendarEvents(supabase, userId, calendarData),
    onSuccess: () => {
      // Manual invalidation for now
    },
  })
}

// ===== ADVANCED EVENT HOOKS =====

export function useEventsByDateRange(
  userId: string, 
  startDate: string, 
  endDate: string, 
  options?: { enabled?: boolean }
) {
  return useUnifiedQuery({
    queryKey: queryKeys.events.byDateRange(userId, startDate, endDate),
    fetcher: (supabase) => dataAccess.getEventsByDateRange(supabase, userId, startDate, endDate),
    enabled: options?.enabled ?? !!(userId && startDate && endDate),
  })
}

export function useEventsByStudio(
  userId: string, 
  studioId: string, 
  options?: { enabled?: boolean }
) {
  return useUnifiedQuery({
    queryKey: queryKeys.events.byStudio(userId, studioId),
    fetcher: (supabase) => dataAccess.getEventsByStudio(supabase, userId, studioId),
    enabled: options?.enabled ?? !!(userId && studioId),
  })
}

export function useRecentActivity(userId: string, options?: { enabled?: boolean }) {
  return useUnifiedQuery({
    queryKey: queryKeys.events.recentActivity(userId),
    fetcher: (supabase) => dataAccess.getRecentActivity(supabase, userId),
    enabled: options?.enabled ?? !!userId,
  })
}

// ===== ADMIN HOOKS =====

export function useAllUsers(options?: { enabled?: boolean }) {
  return useUnifiedQuery({
    queryKey: queryKeys.admin.users(),
    fetcher: (supabase) => dataAccess.getAllUsers(supabase),
    enabled: options?.enabled ?? true,
  })
}

export function useUpdateUserRole() {
  return useUnifiedMutation({
    mutationFn: (supabase, { userId, role }: { userId: string; role: string }) => 
      dataAccess.updateUserRole(supabase, userId, role),
    onSuccess: () => {
      // Manual invalidation for now
    },
  })
}

export function useDeleteUser() {
  return useUnifiedMutation({
    mutationFn: (supabase, { userId }: { userId: string }) => 
      dataAccess.deleteUser(supabase, userId),
    onSuccess: () => {
      // Manual invalidation for now
    },
  })
}

// ===== EVENT MANAGEMENT HOOKS =====
// These handle events with Google Calendar integration via API routes

export function useCreateEvent() {
  return useUnifiedMutation({
    mutationFn: (_supabase, eventData: {
      summary: string
      description?: string
      start: { dateTime: string; timeZone?: string }
      end: { dateTime: string; timeZone?: string }
      location?: string
      custom_tags?: string[]
      visibility?: string
    }) => dataAccess.createEventViaAPI(eventData),
    onSuccess: () => {
      // Manual invalidation for now - would invalidate events queries
    },
  })
}

export function useUpdateEvent() {
  return useUnifiedMutation({
    mutationFn: (_supabase, eventData: {
      eventId: string
      summary?: string
      description?: string
      start?: { dateTime: string; timeZone?: string }
      end?: { dateTime: string; timeZone?: string }
      location?: string
      custom_tags?: string[]
      visibility?: string
    }) => dataAccess.updateEventViaAPI(eventData),
    onSuccess: () => {
      // Manual invalidation for now - would invalidate events queries
    },
  })
}

export function useDeleteEvent() {
  return useUnifiedMutation({
    mutationFn: (_supabase, { eventId }: { eventId: string }) => 
      dataAccess.deleteEventViaAPI(eventId),
    onSuccess: () => {
      // Manual invalidation for now - would invalidate events queries
    },
  })
}

// ===== INVOICE OPERATIONS HOOKS =====

export function useUpdateInvoiceStatus() {
  return useUnifiedMutation({
    mutationFn: (supabase, { invoiceId, status, timestamp }: {
      invoiceId: string
      status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
      timestamp?: string
    }) => dataAccess.updateInvoiceStatus(supabase, invoiceId, status, timestamp),
    onSuccess: () => {
      // Manual invalidation for now - would invalidate invoices queries
    },
  })
}

export function useGenerateInvoicePDF() {
  return useUnifiedMutation({
    mutationFn: (supabase, { invoiceId, language }: {
      invoiceId: string
      language?: 'en' | 'de' | 'es'
    }) => dataAccess.generateInvoicePDF(supabase, invoiceId, language),
    onSuccess: () => {
      // Manual invalidation for now - would invalidate invoices queries
    },
  })
}

export function useDeleteInvoice() {
  return useUnifiedMutation({
    mutationFn: (supabase, { invoiceId }: { invoiceId: string }) => 
      dataAccess.deleteInvoice(supabase, invoiceId),
    onSuccess: () => {
      // Manual invalidation for now - would invalidate invoices queries
    },
  })
}

// ===== TEACHER STUDIO RELATIONSHIPS HOOKS =====

export function useTeacherStudioRelationships(teacherId: string, options?: { enabled?: boolean }) {
  return useUnifiedQuery({
    queryKey: queryKeys.studios.teacherRelationships(teacherId),
    fetcher: (supabase) => dataAccess.getTeacherStudioRelationships(supabase, teacherId),
    enabled: options?.enabled ?? !!teacherId,
  })
}

// ===== PUBLIC EVENTS HOOKS =====

export function usePublicEvents(
  userId: string, 
  filters?: {
    limit?: number
    offset?: number
    startDate?: string
    endDate?: string
  }, 
  options?: { enabled?: boolean }
) {
  return useUnifiedQuery({
    queryKey: queryKeys.events.public(userId, { 
      startDate: filters?.startDate, 
      endDate: filters?.endDate 
    }),
    fetcher: (supabase) => dataAccess.getPublicEvents(supabase, userId, filters),
    enabled: options?.enabled ?? !!userId,
  })
} 