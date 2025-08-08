'use client'

import React, { useState } from 'react'
import { useSupabaseMutation } from '@/lib/hooks/useQueryWithSupabase'
import { useTagRules } from '@/lib/hooks/useAppQuery'
import { useKeywordSuggestions } from '@/lib/hooks/useKeywordSuggestions'
import { TagRule, Tag } from '@/lib/types'
import { rematchUserTags } from '@/lib/rematch-utils'

import { toast } from 'sonner'

import { TagRulesCard } from './TagRulesCard'
import { TagRuleFormDialog } from './TagRuleFormDialog'
import { clearTagMapCache } from '@/lib/event-utils'
import { useTranslation } from '@/lib/i18n/context'

// Extended TagRule interface to handle new fields until database types are regenerated
interface ExtendedTagRule extends TagRule {
  keywords: string[] | null
  location_keywords: string[] | null
}

interface TagRuleState {
  newRule: {
    keywords: string[]
    locationKeywords: string[]
    selectedTag: string
  }
  editingRule: ExtendedTagRule | null
  isEditing: boolean
  dialogOpen: boolean
}

const initialState: TagRuleState = {
  newRule: {
    keywords: [],
    locationKeywords: [],
    selectedTag: '',
  },
  editingRule: null,
  isEditing: false,
  dialogOpen: false,
}

interface Props {
  userId: string
  availableTags: Tag[] // Required - passed from parent
  tagRules?: ExtendedTagRule[] // Optional - can be passed from parent
  rulesError?: string | null // Error state from parent
}

