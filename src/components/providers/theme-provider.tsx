'use client'

import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { themeConfig, themeUtils } from '@/lib/design-system'
import { useAuthUser } from '@/lib/hooks/useAuthUser'
import { createClient } from '@/lib/supabase'

type ThemeVariant = keyof typeof themeConfig.variants

interface ThemeContextType {
  variant: ThemeVariant
  setVariant: (variant: ThemeVariant) => void // Final UI state update
  setVariantPreview: (variant: ThemeVariant) => void // Preview only
  availableVariants: Array<{
    key: ThemeVariant
    name: string
  }>
  isLoading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultVariant?: ThemeVariant
}

export function ThemeProvider({ 
  children, 
  defaultVariant = 'default'
}: ThemeProviderProps) {
  const [variant, setVariant] = useState<ThemeVariant>(defaultVariant)
  // Start as not loading if we have a server-provided theme
  const [isLoading, setIsLoading] = useState(defaultVariant === 'default')
  const { user } = useAuthUser()
  const supabase = createClient()





  // Preview function - changes UI immediately but doesn't save
  const handleSetVariantPreview = (newVariant: ThemeVariant) => {
    setVariant(newVariant)
    // No database save - just visual preview
  }

  // Final save function - only updates UI state and localStorage
  // Database save is handled by ProfileClient's existing update mechanism
  const handleSetVariant = (newVariant: ThemeVariant) => {
    setVariant(newVariant)
    
    // Save to localStorage as backup
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-theme-variant', newVariant)
    }
  }

  // Apply theme synchronously to prevent flicker
  useLayoutEffect(() => {
    themeUtils.applyTheme(variant)
  }, [variant])

  // Load theme preference only if no server-provided theme
  useEffect(() => {
    // If we already have a server-provided theme (not default), skip loading
    if (defaultVariant !== 'default') {
      return
    }

    const loadTheme = async () => {
      setIsLoading(true)

      if (user?.id) {
        // Try to load from database first
        try {
          const { data, error } = await supabase
            .from('users')
            .select('theme_variant')
            .eq('id', user.id)
            .single()

          if (!error && data?.theme_variant && data.theme_variant in themeConfig.variants) {
            setVariant(data.theme_variant as ThemeVariant)
          } else {
            // Fallback to localStorage if no database preference
            const localTheme = localStorage.getItem('app-theme-variant') as ThemeVariant
            if (localTheme && localTheme in themeConfig.variants) {
              setVariant(localTheme)
              // Note: Database sync happens through ProfileClient's update mechanism
            }
          }
        } catch (error) {
          console.error('Error loading theme preference:', error)
          // Fallback to localStorage
          const localTheme = localStorage.getItem('app-theme-variant') as ThemeVariant
          if (localTheme && localTheme in themeConfig.variants) {
            setVariant(localTheme)
          }
        }
      } else {
        // Not logged in, use localStorage
        const localTheme = localStorage.getItem('app-theme-variant') as ThemeVariant
        if (localTheme && localTheme in themeConfig.variants) {
          setVariant(localTheme)
        }
      }

      setIsLoading(false)
    }

    loadTheme()
  }, [user?.id, supabase, defaultVariant])

  const availableVariants = Object.entries(themeConfig.variants).map(([key, config]) => ({
    key: key as ThemeVariant,
    name: config.name,
  }))

  const value: ThemeContextType = {
    variant,
    setVariant: handleSetVariant,
    setVariantPreview: handleSetVariantPreview,
    availableVariants,
    isLoading,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useAppTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider')
  }
  return context
}

// Hook for getting theme-specific classes
export function useThemeClasses() {
  const { variant } = useAppTheme()
  return themeUtils.getThemeClasses(variant)
}