import { Event, Tag } from './types'

// Enhanced event tag interface that combines database tag with additional display properties
export interface EventTag {
  id: string
  slug: string | null
  name: string | null
  color: string | null
  imageUrl?: string | null
  classType?: string[] | null
  audience?: string[] | null
  cta?: {
    label: string
    url: string
  } | null
  chip: {
    color: string
  }
  priority?: number | null
  userId?: string | null
}

// Enhanced display event that includes processed tags and additional display properties
export interface EnhancedDisplayEvent extends Omit<Event, 'tags' | 'custom_tags'> {
  tags?: EventTag[] // Combined processed tags (both auto and custom)
  autoTags?: EventTag[] // Only auto-generated tags (from rules)
  customTags?: EventTag[] // Only custom tags (manually assigned)
  isPublic?: boolean
  imageQuery: string // Fallback image query when no tag images are available
  rawAutoTags?: string[] | null // Original database tags field
  rawCustomTags?: string[] | null // Original database custom_tags field
}

// Event display variants from our database enum
export type EventDisplayVariant = 'minimal' | 'compact' | 'full'

// Helper function to convert database tag to EventTag
export function convertToEventTag(dbTag: Tag): EventTag {
  return {
    id: dbTag.id,
    slug: dbTag.slug,
    name: dbTag.name,
    color: dbTag.color,
    imageUrl: dbTag.image_url,
    classType: dbTag.class_type ? [dbTag.class_type] : null,
    audience: dbTag.audience,
    cta: dbTag.cta_label && dbTag.cta_url ? {
      label: dbTag.cta_label,
      url: dbTag.cta_url
    } : null,
    chip: {
      color: dbTag.color || '#6B7280' // Default gray color
    },
    priority: dbTag.priority,
    userId: dbTag.user_id || null
  }
}

// Helper function to generate image query from event data
export function generateImageQuery(event: Event): string {
  const parts = []
  
  if (event.title) parts.push(event.title)
  if (event.location) parts.push(event.location)
  if (event.tags && event.tags.length > 0) {
    parts.push(...event.tags.slice(0, 2)) // Add first 2 tags
  }
  
  return parts.join(' ').toLowerCase() || 'yoga class'
} 