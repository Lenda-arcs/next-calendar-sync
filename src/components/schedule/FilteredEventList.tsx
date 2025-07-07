'use client'

import React, { useEffect } from 'react'
import { PublicEvent } from '@/lib/types'
import PublicEventList from '@/components/events/PublicEventList'
import { useScheduleFilters } from './FilterProvider'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { useAllTags } from '@/lib/hooks/useAllTags'
import DataLoader from '@/components/ui/data-loader'
import { PublicEventListSkeleton } from '@/components/ui/skeleton'



interface FilteredEventListProps {
  userId: string
  variant?: 'compact' | 'full' | 'minimal'
  className?: string
}

export function FilteredEventList({ userId, variant = 'compact', className }: FilteredEventListProps) {
  const { 
    filteredEvents, 
    hasActiveFilters, 
    clearAllFilters, 
    setEvents, 
    setTags 
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

  // Combined loading state
  const isLoading = eventsLoading || tagsLoading
  const errorMessage = eventsError?.message || null
  
  // Empty state component
  const emptyState = (
    <Card>
      <CardContent className="py-12">
        <div className="text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {(events?.length || 0) === 0 
              ? "No upcoming classes" 
              : "No classes match your filters"
            }
          </h3>
          <p className="text-muted-foreground mb-6">
            {(events?.length || 0) === 0 
              ? "This teacher doesn't have any classes scheduled in the next 3 months."
              : "Try adjusting your filters to see more classes."
            }
          </p>
          {hasActiveFilters && (
            <Button onClick={clearAllFilters} variant="outline">
              Clear All Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      <div className="transition-all duration-500 ease-in-out min-h-[300px]">
        <DataLoader
          data={filteredEvents}
          loading={isLoading}
          error={errorMessage}
          empty={emptyState}
          skeleton={() => <PublicEventListSkeleton variant={variant} />}
          skeletonCount={1}
        >
          {(data) => (
            <PublicEventList
              userId={userId}
              variant={variant}
              events={data}
              tags={allTags}
              disableFetching={true}
              className={className}
            />
          )}
        </DataLoader>
      </div>

    </>
  )
} 