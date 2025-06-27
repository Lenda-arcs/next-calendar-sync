'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

interface UseAuthUserReturn {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

export function useAuthUser(): UseAuthUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Handle different auth events
        if (event === 'SIGNED_IN') {
          // User signed in - could trigger additional setup here
        } else if (event === 'SIGNED_OUT') {
          // User signed out - cleanup if needed
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    signOut
  }
} 