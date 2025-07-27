'use client'

import React from 'react'
import { Edit3 } from 'lucide-react'
import { EventCard } from './EventCard'
import { Button } from '@/components/ui/button'
import { EventTag, type EventDisplayVariant } from '@/lib/event-types'
import { Card } from '@/components/ui/card'

interface InteractiveEventCardProps {
  id: string
  title: string
  dateTime: string
  location: string | null
  imageQuery: string
  tags: EventTag[]
  isPublic?: boolean
  autoTags?: EventTag[]
  variant?: EventDisplayVariant
  availableTags?: EventTag[]
  onEdit?: (event: { id: string }) => void
  className?: string
}

export const InteractiveEventCard = React.memo<InteractiveEventCardProps>(
  ({
    id,
    title,
    dateTime,
    location,
    imageQuery,
    tags = [],
    isPublic = true,
    variant = 'compact',
    onEdit,
    className,
  }) => {

    const handleEdit = React.useCallback(() => {
      if (onEdit) {
        onEdit({ id })
      }
    }, [onEdit, id])

    return (
      <div className={`relative group ${className || ''}`}>
        {/* Edit Button */}
        {onEdit && (
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="outline"
              onClick={handleEdit}
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Card className="relative overflow-hidden">
          <EventCard
            id={id}
            title={title}
            dateTime={dateTime}
            location={location}
            imageQuery={imageQuery}
            tags={tags}
            variant={variant}
          />
          
          {/* Simple visibility indicator */}
          {!isPublic && (
            <div className="absolute bottom-2 right-2">
              <div className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                Private
              </div>
            </div>
          )}
        </Card>
      </div>
    )
  }
)

InteractiveEventCard.displayName = 'InteractiveEventCard' 