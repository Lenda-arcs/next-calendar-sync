'use client'

import React from 'react'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { CalendarFeedManager } from './CalendarFeedManager'
import { type CalendarFeed } from '@/lib/calendar-feeds'

interface CalendarFeedsModalProps {
  open?: boolean
  trigger?: React.ReactNode
  feeds?: CalendarFeed[]
  onOpenChange?: (open: boolean) => void
}

export function CalendarFeedsModal({ 
  open = false,
  feeds: providedFeeds, 
  onOpenChange 
}: CalendarFeedsModalProps) {
  const feeds = providedFeeds || []

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange?.(newOpen)
  }

  return (
    <UnifiedDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Calendar Feeds"
      description="Manage your connected calendar feeds and sync settings."
      size="xl"
    >
      <CalendarFeedManager
        feeds={feeds}
        isLoading={false}
        onRefetch={() => {
          // Refetch logic can be added here
        }}
      />
    </UnifiedDialog>
  )
} 