'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { EyeOff, RefreshCw, Eye, RotateCcw, Calendar } from 'lucide-react'
import { useSupabaseMutation } from '@/lib/hooks/useSupabaseMutation'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { EventInvoiceCard } from '@/components/invoices/EventInvoiceCard'
import { Event } from '@/lib/types'
import { toggleEventExclusion } from '@/lib/invoice-utils'
import { rematchEvents } from '@/lib/rematch-utils'
import { toast } from 'sonner'
import { colorSchemes, InfoCardSection } from './InfoCardSection'

interface ExcludedEventsSectionProps {
  excludedEvents: Event[]
  isLoading: boolean
  onRefresh: () => void
  userId?: string
}

export function ExcludedEventsSection({ 
  excludedEvents, 
  isLoading, 
  onRefresh,
  userId
}: ExcludedEventsSectionProps) {
  const [showEventsDialog, setShowEventsDialog] = useState(false)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const batchIncludeMutation = useSupabaseMutation({
    mutationFn: async (supabase, eventIds: string[]) => {
      // Toggle exclusion for all selected events
      const results = await Promise.all(
        eventIds.map(eventId => toggleEventExclusion(eventId))
      )
      return results
    },
    onSuccess: async (results) => {
      const includedCount = results.filter(r => !r.excluded).length
      
      if (includedCount > 0) {
        toast.success(`${includedCount} event${includedCount !== 1 ? 's' : ''} included in studio matching`, {
          description: 'Events are now available for studio billing and will be re-matched.',
        })

        // 🚀 Use efficient rematch instead of heavy database operation
        if (userId) {
          setIsProcessing(true)
          try {
            // Use new rematch functionality for faster studio matching
            const rematchResult = await rematchEvents({
              user_id: userId,
              rematch_studios: true,
              rematch_tags: true
            })
            
            toast.success('Events Re-matched!', {
              description: `${rematchResult.updated_count} out of ${rematchResult.total_events_processed} events were matched with studios and tags.`,
              duration: 4000,
            })
          } catch (error) {
            console.error('Failed to re-match events:', error)
            toast.error('Re-matching Failed', {
              description: 'Unable to re-match events with studios. The events were included but may need manual matching.',
              duration: 5000,
            })
          } finally {
            setIsProcessing(false)
          }
        }
      }
      
      // Clear selections and refresh
      setSelectedEvents([])
      onRefresh()
    },
    onError: (error) => {
      console.error('Failed to include events:', error)
      toast.error('Failed to update events', {
        description: 'There was an error updating the events. Please try again.',
      })
      setIsProcessing(false)
    }
  })

  // Selection handlers
  const handleToggleEvent = (eventId: string) => {
    setSelectedEvents(prev => {
      const isSelected = prev.includes(eventId)
      if (isSelected) {
        return prev.filter(id => id !== eventId)
      } else {
        return [...prev, eventId]
      }
    })
  }

  const handleSelectAll = () => {
    const allEventIds = excludedEvents.map(event => event.id)
    const allSelected = allEventIds.every(id => selectedEvents.includes(id))
    
    setSelectedEvents(allSelected ? [] : allEventIds)
  }

  const handleBatchInclude = () => {
    if (selectedEvents.length > 0) {
      batchIncludeMutation.mutate(selectedEvents)
    }
  }

  const someEventsSelected = selectedEvents.length > 0
  const allEventsSelected = excludedEvents.length > 0 && excludedEvents.every(event => selectedEvents.includes(event.id))

  if (isLoading) return null
  if (!excludedEvents || excludedEvents.length === 0) return null

  return (
    <>
      <InfoCardSection
        title="Excluded Events"
        count={excludedEvents.length}
        description="Events marked as excluded from studio matching"
        mobileDescription="Excluded from matching"
        icon={EyeOff}
        colorScheme={colorSchemes.orange}
        actions={[
          {
            label: 'Refresh',
            mobileLabel: 'Refresh',
            icon: RefreshCw,
            onClick: onRefresh,
            disabled: isLoading || isProcessing,
            loading: isLoading || isProcessing
          },
          {
            label: 'View All',
            mobileLabel: `View (${excludedEvents.length})`,
            icon: Eye,
            onClick: () => setShowEventsDialog(true)
          }
        ]}
      />

      <UnifiedDialog
        open={showEventsDialog}
        onOpenChange={setShowEventsDialog}
        title={`Excluded Events (${excludedEvents.length})`}
        description="These events have been excluded from studio matching. Select events and click 'Include in Matching' to make them available for studio billing again."
        size="lg"
        footer={
          <div className="flex flex-col gap-3 w-full sm:flex-row sm:items-center sm:justify-between">
            {/* Top row on mobile, left side on desktop */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <Button 
                onClick={handleSelectAll}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                {allEventsSelected ? 'Deselect All' : 'Select All'}
              </Button>
              {someEventsSelected && (
                <span className="text-sm text-gray-600 text-center sm:text-left">
                  <span className="sm:hidden">{selectedEvents.length}/{excludedEvents.length} selected</span>
                  <span className="hidden sm:inline">{selectedEvents.length} of {excludedEvents.length} events selected</span>
                </span>
              )}
            </div>
            
            {/* Bottom row on mobile, right side on desktop */}
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              {someEventsSelected && (
                <Button
                  onClick={handleBatchInclude}
                  disabled={batchIncludeMutation.isLoading || isProcessing}
                  className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
                >
                  <RotateCcw className="mr-2 h-3 w-3" />
                  <span className="sm:hidden">
                    {batchIncludeMutation.isLoading || isProcessing ? 'Including...' : `Include (${selectedEvents.length})`}
                  </span>
                  <span className="hidden sm:inline">
                    {batchIncludeMutation.isLoading || isProcessing ? 'Including...' : `Include in Matching (${selectedEvents.length})`}
                  </span>
                </Button>
              )}
              <Button 
                onClick={() => setShowEventsDialog(false)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          {excludedEvents.map((event) => (
            <div key={event.id} className="border rounded-lg bg-orange-50/30 overflow-hidden">
              <EventInvoiceCard
                event={{ ...event, studio: null }}
                selected={selectedEvents.includes(event.id)}
                onToggleSelect={handleToggleEvent}
                showCheckbox={true}
                variant="compact"
              />
              {event.exclude_from_studio_matching && (
                <div className="px-4 pb-3 flex items-center gap-2 text-xs text-orange-600">
                  <EyeOff className="w-3 h-3 flex-shrink-0" />
                  <span>Excluded from studio matching</span>
                </div>
              )}
            </div>
          ))}
          
          {excludedEvents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No excluded events found.</p>
            </div>
          )}
        </div>
      </UnifiedDialog>
    </>
  )
} 