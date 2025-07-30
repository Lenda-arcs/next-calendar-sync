'use client'
import { useQueryClient } from '@tanstack/react-query'
import { createBrowserClient } from '@supabase/ssr'
import { queryKeys } from '../query-keys'
import * as dataAccess from '../server/data-access'
import type { 
  Event
} from '../types'

/**
 * Hook for intelligent data preloading based on user intent signals
 * Optimized for better UX with predictive loading
 * 
 * ✅ Fixed: Uses same query keys and data access functions as actual hooks
 */
export function useSmartPreload() {
  const queryClient = useQueryClient()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return {
    preloadUserEvents: (userId: string): Promise<void> => {
      // ✅ Uses same query key as useUserEvents hook (without filters for general preload)
      return queryClient.prefetchQuery({
        queryKey: queryKeys.events.list(userId),
        queryFn: () => dataAccess.getUserEvents(supabase, userId),
        staleTime: 30 * 1000, // 30 seconds
      })
    },

    preloadUserTags: (userId: string): Promise<void[]> => {
      // ✅ Preload using the EXACT same query keys and data access functions as the hooks
      return Promise.all([
        // All tags combined (matches useAllTags hook exactly)
        queryClient.prefetchQuery({
          queryKey: queryKeys.tags.allForUser(userId), // ['tags', 'all', userId]
          queryFn: () => dataAccess.getAllTags(supabase, userId), // Returns AllTagsResult
          staleTime: 60 * 1000, // 1 minute
        }),
        // Tag rules (matches useTagRules hook exactly)
        queryClient.prefetchQuery({
          queryKey: queryKeys.tags.tagRules(userId), // ['tags', 'rules', userId] 
          queryFn: () => dataAccess.getTagRules(supabase, userId), // Returns TagRuleWithTag[]
          staleTime: 60 * 1000, // 1 minute
        })
      ])
    },

    preloadPublicEvents: (teacherSlug: string): Promise<void> => {
      return queryClient.prefetchQuery({
        queryKey: queryKeys.events.public(teacherSlug),
        queryFn: () => dataAccess.getPublicEvents(supabase, teacherSlug),
        staleTime: 30 * 1000, // 30 seconds
      })
    },

    preloadUserStudios: (userId: string): Promise<void> => {
      return queryClient.prefetchQuery({
        queryKey: queryKeys.studios.userStudios(userId),
        queryFn: () => dataAccess.getUserStudios(supabase, userId),
        staleTime: 5 * 60 * 1000, // 5 minutes
      })
    },

    preloadInvoices: (userId: string): Promise<void[]> => {
      return Promise.all([
        // Basic user invoices (for InvoiceManagement.tsx)
        queryClient.prefetchQuery({
          queryKey: queryKeys.invoices.userInvoices(userId),
          queryFn: () => dataAccess.getUserInvoices(supabase, userId),
          staleTime: 2 * 60 * 1000, // 2 minutes
        }),
        
        // Uninvoiced events (useAppQuery version - for InvoiceManagement.tsx)
        queryClient.prefetchQuery({
          queryKey: queryKeys.invoices.uninvoicedEvents(userId),
          queryFn: () => dataAccess.getUninvoicedEvents(supabase, userId),
          staleTime: 30 * 1000, // 30 seconds
        }),
        
        // Calendar feeds (for UninvoicedEventsList.tsx)
        queryClient.prefetchQuery({
          queryKey: queryKeys.calendarFeeds.userFeeds(userId),
          queryFn: () => dataAccess.getUserCalendarFeeds(supabase, userId),
          staleTime: 60 * 1000, // 1 minute
        }),
        
        // Invoice Events queries (for UninvoicedEventsList.tsx via useInvoiceEvents)
        // These use invoice-utils.ts functions with different cache keys
        queryClient.prefetchQuery({
          queryKey: ['uninvoiced-events', userId],
          queryFn: async (): Promise<Event[]> => {
            const { getUninvoicedEvents } = await import('@/lib/invoice-utils')
            return getUninvoicedEvents(userId)
          },
          staleTime: 30 * 1000,
        }),
        
        queryClient.prefetchQuery({
          queryKey: ['unmatched-events', userId],
          queryFn: async (): Promise<Event[]> => {
            const { getUnmatchedEvents } = await import('@/lib/invoice-utils')
            return getUnmatchedEvents(userId)
          },
          staleTime: 30 * 1000,
        }),
        
        queryClient.prefetchQuery({
          queryKey: ['excluded-events', userId],
          queryFn: async (): Promise<Event[]> => {
            const { getExcludedEvents } = await import('@/lib/invoice-utils')
            return getExcludedEvents(userId)
          },
          staleTime: 30 * 1000,
        }),
        
        // Note: uninvoiced-events-by-studio is now calculated from uninvoiced-events
        // No need to preload separately as it would cause duplicate billing entity fetches
      ])
    },

    preloadDashboard: (userId: string): Promise<void[]> => {
      return Promise.all([
        // User profile (for dashboard header and user info)
        queryClient.prefetchQuery({
          queryKey: queryKeys.users.profile(userId),
          queryFn: () => dataAccess.getUserProfile(supabase, userId),
          staleTime: 5 * 60 * 1000, // 5 minutes
        }),
        
        // Calendar feeds (for dashboard calendar section)
        queryClient.prefetchQuery({
          queryKey: queryKeys.calendarFeeds.userFeeds(userId),
          queryFn: () => dataAccess.getUserCalendarFeeds(supabase, userId),
          staleTime: 60 * 1000, // 1 minute
        }),
        
        // User events (for upcoming events list - 3 events)
        queryClient.prefetchQuery({
          queryKey: queryKeys.events.list(userId, { limit: 3, futureOnly: true }),
          queryFn: () => dataAccess.getUserEvents(supabase, userId, { limit: 3, futureOnly: true }),
          staleTime: 30 * 1000, // 30 seconds
        })
      ])
    },

    preloadProfile: (userId: string): Promise<void> => {
      return queryClient.prefetchQuery({
        queryKey: queryKeys.users.profile(userId),
        queryFn: () => dataAccess.getUserProfile(supabase, userId),
        staleTime: 5 * 60 * 1000, // 5 minutes
      })
    },
  }
} 