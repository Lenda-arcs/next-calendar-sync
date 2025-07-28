'use client'

import React, { useMemo } from 'react'
import DataLoader from '@/components/ui/data-loader'
import { TagLibraryGridSkeleton } from '@/components/ui/skeleton'
import { useAllTags, useUserRole } from '@/lib/hooks/useAppQuery'
import { useTagOperations } from '@/lib/hooks/useTagOperations'
import { clearTagMapCache } from '@/lib/event-utils'
import { TagLibrary, TagRuleManager, TagViewDialog } from '@/components/tags'
import { NewTagForm } from '@/components/tags'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { UserRole } from '@/lib/types'

interface Props {
  userId: string
}

export function ManageTagsClient({ userId }: Props) {
  // ✨ Use unified hooks
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

  // 🔥 SIMPLIFIED: Use regular tag operations (we'll add optimistic updates directly here later)
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
    onSuccess: refetchAllTags
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
              // Pass down the standard tag operations
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
      
      {/* New/Edit Tag Form */}
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