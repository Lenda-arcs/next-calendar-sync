/**
 * 🔄 Shared Query Constants
 * 
 * Simple constants that ensure hooks and preload functions use identical configurations.
 * Both import from here to prevent mismatches.
 */

import { queryKeys } from './query-keys'
import * as dataAccess from './server/data-access'
import type { SupabaseClient } from '@supabase/supabase-js'

export const QUERY_CONFIGS = {
  // Tags
  allTags: {
    queryKey: (userId: string) => queryKeys.tags.allForUser(userId),
    queryFn: (supabase: SupabaseClient, userId: string) => dataAccess.getAllTags(supabase, userId),
    staleTime: 60 * 1000, // 1 minute
  },

  tagRules: {
    queryKey: (userId: string) => queryKeys.tags.tagRules(userId),
    queryFn: (supabase: SupabaseClient, userId: string) => dataAccess.getTagRules(supabase, userId),
    staleTime: 60 * 1000, // 1 minute
  },

  // Users
  userProfile: {
    queryKey: (userId: string) => queryKeys.users.profile(userId),
    queryFn: (supabase: SupabaseClient, userId: string) => dataAccess.getUserProfile(supabase, userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  },

  userRole: {
    queryKey: (userId: string) => queryKeys.users.role(userId),
    queryFn: (supabase: SupabaseClient, userId: string) => dataAccess.getUserRole(supabase, userId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  },

  // Events
  userEvents: {
    queryKey: (userId: string, filters?: Record<string, unknown>) => queryKeys.events.list(userId, filters),
    queryFn: (supabase: SupabaseClient, userId: string, filters?: Record<string, unknown>) => dataAccess.getUserEvents(supabase, userId, filters),
    staleTime: 30 * 1000, // 30 seconds
  },

  events: {
    queryKey: (userId: string) => queryKeys.events.list(userId),
    queryFn: (supabase: SupabaseClient, userId: string) => dataAccess.getUserEvents(supabase, userId),
    staleTime: 30 * 1000, // 30 seconds
  },

  publicEvents: {
    queryKey: (teacherSlug: string, options?: Record<string, unknown>) => queryKeys.events.public(teacherSlug, options),
    queryFn: (supabase: SupabaseClient, teacherSlug: string, options?: Record<string, unknown>) => dataAccess.getPublicEvents(supabase, teacherSlug, options),
    staleTime: 30 * 1000, // 30 seconds
  },

  eventActivity: {
    queryKey: (userId: string) => queryKeys.events.recentActivity(userId),
    queryFn: (supabase: SupabaseClient, userId: string) => dataAccess.getRecentActivity(supabase, userId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  },

  // Studios
  userStudios: {
    queryKey: (userId: string) => queryKeys.studios.userStudios(userId),
    queryFn: (supabase: SupabaseClient, userId: string) => dataAccess.getUserStudios(supabase, userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  },

  // Calendar Feeds
  userCalendarFeeds: {
    queryKey: (userId: string) => queryKeys.calendarFeeds.userFeeds(userId),
    queryFn: (supabase: SupabaseClient, userId: string) => dataAccess.getUserCalendarFeeds(supabase, userId),
    staleTime: 60 * 1000, // 1 minute
  },

  // Invoices  
  userInvoices: {
    queryKey: (userId: string) => queryKeys.invoices.userInvoices(userId),
    queryFn: async (supabase: SupabaseClient, userId: string) => {
      const { getUserInvoices } = await import('./invoice-utils')
      return getUserInvoices(userId)
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  },

  uninvoicedEvents: {
    queryKey: (userId: string) => queryKeys.invoices.uninvoicedEvents(userId),
    queryFn: (supabase: SupabaseClient, userId: string) => dataAccess.getUninvoicedEvents(supabase, userId),
    staleTime: 30 * 1000, // 30 seconds
  },

  // Invoice Events (from invoice-utils.ts)
  invoiceUninvoicedEvents: {
    queryKey: (userId: string) => ['uninvoiced-events', userId],
    queryFn: async (_supabase: SupabaseClient, userId: string) => {
      const { getUninvoicedEvents } = await import('./invoice-utils')
      return getUninvoicedEvents(userId)
    },
    staleTime: 30 * 1000, // 30 seconds
  },

  invoiceUnmatchedEvents: {
    queryKey: (userId: string) => ['unmatched-events', userId],
    queryFn: async (_supabase: SupabaseClient, userId: string) => {
      const { getUnmatchedEvents } = await import('./invoice-utils')
      return getUnmatchedEvents(userId)
    },
    staleTime: 30 * 1000, // 30 seconds
  },

  invoiceExcludedEvents: {
    queryKey: (userId: string) => ['excluded-events', userId],
    queryFn: async (_supabase: SupabaseClient, userId: string) => {
      const { getExcludedEvents } = await import('./invoice-utils')
      return getExcludedEvents(userId)
    },
    staleTime: 30 * 1000, // 30 seconds
  },
} as const