'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createBrowserClient } from '@supabase/ssr'

// Types
type SupabaseClient = ReturnType<typeof createBrowserClient>

export interface UnifiedQueryOptions<TData> {
  queryKey: readonly unknown[]
  fetcher: (supabase: SupabaseClient) => Promise<TData>
  enabled?: boolean
  staleTime?: number
  refetchOnWindowFocus?: boolean
}

export interface UnifiedMutationOptions<TData, TVariables> {
  mutationFn: (supabase: SupabaseClient, variables: TVariables) => Promise<TData>
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>
  onError?: (error: Error, variables: TVariables) => void | Promise<void>
  // Smart invalidation - pass query keys or a function that returns them
  invalidateQueries?: readonly unknown[][] | ((variables: TVariables, data: TData) => readonly unknown[][])
  // Optimistic updates - function to update cache immediately
  optimisticUpdate?: (variables: TVariables) => { queryKey: readonly unknown[]; updater: (old: unknown) => unknown }[]
}

/**
 * Unified Query Hook
 * 
 * Replaces useSupabaseQuery with TanStack Query + our data access functions
 * Works with the same data access functions used in server components
 */
export function useUnifiedQuery<TData = unknown>({
  queryKey,
  fetcher,
  enabled = true,
  staleTime,
  refetchOnWindowFocus,
}: UnifiedQueryOptions<TData>) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return useQuery({
    queryKey,
    queryFn: () => fetcher(supabase),
    enabled,
    staleTime,
    refetchOnWindowFocus,
  })
}

/**
 * Unified Mutation Hook
 * 
 * Replaces useSupabaseMutation with TanStack Query + smart cache invalidation
 * Automatically handles optimistic updates and cache invalidation
 */
export function useUnifiedMutation<TData = unknown, TVariables = unknown>({
  mutationFn,
  onSuccess,
  onError,
  invalidateQueries,
  optimisticUpdate,
}: UnifiedMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return useMutation({
    mutationFn: (variables: TVariables) => mutationFn(supabase, variables),
    
    onMutate: async (variables: TVariables) => {
      // Apply optimistic updates if provided
      if (optimisticUpdate) {
        const updates = optimisticUpdate(variables)
        const previousData: Record<string, unknown> = {}
        
        for (const update of updates) {
          // Cancel any outgoing refetches
          await queryClient.cancelQueries({ queryKey: update.queryKey })
          
          // Snapshot the previous value
          const cacheKey = JSON.stringify(update.queryKey)
          previousData[cacheKey] = queryClient.getQueryData(update.queryKey)
          
          // Optimistically update
          queryClient.setQueryData(update.queryKey, update.updater)
        }
        
        return { previousData, updates }
      }
    },
    
    onError: async (error, variables, context) => {
      // Rollback optimistic updates on error
      if (context?.previousData && context?.updates) {
        for (const update of context.updates) {
          const cacheKey = JSON.stringify(update.queryKey)
          if (context.previousData[cacheKey] !== undefined) {
            queryClient.setQueryData(update.queryKey, context.previousData[cacheKey])
          }
        }
      }
      
      await onError?.(error as Error, variables)
    },
    
    onSuccess: async (data, variables) => {
      // Invalidate related queries
      if (invalidateQueries) {
        const queriesToInvalidate = typeof invalidateQueries === 'function' 
          ? invalidateQueries(variables, data)
          : invalidateQueries
          
        for (const queryKey of queriesToInvalidate) {
          await queryClient.invalidateQueries({ queryKey })
        }
      }
      
      await onSuccess?.(data, variables)
    },
  })
}

/**
 * Hook to prefetch queries (useful for hover states, route preloading, etc.)
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
      fetcher: (supabase: SupabaseClient) => Promise<TData>,
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
 * Hook to manually invalidate queries (useful for global refresh actions)
 */
export function useInvalidateQueries() {
  const queryClient = useQueryClient()
  
  return {
    invalidate: (queryKeys: readonly unknown[][] | readonly unknown[]) => {
      if (Array.isArray(queryKeys[0])) {
        // Multiple query keys
        return Promise.all(
          (queryKeys as readonly unknown[][]).map(queryKey => 
            queryClient.invalidateQueries({ queryKey })
          )
        )
      } else {
        // Single query key
        return queryClient.invalidateQueries({ queryKey: queryKeys as readonly unknown[] })
      }
    },
    
    invalidateAll: () => {
      return queryClient.invalidateQueries()
    }
  }
} 