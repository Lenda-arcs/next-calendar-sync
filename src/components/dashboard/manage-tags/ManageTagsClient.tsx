'use client'

import React from 'react'
import DataLoader from '@/components/ui/data-loader'
import { TagLibraryGridSkeleton } from '@/components/ui/skeleton'
import { useAllTags, useTagRules, useUserRole } from '@/lib/hooks/useAppQuery'
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
  // ✨ Use unified hooks to fetch all data in one place
  const { 
    data: tagsData,
    isLoading: tagsLoading, 
    error: tagsError, 
    refetch: refetchAllTags 
  } = useAllTags(userId, { enabled: !!userId })

  // Extract tag data
  const userTags = tagsData?.userTags || []
  const globalTags = tagsData?.globalTags || []
  const allTags = React.useMemo(() => tagsData?.allTags || [], [tagsData?.allTags])

  const { 
    data: userRole, 
    isLoading: roleLoading, 
    error: roleError 
  } = useUserRole(userId, { enabled: !!userId })

  // ✨ Fetch tag rules in parent to pass down
  const {
    data: tagRules,
    isLoading: rulesLoading,
    error: rulesError,
    refetch: refetchTagRules
  } = useTagRules(userId, { enabled: !!userId })

  // ✨ Use unified tag operations with cache invalidation
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
    onSuccess: () => {
      refetchAllTags()
      refetchTagRules()
    }
  })

  // Clear cache when tags are updated
  React.useEffect(() => {
    clearTagMapCache()
  }, [allTags])

  const resolvedUserRole = (userRole || 'user') as UserRole
  
  // Only show loading state for initial loads, not background refetches
  const isInitialLoading = tagsLoading || roleLoading || rulesLoading
  const hasData = allTags.length > 0
  
  const error = tagsError || roleError || rulesError
  const errorMessage = error?.message || null

  return (
    <>
      <DataLoader
        data={hasData ? allTags : null}
        loading={isInitialLoading}
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
            {/* ✨ Pass all data as props to eliminate child queries */}
            <TagRuleManager 
              userId={userId} 
              availableTags={allTags}
              tagRules={tagRules}
              rulesError={rulesError?.message || null}
            />
            
            {/* ✨ Pass all data as props to eliminate child queries */}
            <TagLibrary 
              userId={userId} 
              userRole={resolvedUserRole}
              globalTags={globalTags}
              customTags={userTags}
              // Pass down the unified tag operations
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