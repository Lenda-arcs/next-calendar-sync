'use client'

import { useState } from 'react'
import { Building2, RefreshCw, Plus, Eye, X } from 'lucide-react'
import { toast } from 'sonner'
import { useCalendarFeeds, useCalendarFeedActions } from '@/lib/hooks/useCalendarFeeds'
import { useSupabaseMutation } from '@/lib/hooks/useSupabaseMutation'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { Button } from '@/components/ui/button'
import { EventCard } from './EventCard'
import { Event } from '@/lib/types'
import { markEventAsExcluded } from '@/lib/invoice-utils'
import { rematchEvents } from '@/lib/rematch-utils'
import { colorSchemes, InfoCardSection } from './InfoCardSection'

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
  const [excludingEventId, setExcludingEventId] = useState<string | null>(null)
  const { data: calendarFeeds } = useCalendarFeeds(userId)
  const { syncFeed } = useCalendarFeedActions()

  // Mark event as excluded mutation
  const excludeEventMutation = useSupabaseMutation({
    mutationFn: (supabase, eventId: string) => markEventAsExcluded(eventId, true),
    onSuccess: () => {
      toast.success('Event Marked as Free', {
        description: 'The event has been excluded from studio matching and invoicing.',
        duration: 4000,
      })
      onRefresh() // Refresh the list to remove the excluded event
      setExcludingEventId(null)
    },
    onError: (error) => {
      console.error('Error excluding event:', error)
      toast.error('Failed to Mark Event as Free', {
        description: 'Unable to exclude the event. Please try again.',
        duration: 5000,
      })
      setExcludingEventId(null)
    }
  })

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

  // Handle excluding an event from studio matching
  const handleExcludeEvent = async (eventId: string) => {
    setExcludingEventId(eventId)
    await excludeEventMutation.mutateAsync(eventId)
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
      // 🚀 STEP 1: Sync all calendar feeds in historical mode
      const syncPromises = calendarFeeds.map(feed => 
        syncFeed(feed.id, 'historical')
      )
      
      const syncResults = await Promise.all(syncPromises)
      
      // Calculate total events synced
      const totalEventsSynced = syncResults.reduce((total, result) => total + result.count, 0)
      const successfulSyncs = syncResults.filter(result => result.success).length
      
      // 🚀 STEP 2: Rematch events to ensure proper tagging and studio assignment
      let rematchResult = null
      try {
        rematchResult = await rematchEvents({
          user_id: userId,
          rematch_tags: true,
          rematch_studios: true
        })
      } catch (rematchError) {
        console.warn('Sync succeeded but rematch failed:', rematchError)
      }

      // 🎉 Show success notification
      if (totalEventsSynced > 0) {
        toast.success('Refresh Complete!', {
          description: `${totalEventsSynced} event${totalEventsSynced !== 1 ? 's' : ''} synced. ${
            rematchResult ? `${rematchResult.updated_count} event${rematchResult.updated_count !== 1 ? 's' : ''} were matched with studios.` : ''
          }`.trim(),
          duration: 5000,
        })
      } else if (successfulSyncs > 0) {
        toast('Refresh Complete', {
          description: 'No new events found. Calendar feeds were checked successfully.',
          duration: 3000,
        })
      }
      
      // Then call the original refresh function to update UI
      onRefresh()
    } catch (error) {
      console.error('Failed to sync feeds during refresh:', error)
      toast.error('Refresh Failed', {
        description: 'Unable to sync calendar feeds. Please try again.',
        duration: 5000,
      })
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
      <InfoCardSection
        title="Unmatched Events"
        count={unmatchedEvents.length}
        description="These events don't have a studio assigned yet. Create studio profiles to automatically match events and generate invoices."
        mobileDescription="Need studio assignment for billing"
        icon={Building2}
        colorScheme={colorSchemes.orange}
        actions={[
          {
            label: 'View Events',
            mobileLabel: 'View',
            icon: Eye,
            onClick: () => setShowEventsDialog(true)
          },
          {
            label: 'Refresh',
            mobileLabel: isRefreshing ? 'Syncing...' : 'Refresh',
            icon: RefreshCw,
            onClick: handleRefresh,
            disabled: isLoading || isRefreshing,
            loading: isLoading || isRefreshing
          },
          {
            label: 'Create Studio',
            mobileLabel: 'Create',
            icon: Plus,
            onClick: onCreateStudio,
            variant: 'default',
            className: 'bg-orange-600 hover:bg-orange-700 text-white'
          }
        ]}
        additionalContent={
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
        }
      />

      {/* Unmatched Events Dialog */}
      <UnifiedDialog
        open={showEventsDialog}
        onOpenChange={setShowEventsDialog}
        title={`Unmatched Events (${unmatchedEvents.length})`}
        description="These events don't have a studio assigned yet. Create studio profiles to automatically match events and generate invoices. Use 'Free Event' to exclude events that shouldn't be invoiced (like free classes or personal practice)."
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
            <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg bg-white">
              <div className="flex-1 min-w-0">
                <EventCard
                  id={event.id}
                  title={event.title || 'Untitled Event'}
                  dateTime={formatEventDateTime(event.start_time)}
                  location={event.location}
                  imageQuery={event.image_url || ''}
                  variant="minimal"
                  tags={[]}
                />
              </div>
              
              {/* Exclude button */}
              <div className="flex-shrink-0">
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExcludeEvent(event.id)}
                  disabled={excludingEventId === event.id}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 min-w-0 sm:min-w-fit"
                  title="Mark as free event (exclude from studio matching)"
                >
                  {excludingEventId === event.id ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span className="ml-1 hidden sm:inline">Excluding...</span>
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4" />
                      <span className="ml-1 hidden sm:inline">Free Event</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
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