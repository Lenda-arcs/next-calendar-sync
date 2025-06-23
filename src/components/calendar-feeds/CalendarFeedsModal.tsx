'use client'

import React from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
    
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Calendar Feeds</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <CalendarFeedManager
            feeds={feeds}
            isLoading={false}
            onRefetch={() => {
              // Refetch logic can be added here
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 