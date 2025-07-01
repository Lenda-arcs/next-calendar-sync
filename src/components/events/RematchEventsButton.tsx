'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { rematchEvents, RematchEventsParams } from '@/lib/rematch-utils'

interface RematchEventsButtonProps {
  userId: string
  feedId?: string
  eventIds?: string[]
  rematchTags?: boolean
  rematchStudios?: boolean
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
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
  children
}: RematchEventsButtonProps) {
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
      toast.success('Matching Updated!', {
        description: `${rematchResult.updated_count} out of ${rematchResult.total_events_processed} events were updated.`,
        duration: 4000,
      })

    } catch (err) {
      console.error('Failed to rematch events:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to rematch events'
      
      // Show error toast
      toast.error('Failed to update matching', {
        description: errorMessage,
        duration: 6000,
      })
    } finally {
      setIsRematching(false)
    }
  }

  const getButtonText = () => {
    if (isRematching) return 'Updating...'
    if (children) return children
    
    const scope = eventIds ? 'Selected Events' : feedId ? 'Feed Events' : 'All Events'
    const actions = []
    if (rematchTags) actions.push('Tags')
    if (rematchStudios) actions.push('Studios')
    
    return `Fix ${actions.join(' & ')} for ${scope}`
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRematch}
      disabled={isRematching}
      className="whitespace-nowrap"
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