'use client'

import React from 'react'
import { EventTag } from '@/lib/event-types'
import { TagBadge } from '@/components/ui/tag-badge'
import { cn } from '@/lib/utils'
import { MultiSelect } from '@/components/ui/multi-select'
import { useTranslation } from '@/lib/i18n/context'
import { Link as LinkIcon, Star } from 'lucide-react'
import { PRIORITY_LABELS } from '@/lib/constants/tag-constants'

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
  const { t } = useTranslation()
  const MAX_TAGS = 3

  // Convert EventTag[] to Option[] format for FormMultiSelect with color + meta
  const tagOptions = availableTags.map(tag => ({
    value: tag.id,
    label: tag.name || t('tags.management.unnamedTag'),
    color: tag.color,
    priority: tag.priority ?? null,
    hasCta: !!tag.cta,
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
  const renderOption = (option: { value: string; label: string; color?: string | null; priority?: number | null; hasCta?: boolean }, isSelected: boolean, isDisabled: boolean) => (
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
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          {typeof option.priority === 'number' && (
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3" />
              {PRIORITY_LABELS[option.priority as keyof typeof PRIORITY_LABELS] || t('common.unknown')}
            </span>
          )}
          {option.hasCta && (
            <span className="inline-flex items-center gap-1">
              <LinkIcon className="h-3 w-3" />
              {t('tags.management.hasCta')}
            </span>
          )}
        </div>
      </div>
      {isDisabled && (
        <span className="ml-2 text-xs text-muted-foreground">
          {t('tags.management.maxReached')}
        </span>
      )}
    </div>
  )

  // Custom selected badge renderer using TagBadge
  const renderSelectedBadge = (option: { value: string; label: string; color?: string | null; priority?: number | null; hasCta?: boolean }, onRemove: (e: React.MouseEvent) => void) => (
    <div key={option.value} className="flex items-center">
      <TagBadge
        variant="safe"
        color={option.color}
        className="text-sm pr-7 relative"
      >
        {option.label}
        <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-foreground/70">
          {typeof option.priority === 'number' && (
            <>
              <Star className="h-3 w-3" />
              {PRIORITY_LABELS[option.priority as keyof typeof PRIORITY_LABELS] || t('common.unknown')}
            </>
          )}
          {option.hasCta && (
            <>
              <LinkIcon className="h-3 w-3" />
              {t('tags.management.cta')}
            </>
          )}
        </span>
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
        <span>{t('tags.management.showOnPublicPage')}</span>
      </label>

      <div className="flex flex-col gap-2">
        <MultiSelect
          id="tag-selection"
          name="tags"
          label={t('tags.management.selectTags', { count: MAX_TAGS.toString() })}
          options={tagOptions}
          value={selectedTagIds}
          onChange={handleTagSelectionChange}
          placeholder={currentTags.length >= MAX_TAGS ? t('tags.management.maxTagsSelected', { count: MAX_TAGS.toString() }) : t('tags.management.selectTagsPlaceholder')}
          maxSelections={MAX_TAGS}
          renderOption={renderOption}
          renderSelectedBadge={renderSelectedBadge}
        />
        <p className="text-xs text-muted-foreground">
          {t('tags.management.priorityHelper', {
            defaultValue: 'Priority affects which tag action (CTA) is preferred when multiple tags apply. Higher priority tags (High > Medium > Low) take precedence for CTAs and prominence.'
          })}
        </p>
        {currentTags.length >= MAX_TAGS && (
          <p className="text-xs text-muted-foreground">
            {t('tags.management.maxTagsAllowed', { count: MAX_TAGS.toString() })}
          </p>
        )}
      </div>
    </div>
  )
} 