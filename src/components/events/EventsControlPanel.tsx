'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TagBadge } from '@/components/ui/tag-badge'
import { Settings, Plus, ArrowLeftRight, RefreshCw, Zap } from 'lucide-react'
import { Tag as TagType } from '@/lib/types'
import { RematchTagsButton } from './RematchEventsButton'

export type VisibilityFilter = 'all' | 'public' | 'private'
export type TimeFilter = 'future' | 'all'

interface EventStats {
  total: number
  public: number
  private: number
}

interface EventsControlPanelProps {
  timeFilter: TimeFilter
  visibilityFilter: VisibilityFilter
  eventStats: EventStats
  userTags?: TagType[]
  globalTags?: TagType[]
  hasPendingChanges: boolean
  pendingChangesCount: number
  isSyncing: boolean
  isLoading: boolean
  userId?: string
  onTimeFilterChange: (filter: TimeFilter) => void
  onVisibilityFilterChange: (filter: VisibilityFilter) => void
  onCreateTag: () => void
  onSyncFeeds: () => void
  onRefresh: () => void
}

export default function EventsControlPanel({
  timeFilter,
  visibilityFilter,
  eventStats,
  userTags,
  globalTags,
  hasPendingChanges,
  pendingChangesCount,
  isSyncing,
  isLoading,
  userId,
  onTimeFilterChange,
  onVisibilityFilterChange,
  onCreateTag,
  onSyncFeeds,
  onRefresh
}: EventsControlPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Event Management
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
                All ({eventStats.total})
              </Button>
              <Button
                variant={visibilityFilter === 'public' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onVisibilityFilterChange('public')}
              >
                Public ({eventStats.public})
              </Button>
              <Button
                variant={visibilityFilter === 'private' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onVisibilityFilterChange('private')}
              >
                Private ({eventStats.private})
              </Button>
            </div>
          </div>
        </div>

        {/* Management Actions */}
        <div className="pt-4 border-t border-border">
          {hasPendingChanges && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <span className="font-medium">{pendingChangesCount} unsaved change{pendingChangesCount !== 1 ? 's' : ''}</span>
                {' '}• Use the floating action buttons to save or discard
              </p>
            </div>
          )}
          
          {/* Quick Actions Row */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onCreateTag}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Tag
            </Button>
            <Button 
              onClick={onRefresh}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Quick Fix Actions */}
          {userId && (
            <div className="border-t pt-3">
              <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Quick Actions (~1-3s)
              </p>
              <div className="flex flex-wrap gap-2">
                <RematchTagsButton 
                  userId={userId}
                  variant="outline" 
                  size="sm"
                />
                <Button 
                  onClick={onSyncFeeds}
                  disabled={isLoading || isSyncing}
                  variant="outline"
                  size="sm"
                >
                  <ArrowLeftRight className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-pulse' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Full Calendar Sync'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Fix event tags or download fresh calendar data (~15-30s for sync)
              </p>
            </div>
          )}
          
          {/* Available Tags */}
          {(userTags?.length || globalTags?.length) && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Available Tags:</p>
              <div className="flex flex-wrap gap-2">
                {userTags?.map(tag => (
                  <TagBadge 
                    key={tag.id} 
                    variant="safe"
                    color={tag.color}
                  >
                    {tag.name}
                  </TagBadge>
                ))}
                {globalTags?.map(tag => (
                  <TagBadge 
                    key={tag.id} 
                    variant="safe"
                    color={tag.color}
                  >
                    {tag.name}
                  </TagBadge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 