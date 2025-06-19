import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

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

  // Get variant-specific styles
  const getVariantClasses = () => {
    switch (variant) {
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800'
      case 'gray':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
    }
  }

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

  // Get layout-specific tag styles
  const getTagClasses = () => {
    const baseClasses = cn(
      'text-xs font-medium px-2 py-1 rounded-full border',
      getVariantClasses()
    )

    switch (layout) {
      case 'overlay':
        return cn(baseClasses, 'bg-black/60 text-white border-white/20 backdrop-blur-sm')
      case 'stacked':
      case 'inline':
      default:
        return baseClasses
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
          <Badge
            key={`${tag}-${index}`}
            variant="outline"
            className={getTagClasses()}
          >
            {tag}
          </Badge>
        ))}
        
        {hasMoreTags && (
          <Badge
            variant="outline"
            className={cn(getTagClasses(), 'opacity-75')}
          >
            +{tags.length - maxTags}
          </Badge>
        )}
      </div>
    </div>
  )
} 