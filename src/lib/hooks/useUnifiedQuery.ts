'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useSupabaseQuery as useSupabaseQueryNew, useSupabaseMutation as useSupabaseMutationNew } from './useQueryWithSupabase'
import { createBrowserClient } from '@supabase/ssr'

/**
 * @deprecated This file contains temporary compatibility wrappers.
 * 
 * Migration Guide:
 * - Use `useSupabaseQuery` and `useSupabaseMutation` from `./useQueryWithSupabase.ts`
 * - For prefetching: Use `queryClient.prefetchQuery()` directly
 * - For invalidation: Use `queryClient.invalidateQueries()` directly
 * - For advanced features: Use native TanStack Query hooks with optimistic updates
 */

/**
 * Temporary compatibility wrapper for useUnifiedQuery
 * @deprecated Use useSupabaseQuery from ./useQueryWithSupabase.ts
 */
export function useUnifiedQuery<TData = unknown>({
  queryKey,
  fetcher,
  enabled = true,
  staleTime,
  refetchOnWindowFocus,
}: {
  queryKey: readonly unknown[]
  fetcher: (supabase: ReturnType<typeof createBrowserClient>) => Promise<TData>
  enabled?: boolean
  staleTime?: number
  refetchOnWindowFocus?: boolean
}) {
  return useSupabaseQueryNew(queryKey, fetcher, {
    enabled,
    staleTime,
    refetchOnWindowFocus,
  })
}

/**
 * Temporary compatibility wrapper for useUnifiedMutation
 * @deprecated Use useSupabaseMutation from ./useQueryWithSupabase.ts
 */
export function useUnifiedMutation<TData = unknown, TVariables = unknown>({
  mutationFn,
  onSuccess,
  onError,
}: {
  mutationFn: (supabase: ReturnType<typeof createBrowserClient>, variables: TVariables) => Promise<TData>
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>
  onError?: (error: Error, variables: TVariables) => void | Promise<void>
}) {
  return useSupabaseMutationNew(mutationFn, {
    onSuccess,
    onError,
  })
}

/**
 * Temporary compatibility wrapper for usePrefetchQuery
 * @deprecated Use queryClient.prefetchQuery() directly
 */
export function usePrefetchQuery() {
  const queryClient = useQueryClient()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return {
    prefetch: <TData>(
      queryKey: readonly unknown[], 
      fetcher: (supabase: ReturnType<typeof createBrowserClient>) => Promise<TData>, 
      staleTime?: number
    ) => {
      return queryClient.prefetchQuery({
        queryKey,
        queryFn: () => fetcher(supabase),
        staleTime,
      })
    }
  }
}

/**
 * Simple hook to get query client for manual operations
 * Use this temporarily while migrating components
 */
export function useQueryClientAccess() {
  return useQueryClient()
} 