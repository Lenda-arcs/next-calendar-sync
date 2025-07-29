'use client'

import { useSupabaseQuery } from '@/lib/hooks'
import {
  getUninvoicedEvents,
  getUninvoicedEventsByStudio,
  getUnmatchedEvents,
  getExcludedEvents,
  type EventWithSubstituteTeacher
} from '@/lib/invoice-utils'
import { Event } from '@/lib/types'

interface UseInvoiceEventsResult {
  uninvoicedEvents: EventWithSubstituteTeacher[] | undefined
  unmatchedEvents: Event[] | undefined
  excludedEvents: Event[] | undefined
  eventsByStudio: Record<string, EventWithSubstituteTeacher[]> | undefined
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

  // Fetch events grouped by studio/teacher (using the updated grouping logic)
  const {
    data: eventsByStudio,
    refetch: refetchEventsByStudio
  } = useSupabaseQuery(
    ['uninvoiced-events-by-studio', userId],
    () => getUninvoicedEventsByStudio(userId),
    { enabled: !!userId }
  )

  // Consolidated refetch function
  const refetchAll = async () => {
    await Promise.all([
      refetchUninvoiced(),
      refetchEventsByStudio(),
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