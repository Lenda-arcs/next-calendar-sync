'use client'

import React from 'react'
import { PublicEvent, Tag } from '@/lib/types'
import { EventCard } from './EventCard'

import { Calendar, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type EventDisplayVariant } from '@/lib/event-types'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
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
  // Fetch events using the custom hook
  const {
    data: events,
    isLoading: eventsLoading,
    error: eventsError
  } = useSupabaseQuery<PublicEvent[]>({
    queryKey: ['private_events_preview', userId],
    fetcher: async (supabase) => {
      const { data, error } = await supabase
        .from('public_events')
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

  // Fetch user tags using the custom hook
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

  // Fetch global tags using the custom hook
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

  // Get all available tags for processing
  const allAvailableTags = [...(userTags || []), ...(globalTags || [])]

  // Loading state
  const isLoading = eventsLoading || userTagsLoading || globalTagsLoading
  
  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center py-8', className)}>
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading events...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (eventsError) {
    return (
      <div className={cn('flex items-center justify-center py-8', className)}>
        <div className="text-center">
          <p className="text-sm text-destructive mb-1">Failed to load events</p>
          <p className="text-xs text-muted-foreground">{eventsError.message}</p>
        </div>
      </div>
    )
  }

  // No events state
  if (!events || events.length === 0) {
    return (
      <div className={cn('py-8', className)}>
        <div className="text-center">
          <Calendar className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No upcoming events found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(getGridClasses(), className)}>
      {events.map((event) => (
        <div key={event.id} className="flex flex-col">
          <EventCard
            {...convertEventToCardProps(event, allAvailableTags)}
            variant={variant}
          />
        </div>
      ))}
    </div>
  )
}

export default PrivateEventList 