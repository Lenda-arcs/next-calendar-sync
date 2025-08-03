'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Event, PublicEvent, Tag } from '@/lib/types'
import { EventCard } from './EventCard'
import { parseISO, isToday, isTomorrow, isThisWeek, format } from 'date-fns'

import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type EventDisplayVariant, type EventTag } from '@/lib/event-types'
import { useAllTags, usePublicEvents } from '@/lib/hooks/useAppQuery'
import { convertEventToCardProps, processAllEventTags } from '@/lib/event-utils'
import DataLoader from '@/components/ui/data-loader'
import { PublicEventListSkeleton } from '@/components/ui/skeleton'

// Enhanced Event/PublicEvent with matched tags
interface EnhancedEvent extends Event {
  matchedTags: EventTag[]
}

interface EnhancedPublicEvent extends PublicEvent {
  matchedTags: EventTag[]
}

type EnhancedEventUnion = EnhancedEvent | EnhancedPublicEvent

interface PublicEventListProps {
  userId: string
  variant?: EventDisplayVariant
  className?: string
  events?: (Event | PublicEvent)[] // Accept both Event and PublicEvent types for backward compatibility
  tags?: Tag[] // Accept tags as props to avoid duplicate fetching
  disableFetching?: boolean // Explicitly disable data fetching when data is provided externally
}

