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
}

export default function TagList({
  tags,
  variant = 'gray',
  layout = 'inline',
  showLabel = true,
  label,
  maxTags = 3,
  className
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

  return (
    <div className={cn(className)}>
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
          >
            {tag}
          </TagBadge>
        ))}
        
        {hasMoreTags && (
          <TagBadge
            variant={variant}
            layout={layout}
            className="opacity-75"
          >
            +{tags.length - maxTags}
          </TagBadge>
        )}
      </div>
    </div>
  )
} 