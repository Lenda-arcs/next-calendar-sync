'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TagLibraryItem } from '@/components/tags'
import { TagViewDialog } from '@/components/tags/TagViewDialog'
import { Settings, Plus, ArrowLeftRight, RefreshCw, Zap, Tag } from 'lucide-react'
import { Tag as TagType } from '@/lib/types'
import { EventTag } from '@/lib/event-types'
import { RematchTagsButton } from './RematchEventsButton'
import { useTranslation } from '@/lib/i18n/context'
import { StudioInfo } from '@/lib/hooks/useEventFilters'

export type VisibilityFilter = 'all' | 'public' | 'private'
export type TimeFilter = 'future' | 'all' | 'past' | 'today' | 'week' | 'month'

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
  isSyncing: boolean
  isLoading: boolean
  userId?: string
  // Updated filter props - only studio filters now
  studioFilter?: string[]
  availableStudioInfo?: StudioInfo[]
  onTimeFilterChange: (filter: TimeFilter) => void
  onVisibilityFilterChange: (filter: VisibilityFilter) => void
  onStudioFilterChange?: (studioIds: string[]) => void
  onClearAllFilters?: () => void
  onCreateTag: () => void
  onCreateEvent: () => void
  onSyncFeeds: () => void
  onRefresh: () => void
}