const PublicEventList: React.FC<PublicEventListProps> = ({
  userId,
  variant = 'compact',
  className = '',
  events: propEvents,
  tags: propTags,
  disableFetching = false,
}) => {
  // Client-side date state to prevent hydration mismatches
  const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined)
  
  // State for expanded cards (variant switching)
  const [expandedCards, setExpandedCards] = useState<Record<string, EventDisplayVariant>>({})
  
  useEffect(() => {
    setCurrentDate(new Date())
  }, [])

  // Handle variant change for interactive cards
  const handleVariantChange = (eventId: string, newVariant: EventDisplayVariant) => {
    setExpandedCards(prev => ({
      ...prev,
      [eventId]: newVariant
    }))
  }

  //TODO: DO we need this if we already fetch in the FilteredEventList?
  const {
    data: fetchedEvents,
    isLoading: eventsLoading,
    error: eventsError
  } = usePublicEvents(userId, { 
    limit: 50,
    enabled: !!userId && !propEvents && !disableFetching, // Only fetch if events not provided and fetching not disabled
  })

  // Use provided events or fetched events
  const events = propEvents || fetchedEvents

  //TODO: DO we need this if we already fetch in the FilteredEventList?
  const { 
    data: tagsData, 
    isLoading: tagsLoading 
  } = useAllTags(userId, { 
    enabled: !!userId && !propTags && !disableFetching
  })
  
  // Use provided tags or fetched tags - ensure type compatibility
  const allTags: Tag[] = propTags || tagsData?.allTags || []

  // Utility function to group events by date
  const groupEventsByDate = (events: EnhancedEventUnion[]) => {
    const groups = new Map<string, EnhancedEventUnion[]>()

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

  // Get formatted date header (client-safe version)
  //TODO Refactor date grid logic to a separate utility function
  const getDateHeader = (dateString: string, currentDate?: Date) => {
    const date = parseISO(dateString)
    
    let label = ''
    let compact = ''
    
    // Only use relative dates if we have a current date (client-side)
    if (currentDate) {
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
    } else {
      // Fallback for SSR - always use full date format
      label = format(date, 'EEEE, MMMM d')
      compact = format(date, 'MMM d')
    }
    
    return { label, compact }
  }

  // Get all available tags for processing
  const allAvailableTags = allTags

  // Enhanced events with matched tags
  const enhancedEvents: EnhancedEventUnion[] = useMemo(() => {
    if (!events) return []

    return events.map(event => ({
      ...event,
      matchedTags: processAllEventTags(
        event.tags, 
        'custom_tags' in event ? (event.custom_tags as string[] | null) : null, 
        allAvailableTags
      )
    }))
  }, [events, allAvailableTags])

  // Process data for layouts
  const groupedEvents = useMemo(() => groupEventsByDate(enhancedEvents), [enhancedEvents])
  
  const getGridClasses = () => {
    switch (variant) {
      case 'full':
        return 'grid grid-cols-1 md:grid-cols-2 gap-8'
      case 'minimal':
        return 'grid grid-cols-1 md:grid-cols-3 gap-4'
      case 'compact':
      default:
        return 'grid grid-cols-1 md:grid-cols-3 gap-6'
    }
  }

  // Create a flattened array of events with day information for desktop layout
  const flattenedEvents = useMemo(() => {
    return groupedEvents.flatMap(({ date, events: dayEvents }) => {
      const { compact } = getDateHeader(date, currentDate)
      return dayEvents.map((event, index) => ({
        event: convertEventToCardProps(event, allAvailableTags),
        dayLabel: compact,
        isFirstOfDay: index === 0,
      }))
    })
  }, [groupedEvents, allAvailableTags, currentDate])

  // Loading states
  const isLoading = (propEvents ? false : eventsLoading) || (propTags ? false : tagsLoading)
  const errorMessage = eventsError?.message || null
  
  // TODO: can be removed if we handle empty state in FilteredEventList
  const emptyState = (
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

  // Date Badge Component for desktop layout
  const DateBadge: React.FC<{ label: string }> = ({ label }) => (
    <div className="absolute -top-2 -left-2 z-10">
      <div className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
        {label}
      </div>
    </div>
  )

  return (
      //TODO: see if wee need this DataLoader component,, or if we put it directly in the FilteredEventList
    <DataLoader
      data={enhancedEvents}
      loading={isLoading}
      error={errorMessage}
      empty={emptyState}
      skeleton={() => <PublicEventListSkeleton variant={variant} />}
      skeletonCount={1}
    >
      {() => (
        <div className={cn('space-y-6', className)}>
          {/* Mobile Layout: Grouped by day with headers */}
          <div className="block md:hidden">
            {/* Container with smooth height transitions and minimum height */}
            <div className="transition-all duration-500 ease-in-out min-h-[400px] space-y-8">
              {groupedEvents.map(({ date, events: dayEvents }) => {
                const { label } = getDateHeader(date, currentDate)
                const dateKey = date

                return (
                  <div key={dateKey} className="space-y-4 transition-all duration-300 ease-in-out">
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
                      {dayEvents.map((event, index) => {
                        const eventKey = `mobile-${dateKey}-${index}`
                        // For the first event of the first day, force "compact" variant
                        const isFirstEvent = groupedEvents.indexOf(groupedEvents.find(g => g.date === dateKey)!) === 0 && index === 0
                        const currentVariant = isFirstEvent ? 'compact' : (expandedCards[eventKey] || variant)
                        return (
                          <div key={eventKey} className="flex flex-col transition-all duration-300 ease-in-out">
                            <EventCard
                              {...convertEventToCardProps(event, allAvailableTags)}
                              variant={currentVariant}
                              onVariantChange={(newVariant) => handleVariantChange(eventKey, newVariant)}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Desktop Layout: Clean grid with date badges */}
          <div className="hidden md:block">
            <div className={getGridClasses()}>
              {flattenedEvents.map(({ event, dayLabel, isFirstOfDay }, index) => {
                const eventKey = `desktop-${index}`
                // For the first 3 events, force "full" variant (open state)
                const currentVariant = index < 3 ? 'full' : (expandedCards[eventKey] || variant)
                return (
                  <div key={eventKey} className="flex flex-col relative">
                    {isFirstOfDay && <DateBadge label={dayLabel} />}
                    <EventCard 
                      {...event} 
                      variant={currentVariant}
                      onVariantChange={(newVariant) => handleVariantChange(eventKey, newVariant)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </DataLoader>
  )
}

export default PublicEventList 