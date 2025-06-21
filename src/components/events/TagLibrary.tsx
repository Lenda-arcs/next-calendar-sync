'use client'

import React, { useState, useMemo } from 'react'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { useSupabaseMutation } from '@/lib/hooks/useSupabaseMutation'
import { Tag, TagInsert, TagUpdate } from '@/lib/types'
import { EventTag, convertToEventTag } from '@/lib/event-types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import DataLoader from '@/components/ui/data-loader'
import { TagLibraryGrid } from './TagLibraryGrid'
import { NewTagForm } from './NewTagForm'
import { TagViewDialog } from './TagViewDialog'

interface Props {
  userId: string
}

export const TagLibrary: React.FC<Props> = ({ userId }) => {
  const [showNewTagForm, setShowNewTagForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedTag, setSelectedTag] = useState<EventTag | null>(null)
  const [showViewDialog, setShowViewDialog] = useState(false)

  // Fetch global tags
  const { 
    data: globalTags, 
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
  })

  // Fetch user's custom tags
  const { 
    data: customTags, 
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
  })

  // Create tag mutation
  const { mutate: createTag, isLoading: creating } = useSupabaseMutation({
    mutationFn: async (supabase, variables: TagInsert) => {
      const { data, error } = await supabase
        .from('tags')
        .insert([variables])
        .select()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      setShowNewTagForm(false)
      setSelectedTag(null)
      refetchCustom()
    },
  })

  // Update tag mutation
  const { mutate: updateTag, isLoading: updating } = useSupabaseMutation({
    mutationFn: async (supabase, variables: { id: string; data: TagUpdate }) => {
      const { data, error } = await supabase
        .from('tags')
        .update(variables.data)
        .eq('id', variables.id)
        .select()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      setShowNewTagForm(false)
      setIsEditing(false)
      setSelectedTag(null)
      refetchCustom()
    },
  })

  // Delete tag mutation
  const { mutate: deleteTag, isLoading: deleting } = useSupabaseMutation({
    mutationFn: async (supabase, tagId: string) => {
      const { data, error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)
        .select()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      refetchCustom()
    },
  })

  // Convert database tags to EventTags
  const globalEventTags = useMemo(() => {
    return globalTags?.map(convertToEventTag) || []
  }, [globalTags])

  const customEventTags = useMemo(() => {
    return customTags?.map(convertToEventTag) || []
  }, [customTags])

  const handleTagClick = (tag: EventTag) => {
    setSelectedTag(tag)
    setShowViewDialog(true)
  }

  const handleEditClick = (tag: EventTag) => {
    setSelectedTag(tag)
    setIsEditing(true)
    setShowNewTagForm(true)
    setShowViewDialog(false)
  }

  const handleCreateNew = () => {
    setSelectedTag(null)
    setIsEditing(false)
    setShowNewTagForm(true)
  }

  const handleCancel = () => {
    setSelectedTag(null)
    setIsEditing(false)
    setShowNewTagForm(false)
    setShowViewDialog(false)
  }

  const handleSaveTag = async (tagData: EventTag) => {
    if (isEditing && selectedTag) {
      // Update existing tag
      const updateData: TagUpdate = {
        name: tagData.name,
        color: tagData.color,
        image_url: tagData.imageUrl,
        class_type: tagData.classType?.[0] || null,
        audience: tagData.audience,
        cta_label: tagData.cta?.label || null,
        cta_url: tagData.cta?.url || null,
        priority: tagData.priority,
      }
      updateTag({ id: selectedTag.id, data: updateData })
    } else {
      // Create new tag
      const insertData: TagInsert = {
        user_id: userId,
        name: tagData.name,
        slug: tagData.slug,
        color: tagData.color,
        image_url: tagData.imageUrl,
        class_type: tagData.classType?.[0] || null,
        audience: tagData.audience,
        cta_label: tagData.cta?.label || null,
        cta_url: tagData.cta?.url || null,
        priority: tagData.priority,
      }
      createTag(insertData)
    }
  }

  const handleDeleteTag = (tagId: string) => {
    deleteTag(tagId)
  }

  const error = globalError || customError
  const errorMessage = error ? error.message || error.toString() : null
  const loading = globalLoading || customLoading

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
        data={{ globalTags: globalEventTags, customTags: customEventTags }}
        loading={loading}
        error={errorMessage}
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
          onClose={() => {
            setShowViewDialog(false)
            setSelectedTag(null)
          }}
          onEdit={() => handleEditClick(selectedTag)}
          canEdit={!selectedTag.userId || selectedTag.userId === userId}
        />
      )}
    </div>
  )
} 