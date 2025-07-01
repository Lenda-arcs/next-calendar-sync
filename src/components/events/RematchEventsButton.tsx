'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { rematchEvents, RematchEventsParams, RematchEventsResult } from '@/lib/rematch-utils'

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
  const [result, setResult] = useState<RematchEventsResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRematch = async () => {
    try {
      setIsRematching(true)
      setError(null)
      setResult(null)

      const params: RematchEventsParams = {
        user_id: userId,
        rematch_tags: rematchTags,
        rematch_studios: rematchStudios
      }

      if (feedId) params.feed_id = feedId
      if (eventIds && eventIds.length > 0) params.event_ids = eventIds

      const rematchResult = await rematchEvents(params)
      setResult(rematchResult)

      // Clear success message after 5 seconds
      setTimeout(() => {
        setResult(null)
      }, 5000)

    } catch (err) {
      console.error('Failed to rematch events:', err)
      setError(err instanceof Error ? err.message : 'Failed to rematch events')
      
      // Clear error message after 8 seconds
      setTimeout(() => {
        setError(null)
      }, 8000)
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
    <div className="space-y-2">
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

      {/* Success Message */}
      {result && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Matching Updated!</strong> {result.updated_count} out of {result.total_events_processed} events were updated.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Failed to update matching:</strong> {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
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