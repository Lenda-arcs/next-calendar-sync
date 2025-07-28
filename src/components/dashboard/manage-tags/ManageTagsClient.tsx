'use client'

import React, { useMemo } from 'react'
import DataLoader from '@/components/ui/data-loader'
import { useAllTags, useUserRole } from '@/lib/hooks/useAppQuery'
import { useTagOperations } from '@/lib/hooks/useTagOperations'
import { UserRole } from '@/lib/types'
import { TagLibrary } from '@/components/tags/TagLibrary'
import { TagRuleManager } from '@/components/tags/TagRuleManager'
import { NewTagForm } from '@/components/tags/NewTagForm'
import { TagViewDialog } from '@/components/tags/TagViewDialog'
import { TagLibraryGridSkeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { clearTagMapCache } from '@/lib/event-utils'

interface Props {
  userId: string
}

export function ManageTagsClient({ userId }: Props) {
  // ✨ NEW: Use unified hooks
  const { 
    data: tagData, 
    isLoading: tagsLoading, 
    error: tagsError, 
    refetch: refetchAllTags 
  } = useAllTags(userId, { enabled: !!userId })

  const { 
    data: userRole, 
    isLoading: roleLoading, 
    error: roleError 
  } = useUserRole(userId, { enabled: !!userId })

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

  // Extract tag data from unified response
  const allTags = useMemo(() => tagData?.allTags || [], [tagData?.allTags])
  const userTags = useMemo(() => tagData?.userTags || [], [tagData?.userTags])
  const globalTags = useMemo(() => tagData?.globalTags || [], [tagData?.globalTags])
  
  // Clear cache when tags are updated
  React.useEffect(() => {
    clearTagMapCache()
  }, [allTags])

  const resolvedUserRole = (userRole || 'user') as UserRole
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
              userRole={resolvedUserRole}
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