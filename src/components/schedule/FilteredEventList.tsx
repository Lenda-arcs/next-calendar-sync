'use client'

import React, { useMemo } from 'react'
import { useAllTags } from '@/lib/hooks/useAppQuery'
import { useScheduleFilters } from './FilterProvider'

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
    isLoading: eventsLoading
  } = useScheduleFilters()

  // For compatibility, we still need allTags for the PublicEventList component
  const { data: tagsData, isLoading: tagsLoading } = useAllTags(userId, { enabled: !!userId })
  const allTags = useMemo(() => tagsData?.allTags || [], [tagsData?.allTags])

  // Show loading skeleton when either events or tags are loading
  if (eventsLoading || tagsLoading) {
    return <PublicEventListSkeleton variant={variant} />
  }

  if (!filteredEvents || filteredEvents.length === 0) {
    if (hasActiveFilters) {
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
    } else {
      return (
        <EventListEmptyState 
          isInteractive={false}
          totalEventsCount={0}
        />
      )
    }
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