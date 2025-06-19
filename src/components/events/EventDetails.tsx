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
  // Format the date time
  const formatDateTime = (dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr)
      const now = new Date()
      const isToday = date.toDateString() === now.toDateString()
      const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString()
      
      let dateStr = ''
      if (isToday) {
        dateStr = 'Today'
      } else if (isTomorrow) {
        dateStr = 'Tomorrow'
      } else {
        dateStr = date.toLocaleDateString(undefined, { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      }
      
      const timeStr = date.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
      
      return { dateStr, timeStr, fullDate: date }
    } catch {
      return { dateStr: 'Invalid date', timeStr: '', fullDate: null }
    }
  }

  const { dateStr, timeStr } = formatDateTime(dateTime)

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
            {dateStr}
            {timeStr && (
              <>
                {variant === 'minimal' ? ' • ' : ' at '}
                {timeStr}
              </>
            )}
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