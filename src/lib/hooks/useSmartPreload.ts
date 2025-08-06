'use client'
import { useQueryClient } from '@tanstack/react-query'
import { createBrowserClient } from '@supabase/ssr'
import { QUERY_CONFIGS } from '../query-constants'

/**
 * Hook for intelligent data preloading based on user intent signals
 * Optimized for better UX with predictive loading
 * 
 * ✅ SIMPLE: Uses shared constants to ensure identical configurations
 * ✅ MAINTAINABLE: Single source of truth for query configs
 */
export function useSmartPreload() {
  const queryClient = useQueryClient()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return {
    preloadUserEvents: (userId: string): Promise<void> => {
      // ✅ Uses shared constants - guaranteed to match hooks
      const config = QUERY_CONFIGS.userEvents
      return queryClient.prefetchQuery({
        queryKey: config.queryKey(userId),
        queryFn: () => config.queryFn(supabase, userId),
        staleTime: config.staleTime,
      })
    },

    preloadUserTags: (userId: string): Promise<void[]> => {
      // ✅ Uses shared constants - guaranteed to match hooks
      return Promise.all([
        queryClient.prefetchQuery({
          queryKey: QUERY_CONFIGS.allTags.queryKey(userId),
          queryFn: () => QUERY_CONFIGS.allTags.queryFn(supabase, userId),
          staleTime: QUERY_CONFIGS.allTags.staleTime,
        }),
        queryClient.prefetchQuery({
          queryKey: QUERY_CONFIGS.tagRules.queryKey(userId),
          queryFn: () => QUERY_CONFIGS.tagRules.queryFn(supabase, userId),
          staleTime: QUERY_CONFIGS.tagRules.staleTime,
        })
      ])
    },

    preloadPublicEvents: (teacherSlug: string): Promise<void> => {
      const config = QUERY_CONFIGS.publicEvents
      return queryClient.prefetchQuery({
        queryKey: config.queryKey(teacherSlug),
        queryFn: () => config.queryFn(supabase, teacherSlug),
        staleTime: config.staleTime,
      })
    },

    preloadUserStudios: (userId: string): Promise<void> => {
      const config = QUERY_CONFIGS.userStudios
      return queryClient.prefetchQuery({
        queryKey: config.queryKey(userId),
        queryFn: () => config.queryFn(supabase, userId),
        staleTime: config.staleTime,
      })
    },

    preloadInvoices: (userId: string): Promise<void[]> => {
      return Promise.all([
        // Basic user invoices (for InvoiceManagement.tsx)
        queryClient.prefetchQuery({
          queryKey: QUERY_CONFIGS.userInvoices.queryKey(userId),
          queryFn: () => QUERY_CONFIGS.userInvoices.queryFn(supabase, userId),
          staleTime: QUERY_CONFIGS.userInvoices.staleTime,
        }),
        
        // Uninvoiced events (useAppQuery version - for InvoiceManagement.tsx)
        queryClient.prefetchQuery({
          queryKey: QUERY_CONFIGS.uninvoicedEvents.queryKey(userId),
          queryFn: () => QUERY_CONFIGS.uninvoicedEvents.queryFn(supabase, userId),
          staleTime: QUERY_CONFIGS.uninvoicedEvents.staleTime,
        }),
        
        // Calendar feeds (for UninvoicedEventsList.tsx)
        queryClient.prefetchQuery({
          queryKey: QUERY_CONFIGS.userCalendarFeeds.queryKey(userId),
          queryFn: () => QUERY_CONFIGS.userCalendarFeeds.queryFn(supabase, userId),
          staleTime: QUERY_CONFIGS.userCalendarFeeds.staleTime,
        }),
        
        // Invoice Events queries (for UninvoicedEventsList.tsx via useInvoiceEvents)
        queryClient.prefetchQuery({
          queryKey: QUERY_CONFIGS.invoiceUninvoicedEvents.queryKey(userId),
          queryFn: () => QUERY_CONFIGS.invoiceUninvoicedEvents.queryFn(supabase, userId),
          staleTime: QUERY_CONFIGS.invoiceUninvoicedEvents.staleTime,
        }),
        
        queryClient.prefetchQuery({
          queryKey: QUERY_CONFIGS.invoiceUnmatchedEvents.queryKey(userId),
          queryFn: () => QUERY_CONFIGS.invoiceUnmatchedEvents.queryFn(supabase, userId),
          staleTime: QUERY_CONFIGS.invoiceUnmatchedEvents.staleTime,
        }),
        
        queryClient.prefetchQuery({
          queryKey: QUERY_CONFIGS.invoiceExcludedEvents.queryKey(userId),
          queryFn: () => QUERY_CONFIGS.invoiceExcludedEvents.queryFn(supabase, userId),
          staleTime: QUERY_CONFIGS.invoiceExcludedEvents.staleTime,
        }),
      ])
    },

    preloadDashboard: (userId: string): Promise<void[]> => {
      return Promise.all([
        // User profile (for dashboard header and user info)
        queryClient.prefetchQuery({
          queryKey: QUERY_CONFIGS.userProfile.queryKey(userId),
          queryFn: () => QUERY_CONFIGS.userProfile.queryFn(supabase, userId),
          staleTime: QUERY_CONFIGS.userProfile.staleTime,
        }),
        
        // Calendar feeds (for dashboard calendar section)
        queryClient.prefetchQuery({
          queryKey: QUERY_CONFIGS.userCalendarFeeds.queryKey(userId),
          queryFn: () => QUERY_CONFIGS.userCalendarFeeds.queryFn(supabase, userId),
          staleTime: QUERY_CONFIGS.userCalendarFeeds.staleTime,
        }),
        
        // User events (for upcoming events list - 3 events)
        queryClient.prefetchQuery({
          queryKey: QUERY_CONFIGS.userEvents.queryKey(userId, { limit: 3, futureOnly: true }),
          queryFn: () => QUERY_CONFIGS.userEvents.queryFn(supabase, userId, { limit: 3, futureOnly: true }),
          staleTime: QUERY_CONFIGS.userEvents.staleTime,
        }),

        // Future events for studio discovery (following FilterProvider pattern)
        queryClient.prefetchQuery({
          queryKey: ['user-future-events', userId],
          queryFn: async () => {
            const now = new Date()
            const { data, error } = await supabase
              .from('events')
              .select('studio_id, location')
              .eq('user_id', userId)
              .gte('start_time', now.toISOString())
              .order('start_time', { ascending: true })
            
            if (error) throw error
            return data || []
          },
          staleTime: 15 * 60 * 1000, // 15 minutes
        })
      ])
    },

    preloadProfile: (userId: string): Promise<void> => {
      const config = QUERY_CONFIGS.userProfile
      return queryClient.prefetchQuery({
        queryKey: config.queryKey(userId),
        queryFn: () => config.queryFn(supabase, userId),
        staleTime: config.staleTime,
      })
    },
  }
}