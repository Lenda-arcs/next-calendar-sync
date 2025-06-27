'use client'

import { TagLibrary } from '@/components/events/TagLibrary'
import { TagRuleManager } from '@/components/events/TagRuleManager'
import { useAllTags } from '@/lib/hooks/useAllTags'
import DataLoader from '@/components/ui/data-loader'
import { TagLibraryGridSkeleton } from '@/components/ui/skeleton'

interface Props {
  userId: string
}

export function ManageTagsClient({ userId }: Props) {
  // Fetch all tags once and share between components
  const { allTags, userTags, globalTags, isLoading, error } = useAllTags({ 
    userId, 
    enabled: !!userId 
  })

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
            globalTags={globalTags}
            customTags={userTags}
          />
        </div>
      )}
    </DataLoader>
  )
} 