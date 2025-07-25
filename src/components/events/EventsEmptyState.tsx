'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Plus } from 'lucide-react'
import { VisibilityFilter, TimeFilter } from './EventsControlPanel'
import { useTranslation } from '@/lib/i18n/context'

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
  const { t } = useTranslation()
  const isNoEventsAtAll = totalEventsCount === 0

  const getDescription = () => {
    if (isNoEventsAtAll) {
      return t('pages.manageEvents.emptyState.connectCalendar')
    }
    
    if (timeFilter === 'future' && visibilityFilter !== 'all') {
      const oppositeVisibility = visibilityFilter === 'public' ? 'private' : 'public'
      return t('pages.manageEvents.emptyState.changeFiltersPublicPrivate', { 
        visibility: oppositeVisibility 
      })
    }
    
    if (timeFilter === 'future') {
      return t('pages.manageEvents.emptyState.changeFiltersTime')
    }
    
    return t('pages.manageEvents.emptyState.changeFiltersVisibility')
  }

  return (
    <Card>
      <CardContent className="py-12">
        <div className="text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {isNoEventsAtAll ? t('pages.manageEvents.emptyState.noEvents') : t('pages.manageEvents.emptyState.noEventsFiltered')}
          </h3>
          <p className="text-muted-foreground mb-6">
            {getDescription()}
          </p>
          {isNoEventsAtAll ? (
            <Button asChild>
              <Link href="/app/add-calendar">
                <Plus className="h-4 w-4 mr-2" />
                {t('pages.manageEvents.emptyState.addCalendarFeed')}
              </Link>
            </Button>
          ) : (
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => onChangeVisibilityFilter('all')}>
                {t('pages.manageEvents.emptyState.showAllVisibility')}
              </Button>
              <Button variant="outline" onClick={() => onChangeTimeFilter('all')}>
                {t('pages.manageEvents.emptyState.showAllTime')}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 