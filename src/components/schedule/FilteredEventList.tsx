'use client'

import React, { useEffect, useMemo } from 'react'
import { usePublicEvents, useAllTags } from '@/lib/hooks/useAppQuery'
import { useScheduleFilters, type StudioInfo } from './FilterProvider'

import { Button } from '@/components/ui/button'
import { AlertTriangle, X } from 'lucide-react'
import { EventListEmptyState } from '@/components/events/EventListStates'
import PublicEventList from '@/components/events/PublicEventList'
import { PublicEventListSkeleton } from '@/components/ui/skeleton'

export interface FilteredEventListProps {
  userId: string
  variant?: 'minimal' | 'compact' | 'full'
  className?: string
}

export function FilteredEventList({ userId, variant = 'compact', className }: FilteredEventListProps) {
  const { 
    filteredEvents, 
    hasActiveFilters, 
    clearAllFilters, 
    setEvents, 
    setTags,
    setStudioInfo
  } = useScheduleFilters()

  // ✨ NEW: Use unified hook for public events
  const {
    data: events,
    isLoading: eventsLoading,
    error: eventsError
  } = usePublicEvents(userId, undefined, { enabled: !!userId })

  // 🚧 TODO: Migrate studio information fetching to unified pattern
  // For now, using empty data to complete the main migration
  const studioLoading = false
  const studioInfo = useMemo(() => [] as StudioInfo[], [])

  // ✨ NEW: Use unified tags hook
  const { 
    data: tagData, 
    isLoading: tagsLoading 
  } = useAllTags(userId, { enabled: !!userId })

  // Extract tags from unified response (memoized to prevent infinite re-renders)
  const allTags = useMemo(() => tagData?.allTags || [], [tagData?.allTags])

  // Update filter context when data changes
  useEffect(() => {
    if (events) {
      setEvents(events)
    }
  }, [events, setEvents])

  useEffect(() => {
    if (allTags.length > 0) {
      setTags(allTags)
    }
  }, [allTags, setTags])

  useEffect(() => {
    if (studioInfo) {
      setStudioInfo(studioInfo)
    }
  }, [studioInfo, setStudioInfo])

  // Combined loading state
  const isLoading = eventsLoading || tagsLoading || studioLoading
  const errorMessage = eventsError?.message || null

  if (isLoading) {
    return <PublicEventListSkeleton variant={variant} />
  }

  if (errorMessage) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Error loading events: {errorMessage}</p>
      </div>
    )
  }

  if (!events || events.length === 0) {
    return (
      <EventListEmptyState 
        isInteractive={false}
        totalEventsCount={0}
      />
    )
  }

  if (filteredEvents.length === 0 && hasActiveFilters) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No events match your filters
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Try adjusting your filters to see more events.
        </p>
        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="inline-flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear All Filters
        </Button>
      </div>
    )
  }

  return (
    <PublicEventList
      userId={userId}
      variant={variant}
      events={filteredEvents}
      tags={allTags}
      disableFetching={true}
      className={className}
    />
  )
} 