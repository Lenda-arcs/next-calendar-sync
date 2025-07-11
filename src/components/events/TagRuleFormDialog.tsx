'use client'

import React from 'react'
import { Tag, TagRule } from '@/lib/types'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { PatternInput } from './PatternInput'
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
  userId: string
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
  userId,
}) => {
  const title = isEditing ? 'Edit Tag Rule' : 'Create Tag Rule'
  const description = isEditing 
    ? 'Update this rule to change how events are automatically tagged.'
    : 'Create a new rule to automatically tag events based on keywords in their title, description, or location.'

  // Use the correct data source based on editing state
  const currentKeywords = isEditing ? (editingRule?.keywords || []) : (Array.isArray(keywords) ? keywords : [])
  const currentLocationKeywords = isEditing ? (editingRule?.location_keywords || []) : (Array.isArray(locationKeywords) ? locationKeywords : [])
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
        {/* Keywords for title/description using PatternInput */}
        <PatternInput
          label="Keywords (Title/Description)"
          patterns={currentKeywords}
          onChange={handleKeywordsChange}
          placeholder="e.g., Flow, Vinyasa, Meditation"
          userId={userId}
          mode="keywords"
          maxPatterns={5}
          suggestions={keywordSuggestions.filter(s => s.type === 'title').map(s => ({ 
            value: s.keyword, 
            label: s.keyword,
            count: s.count 
          }))}
          required={!hasLocationKeywords}
        />
        <p className="text-xs text-muted-foreground -mt-3">
          Match these keywords in event titles or descriptions (max 5)
        </p>

        {/* Keywords for location using PatternInput */}
        <PatternInput
          label="Location Keywords"
          patterns={currentLocationKeywords}
          onChange={handleLocationKeywordsChange}
          placeholder="e.g., Studio A, Flow Room, Main Hall"
          userId={userId}
          mode="location"
          maxPatterns={15}
          suggestions={keywordSuggestions.filter(s => s.type === 'location').map(s => ({ 
            value: s.keyword, 
            label: s.keyword,
            count: s.count 
          }))}
        />
        <p className="text-xs text-muted-foreground -mt-3">
          Match these keywords in event locations (max 5)
        </p>

        {/* Tag selection - remains the same */}
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

        {/* Rules info - remains the same */}
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