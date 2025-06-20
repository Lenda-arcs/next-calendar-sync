import { PublicEvent, Tag } from './types'
import { EventTag, convertToEventTag } from './event-types'
import { formatEventDateTime } from './date-utils'

/**
 * Processes tags from an event and matches them with available tags
 */
export function processEventTags(
  eventTags: string[] | null,
  availableTags: Tag[]
): EventTag[] {
  if (!eventTags || !availableTags.length) return []

  const tagMap = new Map<string, Tag>()
  availableTags.forEach(tag => {
    if (tag.name) {
      tagMap.set(tag.name.toLowerCase(), tag)
    }
  })

  const matchedTags: EventTag[] = []
  eventTags.forEach(tagName => {
    const tag = tagMap.get(tagName.toLowerCase())
    if (tag) {
      matchedTags.push(convertToEventTag(tag))
    }
  })

  return matchedTags
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
 * Converts a PublicEvent to EventCard props
 */
export function convertEventToCardProps(
  event: PublicEvent,
  availableTags: Tag[]
): {
  id: string
  title: string
  dateTime: string
  location: string | null
  imageQuery: string
  tags: EventTag[]
} {
  // Process tags
  const matchedTags = processEventTags(event.tags, availableTags)

  // Get image URL (or empty string for placeholder)
  const imageUrl = getEventImageUrl(event, matchedTags)

  // Format datetime
  const dateTime = formatEventDateTime(event.start_time, event.end_time)

  return {
    id: event.id || 'unknown',
    title: event.title || 'Untitled Event',
    dateTime,
    location: event.location,
    imageQuery: imageUrl, // This will be empty string if no image, triggering placeholder
    tags: matchedTags,
  }
} 