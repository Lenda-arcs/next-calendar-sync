'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EventDisplayVariant } from '@/lib/event-types'
import { PublicEventListSkeleton, DashboardUpcomingClassesSkeleton } from '@/components/ui/skeleton'

interface EventListEmptyStateProps {
  className?: string
  isInteractive?: boolean
  hasActiveFilters?: boolean
  onClearFilters?: () => void
  totalEventsCount?: number
}

export const EventListEmptyState: React.FC<EventListEmptyStateProps> = ({
  className,
  isInteractive = false,
  hasActiveFilters = false,
  onClearFilters,
  totalEventsCount = 0
}) => {
  const title = totalEventsCount === 0 
    ? "No upcoming events"
    : "No events match your filters"
  
  const description = totalEventsCount === 0
    ? isInteractive
      ? "Set up your yoga calendar to start importing events."
      : "Check back later for new classes and sessions."
    : "Try adjusting your filters to see more events."

  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <Card className="p-8 text-center max-w-md mx-auto">
        <CardContent className="pt-6">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {title}
          </h3>
          <p className="text-muted-foreground mb-6">
            {description}
          </p>
          {hasActiveFilters && onClearFilters && (
            <Button onClick={onClearFilters} variant="outline">
              Clear All Filters
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface EventListSkeletonProps {
  variant?: EventDisplayVariant
  useCompactSkeleton?: boolean
}

export const EventListSkeleton: React.FC<EventListSkeletonProps> = ({
  variant = 'compact',
  useCompactSkeleton = false
}) => {
  if (useCompactSkeleton) {
    return <DashboardUpcomingClassesSkeleton />
  }
  
  return <PublicEventListSkeleton variant={variant} />
}

interface EventListErrorStateProps {
  error: string
  className?: string
  onRetry?: () => void
}

export const EventListErrorState: React.FC<EventListErrorStateProps> = ({
  error,
  className,
  onRetry
}) => {
  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <div className="text-center">
        <p className="text-destructive mb-2">Failed to load events</p>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
} 