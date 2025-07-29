'use client'

import { useState } from 'react'
import { useCreateTag, useUpdateTag, useDeleteTag } from '@/lib/hooks/useAppQuery'
import { TagInsert, TagUpdate } from '@/lib/types'
import { EventTag } from '@/lib/event-types'
import { toast } from 'sonner'

interface UseTagOperationsProps {
  onSuccess?: () => void
}

export function useTagOperations({ onSuccess }: UseTagOperationsProps = {}) {
  const [selectedTag, setSelectedTag] = useState<EventTag | null>(null)
  const [showNewTagForm, setShowNewTagForm] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // ✨ Use unified hooks instead of direct mutations
  const { mutate: createTag, isPending: creating } = useCreateTag()
  const { mutate: updateTag, isPending: updating } = useUpdateTag()
  const { mutate: deleteTag, isPending: deleting } = useDeleteTag()

  const handleTagClick = (tag: EventTag) => {
    setSelectedTag(tag)
    setIsEditing(false)
    setShowViewDialog(true)
  }

  const handleEditClick = (tag: EventTag) => {
    setSelectedTag(tag)
    setIsEditing(true)
    setShowNewTagForm(true)
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
      
      updateTag({ tagId: selectedTag.id, updates: updateData }, {
        onSuccess: () => {
          toast.success('Tag updated successfully!')
          handleCancel()
          onSuccess?.()
        },
        onError: (error) => {
          toast.error('Failed to update tag', {
            description: error.message
          })
        }
      })
    } else {
      // Convert EventTag to database format for insert
      if (!tagData.userId) {
        throw new Error('User ID is required when creating a tag')
      }
      
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
        user_id: tagData.userId,
      }
      
      createTag(insertData, {
        onSuccess: () => {
          toast.success('Tag created successfully!')
          handleCancel()
          onSuccess?.()
        },
        onError: (error) => {
          toast.error('Failed to create tag', {
            description: error.message
          })
        }
      })
    }
  }

  const handleDeleteTag = (tagId: string) => {
    deleteTag(tagId, {
      onSuccess: () => {
        toast.success('Tag deleted successfully!')
        handleCancel()
        onSuccess?.()
      },
      onError: (error) => {
        toast.error('Failed to delete tag', {
          description: error.message
        })
      }
    })
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
    handleDeleteTag,
  }
} 