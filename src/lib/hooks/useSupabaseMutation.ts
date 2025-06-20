'use client'

import { useState, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export interface UseSupabaseMutationOptions<TData, TVariables> {
  mutationFn: (
    supabase: ReturnType<typeof createBrowserClient>,
    variables: TVariables
  ) => Promise<TData>
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>
  onError?: (error: Error, variables: TVariables) => void | Promise<void>
  onSettled?: (
    data: TData | null,
    error: Error | null,
    variables: TVariables
  ) => void | Promise<void>
}

export interface UseSupabaseMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<void>
  mutateAsync: (variables: TVariables) => Promise<TData>
  data: TData | null
  error: Error | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  reset: () => void
}

export function useSupabaseMutation<TData = unknown, TVariables = unknown>({
  mutationFn,
  onSuccess,
  onError,
  onSettled,
}: UseSupabaseMutationOptions<TData, TVariables>): UseSupabaseMutationResult<
  TData,
  TVariables
> {
  const [data, setData] = useState<TData | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  const mutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      try {
        setIsLoading(true)
        setError(null)

        const result = await mutationFn(supabase, variables)
        setData(result)

        await onSuccess?.(result, variables)
        await onSettled?.(result, null, variables)

        return result
      } catch (err) {
        console.error('Supabase mutation error:', err)
        
        let error: Error
        if (err instanceof Error) {
          error = err
        } else if (err && typeof err === 'object' && 'message' in err) {
          // Handle Supabase error objects
          const supabaseError = err as { message: string; code?: string; details?: string }
          error = new Error(supabaseError.message || 'Database operation failed')
        } else {
          error = new Error('Unknown error occurred')
        }
        
        setError(error)

        await onError?.(error, variables)
        await onSettled?.(null, error, variables)

        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [mutationFn, supabase, onSuccess, onError, onSettled]
  )

  const mutate = useCallback(
    async (variables: TVariables): Promise<void> => {
      try {
        await mutateAsync(variables)
      } catch {
        // Error is already handled in mutateAsync
        // This version doesn't throw to make it safe for event handlers
      }
    },
    [mutateAsync]
  )

  return {
    mutate,
    mutateAsync,
    data,
    error,
    isLoading,
    isError: !!error,
    isSuccess: !!data && !error,
    reset,
  }
}

// Helper hooks for common operations
export function useSupabaseInsert<T = unknown>(
  tableName: string,
  options?: Omit<UseSupabaseMutationOptions<T[], T>, 'mutationFn'>
) {
  return useSupabaseMutation<T[], T>({
    mutationFn: async (supabase, data) => {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
      
      if (error) throw error
      return result
    },
    ...options,
  })
}

export function useSupabaseUpdate<T = unknown>(
  tableName: string,
  options?: Omit<UseSupabaseMutationOptions<T[], { id: string; data: Partial<T> }>, 'mutationFn'>
) {
  return useSupabaseMutation<T[], { id: string; data: Partial<T> }>({
    mutationFn: async (supabase, { id, data }) => {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return result
    },
    ...options,
  })
}

export function useSupabaseDelete<T = unknown>(
  tableName: string,
  options?: Omit<UseSupabaseMutationOptions<T[], string>, 'mutationFn'>
) {
  return useSupabaseMutation<T[], string>({
    mutationFn: async (supabase, id) => {
      const { data: result, error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)
        .select()
      
      if (error) throw error
      return result
    },
    ...options,
  })
} 