'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { EventTag, EventDisplayVariant } from '@/lib/event-types'
import { EventCard } from './EventCard'
import { TagManagement } from './TagManagement'
import { Card } from '@/components/ui/card'

interface InteractiveEventCardProps {
  id: string
  title: string
  dateTime: string
  location: string | null
  imageQuery: string
  tags?: EventTag[]
  isPublic?: boolean
  autoTags?: EventTag[]
  variant?: EventDisplayVariant
  availableTags?: EventTag[]
  onUpdate?: (updates: {
    id: string
    tags: string[]
    visibility: string
  }) => void
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

    return (
      <Card className={`space-y-3 ${className || ''}`}>
        <EventCard
          id={id}
          title={title}
          dateTime={dateTime}
          location={location}
          imageQuery={imageQuery}
          tags={currentTags}
          variant={variant}
        />

        <div
          className={`border-t border-border ${variant === 'full' ? 'pt-4' : 'pt-3'}`}
        />

        <TagManagement
          currentTags={currentTags}
          availableTags={availableTags}
          onTagsUpdate={handleTagUpdate}
          publicStatus={publicStatus}
          onVisibilityChange={handleVisibilityChange}
        />
      </Card>
    )
  }
)

InteractiveEventCard.displayName = 'InteractiveEventCard' 