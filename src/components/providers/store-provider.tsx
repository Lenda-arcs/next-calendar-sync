'use client'

import { useEffect } from 'react'
import { useEventsStore, useTagsStore, useUserStore } from '@/lib/stores'
import { createClient } from '@/lib/supabase'

interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  const fetchEvents = useEventsStore(state => state.fetchEvents)
  const fetchTags = useTagsStore(state => state.fetchTags)
  const fetchTagRules = useTagsStore(state => state.fetchTagRules)
  const fetchUser = useUserStore(state => state.fetchUser)
  const enhanceEventsWithTags = useEventsStore(state => state.enhanceEventsWithTags)
  const eventTags = useTagsStore(state => state.eventTags)
  
  const clearEvents = useEventsStore(state => state.clearEvents)
  const clearTags = useTagsStore(state => state.clearTags)
  const clearUser = useUserStore(state => state.clearUser)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      console.log('StoreProvider - Initial session:', session?.user?.id)
      
      if (session?.user) {
        console.log('StoreProvider - Initializing stores for user:', session.user.id)
        // Initialize all stores with user data
        try {
          console.log('StoreProvider - About to call fetchUser...')
          await fetchUser(session.user.id)
          console.log('StoreProvider - fetchUser completed')
          
          console.log('StoreProvider - About to call fetchTags...')
          await fetchTags(session.user.id)
          console.log('StoreProvider - fetchTags completed')
          
          console.log('StoreProvider - About to call fetchTagRules...')
          await fetchTagRules(session.user.id)
          console.log('StoreProvider - fetchTagRules completed')
          
          console.log('StoreProvider - About to call fetchEvents...')
          await fetchEvents(session.user.id)
          console.log('StoreProvider - fetchEvents completed')
          
          console.log('StoreProvider - All stores initialized successfully')
        } catch (error) {
          console.error('StoreProvider - Error initializing stores:', error)
        }
      } else {
        console.log('StoreProvider - No user session found')
        
        // For development: try to initialize with a default user ID if in development mode
        if (process.env.NODE_ENV === 'development') {
          console.log('StoreProvider - Development mode: attempting to load with default user')
          try {
            // Try to fetch any user from the database for development
            const { data: users } = await supabase
              .from('users')
              .select('id')
              .limit(1)
            
            if (users && users.length > 0) {
              const userId = users[0].id
              console.log('StoreProvider - Using development user:', userId)
              await Promise.all([
                fetchUser(userId),
                fetchTags(userId),
                fetchTagRules(userId),
                fetchEvents(userId)
              ])
            } else {
              console.log('StoreProvider - No users found in database')
            }
          } catch (error) {
            console.error('StoreProvider - Error fetching development user:', error)
          }
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // User signed in - initialize stores
          console.log('StoreProvider - User signed in:', session.user.id)
          await Promise.all([
            fetchUser(session.user.id),
            fetchTags(session.user.id),
            fetchTagRules(session.user.id),
            fetchEvents(session.user.id)
          ])
        } else if (event === 'SIGNED_OUT') {
          // User signed out - clear stores
          console.log('StoreProvider - User signed out')
          clearEvents()
          clearTags()
          clearUser()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchEvents, fetchTags, fetchTagRules, fetchUser, clearEvents, clearTags, clearUser])

  // Enhance events with tags when tags are loaded
  useEffect(() => {
    if (eventTags.length > 0) {
      enhanceEventsWithTags(eventTags)
    }
  }, [eventTags, enhanceEventsWithTags])

  return <>{children}</>
} 