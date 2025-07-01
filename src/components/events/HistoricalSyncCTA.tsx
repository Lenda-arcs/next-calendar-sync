'use client'

import { useState } from 'react'
import { History, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useCalendarFeedActions } from '@/lib/hooks/useCalendarFeeds'
import { rematchEvents } from '@/lib/rematch-utils'
import { InfoCardSection, colorSchemes } from './shared'

interface CalendarFeed {
  id: string
  // Add other feed properties as needed
}

interface HistoricalSyncCTAProps {
  calendarFeeds: CalendarFeed[]
  userId: string
  onSyncComplete?: () => void
  layout?: 'horizontal' | 'vertical'
}

export function HistoricalSyncCTA({ calendarFeeds, userId, onSyncComplete, layout = 'horizontal' }: HistoricalSyncCTAProps) {
  const [isHistoricalSyncing, setIsHistoricalSyncing] = useState(false)
  const { syncFeed } = useCalendarFeedActions()

  const handleHistoricalSync = async () => {
    if (!calendarFeeds || calendarFeeds.length === 0) {
      toast.error('No Calendar Feeds Found', {
        description: 'Please connect your calendar feeds first before syncing historical events.',
        duration: 5000,
      })
      return
    }

    setIsHistoricalSyncing(true)
    try {
      // 🚀 STEP 1: Sync all calendar feeds in historical mode
      const syncPromises = calendarFeeds.map(feed => 
        syncFeed(feed.id, 'historical')
      )
      
      const syncResults = await Promise.all(syncPromises)
      
      // Calculate total events synced
      const totalEventsSynced = syncResults.reduce((total, result) => total + result.count, 0)
      const successfulSyncs = syncResults.filter(result => result.success).length
      
      if (successfulSyncs === 0) {
        throw new Error('All calendar sync operations failed')
      }

      // 🚀 STEP 2: Rematch events to ensure proper tagging and studio assignment
      let rematchResult = null
      try {
        rematchResult = await rematchEvents({
          user_id: userId,
          rematch_tags: true,
          rematch_studios: true
        })
      } catch (rematchError) {
        console.warn('Historical sync succeeded but rematch failed:', rematchError)
      }

      // 🎉 Show success notification
      if (totalEventsSynced > 0) {
        toast.success('Historical Sync Complete!', {
          description: `${totalEventsSynced} historical event${totalEventsSynced !== 1 ? 's' : ''} synced from ${successfulSyncs} calendar feed${successfulSyncs !== 1 ? 's' : ''}. ${
            rematchResult ? `${rematchResult.updated_count} event${rematchResult.updated_count !== 1 ? 's' : ''} were matched with tags and studios.` : ''
          }`.trim(),
          duration: 6000,
        })
      } else {
        toast('Historical Sync Complete', {
          description: `No new historical events found. Your calendar feeds (${successfulSyncs}) were checked successfully.`,
          duration: 4000,
        })
      }
      
      // Notify parent component that sync is complete
      onSyncComplete?.()
    } catch (error) {
      console.error('Failed to perform historical sync:', error)
      toast.error('Historical Sync Failed', {
        description: error instanceof Error ? error.message : 'Unable to sync historical events. Please try again.',
        duration: 6000,
      })
    } finally {
      setIsHistoricalSyncing(false) 
    }
  }

  return (
    <InfoCardSection
      title="Missing older events"
      count={0}
      description="Sync historical events from your connected calendar feeds to find uninvoiced classes from previous months."
      mobileDescription="Sync historical events from calendar feeds"
      icon={History}
      colorScheme={colorSchemes.blue}
      layout={layout}
      actions={[
        {
          label: isHistoricalSyncing ? 'Syncing...' : 'Sync Historical Events',
          mobileLabel: isHistoricalSyncing ? 'Syncing...' : 'Sync Historical',
          icon: isHistoricalSyncing ? RefreshCw : History,
          onClick: handleHistoricalSync,
          disabled: isHistoricalSyncing,
          loading: isHistoricalSyncing,
          variant: 'outline',
          className: 'shadow-sm'
        }
      ]}
    />
  )
} 