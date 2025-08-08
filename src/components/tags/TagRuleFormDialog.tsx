'use client'

import React from 'react'
import { Tag, TagRule } from '@/lib/types'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { PatternInput } from './PatternInput'
import { Loader2, Plus, Edit2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

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
  const { t } = useTranslation()
  
  const title = isEditing ? t('pages.manageTags.tagRuleForm.editTitle') : t('pages.manageTags.tagRuleForm.createTitle')
  const description = isEditing 
    ? t('pages.manageTags.tagRuleForm.editDescription')
    : t('pages.manageTags.tagRuleForm.createDescription')

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
        {t('pages.manageTags.tagRuleForm.cancel')}
      </Button>
      <Button
        onClick={onSave}
        disabled={!canSave || isLoading}
        variant="default"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {isEditing ? t('pages.manageTags.tagRuleForm.updating') : t('pages.manageTags.tagRuleForm.creating')}
          </>
        ) : (
          <>
            {isEditing ? (
              <>
                <Edit2 className="h-4 w-4 mr-2" />
                {t('pages.manageTags.tagRuleForm.updateRule')}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                {t('pages.manageTags.tagRuleForm.createRule')}
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
          label={t('pages.manageTags.tagRuleForm.keywordsLabel')}
          patterns={currentKeywords}
          onChange={handleKeywordsChange}
          placeholder={t('pages.manageTags.tagRuleForm.keywordsPlaceholder')}
          userId={userId}
          mode="keywords"
          maxPatterns={5}
          excludeRuleId={isEditing ? (editingRule?.id || undefined) : undefined}
          suggestions={keywordSuggestions.filter(s => s.type === 'title').map(s => ({ 
            value: s.keyword, 
            label: s.keyword,
            count: s.count 
          }))}
          required={!hasLocationKeywords}
        />
        <p className="text-xs text-muted-foreground -mt-3">
          {t('pages.manageTags.tagRuleForm.keywordsHelp')}
        </p>

        {/* Keywords for location using PatternInput */}
        <PatternInput
          label={t('pages.manageTags.tagRuleForm.locationLabel')}
          patterns={currentLocationKeywords}
          onChange={handleLocationKeywordsChange}
          placeholder={t('pages.manageTags.tagRuleForm.locationPlaceholder')}
          userId={userId}
          mode="location"
          maxPatterns={15}
          excludeRuleId={isEditing ? (editingRule?.id || undefined) : undefined}
          suggestions={keywordSuggestions.filter(s => s.type === 'location').map(s => ({ 
            value: s.keyword, 
            label: s.keyword,
            count: s.count 
          }))}
        />
        <p className="text-xs text-muted-foreground -mt-3">
          {t('pages.manageTags.tagRuleForm.locationHelp')}
        </p>

        {/* Tag selection - remains the same */}
        <div>
          <Select
            label={t('pages.manageTags.tagRuleForm.selectTag')}
            options={tags.map((tag) => ({
              value: tag.id,
              label: tag.name || t('pages.manageTags.tagLibraryComponent.unnamedTag')
            }))}
            value={currentSelectedTag}
            onChange={handleTagChange}
            placeholder={t('pages.manageTags.tagRuleForm.selectTagPlaceholder')}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {t('pages.manageTags.tagRuleForm.tagHelp')}
          </p>
        </div>

        {/* Rules info - remains the same */}
        <div className="bg-blue-50/50 border border-blue-200/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">{t('pages.manageTags.tagRuleForm.howItWorksTitle')}</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>{t('pages.manageTags.tagRuleForm.howItWorksBullets.autoTag')}</li>
            <li>{t('pages.manageTags.tagRuleForm.howItWorksBullets.titleSearch')}</li>
            <li>{t('pages.manageTags.tagRuleForm.howItWorksBullets.locationSearch')}</li>
            <li>{t('pages.manageTags.tagRuleForm.howItWorksBullets.required')}</li>
            <li>{t('pages.manageTags.tagRuleForm.howItWorksBullets.immediate')}</li>
          </ul>
        </div>
      </div>
    </UnifiedDialog>
  )
} 