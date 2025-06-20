'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase'
import { Tables } from '../../../database-generated.types'

// Use database-generated types
export type AppUser = Tables<'users'>

interface UserState {
  // Data
  user: AppUser | null
  loading: boolean
  error: string | null
  lastFetch: number | null

  // Actions
  fetchUser: (userId: string) => Promise<void>
  updateUser: (updates: Partial<AppUser>) => Promise<void>
  setUser: (user: AppUser | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      loading: false,
      error: null,
      lastFetch: null,

      // Fetch user from database
      fetchUser: async (userId: string) => {
        const { lastFetch } = get()
        const now = Date.now()
        
        // Skip if fetched within last 10 minutes
        if (lastFetch && now - lastFetch < 10 * 60 * 1000) {
          return
        }

        set({ loading: true, error: null })

        try {
          const supabase = createClient()
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()

          if (error) throw error

          set({ 
            user: data, 
            loading: false, 
            lastFetch: now 
          })

        } catch (error) {
          console.error('Error fetching user:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch user',
            loading: false 
          })
        }
      },

      // Update user
      updateUser: async (updates: Partial<AppUser>) => {
        const { user } = get()
        if (!user) return

        try {
          const supabase = createClient()
          const { error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', user.id)

          if (error) throw error

          // Update local state
          set(state => ({
            user: state.user ? { ...state.user, ...updates } : null
          }))

        } catch (error) {
          console.error('Error updating user:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to update user' })
        }
      },

      // Set user (for auth changes)
      setUser: (user: AppUser | null) => {
        set({ user })
      },

      // Clear user (for logout)
      clearUser: () => {
        set({
          user: null,
          loading: false,
          error: null,
          lastFetch: null
        })
      }
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        lastFetch: state.lastFetch
      })
    }
  )
) 