'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase'
import { Tables } from '../../../database-generated.types'
import { EventTag } from '@/lib/event-types'

// Use database-generated types
export type AppTag = Tables<'tags'>
export type AppTagRule = Tables<'tag_rules'>

interface TagsState {
  // Data
  tags: AppTag[]
  tagRules: AppTagRule[]
  eventTags: EventTag[] // Processed tags for UI
  loading: boolean
  error: string | null
  lastFetch: number | null

  // Actions
  fetchTags: (userId: string) => Promise<void>
  fetchTagRules: (userId: string) => Promise<void>
  createTag: (tag: Omit<AppTag, 'id'>) => Promise<void>
  updateTag: (tagId: string, updates: Partial<AppTag>) => Promise<void>
  deleteTag: (tagId: string) => Promise<void>
  createTagRule: (rule: Omit<AppTagRule, 'id'>) => Promise<void>
  deleteTagRule: (ruleId: string) => Promise<void>
  processTagsForUI: () => void
  clearTags: () => void
}

export const useTagsStore = create<TagsState>()(
  persist(
    (set, get) => ({
      // Initial state
      tags: [],
      tagRules: [],
      eventTags: [],
      loading: false,
      error: null,
      lastFetch: null,

      // Fetch tags from database
      fetchTags: async (userId: string) => {
        const { lastFetch } = get()
        const now = Date.now()
        
        console.log('Tags store - fetchTags called with userId:', userId)
        console.log('Tags store - lastFetch:', lastFetch, 'now:', now)
        
        // Temporarily disable caching for debugging
        // Skip if fetched within last 5 minutes
        // if (lastFetch && now - lastFetch < 5 * 60 * 1000) {
        //   console.log('Tags store - Skipping fetch due to cache')
        //   return
        // }

        set({ loading: true, error: null })

        try {
          const supabase = createClient()
          console.log('Tags store - Fetching tags for user:', userId)
          
          const { data, error } = await supabase
            .from('tags')
            .select('*')
            .eq('user_id', userId)
            .order('priority', { ascending: false })

          console.log('Tags store - Query result:', { data, error })

          if (error) {
            console.error('Tags store - Database error:', error)
            throw error
          }

          const tags = data || []
          console.log('Tags store - Tags fetched from database:', tags.length, tags)
          
          // Debug: Check if there are any tags in the database at all
          const { data: allTags } = await supabase
            .from('tags')
            .select('id, name, user_id')
            .limit(5)
          
          console.log('Tags store - Sample tags in database:', allTags?.length || 0, allTags)
          
          set({ 
            tags, 
            loading: false, 
            lastFetch: now 
          })

          // Process tags for UI
          get().processTagsForUI()

        } catch (error) {
          console.error('Error fetching tags:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch tags',
            loading: false 
          })
        }
      },

      // Fetch tag rules from database
      fetchTagRules: async (userId: string) => {
        try {
          const supabase = createClient()
          const { data, error } = await supabase
            .from('tag_rules')
            .select('*')
            .eq('user_id', userId)

          if (error) throw error

          set({ tagRules: data || [] })

        } catch (error) {
          console.error('Error fetching tag rules:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to fetch tag rules' })
        }
      },

      // Create new tag
      createTag: async (tag: Omit<AppTag, 'id'>) => {
        try {
          const supabase = createClient()
          const { data, error } = await supabase
            .from('tags')
            .insert(tag)
            .select()
            .single()

          if (error) throw error

          // Update local state
          set(state => ({
            tags: [...state.tags, data]
          }))

          // Process tags for UI
          get().processTagsForUI()

        } catch (error) {
          console.error('Error creating tag:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to create tag' })
        }
      },

      // Update tag
      updateTag: async (tagId: string, updates: Partial<AppTag>) => {
        try {
          const supabase = createClient()
          const { error } = await supabase
            .from('tags')
            .update(updates)
            .eq('id', tagId)

          if (error) throw error

          // Update local state
          set(state => ({
            tags: state.tags.map(tag =>
              tag.id === tagId ? { ...tag, ...updates } : tag
            )
          }))

          // Process tags for UI
          get().processTagsForUI()

        } catch (error) {
          console.error('Error updating tag:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to update tag' })
        }
      },

      // Delete tag
      deleteTag: async (tagId: string) => {
        try {
          const supabase = createClient()
          const { error } = await supabase
            .from('tags')
            .delete()
            .eq('id', tagId)

          if (error) throw error

          // Update local state
          set(state => ({
            tags: state.tags.filter(tag => tag.id !== tagId)
          }))

          // Process tags for UI
          get().processTagsForUI()

        } catch (error) {
          console.error('Error deleting tag:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to delete tag' })
        }
      },

      // Create tag rule
      createTagRule: async (rule: Omit<AppTagRule, 'id'>) => {
        try {
          const supabase = createClient()
          const { data, error } = await supabase
            .from('tag_rules')
            .insert(rule)
            .select()
            .single()

          if (error) throw error

          // Update local state
          set(state => ({
            tagRules: [...state.tagRules, data]
          }))

        } catch (error) {
          console.error('Error creating tag rule:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to create tag rule' })
        }
      },

      // Delete tag rule
      deleteTagRule: async (ruleId: string) => {
        try {
          const supabase = createClient()
          const { error } = await supabase
            .from('tag_rules')
            .delete()
            .eq('id', ruleId)

          if (error) throw error

          // Update local state
          set(state => ({
            tagRules: state.tagRules.filter(rule => rule.id !== ruleId)
          }))

        } catch (error) {
          console.error('Error deleting tag rule:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to delete tag rule' })
        }
      },

      // Process tags for UI components (convert to EventTag format)
      processTagsForUI: () => {
        const { tags } = get()
        
        const eventTags: EventTag[] = tags.map(tag => ({
          id: tag.id,
          name: tag.name,
          color: tag.color,
          imageUrl: tag.image_url,
          classType: tag.class_type ? [tag.class_type] : null,
          audience: tag.audience,
          cta: tag.cta_label && tag.cta_url ? {
            label: tag.cta_label,
            url: tag.cta_url
          } : null,
          chip: {
            color: tag.color || '#6B7280'
          },
          priority: tag.priority
        }))

        set({ eventTags })
      },

      // Clear tags (for logout)
      clearTags: () => {
        set({
          tags: [],
          tagRules: [],
          eventTags: [],
          loading: false,
          error: null,
          lastFetch: null
        })
      }
    }),
    {
      name: 'tags-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tags: state.tags,
        tagRules: state.tagRules,
        lastFetch: state.lastFetch
      })
    }
  )
) 