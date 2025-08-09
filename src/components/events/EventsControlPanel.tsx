'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TagLibraryItem } from '@/components/tags'
import { TagViewDialog } from '@/components/tags/TagViewDialog'
import { Settings, Plus, ArrowLeftRight, Tag, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { Tag as TagType } from '@/lib/types'
import { EventTag } from '@/lib/event-types'
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
  studioFilter?: string[]
  availableStudioInfo?: StudioInfo[]
  onTimeFilterChange: (filter: TimeFilter) => void
  onVisibilityFilterChange: (filter: VisibilityFilter) => void
  onStudioFilterChange?: (studioIds: string[]) => void
  onClearAllFilters?: () => void
  onCreateTag: () => void
  onCreateEvent: () => void
  onSyncFeeds: () => void
}

// Helper function to get time filter display text
const getTimeFilterText = (filter: TimeFilter): string => {
  switch (filter) {
    case 'future': return 'Future'
    case 'all': return 'All'
    case 'week': return 'This Week'
    case 'month': return 'This Month'
    case 'past': return 'Past'
    case 'today': return 'Today'
    default: return 'All'
  }
}

// Helper function to transform database tags to EventTag format
const transformToEventTag = (tag: TagType): EventTag => ({
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

// Component for filter stats display
const FilterStats = ({ 
  eventStats, 
  timeFilter, 
  visibilityFilter, 
  studioFilter, 
  className = "" 
}: {
  eventStats: EventStats
  timeFilter: TimeFilter
  visibilityFilter: VisibilityFilter
  studioFilter: string[]
  className?: string
}) => (
  <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
    <span>{eventStats.total} events</span>
    <span>•</span>
    <span>{getTimeFilterText(timeFilter)}</span>
    {visibilityFilter !== 'all' && (
      <>
        <span>•</span>
        <span className="capitalize">{visibilityFilter}</span>
      </>
    )}
    {studioFilter.length > 0 && (
      <>
        <span>•</span>
        <span>{studioFilter.length} studio{studioFilter.length > 1 ? 's' : ''}</span>
      </>
    )}
  </div>
)

// Component for time filter buttons
const TimeFilterButtons = ({ 
  timeFilter, 
  onTimeFilterChange 
}: {
  timeFilter: TimeFilter
  onTimeFilterChange: (filter: TimeFilter) => void
}) => {
  const { t } = useTranslation()
  
  return (
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
  )
}

// Component for visibility filter buttons
const VisibilityFilterButtons = ({ 
  visibilityFilter, 
  eventStats, 
  onVisibilityFilterChange 
}: {
  visibilityFilter: VisibilityFilter
  eventStats: EventStats
  onVisibilityFilterChange: (filter: VisibilityFilter) => void
}) => {
  const { t } = useTranslation()
  
  return (
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
  )
}

// Component for studio filter buttons
const StudioFilterButtons = ({ 
  studioFilter, 
  availableStudioInfo, 
  isLoading, 
  onStudioFilterChange 
}: {
  studioFilter: string[]
  availableStudioInfo?: StudioInfo[]
  isLoading: boolean
  onStudioFilterChange?: (studioIds: string[]) => void
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <RefreshCw className="h-4 w-4 animate-spin" />
        Loading studios...
      </div>
    )
  }

  if (!availableStudioInfo || availableStudioInfo.length === 0) {
    return null
  }

  return (
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
            onStudioFilterChange?.(availableStudioInfo.map(s => s.id))
          }}
        >
          +{availableStudioInfo.length - 3} more
        </Button>
      )}
    </>
  )
}

// Component for action buttons
const ActionButtons = ({ 
  userId, 
  isSyncing, 
  isLoading, 
  onCreateEvent, 
  onSyncFeeds 
}: {
  userId?: string
  isSyncing: boolean
  isLoading: boolean
  onCreateEvent: () => void
  onSyncFeeds: () => void
}) => {
  const { t } = useTranslation()
  
  return (
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
      {userId && (
        <Button 
          onClick={onSyncFeeds}
          disabled={isLoading || isSyncing}
          variant="outline"
          size="sm"
        >
          <ArrowLeftRight className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-pulse' : ''}`} />
          {isSyncing ? t('pages.manageEvents.controlPanel.syncing') : t('pages.manageEvents.controlPanel.syncCalendar')}
        </Button>
      )}
    </div>
  )
}

