'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'

// Simple global cache to prevent duplicate requests
const globalCache = new Map<string, {
  data: unknown
  timestamp: number
  promise?: Promise<unknown>
}>()

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
  queryKey,
  fetcher,
  enabled = true,
  refetchOnWindowFocus = false,
  staleTime = 5 * 60 * 1000, // 5 minutes
}: UseSupabaseQueryOptions<T>): UseSupabaseQueryResult<T> {
  const cacheKey = queryKey.join('|')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [lastFetch, setLastFetch] = useState<number>(0)
  const mountedRef = useRef(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchData = useCallback(async () => {
    if (!enabled) return

    const now = Date.now()
    
    // Check cache first
    const cached = globalCache.get(cacheKey)
    if (cached && (now - cached.timestamp < staleTime)) {
      if (mountedRef.current) {
        setData(cached.data as T)
        setError(null)
        setIsLoading(false)
        setLastFetch(cached.timestamp)
      }
      return
    }

    // If there's already a pending request for this key, wait for it
    if (cached?.promise) {
      try {
        const result = await cached.promise
        if (mountedRef.current) {
          setData(result as T)
          setError(null)
          setIsLoading(false)
          setLastFetch(now)
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err instanceof Error ? err : new Error('Unknown error occurred'))
          setIsLoading(false)
        }
      }
      return
    }

    const isStale = now - lastFetch > staleTime
    if (data && !isStale) return

    try {
      if (mountedRef.current) {
        setIsLoading(true)
        setError(null)
      }
      
      // Create and cache the promise
      const promise = fetcher(supabase)
      globalCache.set(cacheKey, {
        data: null,
        timestamp: now,
        promise
      })
      
      const result = await promise
      
      // Update cache with result
      globalCache.set(cacheKey, {
        data: result,
        timestamp: now
      })
      
      if (mountedRef.current) {
        setData(result)
        setLastFetch(now)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred')
      
      // Remove failed request from cache
      globalCache.delete(cacheKey)
      
      if (mountedRef.current) {
        setError(error)
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [enabled, fetcher, supabase, staleTime, lastFetch, data, cacheKey])

  const refetch = useCallback(async () => {
    // Clear cache for this key
    globalCache.delete(cacheKey)
    setLastFetch(0) // Force refetch by resetting last fetch time
    await fetchData()
  }, [fetchData, cacheKey])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

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