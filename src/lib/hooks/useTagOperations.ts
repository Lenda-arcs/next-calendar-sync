import { useState } from 'react'
import { useSupabaseMutation } from './useSupabaseMutation'
import { TagInsert, TagUpdate } from '@/lib/types'
import { EventTag } from '@/lib/event-types'

interface UseTagOperationsProps {
  onSuccess?: () => void
}

export function useTagOperations({ onSuccess }: UseTagOperationsProps = {}) {
  const [selectedTag, setSelectedTag] = useState<EventTag | null>(null)
  const [showNewTagForm, setShowNewTagForm] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

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
      handleCancel()
      onSuccess?.()
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
      handleCancel()
      onSuccess?.()
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
      onSuccess?.()
    },
  })

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

  const handleSaveTag = (tagData: EventTag) => {
    if (isEditing && selectedTag?.id) {
      // Convert EventTag back to database format for update
      const updateData: TagUpdate = {
        name: tagData.name,
        color: tagData.color,
        class_type: tagData.classType?.[0] || null,
        audience: tagData.audience || null,
        cta_label: tagData.cta?.label || null,
        cta_url: tagData.cta?.url || null,
        priority: tagData.priority,
        image_url: tagData.imageUrl,
      }
      
      updateTag({ id: selectedTag.id, data: updateData })
    } else {
      // Convert EventTag to database format for insert
      const insertData: TagInsert = {
        slug: tagData.slug,
        name: tagData.name,
        color: tagData.color,
        class_type: tagData.classType?.[0] || null,
        audience: tagData.audience || null,
        cta_label: tagData.cta?.label || null,
        cta_url: tagData.cta?.url || null,
        priority: tagData.priority,
        image_url: tagData.imageUrl,
        user_id: tagData.userId || null,
      }
      
      createTag(insertData)
    }
  }

  return {
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
    handleDeleteTag: deleteTag,
  }
} 