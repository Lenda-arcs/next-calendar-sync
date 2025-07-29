import { useMemo } from 'react'
import { Tag } from '@/lib/types'
import { useSupabaseQuery } from './useQueryWithSupabase'

interface UseAllTagsProps {
  userId?: string | null
  enabled?: boolean
}

export function useAllTags({ userId, enabled = true }: UseAllTagsProps = {}) {
  // Fetch user tags
  const {
    data: userTags,
    isLoading: userTagsLoading,
    error: userTagsError,
    refetch: refetchUserTags
  } = useSupabaseQuery<Tag[]>(
    ['user_tags', userId || 'no-user'],
    async (supabase) => {
      if (!userId) return []
      
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', userId)
        .order('priority', { ascending: false, nullsLast: true })
      
      if (error) throw error
      return data || []
    },
    { enabled: enabled && !!userId }
  )

  // Fetch global tags
  const {
    data: globalTags,
    isLoading: globalTagsLoading,
    error: globalTagsError,
    refetch: refetchGlobalTags
  } = useSupabaseQuery<Tag[]>(
    ['global_tags'],
    async (supabase) => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .is('user_id', null)
        .order('priority', { ascending: false, nullsLast: true })
      
      if (error) throw error
      return data || []
    },
    { enabled }
  )

  // Combine all tags
  const allTags = useMemo(() => {
    return [...(userTags || []), ...(globalTags || [])]
  }, [userTags, globalTags])

  // Combined loading state
  const isLoading = userTagsLoading || globalTagsLoading

  // Combined error (prioritize user tags error if both exist)
  const error = userTagsError || globalTagsError

  // Combined refetch function
  const refetch = () => {
    refetchUserTags()
    refetchGlobalTags()
  }

  return {
    userTags: userTags || [],
    globalTags: globalTags || [],
    allTags,
    isLoading,
    error,
    refetch
  }
} 