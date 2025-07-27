'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Edit3 } from 'lucide-react'
import { EventCard } from './EventCard'
import { Button } from '@/components/ui/button'
import { EventTag, type EventDisplayVariant } from '@/lib/event-types'
import { TagManagement } from '@/components/tags/TagManagement'
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
  onUpdate?: (updates: {
    id: string
    tags: string[]
    visibility: string
  }) => void
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
    autoTags = [],
    variant = 'compact',
    availableTags = [],
    onUpdate,
    onEdit,
    className,
  }) => {
    const [currentTags, setCurrentTags] = useState<EventTag[]>(tags)
    const [publicStatus, setPublicStatus] = useState<boolean>(isPublic)

    // Update local state when props change
    useEffect(() => {
      if (tags && tags.length > 0) {
        setCurrentTags(tags)
      }
    }, [tags])

    useEffect(() => {
      setPublicStatus(isPublic)
    }, [isPublic])

    // Helper function to send updates (called only when user makes changes)
    const sendUpdate = useCallback((newTags?: EventTag[], newPublicStatus?: boolean) => {
      if (onUpdate) {
        const tagsToUse = newTags || currentTags
        const statusToUse = newPublicStatus !== undefined ? newPublicStatus : publicStatus
        
        // Only send custom tags (filter out auto-generated ones)
        const autoTagSlugs = autoTags.map((tag) => tag.slug).filter((slug): slug is string => slug !== null)
        const customTagSlugs = tagsToUse
          .map((tag) => tag.slug)
          .filter((slug): slug is string => slug !== null)
          .filter((slug) => !autoTagSlugs.includes(slug))

        onUpdate({
          id,
          tags: customTagSlugs,
          visibility: statusToUse ? 'public' : 'private',
        })
      }
    }, [currentTags, publicStatus, id, onUpdate, autoTags])

    const handleTagUpdate = useCallback((updatedTags: EventTag[]) => {
      setCurrentTags(updatedTags)
      sendUpdate(updatedTags)
    }, [sendUpdate])

    const handleVisibilityChange = useCallback((isPublic: boolean) => {
      setPublicStatus(isPublic)
      sendUpdate(undefined, isPublic)
    }, [sendUpdate])

    const handleEdit = useCallback(() => {
      if (onEdit) {
        onEdit({ id })
      }
    }, [onEdit, id])

    return (
      <div className={`relative group ${className || ''}`}>
        {/* Edit Button */}
        {onEdit && (
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
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

        <Card className="relative">
          <EventCard
            id={id}
            title={title}
            dateTime={dateTime}
            location={location}
            imageQuery={imageQuery}
            tags={currentTags}
            variant={variant}
          />
          
          <TagManagement
            currentTags={currentTags}
            availableTags={availableTags}
            onTagsUpdate={handleTagUpdate}
            publicStatus={publicStatus}
            onVisibilityChange={handleVisibilityChange}
          />
        </Card>
      </div>
    )
  }
)

InteractiveEventCard.displayName = 'InteractiveEventCard' 