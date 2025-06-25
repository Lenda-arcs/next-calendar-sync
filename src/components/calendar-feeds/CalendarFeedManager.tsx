'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert } from '@/components/ui/alert'
import DataLoader from '@/components/ui/data-loader'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { 
  Calendar, 
  RefreshCw, 
  Trash2, 
  ExternalLink, 
  Plus,
  Clock,
  AlertCircle 
} from 'lucide-react'
import { formatDate, type CalendarFeed } from '@/lib/calendar-feeds'
import { useCalendarFeedActions } from '@/lib/hooks/useCalendarFeeds'
import Link from 'next/link'

interface CalendarFeedManagerProps {
  feeds: CalendarFeed[]
  isLoading?: boolean
  onRefetch?: () => void
}

export function CalendarFeedManager({ feeds, isLoading, onRefetch }: CalendarFeedManagerProps) {
  const [actionFeedId, setActionFeedId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const { syncFeed, deleteFeed, isSyncing, isDeleting, syncError, deleteError } = useCalendarFeedActions()

  const handleSync = async (feedId: string) => {
    try {
      setActionFeedId(feedId)
      await syncFeed(feedId)
      onRefetch?.()
    } catch (error) {
      console.error('Error syncing feed:', error)
    } finally {
      setActionFeedId(null)
    }
  }

  const handleDelete = async (feedId: string) => {
    try {
      setActionFeedId(feedId)
      await deleteFeed(feedId)
      onRefetch?.()
      setConfirmDelete(null)
    } catch (error) {
      console.error('Error deleting feed:', error)
    } finally {
      setActionFeedId(null)
    }
  }

  const isProcessing = (feedId: string) => actionFeedId === feedId && (isSyncing || isDeleting)

  return (
    <div className="space-y-6">
      {/* Error Messages */}
      {syncError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div>
            <strong>Sync Error:</strong> {syncError.message}
          </div>
        </Alert>
      )}
      
      {deleteError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div>
            <strong>Delete Error:</strong> {deleteError.message}
          </div>
        </Alert>
      )}

      <DataLoader
        data={feeds}
        loading={isLoading || false}
        error={null}
        empty={
          <Card variant="glass">
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Calendar Feeds Connected</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Connect your first calendar feed to start syncing your events and building your schedule.
              </p>
              <Button asChild>
                <Link href="/app/add-calendar">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Calendar Feed
                </Link>
              </Button>
            </CardContent>
          </Card>
        }
      >
        {(calendarFeeds) => (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-serif">Calendar Feeds</h2>
                <p className="text-muted-foreground">
                  Manage your connected calendar feeds and sync settings.
                </p>
              </div>
              <Button asChild>
                <Link href="/app/add-calendar">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Calendar Feed
                </Link>
              </Button>
            </div>

            {/* Feeds List */}
            <div className="grid gap-4">
              {calendarFeeds.map((feed) => (
                <CalendarFeedCard
                  key={feed.id}
                  feed={feed}
                  isProcessing={isProcessing(feed.id)}
                  onSync={() => handleSync(feed.id)}
                  onDelete={() => setConfirmDelete(feed.id)}
                />
              ))}
            </div>

            {/* Delete Confirmation Dialog */}
            <UnifiedDialog
              open={!!confirmDelete}
              onOpenChange={() => setConfirmDelete(null)}
              title="Delete Calendar Feed"
              description="Are you sure you want to delete this calendar feed? This action cannot be undone, and all associated events will be removed from your schedule."
              size="sm"
              footer={
                <>
                  <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => confirmDelete && handleDelete(confirmDelete)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Feed'}
                  </Button>
                </>
              }
            >
              <div className="text-center py-4">
                <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
                <p className="text-sm text-muted-foreground">
                  This action is permanent and cannot be reversed.
                </p>
              </div>
            </UnifiedDialog>
          </>
        )}
      </DataLoader>
    </div>
  )
}

interface CalendarFeedCardProps {
  feed: CalendarFeed
  isProcessing: boolean
  onSync: () => void
  onDelete: () => void
}

function CalendarFeedCard({ feed, isProcessing, onSync, onDelete }: CalendarFeedCardProps) {
  const isActive = !!feed.last_synced_at
  const syncDate = formatDate(feed.last_synced_at)

  return (
    <Card variant="glass" className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              {feed.calendar_name || 'Unnamed Calendar'}
              <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                {isActive ? "Active" : "Pending"}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              {feed.feed_url ? (
                <span className="flex items-center gap-1 text-xs">
                  <ExternalLink className="h-3 w-3" />
                  {feed.feed_url.length > 60 
                    ? `${feed.feed_url.substring(0, 60)}...` 
                    : feed.feed_url
                  }
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">No URL provided</span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Sync Information */}
          <div className="flex items-center justify-between p-3 bg-white/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Last synced:</span>
              <span className="font-medium">{syncDate}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onSync}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Now
                </>
              )}
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm"
              onClick={onDelete}
              disabled={isProcessing}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 