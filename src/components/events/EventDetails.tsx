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
        return 'text-sm font-medium text-foreground line-clamp-1'
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
        return 'text-xs text-muted-foreground'
      case 'full':
        return 'text-sm text-muted-foreground'
      case 'compact':
      default:
        return 'text-sm text-muted-foreground'
    }
  }

  const shouldShowIcons = variant !== 'minimal'

  return (
    <div className={cn('flex-1', className)}>
      <h3 className={getTitleClasses()}>
        {title || 'Untitled Event'}
      </h3>
      
      <div className={cn('space-y-1', variant === 'minimal' && 'space-y-0')}>
        {/* Date and Time */}
        <div className={cn('flex items-center', getMetaClasses())}>
          {shouldShowIcons && <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />}
          <span className="truncate">
            {dateTime}
          </span>
        </div>

        {/* Location */}
        {location && (
          <div className={cn('flex items-center', getMetaClasses())}>
            {shouldShowIcons && <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />}
            <span className="truncate">{location}</span>
          </div>
        )}
      </div>
    </div>
  )
} 