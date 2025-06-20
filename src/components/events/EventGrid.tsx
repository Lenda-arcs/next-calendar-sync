'use client'

import React, { useMemo } from 'react'
import { format, isToday, isTomorrow, isThisWeek, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'
import { EventCard } from './EventCard'
import { InteractiveEventCard } from './InteractiveEventCard'
import { Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { type EventDisplayVariant, type EventTag } from '@/lib/event-types'

// Base event interface that both PublicEvent and enhanced events can satisfy
interface BaseEventForGrid {
  id: string
  title: string
  dateTime: string
  location: string | null
  imageQuery: string
  tags: EventTag[]
  start_time?: string | null // For date grouping
}

interface EventGridProps {
  events: BaseEventForGrid[] | undefined
  loading: boolean
  error: Error | null
  variant?: EventDisplayVariant
  className?: string
  skeletonCount?: number
  // Interactive mode support
  isInteractive?: boolean
  availableTags?: EventTag[]
  onEventUpdate?: (updates: {
    id: string
    tags: string[]
    visibility: string
  }) => void
}

// Utility function to group events by date
const groupEventsByDate = (events: BaseEventForGrid[]) => {
  const groups = new Map<string, BaseEventForGrid[]>()

  events.forEach((event) => {
    let eventDate: Date
    
    if (event.start_time) {
      try {
        eventDate = parseISO(event.start_time)
      } catch {
        eventDate = new Date() // fallback to today
      }
    } else {
      // Fallback: try to parse from the dateTime string
      const dateMatch = event.dateTime.match(/^([A-Za-z]+ [A-Za-z]+ \d+)/)
      if (dateMatch) {
        const currentYear = new Date().getFullYear()
        eventDate = new Date(`${dateMatch[1]}, ${currentYear}`)
      } else {
        eventDate = new Date() // fallback to today
      }
    }

    const dateKey = format(eventDate, 'yyyy-MM-dd')
    
    const existingGroup = groups.get(dateKey)
    if (existingGroup) {
      existingGroup.push(event)
    } else {
      groups.set(dateKey, [event])
    }
  })

  // Sort groups by date and return as array
  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, events]) => ({
      dateKey,
      date: parseISO(dateKey),
      events: events.sort((a, b) => {
        const timeA = a.start_time ? parseISO(a.start_time).getTime() : 0
        const timeB = b.start_time ? parseISO(b.start_time).getTime() : 0
        return timeA - timeB
      })
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
      compact: format(date, 'EEE'),
    }
  } else {
    return {
      primary: format(date, 'EEEE'),
      secondary: format(date, 'MMMM d, yyyy'),
      compact: format(date, 'MMM d'),
    }
  }
}

// Event Card Skeleton for loading states
const EventCardSkeleton: React.FC<{ variant: EventDisplayVariant }> = ({ variant }) => {
  const getHeight = () => {
    switch (variant) {
      case 'minimal':
        return 'h-32'
      case 'full':
        return 'h-80'
      case 'compact':
      default:
        return 'h-64'
    }
  }

  return (
    <Card variant="outlined" className={cn('animate-pulse', getHeight())}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
          <div className="h-3 bg-muted rounded w-2/3"></div>
        </div>
      </CardContent>
    </Card>
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

const EventGrid: React.FC<EventGridProps> = ({
  events,
  loading,
  error,
  variant = 'compact',
  className = '',
  skeletonCount = 3,
  isInteractive = false,
  availableTags = [],
  onEventUpdate,
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
        event,
        dayLabel: compact,
        isFirstOfDay: index === 0,
      }))
    })
  }, [groupedEvents])

  // Loading state
  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        {/* Mobile Layout: Single column */}
        <div className="block md:hidden">
          <div className="grid grid-cols-1 gap-6">
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <div key={`mobile-skeleton-${index}`} className="flex flex-col">
                <EventCardSkeleton variant={variant} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout: Multi-column grid */}
        <div className="hidden md:block">
          <div className={getGridClasses()}>
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <div key={`desktop-skeleton-${index}`} className="flex flex-col">
                <EventCardSkeleton variant={variant} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load events</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  // No events state
  if (!events || events.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <Card className="p-8 text-center max-w-md mx-auto">
          <CardContent className="pt-6">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No Upcoming Events
            </h3>
            <p className="text-muted-foreground">
              {isInteractive 
                ? "Connect your calendar feeds to import events."
                : "Check back later for new classes and sessions."
              }
            </p>
          </CardContent>
        </Card>
      </div>
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
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="text-xl font-semibold text-foreground">
                    {primary}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {secondary}
                  </div>
                </div>
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-muted-foreground">
                  {dayEvents.length} {dayEvents.length === 1 ? 'class' : 'classes'}
                </span>
              </div>

              {/* Events Grid for this day */}
              <div className="grid grid-cols-1 gap-6">
                {dayEvents.map((event, index) => (
                  <div key={`${dateKey}-${index}`} className="flex flex-col">
                    {isInteractive ? (
                      <InteractiveEventCard
                        id={event.id}
                        title={event.title}
                        dateTime={event.dateTime}
                        location={event.location}
                        imageQuery={event.imageQuery}
                        tags={event.tags}
                        variant={variant}
                        availableTags={availableTags}
                        onUpdate={onEventUpdate}
                      />
                    ) : (
                      <EventCard
                        id={event.id}
                        title={event.title}
                        dateTime={event.dateTime}
                        location={event.location}
                        imageQuery={event.imageQuery}
                        tags={event.tags}
                        variant={variant}
                      />
                    )}
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
              {isInteractive ? (
                <InteractiveEventCard
                  id={event.id}
                  title={event.title}
                  dateTime={event.dateTime}
                  location={event.location}
                  imageQuery={event.imageQuery}
                  tags={event.tags}
                  variant={variant}
                  availableTags={availableTags}
                  onUpdate={onEventUpdate}
                />
              ) : (
                <EventCard
                  id={event.id}
                  title={event.title}
                  dateTime={event.dateTime}
                  location={event.location}
                  imageQuery={event.imageQuery}
                  tags={event.tags}
                  variant={variant}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EventGrid 