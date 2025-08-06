import React from 'react'
import { cn } from '@/lib/utils'
import { Calendar, MapPin } from 'lucide-react'
import { EventDisplayVariant } from '@/lib/event-types'

// Studio information interface (matching FilterProvider)
interface StudioInfo {
  id: string
  name: string
  address?: string
  eventCount?: number
  hasEventsInFilter?: boolean
  isVerified?: boolean
  hasStudioProfile?: boolean
}

interface EventDetailsProps {
  title: string
  dateTime: string
  location: string | null
  variant?: EventDisplayVariant
  className?: string
  cardId?: string
  studioInfo?: StudioInfo[]
  studioId?: string | null // Add studio ID for reliable matching
}

export function EventDetails({
  title,
  dateTime,
  location,
  variant = 'compact',
  className,
  cardId,
  studioInfo = [],
  studioId
}: EventDetailsProps) {
  // The dateTime is already formatted by the parent component
  // No need to reformat it here

  // Variant-specific styling
  const getTitleClasses = () => {
    switch (variant) {
      case 'minimal':
        return 'text-base font-semibold text-foreground mb-1 line-clamp-2' // Same as compact
      case 'full':
        return 'text-xl font-semibold text-foreground mb-2 line-clamp-2'
      case 'compact':
      default:
        return 'text-base font-semibold text-foreground mb-1 line-clamp-2'
    }
  }

  const getMetaClasses = () => {
    switch (variant) {
      case 'minimal':
        return 'text-sm text-muted-foreground' // Same as compact
      case 'full':
        return 'text-sm text-muted-foreground'
      case 'compact':
      default:
        return 'text-sm text-muted-foreground'
    }
  }

  // Generate accessible IDs
  const titleId = cardId ? `event-title-${cardId}` : undefined
  const dateTimeId = cardId ? `event-datetime-${cardId}` : undefined
  const locationId = cardId ? `event-location-${cardId}` : undefined

  // Determine display location - use studio name if available, fallback to full location
  const getDisplayLocation = () => {
    if (!location) return null

    // Use studio ID for reliable matching (same approach as FilterProvider)
    if (studioId && studioInfo.length > 0) {
      const matchingStudio = studioInfo.find(studio => studio.id === studioId)
      
      if (matchingStudio) {
        return {
          displayText: matchingStudio.name,
          fullAddress: location, // Keep full address for Google Maps link
          isStudio: true
        }
      }
    }

    // Fallback to full location text
    return {
      displayText: location,
      fullAddress: location,
      isStudio: false
    }
  }

  const displayLocation = getDisplayLocation()

  return (
    <div className={cn('flex-1', className)}>
      <h3 
        className={getTitleClasses()}
        id={titleId}
      >
        {title || 'Untitled Event'}
      </h3>
      
      <div className="space-y-1">
        {/* Date and Time */}
        <div 
          className={cn('flex items-center', getMetaClasses())}
          id={dateTimeId}
          aria-label={`Event date and time: ${dateTime}`}
        >
          <Calendar className="h-3 w-3 mr-1 flex-shrink-0" aria-hidden="true" />
          <span className="truncate">
            {dateTime}
          </span>
        </div>

        {/* Location */}
        {displayLocation && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayLocation.fullAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center hover:text-primary transition-colors cursor-pointer',
              getMetaClasses()
            )}
            onClick={(e) => e.stopPropagation()} // Prevent card click when clicking location
            id={locationId}
            aria-label={`Event location: ${displayLocation.displayText}${displayLocation.isStudio ? ` (${displayLocation.fullAddress})` : ''}. Opens Google Maps in new tab.`}
          >
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{displayLocation.displayText}</span>
          </a>
        )}
      </div>
    </div>
  )
} 