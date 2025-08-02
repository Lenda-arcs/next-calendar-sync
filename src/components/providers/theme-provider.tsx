'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { themeConfig, themeUtils } from '@/lib/design-system'

type ThemeVariant = keyof typeof themeConfig.variants

interface ThemeContextType {
  variant: ThemeVariant
  setVariant: (variant: ThemeVariant) => void
  availableVariants: Array<{
    key: ThemeVariant
    name: string
  }>
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

  // Apply theme on variant change
  useEffect(() => {
    themeUtils.applyTheme(variant)
    
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-theme-variant', variant)
    }
  }, [variant])

  // Load saved preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app-theme-variant') as ThemeVariant
      if (saved && saved in themeConfig.variants) {
        setVariant(saved)
      }
    }
  }, [])

  const availableVariants = Object.entries(themeConfig.variants).map(([key, config]) => ({
    key: key as ThemeVariant,
    name: config.name,
  }))

  const value: ThemeContextType = {
    variant,
    setVariant,
    availableVariants,
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