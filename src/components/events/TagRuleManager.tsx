'use client'

import React, { useState } from 'react'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { useSupabaseMutation } from '@/lib/hooks/useSupabaseMutation'
import { TagRule, Tag } from '@/lib/types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import DataLoader from '@/components/ui/data-loader'
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

  // Fetch tag rules for the user
  const { 
    data: tagRules, 
    isLoading: rulesLoading, 
    error: rulesError, 
    refetch: refetchRules 
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
    onSuccess: () => {
      setState((prev) => ({
        ...prev,
        newRule: { keyword: '', selectedTag: '' },
      }))
      refetchRules()
    },
  })

  // Delete tag rule mutation
  const { mutate: deleteRule, isLoading: deleting } = useSupabaseMutation({
    mutationFn: async (supabase, ruleId: string) => {
      const { data, error } = await supabase
        .from('tag_rules')
        .delete()
        .eq('id', ruleId)
        .select()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      refetchRules()
    },
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
    deleteRule(ruleId)
  }

  const error = rulesError || tagsError
  const errorMessage = error ? error.message || error.toString() : null
  const loading = rulesLoading || tagsLoading
  const data = tagRules && availableTags ? { rules: tagRules, tags: availableTags } : null

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {(creating || deleting) && (
        <Alert>
          <AlertDescription>
            {creating ? 'Adding rule...' : 'Deleting rule...'}
          </AlertDescription>
        </Alert>
      )}

      <DataLoader
        data={data}
        loading={loading}
        error={errorMessage}
        empty={
          <p className="text-muted-foreground text-center">
            No tag rules found. Create your first rule!
          </p>
        }
      >
        {(data) => (
          <TagRulesCard
            rules={data.rules}
            tags={data.tags}
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
          />
        )}
      </DataLoader>
    </div>
  )
} 