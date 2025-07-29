'use client'

import { useMemo } from 'react'
import { useSupabaseQuery } from '@/lib/hooks'
import {
  getUninvoicedEvents,
  getUnmatchedEvents,
  getExcludedEvents,
  type EventWithSubstituteTeacher
} from '@/lib/invoice-utils'
import { Event } from '@/lib/types'

interface UseInvoiceEventsResult {
  uninvoicedEvents: EventWithSubstituteTeacher[] | undefined
  unmatchedEvents: Event[] | undefined
  excludedEvents: Event[] | undefined
  eventsByStudio: Record<string, EventWithSubstituteTeacher[]> | null
  isLoading: boolean
  isUnmatchedLoading: boolean
  isExcludedLoading: boolean
  error: Error | null
  unmatchedError: Error | null
  excludedError: Error | null
  refetchAll: () => Promise<void>
  refetchUninvoiced: () => void
  refetchUnmatched: () => void
  refetchExcluded: () => void
}

/**
 * Comprehensive hook for managing all invoice-related events
 * Fetches uninvoiced, unmatched, and excluded events
 * Provides grouped data for invoice creation workflows
 */

export function useInvoiceEvents(userId: string): UseInvoiceEventsResult {
  // Fetch uninvoiced events
  const {
    data: uninvoicedEvents,
    isLoading,
    error,
    refetch: refetchUninvoiced
  } = useSupabaseQuery(
    ['uninvoiced-events', userId],
    () => getUninvoicedEvents(userId),
    { enabled: !!userId }
  )

  // Fetch unmatched events  
  const {
    data: unmatchedEvents,
    isLoading: isUnmatchedLoading,
    error: unmatchedError,
    refetch: refetchUnmatched
  } = useSupabaseQuery(
    ['unmatched-events', userId],
    () => getUnmatchedEvents(userId),
    { enabled: !!userId }
  )

  // Fetch excluded events
  const {
    data: excludedEvents,
    isLoading: isExcludedLoading,
    error: excludedError,
    refetch: refetchExcluded
  } = useSupabaseQuery(
    ['excluded-events', userId],
    () => getExcludedEvents(userId),
    { enabled: !!userId }
  )

  // Calculate events grouped by studio/teacher from already-fetched uninvoiced events
  // This avoids the duplicate billing entities fetch that getUninvoicedEventsByStudio causes
  const eventsByStudio = useMemo(() => {
    if (!uninvoicedEvents) return null  // Return null instead of undefined to match expected type
    
    return uninvoicedEvents.reduce((acc, event) => {
      // Group by substitute teacher if present, otherwise by studio
      const groupingId = event.substitute_teacher_entity_id || event.studio_id!
      if (!acc[groupingId]) {
        acc[groupingId] = []
      }
      acc[groupingId].push(event)
      return acc
    }, {} as Record<string, EventWithSubstituteTeacher[]>)
  }, [uninvoicedEvents])

  // Consolidated refetch function
  const refetchAll = async () => {
    await Promise.all([
      refetchUninvoiced(),
      refetchUnmatched(),
      refetchExcluded()
    ])
  }

  return {
    // Data
    uninvoicedEvents,
    unmatchedEvents,
    excludedEvents,
    eventsByStudio,
    
    // Loading states
    isLoading,
    isUnmatchedLoading,
    isExcludedLoading,
    
    // Errors
    error,
    unmatchedError,
    excludedError,
    
    // Actions
    refetchAll,
    refetchUninvoiced,
    refetchUnmatched,
    refetchExcluded
  }
} 