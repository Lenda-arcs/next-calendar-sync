'use client'


import { useSupabaseQuery } from './useSupabaseQuery'
import { getUninvoicedEvents, getUninvoicedEventsByStudio, getUnmatchedEvents, getExcludedEvents, EventWithSubstituteTeacher } from '@/lib/invoice-utils'
import { Event } from '@/lib/types'

interface UseInvoiceEventsResult {
  // Data
  uninvoicedEvents: EventWithSubstituteTeacher[] | null
  unmatchedEvents: Event[] | null
  excludedEvents: Event[] | null
  eventsByStudio: Record<string, EventWithSubstituteTeacher[]> | null
  
  // Loading states
  isLoading: boolean
  isUnmatchedLoading: boolean
  isExcludedLoading: boolean
  
  // Errors
  error: Error | null
  unmatchedError: Error | null
  excludedError: Error | null
  
  // Actions
  refetchAll: () => Promise<void>
  refetchUninvoiced: () => Promise<void>
  refetchUnmatched: () => Promise<void>
  refetchExcluded: () => Promise<void>
}

export function useInvoiceEvents(userId: string): UseInvoiceEventsResult {
  // Fetch uninvoiced events
  const {
    data: uninvoicedEvents,
    isLoading,
    error,
    refetch: refetchUninvoiced
  } = useSupabaseQuery({
    queryKey: ['uninvoiced-events', userId],
    fetcher: () => getUninvoicedEvents(userId),
    enabled: !!userId
  })

  // Fetch unmatched events  
  const {
    data: unmatchedEvents,
    isLoading: isUnmatchedLoading,
    error: unmatchedError,
    refetch: refetchUnmatched
  } = useSupabaseQuery({
    queryKey: ['unmatched-events', userId],
    fetcher: () => getUnmatchedEvents(userId),
    enabled: !!userId
  })

  // Fetch excluded events
  const {
    data: excludedEvents,
    isLoading: isExcludedLoading,
    error: excludedError,
    refetch: refetchExcluded
  } = useSupabaseQuery({
    queryKey: ['excluded-events', userId],
    fetcher: () => getExcludedEvents(userId),
    enabled: !!userId
  })

  // Fetch events grouped by studio/teacher (using the updated grouping logic)
  const {
    data: eventsByStudio,
    refetch: refetchEventsByStudio
  } = useSupabaseQuery({
    queryKey: ['uninvoiced-events-by-studio', userId],
    fetcher: () => getUninvoicedEventsByStudio(userId),
    enabled: !!userId
  })

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