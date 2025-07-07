'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ImageGallery } from './ImageGallery'
import { EventDetails } from './EventDetails'
import TagList from './TagList'
import { EventTag, EventDisplayVariant } from '@/lib/event-types'
import { styleUtils } from '@/lib/design-system'

interface EventCardProps {
  id: string
  title: string
  dateTime: string
  location: string | null
  imageQuery: string
  tags?: EventTag[]
  variant?: EventDisplayVariant
  className?: string
  onClick?: () => void
  onVariantChange?: (newVariant: EventDisplayVariant) => void
  // Optional props from EnhancedDisplayEvent that aren't used in visual display
  isPublic?: boolean
  autoTags?: EventTag[]
  customTags?: EventTag[]
}

export const EventCard = React.memo<EventCardProps>(
  ({
    // id, // Removed for now, can be added back when needed
    title,
    dateTime,
    location,
    imageQuery,
    tags = [],
    variant = 'compact',
    className,
    onClick,
    onVariantChange,
  }) => {
    // Get all image URLs from tags
    const imageUrls = tags
      .filter((tag) => tag.imageUrl)
      .map((tag) => tag.imageUrl!)
      .filter(Boolean)

    // Add the default imageQuery if no tag images are available
    const allImages = imageUrls.length > 0 ? imageUrls : [imageQuery]

    // Get unique class types and audience levels from tags
    const classTypes = [
      ...new Set(
        tags
          .flatMap((tag) => tag.classType || [])
          .filter((type): type is string => type !== null && type !== '')
      ),
    ]
    
    const audienceLevels = [
      ...new Set(
        tags
          .map((tag) => tag.audience)
          .filter((audience): audience is string[] => audience !== null)
          .flat()
      ),
    ]
    
    const ctaTag = tags.find((tag) => tag.cta)

    // Variant-specific styling
    const getCardClasses = () => {
      const baseClasses = cn(
        'group relative overflow-hidden',
        styleUtils.transition,
        onClick && 'cursor-pointer hover:shadow-lg',
        onClick && styleUtils.focusRing
      )

      switch (variant) {
        case 'minimal':
          return cn(baseClasses, 'p-3 sm:p-4') // Same padding as compact
        case 'full':
          return cn(baseClasses, 'p-4 sm:p-6')
        case 'compact':
        default:
          return cn(baseClasses, 'p-3 sm:p-4')
      }
    }

    const getImageContainerClasses = () => {
      switch (variant) {
        case 'minimal':
          return 'relative mb-2 h-32 sm:h-40'
        case 'full':
          return 'relative mb-4 h-48 sm:h-56'
        case 'compact':
        default:
          return 'relative mb-3 h-40 sm:h-48'
      }
    }

    // Check if we should show image based on variant and screen size
    const shouldShowImage = variant !== 'minimal'

    const handleClick = () => {
      if (onVariantChange) {
        // Toggle between minimal and compact
        if (variant === 'minimal') {
          onVariantChange('compact')
        } else if (variant === 'compact') {
          onVariantChange('minimal')
        } else if (onClick) {
          onClick()
        }
      } else if (onClick) {
        onClick()
      }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (onClick && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault()
        onClick()
      }
    }

    return (
      <Card
        variant="default"
        padding="none"
        interactive={!!(onClick || onVariantChange)}
        className={cn(getCardClasses(), className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        aria-label={onClick ? `View details for ${title}` : undefined}
      >
        {shouldShowImage && (
          <div className={getImageContainerClasses()}>
            <ImageGallery images={allImages} title={title} />

            {/* Tag Lists Overlay - Bottom Left */}
            {(variant === 'compact' || variant === 'full') &&
              (classTypes.length > 0 || audienceLevels.length > 0) && (
                <div className="absolute bottom-10 left-3 space-y-1">
                  {classTypes.length > 0 && (
                    <TagList
                      tags={classTypes}
                      variant="purple"
                      layout="overlay"
                      showLabel={false}
                      maxTags={2}
                    />
                  )}
                  {audienceLevels.length > 0 && (
                    <TagList
                      tags={audienceLevels}
                      variant="blue"
                      layout="overlay"
                      showLabel={false}
                      maxTags={2}
                    />
                  )}
                </div>
              )}

            {/* CTA Button - Bottom Right (for compact/full variants) */}
            {ctaTag?.cta && (
              <div className="absolute bottom-4 right-3">
                <Button
                  size="sm"
                  variant="default"
                  asChild
                  style={{
                    backgroundColor: ctaTag.chip.color,
                    borderColor: ctaTag.chip.color,
                    color: '#FFFFFF',
                  }}
                  className="shadow-lg hover:shadow-xl"
                >
                  <a
                    href={ctaTag.cta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // Prevent card click when clicking CTA
                  >
                    {ctaTag.cta.label}
                  </a>
                </Button>
              </div>
            )}
          </div>
        )}

        <EventDetails
          title={title}
          dateTime={dateTime}
          location={location}
          variant={variant}
        />

        {/* CTA Button for minimal variant - Top right corner (only on hover) */}
        {variant === 'minimal' && ctaTag?.cta && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="default"
              asChild
              style={{
                backgroundColor: ctaTag.chip.color,
                borderColor: ctaTag.chip.color,
                color: '#FFFFFF',
              }}
              className="shadow-sm hover:shadow-md text-xs"
            >
              <a
                href={ctaTag.cta.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking CTA
              >
                {ctaTag.cta.label}
              </a>
            </Button>
          </div>
        )}
      </Card>
    )
  }
)

EventCard.displayName = 'EventCard' 