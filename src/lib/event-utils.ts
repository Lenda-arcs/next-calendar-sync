import { PublicEvent, Event, Tag } from './types'
import { EventTag, convertToEventTag } from './event-types'
import { formatEventDateTime } from './date-utils'

/**
 * Processes tags from an event and matches them with available tags by slug
 */
export function processEventTags(
  eventTags: string[] | null,
  availableTags: Tag[]
): EventTag[] {
  if (!eventTags || !availableTags.length) return []

  const tagMap = new Map<string, Tag>()
  availableTags.forEach(tag => {
    if (tag.slug) {
      tagMap.set(tag.slug.toLowerCase(), tag)
    }
  })

  const matchedTags: EventTag[] = []
  eventTags.forEach(tagSlug => {
    const tag = tagMap.get(tagSlug.toLowerCase())
    if (tag) {
      matchedTags.push(convertToEventTag(tag))
    }
  })

  return matchedTags
}

/**
 * Combines and processes both auto tags and custom tags from an event
 */
export function processAllEventTags(
  autoTags: string[] | null,
  customTags: string[] | null,
  availableTags: Tag[]
): EventTag[] {
  // Combine both tag arrays, removing duplicates
  const allTagNames = [
    ...(autoTags || []),
    ...(customTags || [])
  ]
  
  // Remove duplicates while preserving order (custom tags take precedence)
  const uniqueTagNames = Array.from(new Set(allTagNames))
  
  return processEventTags(uniqueTagNames, availableTags)
}

/**
 * Determines the image URL for an event based on priority:
 * 1. Event's own image_url
 * 2. Image from matched tags
 * 3. Empty string (will use fallback placeholder in ImageGallery)
 */
export function getEventImageUrl(
  event: { image_url?: string | null },
  matchedTags: EventTag[]
): string {
  // First priority: event's own image
  if (event.image_url) {
    return event.image_url
  }

  // Second priority: image from matched tags
  const tagWithImage = matchedTags.find(tag => tag.imageUrl)
  if (tagWithImage?.imageUrl) {
    return tagWithImage.imageUrl
  }

  // Return empty string - ImageGallery will handle the placeholder
  return ''
}

/**
 * Converts an Event or PublicEvent to EventCard props
 */
export function convertEventToCardProps(
  event: Event | PublicEvent,
  availableTags: Tag[]
): {
  id: string
  title: string
  dateTime: string
  location: string | null
  imageQuery: string
  tags: EventTag[]
  isPublic: boolean
} {
  // Process tags - check if event has custom_tags field (Event type) or just tags (PublicEvent type)
  let matchedTags: EventTag[]
  
  if ('custom_tags' in event && event.custom_tags !== undefined) {
    // This is an Event type with both tags and custom_tags
    matchedTags = processAllEventTags(event.tags, event.custom_tags, availableTags)
  } else {
    // This is a PublicEvent type with only tags field
    matchedTags = processEventTags(event.tags, availableTags)
  }

  // Get image URL (or empty string for placeholder)
  const imageUrl = getEventImageUrl(event, matchedTags)

  // Format date and time - ensure we have valid date values
  const dateTime = formatEventDateTime(event.start_time, event.end_time)

  // Determine if public - PublicEvent is always public, Event has visibility field
  const isPublic = 'visibility' in event 
    ? event.visibility === 'public'
    : true // PublicEvent from public_events view is always public

  // Ensure we have valid required fields
  const safeEvent = {
    id: event.id || 'unknown',
    title: event.title || 'Untitled Event',
    dateTime,
    location: event.location || null,
    imageQuery: imageUrl, // This will be empty string if no image, triggering placeholder
    tags: matchedTags,
    isPublic,
  }

  return safeEvent
} 