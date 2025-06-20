'use client'

import React, { useMemo } from 'react'
import { PublicEvent, Tag } from '@/lib/types'
import { EventCard } from './EventCard'
import { parseISO, isToday, isTomorrow, isThisWeek, format } from 'date-fns'
import { formatEventDateTime } from '@/lib/date-utils'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type EventDisplayVariant, type EventTag, convertToEventTag } from '@/lib/event-types'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'

// Enhanced PublicEvent with matched tags
interface EnhancedPublicEvent extends PublicEvent {
  matchedTags: EventTag[]
}

interface PublicEventListProps {
  userId: string
  variant?: EventDisplayVariant
  className?: string
}

const PublicEventList: React.FC<PublicEventListProps> = ({
  userId,
  variant = 'compact',
  className = '',
}) => {
  // Fetch events using the custom hook
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
        .limit(50)
      
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

  // Utility function to group events by date
  const groupEventsByDate = (events: EnhancedPublicEvent[]) => {
    const groups = new Map<string, EnhancedPublicEvent[]>()

    events.forEach((event) => {
      if (!event.start_time) return
      
      const startTime = parseISO(event.start_time)
      const dateKey = format(startTime, 'yyyy-MM-dd')
      
      const existingGroup = groups.get(dateKey)
      if (existingGroup) {
        existingGroup.push(event)
      } else {
        groups.set(dateKey, [event])
      }
    })

    return Array.from(groups.entries()).map(([date, events]) => ({
      date,
      events: events.sort((a, b) => {
        const timeA = a.start_time ? parseISO(a.start_time).getTime() : 0
        const timeB = b.start_time ? parseISO(b.start_time).getTime() : 0
        return timeA - timeB
      })
    }))
  }

  // Get formatted date header
  const getDateHeader = (dateString: string) => {
    const date = parseISO(dateString)
    
    let label = ''
    let compact = ''
    
    if (isToday(date)) {
      label = 'Today'
      compact = 'Today'
    } else if (isTomorrow(date)) {
      label = 'Tomorrow'  
      compact = 'Tomorrow'
    } else if (isThisWeek(date)) {
      label = format(date, 'EEEE, MMMM d')
      compact = format(date, 'EEE')
    } else {
      label = format(date, 'EEEE, MMMM d')
      compact = format(date, 'MMM d')
    }
    
    return { label, compact }
  }

  // Convert EnhancedPublicEvent to EventCard props
  const convertToEventCardProps = (event: EnhancedPublicEvent): {
    id: string
    title: string
    dateTime: string
    location: string | null
    imageQuery: string
    tags: EventTag[]
    variant?: EventDisplayVariant
  } => {
    // Format datetime using timezone-aware utility
    const dateTime = formatEventDateTime(event.start_time, event.end_time)

    // Use actual image URL from database if available, otherwise try tag images, then fallback to search query
    let imageQuery: string
    if (event.image_url) {
      imageQuery = event.image_url
    } else {
      // Try to find an image from the matched tags
      const tagWithImage = event.matchedTags.find(tag => tag.imageUrl)
      if (tagWithImage?.imageUrl) {
        imageQuery = tagWithImage.imageUrl
      } else {
        // Generate image query from available data as fallback
        const parts = []
        if (event.title) parts.push(event.title)
        if (event.location) parts.push(event.location)
        if (event.tags && event.tags.length > 0) {
          parts.push(...event.tags.slice(0, 2))
        }
        imageQuery = parts.join(' ').toLowerCase() || 'yoga class'
      }
    }

    return {
      id: event.id || 'unknown',
      title: event.title || 'Untitled Event',
      dateTime,
      location: event.location,
      imageQuery,
      tags: event.matchedTags,
    }
  }

  // Enhanced events with matched tags
  const enhancedEvents: EnhancedPublicEvent[] = useMemo(() => {
    if (!events || !userTags || !globalTags) return []

    const allTags = [...userTags, ...globalTags]
    const tagMap = new Map<string, Tag>()
    
    allTags.forEach(tag => {
      if (tag.name) {
        tagMap.set(tag.name.toLowerCase(), tag)
      }
    })

    return events.map(event => {
      const matchedTags: EventTag[] = []
      
      if (event.tags) {
        event.tags.forEach(tagName => {
          const tag = tagMap.get(tagName.toLowerCase())
          if (tag) {
            matchedTags.push(convertToEventTag(tag))
          }
        })
      }

      return {
        ...event,
        matchedTags
      }
    })
  }, [events, userTags, globalTags])

  // Process data for layouts
  const groupedEvents = useMemo(() => groupEventsByDate(enhancedEvents), [enhancedEvents])
  
  const getGridClasses = () => {
    switch (variant) {
      case 'full':
        return 'grid grid-cols-1 md:grid-cols-2 gap-8'
      case 'minimal':
        return 'grid grid-cols-1 md:grid-cols-4 gap-4'
      case 'compact':
      default:
        return 'grid grid-cols-1 md:grid-cols-3 gap-6'
    }
  }

  // Create a flattened array of events with day information for desktop layout
  const flattenedEvents = useMemo(() => {
    return groupedEvents.flatMap(({ date, events: dayEvents }) => {
      const { compact } = getDateHeader(date)
      return dayEvents.map((event, index) => ({
        event: convertToEventCardProps(event),
        dayLabel: compact,
        isFirstOfDay: index === 0,
      }))
    })
  }, [groupedEvents])

  // Loading state
  const isLoading = eventsLoading || userTagsLoading || globalTagsLoading
  
  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (eventsError) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load events</p>
          <p className="text-sm text-muted-foreground">{eventsError.message}</p>
        </div>
      </div>
    )
  }

  // No events state
  if (!enhancedEvents || enhancedEvents.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <Card className="p-8 text-center max-w-md mx-auto">
          <CardContent className="pt-6">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No Upcoming Events
            </h3>
            <p className="text-muted-foreground">
              Check back later for new classes and sessions.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Date Badge Component for desktop layout
  const DateBadge: React.FC<{ label: string }> = ({ label }) => (
    <div className="absolute -top-2 -left-2 z-10">
      <div className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
        {label}
      </div>
    </div>
  )

  return (
    <div className={cn('space-y-6', className)}>
      {/* Mobile Layout: Grouped by day with headers */}
      <div className="block md:hidden space-y-8">
        {groupedEvents.map(({ date, events: dayEvents }) => {
          const { label } = getDateHeader(date)
          const dateKey = date

          return (
            <div key={dateKey} className="space-y-4">
              {/* Date Header */}
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-foreground">
                  {label}
                </h3>
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-muted-foreground">
                  {dayEvents.length} {dayEvents.length === 1 ? 'class' : 'classes'}
                </span>
              </div>

              {/* Events Grid for Mobile */}
              <div className="grid grid-cols-1 gap-6">
                {dayEvents.map((event, index) => (
                  <div key={`${dateKey}-${index}`} className="flex flex-col">
                    <EventCard
                      {...convertToEventCardProps(event)}
                      variant={variant}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop Layout: Clean grid with date badges */}
      <div className="hidden md:block">
        <div className={getGridClasses()}>
          {flattenedEvents.map(({ event, dayLabel, isFirstOfDay }, index) => (
            <div key={`desktop-${index}`} className="flex flex-col relative">
              {isFirstOfDay && <DateBadge label={dayLabel} />}
              <EventCard {...event} variant={variant} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PublicEventList 