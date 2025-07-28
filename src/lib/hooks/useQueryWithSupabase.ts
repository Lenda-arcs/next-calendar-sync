'use client'

import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query'
import { createBrowserClient } from '@supabase/ssr'

type SupabaseClient = ReturnType<typeof createBrowserClient>

/**
 * Simple wrapper around TanStack Query's useQuery for Supabase operations
 * Supports both new and old API formats for backward compatibility
 */
export function useSupabaseQuery<TData = unknown, TError = Error>(
  queryKeyOrOptions: readonly unknown[] | {
    queryKey: readonly unknown[]
    fetcher: (supabase: SupabaseClient) => Promise<TData>
    enabled?: boolean
    staleTime?: number
    refetchOnWindowFocus?: boolean
  },
  fetcher?: (supabase: SupabaseClient) => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Normalize parameters based on API format
  const isNewFormat = Array.isArray(queryKeyOrOptions)
  const normalizedParams = isNewFormat 
    ? {
        queryKey: queryKeyOrOptions as readonly unknown[],
        fetcher: fetcher!,
        options: options || {}
      }
    : {
        queryKey: (queryKeyOrOptions as any).queryKey,
        fetcher: (queryKeyOrOptions as any).fetcher,
        options: { 
          enabled: (queryKeyOrOptions as any).enabled,
          staleTime: (queryKeyOrOptions as any).staleTime,
          refetchOnWindowFocus: (queryKeyOrOptions as any).refetchOnWindowFocus
        }
      }

  return useQuery({
    queryKey: normalizedParams.queryKey,
    queryFn: () => normalizedParams.fetcher(supabase),
    ...normalizedParams.options,
  })
}

/**
 * Simple wrapper around TanStack Query's useMutation for Supabase operations
 * Replaces the complex useSupabaseMutation custom hook
 */
export function useSupabaseMutation<TData = unknown, TVariables = unknown, TError = Error>(
  mutationFn: (supabase: SupabaseClient, variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return useMutation({
    mutationFn: (variables: TVariables) => mutationFn(supabase, variables),
    ...options,
  })
}

// Helper hooks for common operations with better type safety
export function useSupabaseInsert<T = unknown>(
  tableName: string,
  options?: Omit<UseMutationOptions<T[], Error, T>, 'mutationFn'>
) {
  return useSupabaseMutation<T[], T>(
    async (supabase, data) => {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
      
      if (error) throw error
      return result
    },
    options
  )
}

export function useSupabaseUpdate<T = unknown>(
  tableName: string,
  options?: Omit<UseMutationOptions<T[], Error, { id: string; data: Partial<T> }>, 'mutationFn'>
) {
  return useSupabaseMutation<T[], { id: string; data: Partial<T> }>(
    async (supabase, { id, data }) => {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return result
    },
    options
  )
}

export function useSupabaseDelete<T = unknown>(
  tableName: string,
  options?: Omit<UseMutationOptions<T[], Error, string>, 'mutationFn'>
) {
  return useSupabaseMutation<T[], string>(
    async (supabase, id) => {
      const { data: result, error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)
        .select()
      
      if (error) throw error
      return result
    },
    options
  )
} 