export const TagRuleManager: React.FC<Props> = ({ 
  userId, 
  availableTags, 
  tagRules: propTagRules,
  rulesError = null
}) => {
  const { t } = useTranslation()
  const [state, setState] = useState<TagRuleState>(initialState)

  // ✨ Use unified hook only if tagRules not provided as props
  const { 
    data: fetchedTagRules, 
    error: fetchedRulesError,
    refetch: refetchTagRules
  } = useTagRules(userId, { enabled: !propTagRules && !!userId })

  // Use provided tagRules or fetched tagRules
  const tagRules = propTagRules || (fetchedTagRules as ExtendedTagRule[])
  const actualRulesError = propTagRules ? rulesError : fetchedRulesError?.message

  // Fetch keyword suggestions
  const { allSuggestions: keywordSuggestions } = useKeywordSuggestions({
    userId,
    enabled: !!userId
  })


  const { mutate: createRule, isPending: creating } = useSupabaseMutation(
    async (supabase, variables: { 
      user_id: string;
      keywords: string[]; 
      location_keywords: string[]; 
      tag_id: string 
    }) => {
      const { data, error } = await supabase
        .from('tag_rules')
        .insert({
          user_id: variables.user_id,
          keywords: variables.keywords,
          location_keywords: variables.location_keywords,
          tag_id: variables.tag_id,
        })
        .select()
      
      if (error) throw error
      return data
    },
    {
      onSuccess: async () => {
        // Clear form and close dialog
        setState(prev => ({
          ...prev,
          newRule: { keywords: [], locationKeywords: [], selectedTag: '' },
          dialogOpen: false,
        }))
        
        // Invalidate/refetch cached rules to update UI promptly
        await refetchTagRules()
        
        // Clear tag cache since rules changed
        clearTagMapCache()
        
        // 🚀 AUTOMATICALLY REMATCH TAGS INSTEAD OF REQUIRING FULL SYNC
        try {
          const rematchResult = await rematchUserTags(userId)
          
          // Show success toast
          toast.success(t('pages.manageTags.tagRuleManager.toasts.ruleCreated'), {
            description: t('pages.manageTags.tagRuleManager.toasts.ruleCreatedDesc', {
              count: rematchResult.updated_count.toString(),
              total: rematchResult.total_events_processed.toString()
            }),
            duration: 4000,
          })
        } catch (error) {
          console.error('Failed to rematch tags after rule creation:', error)
          toast.error(t('pages.manageTags.tagRuleManager.toasts.applyError'), {
            description: t('pages.manageTags.tagRuleManager.toasts.applyErrorDesc'),
            duration: 5000,
          })
        }
      },
      onError: (error) => {
        console.error('Failed to create tag rule:', error)
        toast.error(t('pages.manageTags.tagRuleManager.toasts.createError'))
      }
    }
  )
  
  const { mutate: updateRule, isPending: updating } = useSupabaseMutation(
    async (supabase, variables: { 
      id: string;
      keywords: string[]; 
      location_keywords: string[]; 
      tag_id: string 
    }) => {
      const { data, error } = await supabase
        .from('tag_rules')
        .update({
          keywords: variables.keywords,
          location_keywords: variables.location_keywords,
          tag_id: variables.tag_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', variables.id)
        .select()
      
      if (error) throw error
      return data
    },
    {
      onSuccess: async () => {
        // Clear editing state and close dialog
        setState(prev => ({
          ...prev,
          editingRule: null,
          isEditing: false,
          dialogOpen: false,
        }))
        
        await refetchTagRules()
        
        // Clear tag cache since rules changed
        clearTagMapCache()
        
        // 🚀 AUTOMATICALLY REMATCH TAGS INSTEAD OF REQUIRING FULL SYNC
        try {
          const rematchResult = await rematchUserTags(userId)
          
          // Show success toast
          toast.success(t('pages.manageTags.tagRuleManager.toasts.ruleUpdated'), {
            description: t('pages.manageTags.tagRuleManager.toasts.ruleUpdatedDesc', {
              count: rematchResult.updated_count.toString(),
              total: rematchResult.total_events_processed.toString()
            }),
            duration: 4000,
          })
        } catch (error) {
          console.error('Failed to rematch tags after rule update:', error)
          toast.error(t('pages.manageTags.tagRuleManager.toasts.applyError'), {
            description: t('pages.manageTags.tagRuleManager.toasts.applyErrorDesc'),
            duration: 5000,
          })
        }
      },
      onError: (error) => {
        console.error('Failed to update tag rule:', error)
        toast.error(t('pages.manageTags.tagRuleManager.toasts.updateError'))
      }
    }
  )

  const { mutate: deleteRule } = useSupabaseMutation(
    async (supabase, ruleId: string) => {
      const { data, error } = await supabase
        .from('tag_rules')
        .delete()
        .eq('id', ruleId)
        .select()
      
      if (error) throw error
      return data
    },
    {
      onSuccess: async () => {
        // Refetch data to update UI
        await refetchTagRules()
        
        // Clear tag cache since rules changed
        clearTagMapCache()
        
        // 🚀 AUTOMATICALLY REMATCH TAGS INSTEAD OF REQUIRING FULL SYNC
        try {
          const rematchResult = await rematchUserTags(userId)
          
          // Show success toast
          toast.success(t('pages.manageTags.tagRuleManager.toasts.ruleDeleted'), {
            description: t('pages.manageTags.tagRuleManager.toasts.ruleDeletedDesc', {
              count: rematchResult.updated_count.toString(),
              total: rematchResult.total_events_processed.toString()
            }),
            duration: 4000,
          })
        } catch (error) {
          console.error('Failed to rematch tags after rule deletion:', error)
          toast.error(t('pages.manageTags.tagRuleManager.toasts.applyError'), {
            description: t('pages.manageTags.tagRuleManager.toasts.applyErrorDesc'),
            duration: 5000,
          })
        }
      },
      onError: (error) => {
        console.error('Failed to delete tag rule:', error)
        toast.error(t('pages.manageTags.tagRuleManager.toasts.deleteError'))
      }
    }
  )

  const handleAddRule = async () => {
    const hasKeywords = state.newRule.keywords.length > 0
    const hasLocationKeywords = state.newRule.locationKeywords.length > 0
    
    if ((!hasKeywords && !hasLocationKeywords) || !state.newRule.selectedTag) return

    createRule({
      user_id: userId,
      keywords: state.newRule.keywords,
      location_keywords: state.newRule.locationKeywords,
      tag_id: state.newRule.selectedTag,
    })
  }

  const handleUpdateRule = async () => {
    if (!state.editingRule) return

    const hasKeywords = state.newRule.keywords.length > 0
    const hasLocationKeywords = state.newRule.locationKeywords.length > 0
    
    if ((!hasKeywords && !hasLocationKeywords) || !state.newRule.selectedTag) return

    updateRule({
      id: state.editingRule.id,
      keywords: state.newRule.keywords,
      location_keywords: state.newRule.locationKeywords,
      tag_id: state.newRule.selectedTag,
    })
  }

  const handleDeleteRule = (ruleId: string) => {
    deleteRule(ruleId)
  }

  const handleEditRule = (rule: ExtendedTagRule) => {
    setState(prev => ({
      ...prev,
      editingRule: rule,
      isEditing: true,
      newRule: {
        keywords: rule.keywords || [],
        locationKeywords: rule.location_keywords || [],
        selectedTag: rule.tag_id,
      },
      dialogOpen: true,
    }))
  }

  const handleOpenCreateDialog = () => {
    setState(prev => ({
      ...prev,
      isEditing: false,
      editingRule: null,
      newRule: { keywords: [], locationKeywords: [], selectedTag: '' },
      dialogOpen: true,
    }))
  }

  const handleCloseDialog = () => {
    setState(prev => ({
      ...prev,
      dialogOpen: false,
      isEditing: false,
      editingRule: null,
    }))
  }

  const hasData = tagRules && availableTags

  // Use server data directly (no optimistic updates)
  const displayRules = hasData ? tagRules || [] : []

  // Show error toast
  React.useEffect(() => {
    if (actualRulesError) {
      toast.error(actualRulesError)
    }
  }, [actualRulesError])



  // Don't render if no data (parent DataLoader handles loading states)
  if (!hasData) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{t('pages.manageTags.tagRuleManager.noTagsAvailable')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <TagRulesCard
        rules={displayRules}
        tags={availableTags}
        onDeleteRule={handleDeleteRule}
        onEditRule={handleEditRule}
        onCreateRule={handleOpenCreateDialog}
        isCreating={creating}
        isUpdating={updating}
      />
      
      <TagRuleFormDialog
        isOpen={state.dialogOpen}
        onClose={handleCloseDialog}
        onSave={state.isEditing ? handleUpdateRule : handleAddRule}
        isEditing={state.isEditing}
        keywords={state.newRule.keywords}
        setKeywords={(value: string[]) =>
          setState(prev => ({
            ...prev,
            newRule: { ...prev.newRule, keywords: value },
          }))
        }
        locationKeywords={state.newRule.locationKeywords}
        setLocationKeywords={(value: string[]) =>
          setState(prev => ({
            ...prev,
            newRule: { ...prev.newRule, locationKeywords: value },
          }))
        }
        selectedTag={state.newRule.selectedTag}
        setSelectedTag={(value: string) =>
          setState(prev => ({
            ...prev,
            newRule: { ...prev.newRule, selectedTag: value },
          }))
        }
        editingRule={state.editingRule}
        setEditingRule={(rule: ExtendedTagRule | null) =>
          setState(prev => ({
            ...prev,
            editingRule: rule,
          }))
        }
        tags={availableTags}
        keywordSuggestions={keywordSuggestions || []}
        isCreating={creating}
        isUpdating={updating}
        userId={userId}
      />
    </div>
  )
} 