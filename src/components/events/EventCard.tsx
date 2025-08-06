'use client'

import React, { useRef, useCallback } from 'react'
import {cn} from '@/lib/utils'
import {Card} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {EventDetails, ImageGallery} from '@/components'
import TagList from '@/components/tags/TagList'
import {EventDisplayVariant, EventTag} from '@/lib/event-types'
import {styleUtils} from '@/lib/design-system'

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
    id,
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
    const cardRef = useRef<HTMLDivElement>(null)

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

    // Enhanced keyboard navigation
    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
      if (!onClick && !onVariantChange) return

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (onClick) {
            onClick()
          } else if (onVariantChange) {
            // Toggle between minimal and compact
            if (variant === 'minimal') {
              onVariantChange('compact')
            } else if (variant === 'compact') {
              onVariantChange('minimal')
            }
          }
          break
        case 'Escape':
          // Return focus to the card if it was lost
          cardRef.current?.focus()
          break
      }
    }, [onClick, onVariantChange, variant])

    // Click zone handler for variant toggling
    const handleCardClick = useCallback((e: React.MouseEvent) => {
      // Don't toggle if clicking on interactive elements
      const target = e.target as HTMLElement
      if (
        target.closest('a') || // Links (location, CTA)
        target.closest('button') || // Buttons (image nav, CTA)
        target.closest('[role="tab"]') || // Image indicators
        target.closest('[role="tablist"]') || // Image navigation
        target.closest('[role="region"]') // Image gallery region
      ) {
        return // Let the interactive element handle the click
      }
      
      // Toggle variant only when clicking on non-interactive areas
      if (onVariantChange) {
        if (variant === 'minimal') {
          onVariantChange('compact')
        } else if (variant === 'compact') {
          onVariantChange('minimal')
        }
      } else if (onClick) {
        onClick()
      }
    }, [onVariantChange, onClick, variant])

    // Variant-specific styling
    const getCardClasses = () => {
      const baseClasses = cn(
        'group relative overflow-hidden',
        styleUtils.transition,
        (onClick || onVariantChange) && 'cursor-pointer hover:shadow-lg',
        (onClick || onVariantChange) && styleUtils.focusRing
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

    // Generate accessible descriptions
    const generateCardDescription = () => {
      const parts = []
      
      if (classTypes.length > 0) {
        parts.push(`Class types: ${classTypes.join(', ')}`)
      }
      
      if (audienceLevels.length > 0) {
        parts.push(`Audience: ${audienceLevels.join(', ')}`)
      }
      
      if (location) {
        parts.push(`Location: ${location}`)
      }
      
      if (ctaTag?.cta) {
        parts.push(`Call to action: ${ctaTag.cta.label}`)
      }
      
      return parts.join('. ')
    }

    const cardDescription = generateCardDescription()
    const isInteractive = !!(onClick || onVariantChange)
    const cardLabel = isInteractive 
      ? `View details for ${title}. ${cardDescription}`
      : `${title}. ${cardDescription}`

    return (
      <Card
        ref={cardRef}
        variant="default"
        padding="none"
        interactive={isInteractive}
        className={cn(getCardClasses(), className)}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? 'button' : 'article'}
        aria-label={cardLabel}
        aria-describedby={cardDescription ? `card-description-${id}` : undefined}
        aria-expanded={isInteractive ? undefined : false}
      >
        {shouldShowImage && (
          <div className={getImageContainerClasses()}>
            <ImageGallery 
              images={allImages} 
              title={title}
              cardId={id}
            />

            {/* Tag Lists Overlay - Bottom Left */}
            {(variant === 'compact' || variant === 'full') &&
              (classTypes.length > 0 || audienceLevels.length > 0) && (
                <div 
                  className="absolute bottom-10 left-3 space-y-1"
                  aria-label="Event categories"
                >
                  {classTypes.length > 0 && (
                    <TagList
                      tags={classTypes}
                      variant="purple"
                      layout="overlay"
                      showLabel={false}
                      maxTags={2}
                      ariaLabel="Class types"
                    />
                  )}
                  {audienceLevels.length > 0 && (
                    <TagList
                      tags={audienceLevels}
                      variant="blue"
                      layout="overlay"
                      showLabel={false}
                      maxTags={2}
                      ariaLabel="Audience levels"
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
                  aria-label={`${ctaTag.cta.label} - opens in new tab`}
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
          cardId={id}
        />

        {/* Hidden description for screen readers */}
        {cardDescription && (
          <div 
            id={`card-description-${id}`}
            className="sr-only"
            aria-live="polite"
          >
            {cardDescription}
          </div>
        )}

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
              aria-label={`${ctaTag.cta.label} - opens in new tab`}
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