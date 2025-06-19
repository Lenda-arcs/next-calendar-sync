'use client'

import React, { useMemo } from 'react'
import { PublicEvent } from '@/lib/types'
import { EventCard } from './EventCard'
import { format, parseISO, isToday, isTomorrow, isThisWeek } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type EventDisplayVariant, type EventTag } from '@/lib/event-types'

// Enhanced PublicEvent with matched tags
interface EnhancedPublicEvent extends PublicEvent {
  matchedTags: EventTag[]
}

interface PublicEventListProps {
  events: EnhancedPublicEvent[]
  variant?: EventDisplayVariant
  className?: string
}

// Utility function to group events by date
const groupEventsByDate = (events: EnhancedPublicEvent[]) => {
  const groups = new Map<string, EnhancedPublicEvent[]>()

  events.forEach((event) => {
    if (!event.start_time) return
    
    const eventDate = parseISO(event.start_time)
    const dateKey = format(eventDate, 'yyyy-MM-dd')

    if (!groups.has(dateKey)) {
      groups.set(dateKey, [])
    }
    groups.get(dateKey)!.push(event)
  })

  // Sort groups by date and return as array
  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, events]) => ({
      dateKey,
      date: parseISO(dateKey),
      events,
    }))
}

// Utility function to format date headers
const getDateHeader = (date: Date) => {
  if (isToday(date)) {
    return {
      primary: 'Today',
      secondary: format(date, 'EEEE, MMMM d'),
      compact: 'Today',
    }
  } else if (isTomorrow(date)) {
    return {
      primary: 'Tomorrow',
      secondary: format(date, 'EEEE, MMMM d'),
      compact: 'Tomorrow',
    }
  } else if (isThisWeek(date, { weekStartsOn: 0 })) {
    return {
      primary: format(date, 'EEEE'),
      secondary: format(date, 'MMMM d'),
      compact: format(date, 'EEE, MMM d'),
    }
  } else {
    return {
      primary: format(date, 'EEEE'),
      secondary: format(date, 'MMMM d, yyyy'),
      compact: format(date, 'EEE, MMM d'),
    }
  }
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
  const startTime = event.start_time ? parseISO(event.start_time) : new Date()
  const endTime = event.end_time ? parseISO(event.end_time) : null
  
  // Format datetime string
  const dateTime = format(startTime, 'EEE MMM d') + 
    ' • ' + 
    format(startTime, 'h:mm a') + 
    (endTime ? ' - ' + format(endTime, 'h:mm a') : '')

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
    tags: event.matchedTags, // Now we pass the actual matched tags!
  }
}

// Date Badge Component for desktop layout
const DateBadge: React.FC<{ label: string }> = ({ label }) => (
  <div className="absolute -top-2 -left-2 z-10">
    <div className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
      {label}
    </div>
  </div>
)

const PublicEventList: React.FC<PublicEventListProps> = ({
  events,
  variant = 'compact',
  className = '',
}) => {
  // Group events by date
  const groupedEvents = useMemo(() => {
    if (!events || events.length === 0) return []
    return groupEventsByDate(events)
  }, [events])

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

  if (!events || events.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            No upcoming events scheduled at the moment.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Mobile Layout: Grouped by day with headers */}
      <div className="block md:hidden space-y-8">
        {groupedEvents.map(({ dateKey, date, events: dayEvents }) => {
          const { primary, secondary } = getDateHeader(date)

          return (
            <div key={dateKey} className="space-y-4">
              {/* Date Header */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="text-xl font-bold text-gray-900 leading-none">
                    {primary}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {secondary}
                  </div>
                </div>
                <div className="flex-grow h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
              </div>

              {/* Events Grid for this day */}
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

      {/* Desktop Layout: Efficient grid with day badges */}
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