'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<Session | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
  initialUser?: User | null
  initialSession?: Session | null
}

export function AuthProvider({ 
  children, 
  initialUser = null, 
  initialSession = null 
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [session, setSession] = useState<Session | null>(initialSession)
  const [loading, setLoading] = useState(!initialUser) // Don't load if we have initial user
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    // Get initial session if not provided
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    }

    // Only get session if we don't have initial data
    if (!initialUser && !initialSession) {
      getInitialSession()
    } else {
      setLoading(false)
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in:', session?.user?.email)
            break
          case 'SIGNED_OUT':
            console.log('User signed out')
            // Clear any local storage or cached data
            router.refresh()
            break
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed')
            break
          case 'USER_UPDATED':
            console.log('User updated')
            break
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase.auth, router, initialUser, initialSession])

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        throw error
      }
    } finally {
      setLoading(false)
    }
  }

  const refreshSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Refresh session error:', error)
      throw error
    }
    
    setSession(session)
    setUser(session?.user ?? null)
    
    return session
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signOut,
    refreshSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Convenience hook for protected routes
export function useRequireAuth() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in')
    }
  }, [user, loading, router])

  return { user, loading }
} 