import { PublicEvent, Event, Tag } from './types'
import { EventTag, convertToEventTag } from './event-types'
import { formatEventDateTime } from './date-utils'

// Cache for tag map to avoid rebuilding it for every event
let tagMapCache: Map<string, Tag> | null = null
let tagMapCacheVersion = 0

/**
 * Processes tags from an event and matches them with available tags by slug
 */
export function processEventTags(
  eventTags: string[] | null,
  availableTags: Tag[]
): EventTag[] {
  if (!eventTags || !availableTags.length) return []

  // Create or reuse cached tag map
  const currentVersion = availableTags.length
  if (!tagMapCache || tagMapCacheVersion !== currentVersion) {
    tagMapCache = new Map<string, Tag>()
    availableTags.forEach(tag => {
      if (tag.slug) {
        tagMapCache!.set(tag.slug.toLowerCase(), tag)
      }
    })
    tagMapCacheVersion = currentVersion
  }

  const matchedTags: EventTag[] = []
  const processedSlugs = new Set<string>() // Prevent duplicates

  eventTags.forEach(tagSlug => {
    const normalizedSlug = tagSlug.toLowerCase()
    
    // Skip if already processed (deduplication)
    if (processedSlugs.has(normalizedSlug)) return
    
    const tag = tagMapCache!.get(normalizedSlug)
    if (tag) {
      matchedTags.push(convertToEventTag(tag))
      processedSlugs.add(normalizedSlug)
    } else {
      // Log missing tags for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Tag slug "${tagSlug}" not found in available tags`)
      }
    }
  })

  return matchedTags
}

/**
 * Combines and processes both auto tags and custom tags from an event
 * Custom tags take precedence over auto tags
 */
export function processAllEventTags(
  autoTags: string[] | null,
  customTags: string[] | null,
  availableTags: Tag[]
): EventTag[] {
  // Early return if no tags
  if ((!autoTags || autoTags.length === 0) && (!customTags || customTags.length === 0)) {
    return []
  }

  // Combine tags with custom tags taking precedence
  const allTagSlugs = new Set<string>()
  
  // Add auto tags first
  if (autoTags) {
    autoTags.forEach(tag => allTagSlugs.add(tag.toLowerCase()))
  }
  
  // Add custom tags (will override auto tags due to Set behavior)
  if (customTags) {
    customTags.forEach(tag => allTagSlugs.add(tag.toLowerCase()))
  }
  
  // Convert back to array while preserving order (custom tags first)
  const prioritizedTags = [
    ...(customTags || []),
    ...(autoTags || []).filter(tag => !customTags?.includes(tag))
  ]
  
  return processEventTags(prioritizedTags, availableTags)
}

/**
 * Determines the image URL for an event based on priority:
 * 1. Event's own image_url
 * 2. Image from matched tags (prioritize custom tags)
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

  // Second priority: image from matched tags (find first tag with image)
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
  availableTags: Tag[],
  studioInfo?: Array<{
    id: string
    name: string
    address?: string
    eventCount?: number
    hasEventsInFilter?: boolean
    isVerified?: boolean
    hasStudioProfile?: boolean
  }>
): {
  id: string
  title: string
  dateTime: string
  location: string | null
  imageQuery: string
  tags: EventTag[]
  isPublic: boolean
  studioInfo: Array<{
    id: string
    name: string
    address?: string
    eventCount?: number
    hasEventsInFilter?: boolean
    isVerified?: boolean
    hasStudioProfile?: boolean
  }>
  studioId: string | null
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
    studioInfo: studioInfo || [],
    studioId: event.studio_id || null,
  }

  return safeEvent
}

/**
 * Clear the tag map cache (useful when tags are updated)
 */
export function clearTagMapCache() {
  tagMapCache = null
  tagMapCacheVersion = 0
} 