'use client'

import React, { useEffect } from 'react'
import { PublicEvent, Tag } from '@/lib/types'
import PublicEventList from '@/components/events/PublicEventList'
import { useScheduleFilters } from './FilterProvider'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
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
      const { data, error } = await supabase
        .from('public_events')
        .select('*')
        .eq('user_id', userId)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
      
      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })

  // Fetch user tags
  const {
    data: userTags,
    isLoading: userTagsLoading,
  } = useSupabaseQuery<Tag[]>({
    queryKey: ['user_tags', userId],
    fetcher: async (supabase) => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', userId)
      
      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })

  // Fetch global tags
  const {
    data: globalTags,
    isLoading: globalTagsLoading,
  } = useSupabaseQuery<Tag[]>({
    queryKey: ['global_tags'],
    fetcher: async (supabase) => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .is('user_id', null)
      
      if (error) throw error
      return data || []
    },
  })

  // Update filter context when data changes
  useEffect(() => {
    if (events) {
      setEvents(events)
    }
  }, [events, setEvents])

  useEffect(() => {
    if (userTags && globalTags) {
      setTags([...userTags, ...globalTags])
    }
  }, [userTags, globalTags, setTags])

  // Loading states
  const isLoading = eventsLoading || userTagsLoading || globalTagsLoading
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
              ? "This teacher doesn't have any upcoming classes scheduled."
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
            className={className}
          />
        )}
      </DataLoader>
      

    </>
  )
} 