'use client'

import React, { useMemo } from 'react'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { Tag, UserRole } from '@/lib/types'
import { convertToEventTag } from '@/lib/event-types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import DataLoader from '@/components/ui/data-loader'
import { TagLibraryGridSkeleton } from '@/components/ui/skeleton'
import { TagLibraryGrid } from './TagLibraryGrid'
import { NewTagForm } from './NewTagForm'
import { TagViewDialog } from './TagViewDialog'
import { useTagOperations } from '@/lib/hooks/useTagOperations'

interface Props {
  userId: string
  userRole?: UserRole // User role for determining edit permissions
  globalTags?: Tag[] // Accept global tags as props to avoid duplicate fetching
  customTags?: Tag[] // Accept custom tags as props to avoid duplicate fetching
}

export const TagLibrary: React.FC<Props> = ({ userId, userRole = 'user', globalTags: propGlobalTags, customTags: propCustomTags }) => {
  // Fetch global tags (only if not provided as props)
  const { 
    data: fetchedGlobalTags, 
    isLoading: globalLoading, 
    error: globalError 
  } = useSupabaseQuery({
    queryKey: ['global-tags'],
    fetcher: async (supabase) => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .is('user_id', null)
        .order('name', { ascending: true })
      
      if (error) throw error
      return data as Tag[]
    },
    enabled: !propGlobalTags, // Only fetch if not provided as props
  })

  // Fetch user's custom tags (only if not provided as props)
  const { 
    data: fetchedCustomTags, 
    isLoading: customLoading, 
    error: customError, 
    refetch: refetchCustom 
  } = useSupabaseQuery({
    queryKey: ['custom-tags', userId],
    fetcher: async (supabase) => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true })
      
      if (error) throw error
      return data as Tag[]
    },
    enabled: !propCustomTags, // Only fetch if not provided as props
  })

  // Use provided tags or fetched tags
  const globalTags = propGlobalTags || fetchedGlobalTags
  const customTags = propCustomTags || fetchedCustomTags

  // Tag operations hook
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
    onSuccess: refetchCustom 
  })

  // Convert database tags to EventTags
  const globalEventTags = useMemo(() => {
    return globalTags?.map(convertToEventTag) || []
  }, [globalTags])

  const customEventTags = useMemo(() => {
    return customTags?.map(convertToEventTag) || []
  }, [customTags])

  const error = globalError || customError
  const errorMessage = error ? error.message || error.toString() : null
  const loading = (propGlobalTags ? false : globalLoading) || (propCustomTags ? false : customLoading)
  const data = globalTags && customTags ? { globalTags: globalEventTags, customTags: customEventTags } : null

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {(creating || updating || deleting) && (
        <Alert>
          <AlertDescription>
            {creating && 'Creating tag...'}
            {updating && 'Updating tag...'}
            {deleting && 'Deleting tag...'}
          </AlertDescription>
        </Alert>
      )}

      <DataLoader
        data={data}
        loading={loading}
        error={errorMessage}
        skeleton={TagLibraryGridSkeleton}
        skeletonCount={1}
        empty={
          <p className="text-muted-foreground text-center">
            No tags found. Create your first tag!
          </p>
        }
      >
        {(data) => (
          <TagLibraryGrid
            globalTags={data.globalTags}
            customTags={data.customTags}
            onTagClick={handleTagClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteTag}
            onCreateNew={handleCreateNew}
            userId={userId}
            userRole={userRole}
          />
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
  )
} 