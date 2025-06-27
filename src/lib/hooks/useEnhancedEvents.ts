import { useMemo } from 'react'
import { Event, PublicEvent, Tag } from '@/lib/types'
import { EventTag } from '@/lib/event-types'
import { processAllEventTags } from '@/lib/event-utils'

// Union type for events that can be enhanced
type EnhancableEvent = Event | PublicEvent

// Enhanced event with matched tags
export type EnhancedEvent = EnhancableEvent & {
  matchedTags: EventTag[]
}

interface UseEnhancedEventsProps {
  events: EnhancableEvent[] | undefined
  availableTags: Tag[]
}

export function useEnhancedEvents({ events, availableTags }: UseEnhancedEventsProps) {
  const enhancedEvents = useMemo<EnhancedEvent[]>(() => {
    if (!events || !availableTags.length) return []

    return events.map(event => ({
      ...event,
      matchedTags: processAllEventTags(
        event.tags, 
        'custom_tags' in event ? event.custom_tags : null, 
        availableTags
      )
    }))
  }, [events, availableTags])

  return enhancedEvents
} 