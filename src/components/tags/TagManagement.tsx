'use client'

import React from 'react'
import { EventTag } from '@/lib/event-types'
import { TagBadge } from '@/components/ui/tag-badge'
import { cn } from '@/lib/utils'
import { MultiSelect } from '@/components/ui/multi-select'

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

  // Convert EventTag[] to Option[] format for FormMultiSelect with color support
  const tagOptions = availableTags.map(tag => ({
    value: tag.id,
    label: tag.name || 'Unnamed Tag',
    color: tag.color
  }))

  // Get currently selected tag IDs
  const selectedTagIds = currentTags.map(tag => tag.id)

  const handleTagSelectionChange = (selectedIds: string[]) => {
    // Restrict to max 3 tags
    const limitedIds = selectedIds.slice(0, MAX_TAGS)
    
    // Convert back to EventTag[] format
    const selectedTags = limitedIds.map(id => 
      availableTags.find(tag => tag.id === id)
    ).filter(Boolean) as EventTag[]
    
    onTagsUpdate(selectedTags)
  }

  // Custom option renderer using TagBadge
  const renderOption = (option: { value: string; label: string; color?: string | null }, isSelected: boolean, isDisabled: boolean) => (
    <div className="flex items-center w-full">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => {}} // Handled by onClick
        disabled={isDisabled}
        className="mr-3 accent-primary"
      />
      <div className="flex-1">
        <TagBadge
          variant="safe"
          color={option.color}
          className={cn(
            "text-sm",
            isDisabled && "opacity-50"
          )}
        >
          {option.label}
        </TagBadge>
      </div>
      {isDisabled && (
        <span className="ml-2 text-xs text-muted-foreground">
          Max reached
        </span>
      )}
    </div>
  )

  // Custom selected badge renderer using TagBadge
  const renderSelectedBadge = (option: { value: string; label: string; color?: string | null }, onRemove: (e: React.MouseEvent) => void) => (
    <div key={option.value} className="flex items-center">
      <TagBadge
        variant="safe"
        color={option.color}
        className="text-sm pr-6 relative"
      >
        {option.label}
        <button
          type="button"
          className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-black/10 rounded-full w-4 h-4 flex items-center justify-center text-xs"
          onClick={onRemove}
        >
          ×
        </button>
      </TagBadge>
    </div>
  )

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
        <MultiSelect
          id="tag-selection"
          name="tags"
          label={`Select Tags (max ${MAX_TAGS})`}
          options={tagOptions}
          value={selectedTagIds}
          onChange={handleTagSelectionChange}
          placeholder={currentTags.length >= MAX_TAGS ? `Maximum ${MAX_TAGS} tags selected` : 'Select tags...'}
          maxSelections={MAX_TAGS}
          renderOption={renderOption}
          renderSelectedBadge={renderSelectedBadge}
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