'use client'
import { useQueryClient } from '@tanstack/react-query'
import { createBrowserClient } from '@supabase/ssr'

/**
 * Hook for intelligent data preloading based on user intent signals
 * Optimized for better UX with predictive loading
 */
export function useSmartPreload() {
  const queryClient = useQueryClient()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return {
    preloadUserEvents: (userId: string) => {
      return queryClient.prefetchQuery({
        queryKey: ['events', 'list', userId],
        queryFn: () => fetchUserEvents(supabase, userId),
        staleTime: 30 * 1000, // 30 seconds
      })
    },

    preloadUserTags: (userId: string) => {
      return queryClient.prefetchQuery({
        queryKey: ['tags', 'user', userId],
        queryFn: () => fetchUserTags(supabase, userId),
        staleTime: 60 * 1000, // 1 minute
      })
    },

    preloadPublicEvents: (teacherSlug: string) => {
      return queryClient.prefetchQuery({
        queryKey: ['events', 'public', teacherSlug],
        queryFn: () => fetchPublicEvents(supabase, teacherSlug),
        staleTime: 30 * 1000, // 30 seconds
      })
    },

    preloadUserStudios: (userId: string) => {
      return queryClient.prefetchQuery({
        queryKey: ['studios', 'user', userId],
        queryFn: () => fetchUserStudios(supabase, userId),
        staleTime: 5 * 60 * 1000, // 5 minutes
      })
    },

    preloadInvoices: (userId: string) => {
      return queryClient.prefetchQuery({
        queryKey: ['invoices', 'list', userId],
        queryFn: () => fetchUserInvoices(supabase, userId),
        staleTime: 2 * 60 * 1000, // 2 minutes
      })
    },
  }
}

// Helper functions for data fetching
async function fetchUserEvents(supabase: ReturnType<typeof createBrowserClient>, userId: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}

async function fetchUserTags(supabase: ReturnType<typeof createBrowserClient>, userId: string) {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', userId)
    .order('name')

  if (error) throw error
  return data
}

async function fetchPublicEvents(supabase: ReturnType<typeof createBrowserClient>, teacherSlug: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*, users!inner(teacher_slug)')
    .eq('users.teacher_slug', teacherSlug)
    .eq('is_private', false)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(20)

  if (error) throw error
  return data
}

async function fetchUserStudios(supabase: ReturnType<typeof createBrowserClient>, userId: string) {
  const { data, error } = await supabase
    .from('teacher_studio_relationships')
    .select('*, studios(*)')
    .eq('teacher_id', userId)
    .eq('status', 'approved')

  if (error) throw error
  return data
}

async function fetchUserInvoices(supabase: ReturnType<typeof createBrowserClient>, userId: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return data
} 