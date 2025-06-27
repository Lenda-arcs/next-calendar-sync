'use client'

import React from 'react'
import { Event } from '@/lib/types'
import { EventCard } from './EventCard'
import DataLoader from '@/components/ui/data-loader'
import { DashboardUpcomingClassesSkeleton } from '@/components/ui/skeleton'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type EventDisplayVariant } from '@/lib/event-types'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { useAllTags } from '@/lib/hooks/useAllTags'
import { convertEventToCardProps } from '@/lib/event-utils'

interface PrivateEventListProps {
  userId: string
  eventCount?: number
  variant?: EventDisplayVariant
  className?: string
}

const PrivateEventList: React.FC<PrivateEventListProps> = ({
  userId,
  eventCount = 3,
  variant = 'compact',
  className = '',
}) => {
  // Fetch events using the custom hook - using events table instead of public_events view
  const {
    data: events,
    isLoading: eventsLoading,
    error: eventsError
  } = useSupabaseQuery<Event[]>({
    queryKey: ['private_events_preview', userId],
    fetcher: async (supabase) => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', userId)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(eventCount)
      
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

  // Get grid classes based on variant
  const getGridClasses = () => {
    switch (variant) {
      case 'full':
        return 'grid grid-cols-1 md:grid-cols-2 gap-6'
      case 'minimal':
        return 'grid grid-cols-1 md:grid-cols-3 gap-4'
      case 'compact':
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    }
  }

  // Combined loading state
  const isLoading = eventsLoading || tagsLoading
  const eventsData = events && allTags.length >= 0 ? events : null

  return (
    <DataLoader
      data={eventsData}
      loading={isLoading}
      error={eventsError?.message || null}
      skeleton={DashboardUpcomingClassesSkeleton}
      skeletonCount={1}
      empty={
        <div className={cn('py-8', className)}>
          <div className="text-center">
            <Calendar className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No upcoming events found.
            </p>
          </div>
        </div>
      }
    >
      {(events) => (
        <div className={cn(getGridClasses(), className)}>
          {events.map((event) => (
            <div key={event.id} className="flex flex-col">
              <EventCard
                {...convertEventToCardProps(event, allTags)}
                variant={variant}
              />
            </div>
          ))}
        </div>
      )}
    </DataLoader>
  )
}

export default PrivateEventList 