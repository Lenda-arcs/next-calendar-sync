'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Language, Translations, DEFAULT_LANGUAGE } from './types'
import { 
  loadTranslations, 
  saveLanguage, 
  getInitialLanguage, 
  validateLanguage,
  getNestedTranslation 
} from './utils'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  translations: Translations | null
  isLoading: boolean
  t: (key: string, values?: Record<string, string>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export interface LanguageProviderProps {
  children: ReactNode
  initialLanguage?: Language
}

export function LanguageProvider({ children, initialLanguage }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(
    initialLanguage || getInitialLanguage()
  )
  const [translations, setTranslations] = useState<Translations | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load translations when language changes
  useEffect(() => {
    const loadLanguageTranslations = async () => {
      setIsLoading(true)
      try {
        const newTranslations = await loadTranslations(language)
        setTranslations(newTranslations)
      } catch (error) {
        console.error('Failed to load translations:', error)
        // Fallback to default language if current language fails
        if (language !== DEFAULT_LANGUAGE) {
          try {
            const fallbackTranslations = await loadTranslations(DEFAULT_LANGUAGE)
            setTranslations(fallbackTranslations)
          } catch (fallbackError) {
            console.error('Failed to load fallback translations:', fallbackError)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadLanguageTranslations()
  }, [language])

  // Set language with validation and persistence
  const setLanguage = (newLanguage: Language) => {
    const validatedLanguage = validateLanguage(newLanguage)
    setLanguageState(validatedLanguage)
    saveLanguage(validatedLanguage)
  }

  // Translation function with interpolation support
  const t = (key: string, values?: Record<string, string>): string => {
    if (!translations) {
      return key
    }

    let translation = getNestedTranslation(translations, key)
    
    // Handle interpolation if values are provided
    if (values && typeof translation === 'string') {
      Object.entries(values).forEach(([placeholder, value]) => {
        translation = translation.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), value)
      })
    }

    return translation
  }

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    translations,
    isLoading,
    t
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

// Custom hook to use language context
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// HOC for class components
export function withLanguage<P extends object>(
  Component: React.ComponentType<P & { language: LanguageContextType }>
) {
  return function LanguageComponent(props: P) {
    const languageContext = useLanguage()
    return <Component {...props} language={languageContext} />
  }
}

// Utility hook for translation only
export function useTranslation() {
  const { t, language, isLoading } = useLanguage()
  return { t, language, isLoading }
}

// Utility hook for getting specific translation namespaces
export function useTranslationNamespace(namespace: string) {
  const { t, language, isLoading } = useLanguage()
  
  const namespacedT = (key: string, values?: Record<string, string>) => {
    return t(`${namespace}.${key}`, values)
  }

  return { t: namespacedT, language, isLoading }
} 