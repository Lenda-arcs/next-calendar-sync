'use client'

import { useEffect, useState, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export interface UseSupabaseQueryOptions<T> {
  queryKey: string[]
  fetcher: (supabase: ReturnType<typeof createBrowserClient>) => Promise<T>
  enabled?: boolean
  refetchOnWindowFocus?: boolean
  staleTime?: number
}

export interface UseSupabaseQueryResult<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
  isError: boolean
  refetch: () => Promise<void>
}

export function useSupabaseQuery<T = unknown>({
  queryKey, // eslint-disable-line @typescript-eslint/no-unused-vars
  fetcher,
  enabled = true,
  refetchOnWindowFocus = false,
  staleTime = 5 * 60 * 1000, // 5 minutes
}: UseSupabaseQueryOptions<T>): UseSupabaseQueryResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [lastFetch, setLastFetch] = useState<number>(0)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchData = useCallback(async () => {
    if (!enabled) return

    const now = Date.now()
    const isStale = now - lastFetch > staleTime

    if (data && !isStale) return

    try {
      setIsLoading(true)
      setError(null)
      const result = await fetcher(supabase)
      setData(result)
      setLastFetch(now)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
    } finally {
      setIsLoading(false)
    }
  }, [enabled, fetcher, supabase, staleTime, lastFetch, data])

  const refetch = useCallback(async () => {
    setLastFetch(0) // Force refetch by resetting last fetch time
    await fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!refetchOnWindowFocus) return

    const handleFocus = () => {
      const now = Date.now()
      const isStale = now - lastFetch > staleTime
      if (isStale) {
        fetchData()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refetchOnWindowFocus, fetchData, staleTime, lastFetch])

  return {
    data,
    error,
    isLoading,
    isError: !!error,
    refetch,
  }
}

// Helper hook for common table queries
export function useSupabaseTable<T = unknown>(
  tableName: string,
  query?: (supabase: ReturnType<typeof createBrowserClient>) => unknown,
  options?: Omit<UseSupabaseQueryOptions<T>, 'queryKey' | 'fetcher'>
) {
  return useSupabaseQuery<T>({
    queryKey: [tableName, JSON.stringify(query?.toString() || 'all')],
    fetcher: async (supabase) => {
      const baseQuery = supabase.from(tableName).select('*')
      const finalQuery = query ? query(supabase) : baseQuery
      const { data, error } = await finalQuery
      
      if (error) throw error
      return data
    },
    ...options,
  })
} 