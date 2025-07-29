'use client'
import { useQueryClient } from '@tanstack/react-query'
import { createBrowserClient } from '@supabase/ssr'
import { queryKeys } from '../query-keys'
import * as dataAccess from '../server/data-access'

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
    preloadUserEvents: (userId: string) => {
      // ✅ Uses same query key as useUserEvents hook (without filters for general preload)
      return queryClient.prefetchQuery({
        queryKey: queryKeys.events.list(userId),
        queryFn: () => dataAccess.getUserEvents(supabase, userId),
        staleTime: 30 * 1000, // 30 seconds
      })
    },

        preloadUserTags: (userId: string) => {
      // ✅ Preload all tag query patterns used across the app
      return Promise.all([
        // User tags (for TagLibrary)
        queryClient.prefetchQuery({
          queryKey: ['user_tags', userId],
          queryFn: async () => {
            const { data, error } = await supabase
              .from('tags')
              .select('*')
              .eq('user_id', userId)
              .order('priority', { ascending: false, nullsFirst: false })
            
            if (error) throw error
            return data || []
          },
          staleTime: 60 * 1000, // 1 minute
        }),
        // Global tags (for TagLibrary)
        queryClient.prefetchQuery({
          queryKey: ['global_tags'],
          queryFn: async () => {
            const { data, error } = await supabase
              .from('tags')
              .select('*')
              .is('user_id', null)
              .order('priority', { ascending: false, nullsFirst: false })
            
            if (error) throw error
            return data || []
          },
          staleTime: 60 * 1000, // 1 minute
        }),
        // All tags combined (for TagRuleManager and useAppQuery)
        queryClient.prefetchQuery({
          queryKey: ['tags', 'all', userId],
          queryFn: async () => {
            const { data, error } = await supabase
              .from('tags')
              .select('*')
              .or(`user_id.eq.${userId},user_id.is.null`)
              .order('priority', { ascending: false, nullsFirst: false })
            
            if (error) throw error
            return data || []
          },
          staleTime: 60 * 1000, // 1 minute
        }),
        // Tag rules (often used with tags)
        queryClient.prefetchQuery({
          queryKey: ['tag-rules', userId],
          queryFn: async () => {
            const { data, error } = await supabase
              .from('tag_rules')
              .select('*')
              .eq('user_id', userId)
            
            if (error) throw error
            return data || []
          },
          staleTime: 60 * 1000, // 1 minute
        })
      ])
    },

    preloadPublicEvents: (teacherSlug: string) => {
      return queryClient.prefetchQuery({
        queryKey: queryKeys.events.public(teacherSlug),
        queryFn: () => dataAccess.getPublicEvents(supabase, teacherSlug),
        staleTime: 30 * 1000, // 30 seconds
      })
    },

    preloadUserStudios: (userId: string) => {
      return queryClient.prefetchQuery({
        queryKey: queryKeys.studios.userStudios(userId),
        queryFn: () => dataAccess.getUserStudios(supabase, userId),
        staleTime: 5 * 60 * 1000, // 5 minutes
      })
    },

    preloadInvoices: (userId: string) => {
      return queryClient.prefetchQuery({
        queryKey: queryKeys.invoices.userInvoices(userId),
        queryFn: () => dataAccess.getUserInvoices(supabase, userId),
        staleTime: 2 * 60 * 1000, // 2 minutes
      })
    },
  }
} 