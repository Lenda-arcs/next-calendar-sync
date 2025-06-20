'use client'

import React from 'react'
import { EventTag } from '@/lib/event-types'
import FormMultiSelect from '@/components/ui/form-multi-select'

interface TagManagementProps {
  currentTags: EventTag[]
  availableTags: EventTag[]
  onTagsUpdate: (tags: EventTag[]) => void
  publicStatus: boolean
  onVisibilityChange: (isPublic: boolean) => void
}

export const TagManagement: React.FC<TagManagementProps> = ({
  currentTags,
  availableTags,
  onTagsUpdate,
  publicStatus,
  onVisibilityChange,
}) => {
  const MAX_TAGS = 3

  // Convert EventTag[] to Option[] format for FormMultiSelect
  const tagOptions = React.useMemo(() => 
    availableTags
      .filter(tag => tag && tag.id && typeof tag.id === 'string')
      .map(tag => ({
        value: tag.id,
        label: tag.name || 'Unnamed Tag'
      })), [availableTags]
  )

  // Get currently selected tag IDs
  const selectedTagIds = currentTags
    .filter(tag => tag && tag.id && typeof tag.id === 'string')
    .map(tag => tag.id)

  const handleTagSelectionChange = (selectedIds: string[]) => {
    // Restrict to max 3 tags
    const limitedIds = selectedIds.slice(0, MAX_TAGS)
    
    // Convert back to EventTag[] format
    const selectedTags = limitedIds.map(id => 
      availableTags.find(tag => tag.id === id)
    ).filter(Boolean) as EventTag[]
    
    onTagsUpdate(selectedTags)
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center space-x-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={publicStatus}
          onChange={(e) => onVisibilityChange(e.target.checked)}
          className="accent-primary"
        />
        <span>Show on public page</span>
      </label>

      <div className="flex flex-col gap-2">
        <FormMultiSelect
          id="tag-selection"
          name="tags"
          label={`Select Tags (max ${MAX_TAGS})`}
          options={tagOptions}
          value={selectedTagIds}
          onChange={handleTagSelectionChange}
          placeholder={currentTags.length >= MAX_TAGS ? `Maximum ${MAX_TAGS} tags selected` : 'Select tags...'}
          maxSelections={MAX_TAGS}
        />
        {currentTags.length >= MAX_TAGS && (
          <p className="text-xs text-muted-foreground">
            Maximum of {MAX_TAGS} tags allowed. Remove a tag to select another.
          </p>
        )}
      </div>
    </div>
  )
} 