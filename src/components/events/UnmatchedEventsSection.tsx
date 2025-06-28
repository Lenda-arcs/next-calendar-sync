'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, RefreshCw, Plus, Eye } from 'lucide-react'
import { useCalendarFeeds, useCalendarFeedActions } from '@/lib/hooks/useCalendarFeeds'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { EventCard } from './EventCard'
import { Event } from '@/lib/types'

type UnmatchedEvent = Event

interface UnmatchedEventsSectionProps {
  unmatchedEvents: UnmatchedEvent[]
  isLoading: boolean
  onRefresh: () => void
  onCreateStudio: () => void
  userId: string
}

export function UnmatchedEventsSection({ 
  unmatchedEvents, 
  isLoading, 
  onRefresh, 
  onCreateStudio,
  userId
}: UnmatchedEventsSectionProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showEventsDialog, setShowEventsDialog] = useState(false)
  const { data: calendarFeeds } = useCalendarFeeds(userId)
  const { syncFeed } = useCalendarFeedActions()

  // Format date for EventCard
  const formatEventDateTime = (startTime: string | null) => {
    if (!startTime) return ''
    const date = new Date(startTime)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Enhanced refresh that syncs feeds first, then refetches data
  const handleRefresh = async () => {
    if (!calendarFeeds || calendarFeeds.length === 0) {
      // If no feeds, just call original refresh
      onRefresh()
      return
    }

    setIsRefreshing(true)
    try {
      // Sync all calendar feeds in historical mode
      const syncPromises = calendarFeeds.map(feed => 
        syncFeed(feed.id, 'historical')
      )
      
      await Promise.all(syncPromises)
      
      // Then call the original refresh function
      onRefresh()
    } catch (error) {
      console.error('Failed to sync feeds during refresh:', error)
      // Still call refresh even if sync fails
      onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }

  if (!unmatchedEvents || unmatchedEvents.length === 0) {
    return null
  }

  return (
    <>
      <Card className="bg-orange-50/50 border-orange-200">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-orange-600" />
                <h4 className="text-sm font-medium text-orange-900">
                  Unmatched Events ({unmatchedEvents.length})
                </h4>
              </div>
              <p className="text-xs text-orange-700 mb-3">
                These events don&apos;t have a studio assigned yet. Create studio profiles to automatically match events and generate invoices.
              </p>
              
              {/* Show first few event locations as examples */}
              <div className="flex flex-wrap gap-1">
                {Array.from(new Set(
                  unmatchedEvents
                    .map(event => event.location)
                    .filter(Boolean)
                    .slice(0, 3)
                )).map((location, index) => (
                  <span key={index} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    {location}
                  </span>
                ))}
                {unmatchedEvents.filter(e => e.location).length > 3 && (
                  <span className="text-xs text-orange-600">
                    +{unmatchedEvents.filter(e => e.location).length - 3} more locations
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowEventsDialog(true)}
                className="bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Events
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading || isRefreshing}
                className="bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300"
              >
                {(isLoading || isRefreshing) ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {isRefreshing ? 'Syncing...' : 'Refreshing...'}
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </>
                )}
              </Button>
              <Button 
                onClick={onCreateStudio}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white whitespace-nowrap"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Studio
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unmatched Events Dialog */}
      <UnifiedDialog
        open={showEventsDialog}
        onOpenChange={setShowEventsDialog}
        title={`Unmatched Events (${unmatchedEvents.length})`}
        description="These events don't have a studio assigned yet. Create studio profiles to automatically match events and generate invoices."
        size="lg"
        footer={
          <Button 
            onClick={() => setShowEventsDialog(false)}
            variant="outline"
          >
            Close
          </Button>
        }
      >
        <div className="space-y-4">
          {unmatchedEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title || 'Untitled Event'}
              dateTime={formatEventDateTime(event.start_time)}
              location={event.location}
              imageQuery={event.image_url || ''}
              variant="minimal"
              tags={[]}
            />
          ))}
          
          {unmatchedEvents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No unmatched events found
            </div>
          )}
        </div>
      </UnifiedDialog>
    </>
  )
} 