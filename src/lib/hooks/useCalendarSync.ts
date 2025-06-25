import React from 'react'
import { SupabaseClient } from '@supabase/supabase-js'
import { syncAllUserCalendarFeeds } from '@/lib/calendar-feeds'

interface UseCalendarSyncOptions {
  userId: string | null
  supabase: SupabaseClient
  onSyncComplete?: () => Promise<void> | void
}

interface UseCalendarSyncReturn {
  syncFeeds: () => Promise<void>
  isSyncing: boolean
}

export function useCalendarSync({
  userId,
  supabase,
  onSyncComplete
}: UseCalendarSyncOptions): UseCalendarSyncReturn {
  const [isSyncing, setIsSyncing] = React.useState(false)

  const syncFeeds = React.useCallback(async () => {
    if (!userId) {
      console.warn('Cannot sync feeds: user not authenticated')
      return
    }

    setIsSyncing(true)
    try {
      const result = await syncAllUserCalendarFeeds(supabase, userId)
      console.log(`Sync completed: ${result.successfulSyncs}/${result.totalFeeds} feeds synced, ${result.totalEvents} total events`)
      
      // Call the completion callback if provided
      if (onSyncComplete) {
        await onSyncComplete()
      }
    } catch (error) {
      console.error('Failed to sync calendar feeds:', error)
      // You could add a toast notification here
      // Not throwing the error to prevent uncaught promise rejections
    } finally {
      setIsSyncing(false)
    }
  }, [userId, supabase, onSyncComplete])

  return {
    syncFeeds,
    isSyncing
  }
} 