'use client'

import { useMemo } from 'react'
import { useSupabaseQuery } from '@/lib/hooks'
import { QUERY_CONFIGS } from '@/lib/query-constants'
import { type EventWithSubstituteTeacher } from '@/lib/invoice-utils'
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
  // ✅ Using shared constants - guaranteed to match preload functions
  const {
    data: uninvoicedEvents,
    isLoading,
    error,
    refetch: refetchUninvoiced
  } = useSupabaseQuery(
    QUERY_CONFIGS.invoiceUninvoicedEvents.queryKey(userId),
    (supabase) => QUERY_CONFIGS.invoiceUninvoicedEvents.queryFn(supabase, userId),
    { 
      enabled: !!userId,
      staleTime: QUERY_CONFIGS.invoiceUninvoicedEvents.staleTime 
    }
  )

  // ✅ Using shared constants - guaranteed to match preload functions
  const {
    data: unmatchedEvents,
    isLoading: isUnmatchedLoading,
    error: unmatchedError,
    refetch: refetchUnmatched
  } = useSupabaseQuery(
    QUERY_CONFIGS.invoiceUnmatchedEvents.queryKey(userId),
    (supabase) => QUERY_CONFIGS.invoiceUnmatchedEvents.queryFn(supabase, userId),
    { 
      enabled: !!userId,
      staleTime: QUERY_CONFIGS.invoiceUnmatchedEvents.staleTime 
    }
  )

  // ✅ Using shared constants - guaranteed to match preload functions
  const {
    data: excludedEvents,
    isLoading: isExcludedLoading,
    error: excludedError,
    refetch: refetchExcluded
  } = useSupabaseQuery(
    QUERY_CONFIGS.invoiceExcludedEvents.queryKey(userId),
    (supabase) => QUERY_CONFIGS.invoiceExcludedEvents.queryFn(supabase, userId),
    { 
      enabled: !!userId,
      staleTime: QUERY_CONFIGS.invoiceExcludedEvents.staleTime 
    }
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