'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeftRight, RefreshCw } from 'lucide-react'

interface ManageEventsHeaderProps {
  hasPendingChanges: boolean
  pendingChangesCount: number
  isSyncing: boolean
  isLoading: boolean
  onSyncFeeds: () => void
  onRefresh: () => void
}

export default function ManageEventsHeader({
  hasPendingChanges,
  pendingChangesCount,
  isSyncing,
  isLoading,
  onSyncFeeds,
  onRefresh
}: ManageEventsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Manage Events</h1>
        <p className="text-muted-foreground mt-2">
          Edit tags, manage visibility, and organize your classes
          {hasPendingChanges && (
            <span className="ml-2 text-amber-600 font-medium">
              • {pendingChangesCount} unsaved change{pendingChangesCount !== 1 ? 's' : ''}
            </span>
          )}
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onSyncFeeds}
          disabled={isLoading || isSyncing}
          variant="default"
          size="sm"
        >
          <ArrowLeftRight className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-pulse' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Feeds'}
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
    </div>
  )
} 