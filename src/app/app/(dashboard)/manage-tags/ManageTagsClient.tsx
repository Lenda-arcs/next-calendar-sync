'use client'

import React from 'react'
import DataLoader from '@/components/ui/data-loader'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { useAllTags } from '@/lib/hooks/useAllTags'
import { useTagOperations } from '@/lib/hooks/useTagOperations'
import { UserRole } from '@/lib/types'
import { TagLibrary } from '@/components/events/TagLibrary'
import { TagRuleManager } from '@/components/events/TagRuleManager'
import { NewTagForm } from '@/components/events/NewTagForm'
import { TagViewDialog } from '@/components/events/TagViewDialog'
import { TagLibraryGridSkeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { clearTagMapCache } from '@/lib/event-utils'

interface Props {
  userId: string
}

export function ManageTagsClient({ userId }: Props) {
  // Fetch all tags once and share between components
  const { allTags, userTags, globalTags, isLoading: tagsLoading, error: tagsError, refetch: refetchAllTags } = useAllTags({ 
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

  // Tag operations hook with proper refetch
  const {
    selectedTag,
    showNewTagForm,
    showViewDialog,
    isEditing,
    creating,
    updating,
    deleting,
    handleTagClick,
    handleEditClick,
    handleCreateNew,
    handleCancel,
    handleSaveTag,
    handleDeleteTag,
  } = useTagOperations({ 
    onSuccess: refetchAllTags // Use the shared refetch function
  })

  // Clear cache when tags are updated
  React.useEffect(() => {
    clearTagMapCache()
  }, [allTags])

  const userRole = (userData?.role || 'user') as UserRole
  const isLoading = tagsLoading || roleLoading
  const error = tagsError || roleError
  const errorMessage = error?.message || null

  return (
    <>
      <DataLoader
        data={allTags}
        loading={isLoading}
        error={errorMessage}
        skeleton={TagLibraryGridSkeleton}
        skeletonCount={1}
        empty={
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-4">No tags found. Create your first tag!</p>
            <Button onClick={handleCreateNew} variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Tag
            </Button>
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
              // Pass down the tag operations instead of letting TagLibrary create its own
              tagOperations={{
                onTagClick: handleTagClick,
                onEditClick: handleEditClick,
                onDeleteClick: handleDeleteTag,
                onCreateNew: handleCreateNew,
                creating,
                updating,
                deleting,
              }}
            />
            
            {/* Tag View Dialog */}
            {selectedTag && (
              <TagViewDialog
                tag={selectedTag}
                isOpen={showViewDialog}
                onClose={handleCancel}
                onEdit={() => handleEditClick(selectedTag)}
                canEdit={
                  // Admin can edit any tag
                  userRole === 'admin' ||
                  // User can edit their own tags (non-global only)
                  (selectedTag.userId === userId && selectedTag.userId !== null)
                }
              />
            )}
          </div>
        )}
      </DataLoader>

      {/* New/Edit Tag Form - MOVED OUTSIDE DataLoader so it works in empty state */}
      <NewTagForm
        isOpen={showNewTagForm}
        isEditing={isEditing}
        initialTag={selectedTag}
        onSave={handleSaveTag}
        onCancel={handleCancel}
        userId={userId}
      />
    </>
  )
} 