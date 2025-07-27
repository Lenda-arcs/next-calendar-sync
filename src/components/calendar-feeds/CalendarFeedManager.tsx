'use client'

import React, { useState } from 'react'
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
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react'
import { formatDate, type CalendarFeed } from '@/lib/calendar-feeds'
import { useCalendarFeedActions } from '@/lib/hooks/useCalendarFeeds'
import { RematchEventsButton } from '@/components/events/RematchEventsButton'
import Link from 'next/link'

interface CalendarFeedManagerProps {
  feeds: CalendarFeed[]
  isLoading?: boolean
  onRefetch?: () => void
  userId?: string
}

export function CalendarFeedManager({ feeds, isLoading, onRefetch, userId }: CalendarFeedManagerProps) {
  const [actionFeedId, setActionFeedId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [optimisticFeeds, setOptimisticFeeds] = useState<CalendarFeed[]>(feeds)
  const [recentlySynced, setRecentlySynced] = useState<Set<string>>(new Set())
  const [syncResults, setSyncResults] = useState<Map<string, { success: boolean; count: number }>>(new Map())
  const { syncFeed, deleteFeed, isSyncing, isDeleting, syncError, deleteError } = useCalendarFeedActions()

  // Update optimistic feeds when props change
  React.useEffect(() => {
    setOptimisticFeeds(feeds)
  }, [feeds])

  const handleSync = async (feedId: string) => {
    try {
      setActionFeedId(feedId)
      
      // Add to recently synced set for UI feedback
      setRecentlySynced(prev => new Set(prev).add(feedId))
      
      const result = await syncFeed(feedId)
      
      // Update sync results
      setSyncResults(prev => new Map(prev).set(feedId, {
        success: result.success,
        count: result.count || 0
      }))
      
      if (onRefetch) {
        onRefetch()
      }
      
      // Remove from recently synced after delay
      setTimeout(() => {
        setRecentlySynced(prev => {
          const newSet = new Set(prev)
          newSet.delete(feedId)
          return newSet
        })
        // Clear sync results after showing them
        setSyncResults(prev => {
          const newMap = new Map(prev)
          newMap.delete(feedId)
          return newMap
        })
      }, 3000)
      
    } catch (error) {
      console.error('Sync error:', error)
    } finally {
      setActionFeedId(null)
    }
  }

  const handleDelete = async (feedId: string) => {
    try {
      setActionFeedId(feedId)
      
      // Optimistically remove the feed
      setOptimisticFeeds(prev => prev.filter(feed => feed.id !== feedId))
      
      await deleteFeed(feedId)
      
      if (onRefetch) {
        onRefetch()
      }
      
    } catch (error) {
      console.error('Delete error:', error)
      // Revert optimistic update on error
      setOptimisticFeeds(feeds)
    } finally {
      setActionFeedId(null)
      setConfirmDelete(null)
    }
  }

  const displayFeeds = optimisticFeeds.length > 0 ? optimisticFeeds : feeds

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Connected Calendars</h3>
          <p className="text-sm text-muted-foreground">
            Manage your calendar integrations and sync settings
          </p>
        </div>
        <div className="flex gap-2">
          {onRefetch && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefetch}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
          <Link href="/app/add-calendar">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Import More Events
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Messages */}
      {(syncError || deleteError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div>
            <p className="font-medium">Action Failed</p>
            <p className="text-sm">{(syncError || deleteError)?.message || 'An unknown error occurred'}</p>
          </div>
        </Alert>
      )}

      {/* Calendar Feeds */}
      <DataLoader
        data={displayFeeds}
        loading={isLoading || false}
        error={null}
        skeleton={
          <div className="grid gap-4">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        }
        empty={
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No calendars connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect your first calendar to start syncing yoga events
              </p>
              <Link href="/app/add-calendar">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Calendar
                </Button>
              </Link>
            </CardContent>
          </Card>
        }
      >
        {(feeds: CalendarFeed[]) => (
          <div className="grid gap-4">
            {feeds.map((feed) => (
              <CalendarFeedCard
                key={feed.id}
                feed={feed}
                isProcessing={actionFeedId === feed.id && (isSyncing || isDeleting)}
                isRecentlySynced={recentlySynced.has(feed.id)}
                syncResult={syncResults.get(feed.id)}
                userId={userId}
                onSync={() => handleSync(feed.id)}
                onDelete={() => setConfirmDelete(feed.id)}
              />
            ))}
          </div>
        )}
      </DataLoader>

      {/* Delete Confirmation Dialog */}
      <UnifiedDialog
        open={!!confirmDelete}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        title="Delete Calendar Feed"
        description="Are you sure you want to delete this calendar feed? This action cannot be undone."
      >
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => setConfirmDelete(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => confirmDelete && handleDelete(confirmDelete)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Feed'
            )}
          </Button>
        </div>
      </UnifiedDialog>
    </div>
  )
}

interface CalendarFeedCardProps {
  feed: CalendarFeed
  isProcessing: boolean
  isRecentlySynced: boolean
  syncResult?: { success: boolean; count: number }
  userId?: string
  onSync: () => void
  onDelete: () => void
}

function CalendarFeedCard({ 
  feed, 
  isProcessing, 
  isRecentlySynced, 
  syncResult, 
  userId,
  onSync, 
  onDelete
}: CalendarFeedCardProps) {
  const isActive = !!feed.last_synced_at
  const syncDate = formatDate(feed.last_synced_at)

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {feed.calendar_name || 'Unnamed Calendar'}
              {isActive && (
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {isActive ? `Last synced: ${syncDate}` : 'Never synced'}
              </span>
              {feed.feed_url && (
                <span className="flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  Calendar Feed
                </span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Sync Results */}
        {syncResult && (
          <Alert className={syncResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {syncResult.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <div className={syncResult.success ? 'text-green-800' : 'text-red-800'}>
              <p className="font-medium">
                {syncResult.success 
                  ? `Sync completed successfully` 
                  : 'Sync failed'
                }
              </p>
              {syncResult.success && (
                <p className="text-sm">
                  {syncResult.count} events processed
                </p>
              )}
            </div>
          </Alert>
        )}

        {/* Calendar Type Info */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-sm">
            <Info className="h-4 w-4 text-blue-600" />
            <span className="text-blue-800 font-medium">Dedicated Yoga Calendar</span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            All events from this calendar are synced automatically
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              onClick={onSync}
              disabled={isProcessing}
              className="flex-1"
              variant={isRecentlySynced ? 'secondary' : 'default'}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : isRecentlySynced ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Synced
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Now
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={onDelete}
              disabled={isProcessing}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Rematch Events Button */}
          {userId && isActive && (
            <RematchEventsButton 
              feedId={feed.id} 
              userId={userId}
              variant="outline"
              size="sm"
              className="w-full"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
} 