import React from 'react'
import { cn } from '@/lib/utils'
import { TagBadge } from '@/components/ui/tag-badge'

interface TagListProps {
  tags: string[]
  variant?: 'purple' | 'blue' | 'green' | 'red' | 'yellow' | 'gray'
  layout?: 'inline' | 'overlay' | 'stacked'
  showLabel?: boolean
  label?: string
  maxTags?: number
  className?: string
  ariaLabel?: string
}

export default function TagList({
  tags,
  variant = 'gray',
  layout = 'inline',
  showLabel = true,
  label,
  maxTags = 3,
  className,
  ariaLabel
}: TagListProps) {
  if (!tags || tags.length === 0) return null

  const displayTags = tags.slice(0, maxTags)
  const hasMoreTags = tags.length > maxTags

  // Get layout-specific container styles
  const getContainerClasses = () => {
    switch (layout) {
      case 'overlay':
        return 'flex flex-wrap gap-1'
      case 'stacked':
        return 'flex flex-col gap-1'
      case 'inline':
      default:
        return 'flex flex-wrap gap-1'
    }
  }

  const defaultLabel = variant === 'purple' ? 'Class Types' : 
                      variant === 'blue' ? 'Audience' : 'Tags'

  // Generate accessible description
  const generateTagDescription = () => {
    if (displayTags.length === 0) return ''
    
    const tagList = displayTags.join(', ')
    const moreInfo = hasMoreTags ? ` and ${tags.length - maxTags} more` : ''
    return `${displayTags.length} ${ariaLabel || defaultLabel.toLowerCase()}: ${tagList}${moreInfo}`
  }

  const tagDescription = generateTagDescription()

  return (
    <div 
      className={cn(className)}
      role="list"
      aria-label={ariaLabel || defaultLabel}
      aria-describedby={tagDescription ? `tag-description-${tags.join('-').replace(/\s+/g, '-')}` : undefined}
    >
      {showLabel && (
        <span className={cn(
          'text-xs font-medium text-muted-foreground mb-1',
          layout === 'overlay' ? 'text-white/80' : '',
          layout === 'stacked' ? 'block' : 'mr-2'
        )}>
          {label || defaultLabel}:
        </span>
      )}
      
      <div className={getContainerClasses()}>
        {displayTags.map((tag, index) => (
          <TagBadge
            key={`${tag}-${index}`}
            variant={variant}
            layout={layout}
            role="listitem"
          >
            {tag}
          </TagBadge>
        ))}
        
        {hasMoreTags && (
          <TagBadge
            variant={variant}
            layout={layout}
            className="opacity-75"
            role="listitem"
            aria-label={`${tags.length - maxTags} more ${ariaLabel || defaultLabel.toLowerCase()}`}
          >
            +{tags.length - maxTags}
          </TagBadge>
        )}
      </div>

      {/* Hidden description for screen readers */}
      {tagDescription && (
        <div 
          id={`tag-description-${tags.join('-').replace(/\s+/g, '-')}`}
          className="sr-only"
          aria-live="polite"
        >
          {tagDescription}
        </div>
      )}
    </div>
  )
} 