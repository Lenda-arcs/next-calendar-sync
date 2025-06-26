'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { History, RefreshCw } from 'lucide-react'
import { useCalendarFeedActions } from '@/lib/hooks/useCalendarFeeds'

interface CalendarFeed {
  id: string
  // Add other feed properties as needed
}

interface HistoricalSyncCTAProps {
  calendarFeeds: CalendarFeed[]
  onSyncComplete?: () => void
}

export function HistoricalSyncCTA({ calendarFeeds, onSyncComplete }: HistoricalSyncCTAProps) {
  const [isHistoricalSyncing, setIsHistoricalSyncing] = useState(false)
  const { syncFeed } = useCalendarFeedActions()

  const handleHistoricalSync = async () => {
    if (!calendarFeeds || calendarFeeds.length === 0) return

    setIsHistoricalSyncing(true)
    try {
      // Sync all calendar feeds in historical mode
      const syncPromises = calendarFeeds.map(feed => 
        syncFeed(feed.id, 'historical')
      )
      
      await Promise.all(syncPromises)
      
      // Notify parent component that sync is complete
      onSyncComplete?.()
    } catch (error) {
      console.error('Failed to perform historical sync:', error)
    } finally {
      setIsHistoricalSyncing(false) 
    }
  }

  return (
    <Card className="bg-blue-50/50 border-blue-200">
      <CardContent className="py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Missing older events?
            </h4>
            <p className="text-xs text-blue-700">
              Sync historical events from your connected calendar feeds to find uninvoiced classes from previous months.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleHistoricalSync}
            disabled={isHistoricalSyncing}
            size="sm"
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300 whitespace-nowrap"
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
      </CardContent>
    </Card>
  )
} 