import React from 'react'
import { cn } from '@/lib/utils'
import { Calendar, MapPin } from 'lucide-react'
import { EventDisplayVariant } from '@/lib/event-types'

interface EventDetailsProps {
  title: string
  dateTime: string
  location: string | null
  variant?: EventDisplayVariant
  className?: string
}

export function EventDetails({
  title,
  dateTime,
  location,
  variant = 'compact',
  className
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



  return (
    <div className={cn('flex-1', className)}>
      <h3 className={getTitleClasses()}>
        {title || 'Untitled Event'}
      </h3>
      
      <div className="space-y-1">
        {/* Date and Time */}
        <div className={cn('flex items-center', getMetaClasses())}>
          <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">
            {dateTime}
          </span>
        </div>

        {/* Location */}
        {location && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center hover:text-primary transition-colors cursor-pointer',
              getMetaClasses()
            )}
            onClick={(e) => e.stopPropagation()} // Prevent card click when clicking location
          >
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </a>
        )}
      </div>
    </div>
  )
} 