'use client'

import React from 'react'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { CalendarFeedManager } from './CalendarFeedManager'
import { type CalendarFeed } from '@/lib/calendar-feeds'
import { useTranslationNamespace } from '@/lib/i18n/context'

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
  const { t } = useTranslationNamespace('calendar')

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange?.(newOpen)
  }

  return (
    <UnifiedDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={t('integration.modalTitle')}
      description={t('integration.modalDescription')}
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