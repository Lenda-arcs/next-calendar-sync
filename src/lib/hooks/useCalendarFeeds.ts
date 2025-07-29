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
import { useCallback } from 'react'

export function useCalendarFeeds(userId: string) {
  return useSupabaseQuery<CalendarFeed[]>(
    ['calendar-feeds', userId],
    async (supabase) => {
      if (!userId) throw new Error('No user ID provided')
      return getUserCalendarFeeds({ supabase, userId })
    },
    { enabled: !!userId }
  )
}

export function useCreateCalendarFeed() {
  return useSupabaseMutation<{ feed: CalendarFeed; syncResult: { success: boolean; count: number } }, CalendarFeedInsert>(
    async (supabase, variables) => {
      return createCalendarFeed(supabase, variables)
    }
  )
}

export function useDeleteCalendarFeed() {
  return useSupabaseMutation<void, string>(
    async (supabase, feedId) => {
      return deleteCalendarFeed(supabase, feedId)
    }
  )
}

export function useSyncCalendarFeed() {
  return useSupabaseMutation<{ success: boolean; count: number }, { feedId: string; mode?: 'default' | 'historical' }>(
    async (supabase, variables) => {
      return syncCalendarFeed(supabase, variables.feedId, variables.mode)
    }
  )
}

export function useSyncAllCalendarFeeds(userId: string) {
  return useSupabaseMutation<{ successfulSyncs: number; totalFeeds: number; totalEvents: number }, void>(
    async (supabase) => {
      if (!userId) throw new Error('No user ID provided')
      return syncAllUserCalendarFeeds(supabase, userId)
    }
  )
}

export function useUpdateCalendarFeedSyncApproach() {
  return useSupabaseMutation<CalendarFeed, { feedId: string; syncApproach: 'yoga_only' | 'mixed_calendar' }>(
    async (_, variables) => {
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
    }
  )
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
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isSyncing: syncMutation.isPending,
    isUpdatingSyncApproach: updateSyncApproachMutation.isPending,
    createError: createMutation.error,
    deleteError: deleteMutation.error,
    syncError: syncMutation.error,
    updateSyncApproachError: updateSyncApproachMutation.error,
    createResult: createMutation.data,
  }
} 