export default function EventsControlPanel({
  timeFilter,
  visibilityFilter,
  eventStats,
  userTags,
  globalTags,
  isSyncing,
  isLoading,
  userId,
  // Updated filter props - only studio filters now
  studioFilter = [],
  availableStudioInfo,
  onTimeFilterChange,
  onVisibilityFilterChange,
  onStudioFilterChange,
  onClearAllFilters,
  onCreateTag,
  onCreateEvent,
  onSyncFeeds,
  onRefresh
}: EventsControlPanelProps) {
  const { t } = useTranslation()
  
  // Tag view dialog state
  const [selectedTag, setSelectedTag] = React.useState<EventTag | null>(null)
  const [isTagDialogOpen, setIsTagDialogOpen] = React.useState(false)

  // Transform database tags to EventTag format for TagLibraryItem
  const transformToEventTag = (tag: TagType) => ({
    id: tag.id,
    slug: tag.slug,
    name: tag.name,
    color: tag.color,
    chip: { color: tag.color || '#6B7280' },
    classType: tag.class_type ? [tag.class_type] : null,
    audience: tag.audience,
    cta: tag.cta_label && tag.cta_url ? { label: tag.cta_label, url: tag.cta_url } : null,
    priority: tag.priority,
    userId: tag.user_id,
    imageUrl: tag.image_url
  })

  // Handle tag click to open view dialog
  const handleTagClick = (tag: TagType) => {
    const eventTag = transformToEventTag(tag)
    setSelectedTag(eventTag)
    setIsTagDialogOpen(true)
  }

  // Handle closing tag view dialog
  const handleTagDialogClose = () => {
    setIsTagDialogOpen(false)
    setSelectedTag(null)
  }

  // Handle tag edit - for now just close dialog and open create tag form
  const handleTagEdit = () => {
    setIsTagDialogOpen(false)
    setSelectedTag(null)
    onCreateTag() // This will open the create tag form
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t('pages.manageEvents.controlPanel.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Controls */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{t('pages.manageEvents.controlPanel.timeLabel')}</span>
            <div className="flex flex-wrap gap-1">
              <Button
                variant={timeFilter === 'future' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTimeFilterChange('future')}
              >
                {t('pages.manageEvents.controlPanel.futureEvents')}
              </Button>
              <Button
                variant={timeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTimeFilterChange('all')}
              >
                {t('pages.manageEvents.controlPanel.allEvents')}
              </Button>
              <Button
                variant={timeFilter === 'today' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTimeFilterChange('today')}
              >
                Today
              </Button>
              <Button
                variant={timeFilter === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTimeFilterChange('week')}
              >
                This Week
              </Button>
              <Button
                variant={timeFilter === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTimeFilterChange('month')}
              >
                This Month
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{t('pages.manageEvents.controlPanel.visibilityLabel')}</span>
            <div className="flex flex-wrap gap-1">
              <Button
                variant={visibilityFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onVisibilityFilterChange('all')}
              >
                {t('pages.manageEvents.controlPanel.allVisibility', { count: eventStats.total.toString() })}
              </Button>
              <Button
                variant={visibilityFilter === 'public' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onVisibilityFilterChange('public')}
              >
                {t('pages.manageEvents.controlPanel.publicVisibility', { count: eventStats.public.toString() })}
              </Button>
              <Button
                variant={visibilityFilter === 'private' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onVisibilityFilterChange('private')}
              >
                {t('pages.manageEvents.controlPanel.privateVisibility', { count: eventStats.private.toString() })}
              </Button>
            </div>
          </div>

          {/* Studio Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Studio</span>
            <div className="flex flex-wrap gap-1">
              {availableStudioInfo && availableStudioInfo.length > 0 ? (
                <>
                  {availableStudioInfo.slice(0, 3).map(studio => (
                    <Button
                      key={studio.id}
                      variant={studioFilter.includes(studio.id) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        const newStudioIds = studioFilter.includes(studio.id)
                          ? studioFilter.filter(s => s !== studio.id)
                          : [...studioFilter, studio.id]
                        onStudioFilterChange?.(newStudioIds)
                      }}
                    >
                      {studio.name}
                    </Button>
                  ))}
                  {availableStudioInfo.length > 3 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // For now, just show all studios
                        onStudioFilterChange?.(availableStudioInfo.map(s => s.id))
                      }}
                    >
                      +{availableStudioInfo.length - 3} more
                    </Button>
                  )}
                </>
              ) : isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Loading studios...
                </div>
              ) : null}
            </div>
          </div>

          {/* Clear Filters Button */}
          {onClearAllFilters && (studioFilter.length > 0) && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Management Actions */}
        <div className="pt-4 border-t border-border space-y-4">
          
          {/* Primary Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('pages.manageEvents.controlPanel.createAndManage')}
            </h4>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="default" 
                size="sm"
                onClick={onCreateEvent}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('pages.manageEvents.controlPanel.newEvent')}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onCreateTag}
              >
                <Tag className="h-4 w-4 mr-2" />
                {t('pages.manageEvents.controlPanel.newTag')}
              </Button>
              <Button 
                onClick={onRefresh}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {t('pages.manageEvents.controlPanel.refresh')}
              </Button>
            </div>
          </div>

          {/* System Actions */}
          {userId && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Zap className="h-4 w-4" />
                {t('pages.manageEvents.controlPanel.systemTools')}
              </h4>
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
                  {isSyncing ? t('pages.manageEvents.controlPanel.syncing') : t('pages.manageEvents.controlPanel.syncCalendar')}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('pages.manageEvents.controlPanel.syncDescription')}
              </p>
            </div>
          )}
          
          {/* Available Tags */}
          {(userTags?.length || globalTags?.length) && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">{t('pages.manageEvents.controlPanel.availableTags')}</h4>
              <div className="flex flex-wrap gap-2">
                {userTags?.map(tag => (
                  <TagLibraryItem 
                    key={tag.id} 
                    tag={transformToEventTag(tag)}
                    variant="compact"
                    onClick={() => handleTagClick(tag)}
                  />
                ))}
                {globalTags?.map(tag => (
                  <TagLibraryItem 
                    key={tag.id} 
                    tag={transformToEventTag(tag)}
                    variant="compact"
                    isGlobal={true}
                    onClick={() => handleTagClick(tag)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Tag View Dialog */}
      {selectedTag && (
        <TagViewDialog
          tag={selectedTag}
          isOpen={isTagDialogOpen}
          onClose={handleTagDialogClose}
          onEdit={handleTagEdit}
          canEdit={false} 
        />
      )}
    </Card>
  )
} 