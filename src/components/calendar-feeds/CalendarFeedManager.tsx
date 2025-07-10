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
  Filter,
  Settings2
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
  const { syncFeed, deleteFeed, updateSyncApproach, isSyncing, isDeleting, isUpdatingSyncApproach, syncError, deleteError, updateSyncApproachError } = useCalendarFeedActions()

  // Update optimistic feeds when props change
  React.useEffect(() => {
    setOptimisticFeeds(feeds)
  }, [feeds])

  const handleSync = async (feedId: string) => {
    try {
      setActionFeedId(feedId)
      
      // Optimistically update the last_synced_at timestamp
      const now = new Date().toISOString()
      setOptimisticFeeds(prev => 
        prev.map(feed => 
          feed.id === feedId 
            ? { ...feed, last_synced_at: now }
            : feed
        )
      )
      
      // Perform the actual sync
      const result = await syncFeed(feedId)
      
      // Store sync results for display
      setSyncResults(prev => new Map(prev).set(feedId, result))
      
      // Mark as recently synced for visual feedback
      setRecentlySynced(prev => new Set(prev).add(feedId))
      
      // Remove the "recently synced" indicator after 3 seconds
      setTimeout(() => {
        setRecentlySynced(prev => {
          const newSet = new Set(prev)
          newSet.delete(feedId)
          return newSet
        })
        setSyncResults(prev => {
          const newMap = new Map(prev)
          newMap.delete(feedId)
          return newMap
        })
      }, 3000)
      
      // Refetch to get the latest data from server
      onRefetch?.()
    } catch (error) {
      console.error('Error syncing feed:', error)
      // Revert optimistic update on error
      setOptimisticFeeds(feeds)
    } finally {
      setActionFeedId(null)
    }
  }

  const handleDelete = async (feedId: string) => {
    try {
      setActionFeedId(feedId)
      
      // Optimistically remove the feed from the list
      setOptimisticFeeds(prev => prev.filter(feed => feed.id !== feedId))
      
      // Perform the actual deletion
      await deleteFeed(feedId)
      
      // Refetch to ensure consistency
      onRefetch?.()
      setConfirmDelete(null)
    } catch (error) {
      console.error('Error deleting feed:', error)
      // Revert optimistic update on error
      setOptimisticFeeds(feeds)
    } finally {
      setActionFeedId(null)
    }
  }

  const handleSyncApproachChange = async (feedId: string, syncApproach: 'yoga_only' | 'mixed_calendar') => {
    try {
      setActionFeedId(feedId)
      
      // Optimistically update the sync approach
      setOptimisticFeeds(prev => 
        prev.map(feed => 
          feed.id === feedId 
            ? { ...feed, sync_approach: syncApproach } as CalendarFeed
            : feed
        )
      )
      
      await updateSyncApproach(feedId, syncApproach)
      onRefetch?.()
    } catch (error) {
      console.error('Failed to update sync approach:', error)
      // Revert optimistic update
      setOptimisticFeeds(feeds)
    } finally {
      setActionFeedId(null)
    }
  }

  const isProcessing = (feedId: string) => actionFeedId === feedId && (isSyncing || isDeleting || isUpdatingSyncApproach)

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

      {updateSyncApproachError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div>
            <strong>Sync Approach Error:</strong> {updateSyncApproachError.message}
          </div>
        </Alert>
      )}

      <DataLoader
        data={optimisticFeeds}
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
                  isRecentlySynced={recentlySynced.has(feed.id)}
                  syncResult={syncResults.get(feed.id)}
                  userId={userId}
                  onSync={() => handleSync(feed.id)}
                  onDelete={() => setConfirmDelete(feed.id)}
                  onSyncApproachChange={handleSyncApproachChange}
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
  isRecentlySynced?: boolean
  syncResult?: { success: boolean; count: number }
  userId?: string
  onSync: () => void
  onDelete: () => void
  onSyncApproachChange?: (feedId: string, syncApproach: 'yoga_only' | 'mixed_calendar') => void
}

function CalendarFeedCard({ 
  feed, 
  isProcessing, 
  isRecentlySynced, 
  syncResult, 
  userId,
  onSync, 
  onDelete,
  onSyncApproachChange 
}: CalendarFeedCardProps) {
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
              {isRecentlySynced && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Just Synced
                </Badge>
              )}
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
            {syncResult && (
              <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                {syncResult.count} events synced
              </div>
            )}
          </div>

          {/* Sync Approach Controls */}
          <div className="p-3 bg-white/10 rounded-lg border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm">
                <Settings2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Sync approach:</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(feed as any).sync_approach === 'mixed_calendar' ? 'Mixed Calendar' : 'Yoga Only'}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                variant={(feed as any).sync_approach === 'yoga_only' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSyncApproachChange?.(feed.id, 'yoga_only')}
                disabled={isProcessing}
                className="flex-1"
              >
                <Calendar className="mr-2 h-3 w-3" />
                Yoga Only
              </Button>
              
              <Button
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                variant={(feed as any).sync_approach === 'mixed_calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSyncApproachChange?.(feed.id, 'mixed_calendar')}
                disabled={isProcessing}
                className="flex-1"
              >
                <Filter className="mr-2 h-3 w-3" />
                Mixed Calendar
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(feed as any).sync_approach === 'mixed_calendar' 
                ? 'Events are filtered using your tag patterns' 
                : 'All events are synced without filtering'
              }
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary Actions */}
            <div className="flex gap-2">
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
                    Full Sync
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

            {/* Quick Rematch */}
            {userId && (
              <div className="flex gap-2">
                                 <RematchEventsButton
                   userId={userId}
                   feedId={feed.id}
                   variant="outline"
                   size="sm"
                 >
                   Fix Matching Only
                 </RematchEventsButton>
                <span className="text-xs text-muted-foreground self-center">~1-3s</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 