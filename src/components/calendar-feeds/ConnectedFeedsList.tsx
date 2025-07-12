'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Plus } from 'lucide-react'
import { formatDate, type CalendarFeed } from '@/lib/calendar-feeds'
import { PATHS } from '@/lib/paths'
import Link from 'next/link'
import { useTranslationNamespace } from '@/lib/i18n/context'

interface ConnectedFeedsListProps {
  feeds: CalendarFeed[]
  isLoading?: boolean
  onViewDetails?: () => void
}

export function ConnectedFeedsList({ feeds, isLoading, onViewDetails }: ConnectedFeedsListProps) {
  const { t } = useTranslationNamespace('calendar')

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  if (feeds.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground text-sm mb-4">
          {t('integration.noFeeds')}
        </p>
        <Button asChild size="sm">
          <Link href={PATHS.APP.ADD_CALENDAR}>
            <Plus className="mr-2 h-4 w-4" />
            {t('integration.addCalendar')}
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {feeds.slice(0, 2).map((feed) => (
        <div
          key={feed.id}
          className="flex items-center justify-between p-3 bg-white/30 rounded-lg border border-white/20"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">
                {feed.calendar_name || t('integration.unnamedCalendar')}
              </h4>
              <Badge 
                variant={feed.last_synced_at ? "default" : "secondary"}
                className="text-xs"
              >
                {feed.last_synced_at ? t('integration.active') : t('integration.pending')}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('integration.lastSynced')} {formatDate(feed.last_synced_at)}
            </p>
          </div>
        </div>
      ))}
      
      {feeds.length > 2 && (
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground mb-2">
            {t('integration.moreFeeds', { count: (feeds.length - 2).toString() })}
          </p>
        </div>
      )}
      
      <div className="flex gap-2 pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={onViewDetails}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          {t('integration.manageFeeds')}
        </Button>
        <Button asChild size="sm" variant="secondary">
          <Link href={PATHS.APP.ADD_CALENDAR}>
            <Plus className="mr-2 h-4 w-4" />
            {t('integration.addMore')}
          </Link>
        </Button>
      </div>
    </div>
  )
} 