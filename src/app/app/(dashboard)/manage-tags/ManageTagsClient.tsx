'use client'

import { TagLibrary } from '@/components/events/TagLibrary'
import { TagRuleManager } from '@/components/events/TagRuleManager'
import { useAllTags } from '@/lib/hooks/useAllTags'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import DataLoader from '@/components/ui/data-loader'
import { TagLibraryGridSkeleton } from '@/components/ui/skeleton'
import { UserRole } from '@/lib/types'

interface Props {
  userId: string
}

export function ManageTagsClient({ userId }: Props) {
  // Fetch all tags once and share between components
  const { allTags, userTags, globalTags, isLoading: tagsLoading, error: tagsError } = useAllTags({ 
    userId, 
    enabled: !!userId 
  })

  // Fetch user role
  const { data: userData, isLoading: roleLoading, error: roleError } = useSupabaseQuery({
    queryKey: ['user-role', userId],
    fetcher: async (supabase) => {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!userId
  })

  const userRole = (userData?.role || 'user') as UserRole
  const isLoading = tagsLoading || roleLoading
  const error = tagsError || roleError
  const errorMessage = error?.message || null

  return (
    <DataLoader
      data={allTags}
      loading={isLoading}
      error={errorMessage}
      skeleton={TagLibraryGridSkeleton}
      skeletonCount={1}
      empty={
        <div className="text-center py-8 text-muted-foreground">
          <p>No tags found. Create your first tag!</p>
        </div>
      }
    >
      {() => (
        <div className="space-y-12">
          <TagRuleManager 
            userId={userId} 
            availableTags={allTags}
          />
          <TagLibrary 
            userId={userId} 
            userRole={userRole}
            globalTags={globalTags}
            customTags={userTags}
          />
        </div>
      )}
    </DataLoader>
  )
} 