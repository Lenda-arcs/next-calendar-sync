'use client'

import React, { useEffect } from 'react'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { useAllTags } from '@/lib/hooks/useAllTags'
import { useScheduleFilters } from './FilterProvider'

import { PublicEvent } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { AlertTriangle, X } from 'lucide-react'
import { EventListEmptyState } from '@/components/events/EventListStates'
import { getStudiosForEvents } from '@/lib/calendar-feeds'
import { createClient } from '@/lib/supabase'
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

  // Fetch events
  const {
    data: events,
    isLoading: eventsLoading,
    error: eventsError
  } = useSupabaseQuery<PublicEvent[]>({
    queryKey: ['public_events', userId],
    fetcher: async (supabase) => {
      const now = new Date()
      const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate())
      
      const { data, error } = await supabase
        .from('public_events')
        .select('*')
        .eq('user_id', userId)
        .gte('start_time', now.toISOString())
        .lte('start_time', threeMonthsFromNow.toISOString())
        .order('start_time', { ascending: true })
      
      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })

  // Fetch studio information for events (much simpler now)
  const {
    data: studioInfo,
    isLoading: studioLoading,
    error: studioError
  } = useSupabaseQuery({
    queryKey: ['studios_for_events', JSON.stringify(events?.map(e => e.studio_id).filter(Boolean) || [])],
    fetcher: async () => {
      if (!events || events.length === 0) return []
      const supabase = createClient()
      return await getStudiosForEvents(supabase, events)
    },
    enabled: !!events && events.length > 0,
  })

  // Use shared tags hook instead of individual fetches
  const { allTags, isLoading: tagsLoading } = useAllTags({ 
    userId, 
    enabled: !!userId 
  })

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
  const errorMessage = eventsError?.message || studioError?.message || null

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