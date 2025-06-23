'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Filter, Calendar, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export type VisibilityFilter = 'all' | 'public' | 'private'
export type TimeFilter = 'future' | 'all'

interface EventStats {
  total: number
  public: number
  private: number
}

interface EventsFilterProps {
  timeFilter: TimeFilter
  visibilityFilter: VisibilityFilter
  eventStats: EventStats
  onTimeFilterChange: (filter: TimeFilter) => void
  onVisibilityFilterChange: (filter: VisibilityFilter) => void
}

export default function EventsFilter({
  timeFilter,
  visibilityFilter,
  eventStats,
  onTimeFilterChange,
  onVisibilityFilterChange
}: EventsFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Controls */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Time:</span>
            <div className="flex flex-wrap gap-1">
              <Button
                variant={timeFilter === 'future' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTimeFilterChange('future')}
              >
                Future Events
              </Button>
              <Button
                variant={timeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTimeFilterChange('all')}
              >
                All Events
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Visibility:</span>
            <div className="flex flex-wrap gap-1">
              <Button
                variant={visibilityFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onVisibilityFilterChange('all')}
              >
                All <span className="md:hidden">({eventStats.total})</span>
              </Button>
              <Button
                variant={visibilityFilter === 'public' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onVisibilityFilterChange('public')}
              >
                Public Only <span className="md:hidden">({eventStats.public})</span>
              </Button>
              <Button
                variant={visibilityFilter === 'private' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onVisibilityFilterChange('private')}
              >
                Private Only <span className="md:hidden">({eventStats.private})</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats - Hidden on mobile */}
        <div className="hidden md:grid grid-cols-3 gap-4 pt-2 border-t border-border">
          <div 
            className={cn(
              "p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md",
              visibilityFilter === 'all' 
                ? "bg-blue-50 border-blue-200 ring-2 ring-blue-500 ring-opacity-50" 
                : "bg-muted/50 hover:bg-muted"
            )}
            onClick={() => onVisibilityFilterChange('all')}
          >
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{eventStats.total}</p>
              </div>
            </div>
          </div>

          <div 
            className={cn(
              "p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md",
              visibilityFilter === 'public' 
                ? "bg-green-50 border-green-200 ring-2 ring-green-500 ring-opacity-50" 
                : "bg-muted/50 hover:bg-muted"
            )}
            onClick={() => onVisibilityFilterChange('public')}
          >
            <div className="flex items-center space-x-3">
              <Eye className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Public</p>
                <p className="text-2xl font-bold">{eventStats.public}</p>
              </div>
            </div>
          </div>

          <div 
            className={cn(
              "p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md",
              visibilityFilter === 'private' 
                ? "bg-orange-50 border-orange-200 ring-2 ring-orange-500 ring-opacity-50" 
                : "bg-muted/50 hover:bg-muted"
            )}
            onClick={() => onVisibilityFilterChange('private')}
          >
            <div className="flex items-center space-x-3">
              <EyeOff className="h-6 w-6 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Private</p>
                <p className="text-2xl font-bold">{eventStats.private}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 