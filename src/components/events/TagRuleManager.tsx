'use client'

import React, { useState } from 'react'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { useSupabaseMutation } from '@/lib/hooks/useSupabaseMutation'
import { TagRule, Tag } from '@/lib/types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import { TagRulesCard } from './TagRulesCard'

interface TagRuleState {
  newRule: {
    keyword: string
    selectedTag: string
  }
}

const initialState: TagRuleState = {
  newRule: {
    keyword: '',
    selectedTag: '',
  },
}

interface Props {
  userId: string
}

export const TagRuleManager: React.FC<Props> = ({ userId }) => {
  const [state, setState] = useState<TagRuleState>(initialState)
  const [optimisticRules, setOptimisticRules] = useState<TagRule[]>([])
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
      return data as TagRule[]
    },
  })

  // Fetch available tags for the user
  const { 
    data: availableTags, 
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
  })

  // Create tag rule mutation
  const { mutate: createRule, isLoading: creating } = useSupabaseMutation({
    mutationFn: async (supabase, variables: { user_id: string; keyword: string; tag_id: string }) => {
      const { data, error } = await supabase
        .from('tag_rules')
        .insert([variables])
        .select()
      
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      // Clear form
      setState((prev) => ({
        ...prev,
        newRule: { keyword: '', selectedTag: '' },
      }))
      
      // Add the new rule to optimistic state
      if (data && data[0]) {
        setOptimisticRules(prev => [...prev, data[0]])
      }
      
      // No refetch - trust the database operation succeeded
    },
    onError: () => {
      // Clear optimistic state on error
      setOptimisticRules([])
      console.error('Failed to create tag rule')
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
    onSuccess: (_, ruleId) => {
      // Mark as deleted in optimistic state
      setDeletedRuleIds(prev => new Set([...prev, ruleId]))
      
      // Remove from optimistic additions if it was recently added
      setOptimisticRules(prev => prev.filter(rule => rule.id !== ruleId))
      
      // No refetch - trust the database operation succeeded
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
    if (!state.newRule.keyword.trim() || !state.newRule.selectedTag) return

    createRule({
      user_id: userId,
      keyword: state.newRule.keyword.trim(),
      tag_id: state.newRule.selectedTag,
    })
  }

  const handleDeleteRule = async (ruleId: string) => {
    console.log('Delete rule called:', ruleId)
    
    // Optimistically mark as deleted
    setDeletedRuleIds(prev => new Set([...prev, ruleId]))
    
    // Remove from optimistic additions if it was recently added
    setOptimisticRules(prev => prev.filter(rule => rule.id !== ruleId))
    
    deleteRule(ruleId)
  }

  const error = rulesError || tagsError
  const errorMessage = error ? error.message || error.toString() : null
  const initialLoading = rulesLoading || tagsLoading
  const hasData = tagRules && availableTags

  // Debug logging
  console.log('TagRuleManager render:', {
    rulesLoading,
    tagsLoading,
    initialLoading,
    hasData: !!hasData,
    rulesCount: tagRules?.length || 0,
    optimisticCount: optimisticRules.length,
    deletedCount: deletedRuleIds.size
  })

  // Combine server data with optimistic updates
  const displayRules = hasData ? [
    // Server rules that haven't been deleted
    ...(tagRules || []).filter(rule => !deletedRuleIds.has(rule.id)),
    // Optimistically added rules
    ...optimisticRules
  ] : []

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}



      {/* Initial loading state */}
      {initialLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading tag rules...</span>
        </div>
      )}

      {/* Error state */}
      {!initialLoading && error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Empty state */}
      {!initialLoading && !error && hasData && displayRules.length === 0 && availableTags.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No tags available. Create some tags first to set up tag rules.</p>
        </div>
      )}

      {/* Main content */}
      {!initialLoading && !error && hasData && (
        <TagRulesCard
          rules={displayRules}
          tags={availableTags}
          onDeleteRule={handleDeleteRule}
          onAddRule={handleAddRule}
          newKeyword={state.newRule.keyword}
          setNewKeyword={(value: string) =>
            setState((prev) => ({
              ...prev,
              newRule: { ...prev.newRule, keyword: value },
            }))
          }
          selectedTag={state.newRule.selectedTag}
          setSelectedTag={(value: string) =>
            setState((prev) => ({
              ...prev,
              newRule: { ...prev.newRule, selectedTag: value },
            }))
          }
          isCreating={creating}
        />
      )}
    </div>
  )
} 