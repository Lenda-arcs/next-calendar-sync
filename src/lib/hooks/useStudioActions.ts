'use client'

import { useState, useCallback } from 'react'
import { revertEventsToStudioInvoicing, EventWithStudio } from '@/lib/invoice-utils'
import { useCalendarFeedActions, useCalendarFeeds } from './useCalendarFeeds'

interface UseStudioActionsProps {
  selectedEvents: Record<string, string[]>
  eventsByStudio: Record<string, EventWithStudio[]> | null
  onCreateInvoice?: (studioId: string, eventIds: string[], events: EventWithStudio[]) => void
  onRefreshData: () => Promise<void>
  onClearSelections: () => void
  userId: string
}

interface UseStudioActionsResult {
  // State
  isRefreshing: boolean
  revertingStudioId: string | null
  
  // Actions
  handleRefresh: () => Promise<void>
  handleCreateInvoice: (studioId: string) => void
  handleBatchSubstitute: (studioId: string, onOpenModal: (eventIds: string[]) => void) => void
  handleRevertToStudio: (studioId: string) => Promise<void>
}

export function useStudioActions({
  selectedEvents,
  eventsByStudio,
  onCreateInvoice,
  onRefreshData,
  onClearSelections,
  userId
}: UseStudioActionsProps): UseStudioActionsResult {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [revertingStudioId, setRevertingStudioId] = useState<string | null>(null)
  
  const { syncFeed } = useCalendarFeedActions()
  const { data: calendarFeeds } = useCalendarFeeds(userId)

  // Enhanced refresh that syncs feeds first, then refetches data
  const handleRefresh = useCallback(async () => {
    if (!calendarFeeds || calendarFeeds.length === 0) {
      // If no feeds, just refetch data
      await onRefreshData()
      return
    }

    setIsRefreshing(true)
    try {
      // Sync all calendar feeds in historical mode
      const syncPromises = calendarFeeds.map(feed => 
        syncFeed(feed.id, 'historical')
      )
      
      await Promise.all(syncPromises)
      
      // Then refetch the data
      await onRefreshData()
    } catch (error) {
      console.error('Failed to sync feeds during refresh:', error)
      // Still refetch data even if sync fails
      await onRefreshData()
    } finally {
      setIsRefreshing(false)
    }
  }, [calendarFeeds, syncFeed, onRefreshData])

  const handleCreateInvoice = useCallback((studioId: string) => {
    const eventIds = selectedEvents[studioId] || []
    if (eventIds.length > 0 && onCreateInvoice) {
      const studioEvents = eventsByStudio?.[studioId] || []
      const selectedEventsData = studioEvents.filter(event => eventIds.includes(event.id))
      onCreateInvoice(studioId, eventIds, selectedEventsData)
    }
  }, [selectedEvents, eventsByStudio, onCreateInvoice])

  const handleBatchSubstitute = useCallback((studioId: string, onOpenModal: (eventIds: string[]) => void) => {
    const eventIds = selectedEvents[studioId] || []
    if (eventIds.length > 0) {
      onOpenModal(eventIds)
    }
  }, [selectedEvents])

  const handleRevertToStudio = useCallback(async (studioId: string) => {
    const eventIds = selectedEvents[studioId] || []
    if (eventIds.length === 0) return

    try {
      setRevertingStudioId(studioId)
      
      // Revert events to studio invoicing (no re-matching needed since studio_id is preserved)
      const result = await revertEventsToStudioInvoicing(eventIds)
      console.log(`Reverted ${result.revertedEvents} events back to studio invoicing`)
      
      // Clear selections and refresh data
      onClearSelections()
      await onRefreshData()
    } catch (error) {
      console.error('Failed to revert events to studio invoicing:', error)
    } finally {
      setRevertingStudioId(null)
    }
  }, [selectedEvents, onClearSelections, onRefreshData])

  return {
    // State
    isRefreshing,
    revertingStudioId,
    
    // Actions
    handleRefresh,
    handleCreateInvoice,
    handleBatchSubstitute,
    handleRevertToStudio
  }
} 