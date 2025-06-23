'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Plus } from 'lucide-react'
import { VisibilityFilter, TimeFilter } from './EventsFilter'

interface EventsEmptyStateProps {
  totalEventsCount: number
  timeFilter: TimeFilter
  visibilityFilter: VisibilityFilter
  onChangeVisibilityFilter: (filter: VisibilityFilter) => void
  onChangeTimeFilter: (filter: TimeFilter) => void
}

export default function EventsEmptyState({
  totalEventsCount,
  timeFilter,
  visibilityFilter,
  onChangeVisibilityFilter,
  onChangeTimeFilter
}: EventsEmptyStateProps) {
  const isNoEventsAtAll = totalEventsCount === 0

  return (
    <Card>
      <CardContent className="py-12">
        <div className="text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {isNoEventsAtAll ? "No events found" : "No events match your filters"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {isNoEventsAtAll 
              ? "Connect your calendar feeds to start importing events."
              : timeFilter === 'future' && visibilityFilter !== 'all'
                ? `Try changing your filters to see ${visibilityFilter === 'public' ? 'private' : 'public'} events or past events.`
                : timeFilter === 'future'
                  ? "Try changing the time filter to see all events including past ones."
                  : "Try changing the visibility filter to see all events."
            }
          </p>
          {isNoEventsAtAll ? (
            <Button asChild>
              <a href="/app/add-calendar">
                <Plus className="h-4 w-4 mr-2" />
                Add Calendar Feed
              </a>
            </Button>
          ) : (
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => onChangeVisibilityFilter('all')}>
                Show All Visibility
              </Button>
              <Button variant="outline" onClick={() => onChangeTimeFilter('all')}>
                Show All Time
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 