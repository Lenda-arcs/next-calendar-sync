import React from 'react'
import { SupabaseClient } from '@supabase/supabase-js'

interface UseCalendarSyncOptions {
  userId: string | null
  supabase: SupabaseClient
  onSyncComplete?: () => Promise<void> | void
}

interface UseCalendarSyncReturn {
  syncFeeds: () => Promise<void>
  isSyncing: boolean
}

interface SyncFeedResponse {
  success: boolean
  count: number
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
      // First, fetch all calendar feeds for the user
      const { data: feeds, error: feedsError } = await supabase
        .from('calendar_feeds')
        .select('id')
        .eq('user_id', userId)

      if (feedsError) {
        throw new Error(`Failed to fetch user feeds: ${feedsError.message}`)
      }

      if (!feeds || feeds.length === 0) {
        console.log('No calendar feeds found for user')
        return
      }

      console.log(`Found ${feeds.length} calendar feeds to sync`)

      // Sync each feed individually
      const syncPromises = feeds.map(async (feed) => {
        try {
          const { data, error } = await supabase.functions.invoke('sync-feed', {
            body: { 
              feed_id: feed.id,
              mode: 'default'
            }
          })

          if (error) {
            console.error(`Failed to sync feed ${feed.id}:`, error)
            return { success: false, count: 0 }
          }

          const result = data as SyncFeedResponse
          return result
        } catch (err) {
          console.error(`Failed to sync feed ${feed.id}:`, err)
          return { success: false, count: 0 }
        }
      })

      // Wait for all syncs to complete
      const results = await Promise.all(syncPromises)
      const successfulSyncs = results.filter(result => result.success).length
      const totalEvents = results.reduce((sum, result) => sum + result.count, 0)

      console.log(`Sync completed: ${successfulSyncs}/${feeds.length} feeds synced, ${totalEvents} total events`)
      
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