'use client'

import React from 'react'
import { Tag, TagRule } from '@/lib/types'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select'
import { Loader2, Plus, Edit2 } from 'lucide-react'

interface KeywordSuggestion {
  keyword: string
  count: number
  type: 'title' | 'location'
}

// Extended TagRule interface to handle new fields until database types are regenerated
interface ExtendedTagRule extends TagRule {
  keywords: string[] | null
  location_keywords: string[] | null
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  isEditing: boolean
  keywords: string[]
  setKeywords: (value: string[]) => void
  locationKeywords: string[]
  setLocationKeywords: (value: string[]) => void
  selectedTag: string
  setSelectedTag: (value: string) => void
  editingRule: ExtendedTagRule | null
  setEditingRule: (rule: ExtendedTagRule | null) => void
  tags: Tag[]
  keywordSuggestions: KeywordSuggestion[]
  isCreating?: boolean
  isUpdating?: boolean
  suggestionsLoading?: boolean
}

export const TagRuleFormDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  isEditing,
  keywords,
  setKeywords,
  locationKeywords,
  setLocationKeywords,
  selectedTag,
  setSelectedTag,
  editingRule,
  setEditingRule,
  tags,
  keywordSuggestions,
  isCreating = false,
  isUpdating = false,
  suggestionsLoading = false,
}) => {
  // Convert keyword suggestions to multi-select options
  const titleSuggestionOptions: MultiSelectOption[] = keywordSuggestions
    .filter(s => s.type === 'title')
    .map(s => ({
      value: s.keyword,
      label: s.keyword,
      count: s.count
    }))

  const locationSuggestionOptions: MultiSelectOption[] = keywordSuggestions
    .filter(s => s.type === 'location')
    .map(s => ({
      value: s.keyword,
      label: s.keyword,
      count: s.count
    }))

  const title = isEditing ? 'Edit Tag Rule' : 'Create Tag Rule'
  const description = isEditing 
    ? 'Update the keywords and tag for this rule. Changes will be applied to existing events.'
    : 'Create a new rule to automatically tag events based on keywords in their title, description, or location.'

  const currentKeywords = isEditing ? (editingRule?.keywords || []) : keywords
  const currentLocationKeywords = isEditing ? (editingRule?.location_keywords || []) : locationKeywords
  const currentSelectedTag = isEditing ? (editingRule?.tag_id || '') : selectedTag

  const hasKeywords = currentKeywords.length > 0
  const hasLocationKeywords = currentLocationKeywords.length > 0
  const canSave = (hasKeywords || hasLocationKeywords) && currentSelectedTag
  const isLoading = isCreating || isUpdating

  const handleKeywordsChange = (value: string[]) => {
    if (isEditing && editingRule) {
      setEditingRule({ ...editingRule, keywords: value })
    } else {
      setKeywords(value)
    }
  }

  const handleLocationKeywordsChange = (value: string[]) => {
    if (isEditing && editingRule) {
      setEditingRule({ ...editingRule, location_keywords: value })
    } else {
      setLocationKeywords(value)
    }
  }

  const handleTagChange = (value: string) => {
    if (isEditing && editingRule) {
      setEditingRule({ ...editingRule, tag_id: value })
    } else {
      setSelectedTag(value)
    }
  }

  const footer = (
    <>
      <Button
        variant="outline"
        onClick={onClose}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        onClick={onSave}
        disabled={!canSave || isLoading}
        variant="default"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {isEditing ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          <>
            {isEditing ? (
              <>
                <Edit2 className="h-4 w-4 mr-2" />
                Update Rule
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Rule
              </>
            )}
          </>
        )}
      </Button>
    </>
  )

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={onClose}
      title={title}
      description={description}
      footer={footer}
      size="lg"
    >
      <div className="space-y-6">
        {/* Keywords for title/description */}
        <div>
          <MultiSelect
            label="Keywords (Title/Description)"
            placeholder={suggestionsLoading ? "Loading suggestions..." : "Select or type keywords..."}
            options={titleSuggestionOptions}
            value={currentKeywords}
            onChange={handleKeywordsChange}
            maxSelections={5}
            showCounts={true}
            displayMode="badges"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Match these keywords in event titles or descriptions (max 5)
          </p>
        </div>

        {/* Keywords for location */}
        <div>
          <MultiSelect
            label="Location Keywords (Optional)"
            placeholder={suggestionsLoading ? "Loading suggestions..." : "Select or type location keywords..."}
            options={locationSuggestionOptions}
            value={currentLocationKeywords}
            onChange={handleLocationKeywordsChange}
            maxSelections={5}
            showCounts={true}
            displayMode="badges"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Match these keywords in event locations (max 5)
          </p>
        </div>

        {/* Tag selection */}
        <div>
          <Select
            label="Select Tag"
            options={tags.map((tag) => ({
              value: tag.id,
              label: tag.name || 'Unnamed Tag'
            }))}
            value={currentSelectedTag}
            onChange={handleTagChange}
            placeholder="Select Tag..."
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Events matching the keywords will be tagged with this tag
          </p>
        </div>

        {/* Rules info */}
        <div className="bg-blue-50/50 border border-blue-200/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">How Tag Rules Work</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Events are automatically tagged when they match any of the specified keywords</li>
            <li>• Title/description keywords search in event titles and descriptions</li>
            <li>• Location keywords search only in event locations</li>
            <li>• At least one keyword type is required</li>
            <li>• Changes are applied to existing events immediately</li>
          </ul>
        </div>
      </div>
    </UnifiedDialog>
  )
} 