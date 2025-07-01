'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { History, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useCalendarFeedActions } from '@/lib/hooks/useCalendarFeeds'
import { rematchEvents } from '@/lib/rematch-utils'

interface CalendarFeed {
  id: string
  // Add other feed properties as needed
}

interface HistoricalSyncCTAProps {
  calendarFeeds: CalendarFeed[]
  userId: string
  onSyncComplete?: () => void
}

export function HistoricalSyncCTA({ calendarFeeds, userId, onSyncComplete }: HistoricalSyncCTAProps) {
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
    <Card className="bg-gradient-to-br from-blue-50/80 to-blue-100/40 border-blue-200/80 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="py-5 px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h4 className="text-sm font-semibold text-blue-900">
                Missing older events?
              </h4>
            </div>
            <p className="text-xs text-blue-700/90 leading-relaxed">
              Sync historical events from your connected calendar feeds to find uninvoiced classes from previous months.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={handleHistoricalSync}
              disabled={isHistoricalSyncing}
              size="sm"
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300 whitespace-nowrap shadow-sm"
            >
              {isHistoricalSyncing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <History className="mr-2 h-4 w-4" />
                  Sync Historical Events
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 