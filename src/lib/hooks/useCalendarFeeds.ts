'use client'

import { useSupabaseQuery, useSupabaseMutation } from '@/lib/hooks'
import { 
  getUserCalendarFeeds, 
  createCalendarFeed, 
  deleteCalendarFeed, 
  syncCalendarFeed,
  syncAllUserCalendarFeeds,
  type CalendarFeed,
  type CalendarFeedInsert 
} from '@/lib/calendar-feeds'
import { createBrowserClient } from '@supabase/ssr'
import { useCallback } from 'react'

export function useCalendarFeeds(userId: string ) {
  return useSupabaseQuery<CalendarFeed[]>({
    queryKey: ['calendar-feeds', userId],
    fetcher: async (supabase) => {
      if (!userId) throw new Error('No user ID provided')
      return getUserCalendarFeeds({ supabase, userId: userId! })
    },
    enabled: !!userId,
  })
}

export function useCreateCalendarFeed() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return useSupabaseMutation<{ feed: CalendarFeed; syncResult: { success: boolean; count: number } }, CalendarFeedInsert>({
    mutationFn: async (_, variables) => {
      return createCalendarFeed(supabase, variables)
    },
  })
}

export function useDeleteCalendarFeed() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return useSupabaseMutation<void, string>({
    mutationFn: async (_, feedId) => {
      return deleteCalendarFeed(supabase, feedId)
    },
  })
}

export function useSyncCalendarFeed() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return useSupabaseMutation<{ success: boolean; count: number }, { feedId: string; mode?: 'default' | 'historical' }>({
    mutationFn: async (_, variables) => {
      return syncCalendarFeed(supabase, variables.feedId, variables.mode)
    },
  })
}

export function useSyncAllCalendarFeeds(userId: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return useSupabaseMutation<{ successfulSyncs: number; totalFeeds: number; totalEvents: number }, void>({
    mutationFn: async () => {
      if (!userId) throw new Error('No user ID provided')
      return syncAllUserCalendarFeeds(supabase, userId)
    },
  })
}

export function useUpdateCalendarFeedSyncApproach() {
  return useSupabaseMutation<CalendarFeed, { feedId: string; syncApproach: 'yoga_only' | 'mixed_calendar' }>({
    mutationFn: async (_, variables) => {
      const response = await fetch(`/api/calendar-feeds/${variables.feedId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sync_approach: variables.syncApproach }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update sync approach')
      }

      const data = await response.json()
      return data.feed
    },
  })
}

export function useCalendarFeedActions() {
  const createMutation = useCreateCalendarFeed()
  const deleteMutation = useDeleteCalendarFeed()
  const syncMutation = useSyncCalendarFeed()
  const updateSyncApproachMutation = useUpdateCalendarFeedSyncApproach()

  const createFeed = useCallback(async (feed: CalendarFeedInsert) => {
    return createMutation.mutateAsync(feed)
  }, [createMutation])

  const deleteFeed = useCallback(async (feedId: string) => {
    return deleteMutation.mutateAsync(feedId)
  }, [deleteMutation])

  const syncFeed = useCallback(async (feedId: string, mode?: 'default' | 'historical') => {
    return syncMutation.mutateAsync({ feedId, mode })
  }, [syncMutation])

  const updateSyncApproach = useCallback(async (feedId: string, syncApproach: 'yoga_only' | 'mixed_calendar') => {
    return updateSyncApproachMutation.mutateAsync({ feedId, syncApproach })
  }, [updateSyncApproachMutation])

  return {
    createFeed,
    deleteFeed,
    syncFeed,
    updateSyncApproach,
    isCreating: createMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    isSyncing: syncMutation.isLoading,
    isUpdatingSyncApproach: updateSyncApproachMutation.isLoading,
    createError: createMutation.error,
    deleteError: deleteMutation.error,
    syncError: syncMutation.error,
    updateSyncApproachError: updateSyncApproachMutation.error,
    createResult: createMutation.data,
  }
} 