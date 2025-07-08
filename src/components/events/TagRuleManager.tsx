'use client'

import React, { useState } from 'react'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { useSupabaseMutation } from '@/lib/hooks/useSupabaseMutation'
import { useKeywordSuggestions } from '@/lib/hooks/useKeywordSuggestions'
import { TagRule, Tag } from '@/lib/types'
import { rematchUserTags } from '@/lib/rematch-utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import DataLoader from '@/components/ui/data-loader'
import { TagRulesSkeleton } from '@/components/ui/skeleton'
import { TagRulesCard } from './TagRulesCard'
import { TagRuleFormDialog } from './TagRuleFormDialog'

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
  availableTags?: Tag[] // Accept tags as props to avoid duplicate fetching
}

export const TagRuleManager: React.FC<Props> = ({ userId, availableTags: propTags }) => {
  const [state, setState] = useState<TagRuleState>(initialState)
  const [optimisticRules, setOptimisticRules] = useState<ExtendedTagRule[]>([])
  const [deletedRuleIds, setDeletedRuleIds] = useState<Set<string>>(new Set())

  // Fetch tag rules for the user
  const { 
    data: tagRules, 
    isLoading: rulesLoading, 
    error: rulesError
  } = useSupabaseQuery({
    queryKey: ['tag-rules', userId],
    fetcher: async (supabase) => {
      const { data, error } = await supabase
        .from('tag_rules')
        .select('*')
        .eq('user_id', userId)
      
      if (error) throw error
      return data as ExtendedTagRule[]
    },
  })

  // Fetch available tags for the user (only if not provided as props)
  const { 
    data: fetchedTags, 
    isLoading: tagsLoading, 
    error: tagsError 
  } = useSupabaseQuery({
    queryKey: ['tags', userId],
    fetcher: async (supabase) => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .or(`user_id.eq.${userId},user_id.is.null`)
        .order('name', { ascending: true })
      
      if (error) throw error
      return data as Tag[]
    },
    enabled: !propTags, // Only fetch if tags not provided as props
  })

  // Use provided tags or fetched tags
  const availableTags = propTags || fetchedTags

  // Fetch keyword suggestions
  const { allSuggestions: keywordSuggestions, isLoading: suggestionsLoading } = useKeywordSuggestions({
    userId,
    enabled: !!userId
  })

  // Create tag rule mutation
  const { mutate: createRule, isLoading: creating } = useSupabaseMutation({
    mutationFn: async (supabase, variables: { 
      user_id: string; 
      keywords: string[]; 
      location_keywords: string[]; 
      tag_id: string 
    }) => {
      const { data, error } = await supabase
        .from('tag_rules')
        .insert([variables])
        .select()
      
      if (error) throw error
      return data
    },
    onSuccess: async (data) => {
      // Clear form and close dialog
      setState((prev) => ({
        ...prev,
        newRule: { keywords: [], locationKeywords: [], selectedTag: '' },
        dialogOpen: false,
      }))
      
      // Add the new rule to optimistic state
      if (data && data[0]) {
        setOptimisticRules(prev => [...prev, data[0]])
      }
      
      // 🚀 AUTOMATICALLY REMATCH TAGS INSTEAD OF REQUIRING FULL SYNC
      try {
        const rematchResult = await rematchUserTags(userId)
        
        // Show success toast
        toast.success('Tag Rule Created!', {
          description: `${rematchResult.updated_count} out of ${rematchResult.total_events_processed} events were re-tagged with your new rule.`,
          duration: 4000,
        })
      } catch (error) {
        console.error('Failed to rematch tags after rule creation:', error)
        toast.error('Failed to apply new tag rule', {
          description: 'The rule was created but could not be applied to existing events.',
          duration: 5000,
        })
      }
    },
    onError: () => {
      // Clear optimistic state on error
      setOptimisticRules([])
      console.error('Failed to create tag rule')
    }
  })

  // Update tag rule mutation
  const { mutate: updateRule, isLoading: updating } = useSupabaseMutation({
    mutationFn: async (supabase, variables: { 
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
    onSuccess: async (data) => {
      // Clear editing state and close dialog
      setState((prev) => ({
        ...prev,
        editingRule: null,
        isEditing: false,
        dialogOpen: false,
      }))
      
      // Update optimistic state
      if (data && data[0]) {
        setOptimisticRules(prev => prev.map(rule => 
          rule.id === data[0].id ? { ...rule, ...data[0] } : rule
        ))
      }
      
      // 🚀 AUTOMATICALLY REMATCH TAGS INSTEAD OF REQUIRING FULL SYNC
      try {
        const rematchResult = await rematchUserTags(userId)
        
        // Show success toast
        toast.success('Tag Rule Updated!', {
          description: `${rematchResult.updated_count} out of ${rematchResult.total_events_processed} events were re-tagged with your updated rule.`,
          duration: 4000,
        })
      } catch (error) {
        console.error('Failed to rematch tags after rule update:', error)
        toast.error('Failed to apply updated tag rule', {
          description: 'The rule was updated but could not be applied to existing events.',
          duration: 5000,
        })
      }
    },
    onError: () => {
      console.error('Failed to update tag rule')
    }
  })

  // Delete tag rule mutation
  const { mutate: deleteRule } = useSupabaseMutation({
    mutationFn: async (supabase, ruleId: string) => {
      const { data, error } = await supabase
        .from('tag_rules')
        .delete()
        .eq('id', ruleId)
        .select()
      
      if (error) throw error
      return data
    },
    onSuccess: async (_, ruleId) => {
      // Mark as deleted in optimistic state
      setDeletedRuleIds(prev => new Set([...prev, ruleId]))
      
      // Remove from optimistic additions if it was recently added
      setOptimisticRules(prev => prev.filter(rule => rule.id !== ruleId))
      
      // 🚀 AUTOMATICALLY REMATCH TAGS INSTEAD OF REQUIRING FULL SYNC
      try {
        const rematchResult = await rematchUserTags(userId)
        
        // Show success toast
        toast.success('Tag Rule Deleted!', {
          description: `${rematchResult.updated_count} out of ${rematchResult.total_events_processed} events were re-tagged after removing the rule.`,
          duration: 4000,
        })
      } catch (error) {
        console.error('Failed to rematch tags after rule deletion:', error)
        toast.error('Failed to apply tag changes', {
          description: 'The rule was deleted but changes could not be applied to existing events.',
          duration: 5000,
        })
      }
    },
    onError: (_, ruleId) => {
      // Remove from deleted set to restore the rule
      setDeletedRuleIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(ruleId)
        return newSet
      })
      console.error('Failed to delete tag rule')
    }
  })

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

  const handleEditRule = (rule: ExtendedTagRule) => {
    setState((prev) => ({
      ...prev,
      editingRule: rule,
      isEditing: true,
      dialogOpen: true,
    }))
  }

  const handleOpenCreateDialog = () => {
    setState((prev) => ({
      ...prev,
      editingRule: null,
      isEditing: false,
      dialogOpen: true,
    }))
  }

  const handleCloseDialog = () => {
    setState((prev) => ({
      ...prev,
      editingRule: null,
      isEditing: false,
      dialogOpen: false,
    }))
  }

  const handleUpdateRule = async () => {
    if (!state.editingRule) return
    
    const hasKeywords = (state.editingRule.keywords?.length || 0) > 0
    const hasLocationKeywords = (state.editingRule.location_keywords?.length || 0) > 0
    
    if ((!hasKeywords && !hasLocationKeywords) || !state.editingRule.tag_id) return

    updateRule({
      id: state.editingRule.id,
      keywords: state.editingRule.keywords || [],
      location_keywords: state.editingRule.location_keywords || [],
      tag_id: state.editingRule.tag_id,
    })
  }



  const handleDeleteRule = async (ruleId: string) => {
    // Optimistically mark as deleted
    setDeletedRuleIds(prev => new Set([...prev, ruleId]))
    
    // Remove from optimistic additions if it was recently added
    setOptimisticRules(prev => prev.filter(rule => rule.id !== ruleId))
    
    deleteRule(ruleId)
  }

  const error = rulesError || tagsError
  const errorMessage = error ? error.message || error.toString() : null
  const initialLoading = rulesLoading || (propTags ? false : tagsLoading)
  const hasData = tagRules && availableTags

  // Combine server data with optimistic updates
  const displayRules = hasData ? [
    // Server rules that haven't been deleted
    ...(tagRules || []).filter(rule => !deletedRuleIds.has(rule.id)),
    // Optimistically added rules
    ...optimisticRules
  ] : []

  const data = hasData ? { 
    rules: displayRules, 
    tags: availableTags, 
    keywordSuggestions: keywordSuggestions || [] 
  } : null

  return (
    <div className="space-y-8">
      {/* Loading States */}
      {(creating || updating || (error && !initialLoading)) && (
        <Alert variant={error ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {error ? "Error" : creating ? "Creating Rule" : "Updating Rule"}
          </AlertTitle>
          <AlertDescription>
            {error ? errorMessage : creating ? "Adding new tag rule..." : "Updating tag rule..."}
          </AlertDescription>
        </Alert>
      )}

      <DataLoader
        data={data}
        loading={initialLoading}
        error={errorMessage}
        skeleton={TagRulesSkeleton}
        skeletonCount={1}
        empty={
          <div className="text-center py-8 text-muted-foreground">
            <p>No tags available. Create some tags first to set up tag rules.</p>
          </div>
        }
      >
        {(data) => (
          <>
            <TagRulesCard
              rules={data.rules}
              tags={data.tags}
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
                setState((prev) => ({
                  ...prev,
                  newRule: { ...prev.newRule, keywords: value },
                }))
              }
              locationKeywords={state.newRule.locationKeywords}
              setLocationKeywords={(value: string[]) =>
                setState((prev) => ({
                  ...prev,
                  newRule: { ...prev.newRule, locationKeywords: value },
                }))
              }
              selectedTag={state.newRule.selectedTag}
              setSelectedTag={(value: string) =>
                setState((prev) => ({
                  ...prev,
                  newRule: { ...prev.newRule, selectedTag: value },
                }))
              }
              editingRule={state.editingRule}
              setEditingRule={(rule: ExtendedTagRule | null) =>
                setState((prev) => ({
                  ...prev,
                  editingRule: rule,
                }))
              }
              tags={data.tags}
              keywordSuggestions={data.keywordSuggestions}
              isCreating={creating}
              isUpdating={updating}
              suggestionsLoading={suggestionsLoading}
            />
          </>
        )}
      </DataLoader>
    </div>
  )
} 