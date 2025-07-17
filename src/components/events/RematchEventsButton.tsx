'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { rematchEvents, RematchEventsParams } from '@/lib/rematch-utils'
import { useTranslation } from '@/lib/i18n/context'

interface RematchEventsButtonProps {
  userId: string
  feedId?: string
  eventIds?: string[]
  rematchTags?: boolean
  rematchStudios?: boolean
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  className?: string
  children?: React.ReactNode
}

export function RematchEventsButton({
  userId,
  feedId,
  eventIds,
  rematchTags = true,
  rematchStudios = true,
  variant = 'outline',
  size = 'sm',
  className,
  children
}: RematchEventsButtonProps) {
  const { t } = useTranslation()
  const [isRematching, setIsRematching] = useState(false)

  const handleRematch = async () => {
    try {
      setIsRematching(true)

      const params: RematchEventsParams = {
        user_id: userId,
        rematch_tags: rematchTags,
        rematch_studios: rematchStudios
      }

      if (feedId) params.feed_id = feedId
      if (eventIds && eventIds.length > 0) params.event_ids = eventIds

      const rematchResult = await rematchEvents(params)
      
      // Show success toast
      toast.success(t('pages.manageEvents.rematch.matchingUpdated'), {
        description: t('pages.manageEvents.rematch.eventsUpdated', {
          updated: rematchResult.updated_count.toString(),
          total: rematchResult.total_events_processed.toString()
        }),
        duration: 4000,
      })

    } catch (err) {
      console.error('Failed to rematch events:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to rematch events'
      
      // Show error toast
      toast.error(t('pages.manageEvents.rematch.failedToUpdate'), {
        description: errorMessage,
        duration: 6000,
      })
    } finally {
      setIsRematching(false)
    }
  }

  const getButtonText = () => {
    if (isRematching) return t('pages.manageEvents.rematch.updating')
    if (children) return children
    
    const scope = eventIds ? t('pages.manageEvents.rematch.selectedEvents') : 
                  feedId ? t('pages.manageEvents.rematch.feedEvents') : 
                  t('pages.manageEvents.rematch.allEvents')
    const actions = []
    if (rematchTags) actions.push(t('pages.manageEvents.rematch.tags'))
    if (rematchStudios) actions.push(t('pages.manageEvents.rematch.studios'))
    
    return t('pages.manageEvents.rematch.fixAction', {
      actions: actions.join(' & '),
      scope: scope
    })
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRematch}
      disabled={isRematching}
      className={cn("whitespace-nowrap", className)}
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isRematching ? 'animate-spin' : ''}`} />
      {getButtonText()}
    </Button>
  )
}

// Convenient pre-configured variants
export function RematchTagsButton({ userId, ...props }: Omit<RematchEventsButtonProps, 'rematchTags' | 'rematchStudios'>) {
  return (
    <RematchEventsButton
      {...props}
      userId={userId}
      rematchTags={true}
      rematchStudios={false}
    >
      Fix Event Tags
    </RematchEventsButton>
  )
}

export function RematchStudiosButton({ userId, ...props }: Omit<RematchEventsButtonProps, 'rematchTags' | 'rematchStudios'>) {
  return (
    <RematchEventsButton
      {...props}
      userId={userId}
      rematchTags={false}
      rematchStudios={true}
    >
      Fix Studio Matching
    </RematchEventsButton>
  )
}

export function RematchAllButton({ userId, ...props }: Omit<RematchEventsButtonProps, 'rematchTags' | 'rematchStudios'>) {
  return (
    <RematchEventsButton
      {...props}
      userId={userId}
      rematchTags={true}
      rematchStudios={true}
    >
      Fix All Matching
    </RematchEventsButton>
  )
}