// Component for available tags
const AvailableTags = ({ 
  userTags, 
  globalTags, 
  onCreateTag, 
  onTagClick 
}: {
  userTags?: TagType[]
  globalTags?: TagType[]
  onCreateTag: () => void
  onTagClick: (tag: TagType) => void
}) => {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground">{t('pages.manageEvents.controlPanel.availableTags')}</h4>
      <div className="flex flex-wrap gap-2">
        {userTags?.map(tag => (
          <TagLibraryItem 
            key={tag.id} 
            tag={transformToEventTag(tag)}
            variant="compact"
            onClick={() => onTagClick(tag)}
          />
        ))}
        {globalTags?.map(tag => (
          <TagLibraryItem 
            key={tag.id} 
            tag={transformToEventTag(tag)}
            variant="compact"
            isGlobal={true}
            onClick={() => onTagClick(tag)}
          />
        ))}
        {/* Create New Tag as last element */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={onCreateTag}
          className="p-2 h-auto rounded-lg border-dashed border-muted-foreground/40 hover:border-muted-foreground/60 bg-white/50 border-white/40 hover:bg-white/60 hover:border-white/50 flex items-center"
        >
          <Tag className="h-3 w-3 mr-2 flex-shrink-0" />
          <span className="text-xs font-medium leading-none">{t('pages.manageEvents.controlPanel.newTag')}</span>
        </Button>
      </div>
    </div>
  )
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
  studioFilter = [],
  availableStudioInfo,
  onTimeFilterChange,
  onVisibilityFilterChange,
  onStudioFilterChange,
  onClearAllFilters,
  onCreateTag,
  onCreateEvent,
  onSyncFeeds
}: EventsControlPanelProps) {
  const { t } = useTranslation()
  
  // Accordion state
  const [isExpanded, setIsExpanded] = React.useState(false)
  
  // Tag view dialog state
  const [selectedTag, setSelectedTag] = React.useState<EventTag | null>(null)
  const [isTagDialogOpen, setIsTagDialogOpen] = React.useState(false)

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
    onCreateTag()
  }

  return (
    <Card className="transition-all duration-300 ease-in-out">
      <CardHeader className="pb-3">
        {/* Title section with toggle in top right */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Settings className="h-5 w-5 flex-shrink-0" />
            <CardTitle className="text-lg flex-shrink-0">
              {t('pages.manageEvents.controlPanel.title')}
            </CardTitle>
            {/* Quick stats in collapsed state - responsive layout */}
            {!isExpanded && (
              <FilterStats
                eventStats={eventStats}
                timeFilter={timeFilter}
                visibilityFilter={visibilityFilter}
                studioFilter={studioFilter}
                className="hidden sm:flex items-center gap-4 min-w-0 overflow-hidden"
              />
            )}
          </div>
          
          {/* Toggle button - top right */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0 flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Quick actions row - only in collapsed state */}
        {!isExpanded && (
          <div className="flex items-center gap-2 mt-3">
            <Button 
              variant="default" 
              size="sm"
              onClick={onCreateEvent}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t('pages.manageEvents.controlPanel.newEvent')}</span>
            </Button>
            {userId && (
              <Button 
                onClick={onSyncFeeds}
                disabled={isLoading || isSyncing}
                variant="outline"
                size="sm"
              >
                <ArrowLeftRight className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline">Sync Calendar</span>
              </Button>
            )}
          </div>
        )}
        
        {/* Mobile stats row - only visible on mobile when collapsed */}
        {!isExpanded && (
          <FilterStats
            eventStats={eventStats}
            timeFilter={timeFilter}
            visibilityFilter={visibilityFilter}
            studioFilter={studioFilter}
            className="sm:hidden mt-2"
          />
        )}
      </CardHeader>
      
      {/* Expandable content */}
      <div className={`
        overflow-hidden transition-all duration-300 ease-in-out
        ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <CardContent className="space-y-6 pt-0">
          {/* Filter Controls */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">{t('pages.manageEvents.controlPanel.timeLabel')}</span>
              <TimeFilterButtons timeFilter={timeFilter} onTimeFilterChange={onTimeFilterChange} />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">{t('pages.manageEvents.controlPanel.visibilityLabel')}</span>
              <VisibilityFilterButtons 
                visibilityFilter={visibilityFilter} 
                eventStats={eventStats} 
                onVisibilityFilterChange={onVisibilityFilterChange} 
              />
            </div>

            {/* Studio Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Studio</span>
              <div className="flex flex-wrap gap-1">
                <StudioFilterButtons 
                  studioFilter={studioFilter}
                  availableStudioInfo={availableStudioInfo}
                  isLoading={isLoading}
                  onStudioFilterChange={onStudioFilterChange}
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            {onClearAllFilters && studioFilter.length > 0 && (
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
            {/* Actions Row */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Actions
              </h4>
              <ActionButtons 
                userId={userId}
                isSyncing={isSyncing}
                isLoading={isLoading}
                onCreateEvent={onCreateEvent}
                onSyncFeeds={onSyncFeeds}
              />
              {userId && (
                <p className="text-xs text-muted-foreground">
                  {t('pages.manageEvents.controlPanel.syncDescription')}
                </p>
              )}
            </div>
            
            {/* Available Tags */}
            <AvailableTags 
              userTags={userTags}
              globalTags={globalTags}
              onCreateTag={onCreateTag}
              onTagClick={handleTagClick}
            />
          </div>
        </CardContent>
      </div>

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