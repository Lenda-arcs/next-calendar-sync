import { Language, Translations, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, LOCALES } from './derived-types'
import { useState, useEffect } from 'react'

// Validation function
export function validateLanguage(language: string | undefined): Language {
  return language && SUPPORTED_LANGUAGES.includes(language as Language) 
    ? (language as Language) 
    : DEFAULT_LANGUAGE
}

// Get locale configuration
export function getLocaleConfig(language: Language) {
  return LOCALES[language]
}

// Format date according to locale
export function formatDate(date: Date, language: Language): string {
  return date.toLocaleDateString(getLocaleString(language), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// Format time according to locale
export function formatTime(date: Date, language: Language): string {
  return date.toLocaleTimeString(getLocaleString(language), {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Format datetime according to locale
export function formatDateTime(date: Date, language: Language): string {
  return date.toLocaleString(getLocaleString(language), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get browser locale string
function getLocaleString(language: Language): string {
  const localeMap: Record<Language, string> = {
    en: 'en-US',
    de: 'de-DE',
    es: 'es-ES'
  }
  return localeMap[language]
}

// Get nested translation value
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getNestedTranslation(obj: Record<string, any>, path: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return path.split('.').reduce((current: any, key: string) => {
    return current?.[key]
  }, obj) || path
}

// Storage keys for persistence
export const STORAGE_KEYS = {
  LANGUAGE: 'calendar-sync-language'
} as const

// Get saved language from cookie (consistent with server-side detection)
export function getSavedLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE
  
  try {
    // Read from the same cookie that the server sets
    const cookies = document.cookie.split(';')
    const languageCookie = cookies.find(cookie => cookie.trim().startsWith('language='))
    const saved = languageCookie?.split('=')[1]?.trim()
    return validateLanguage(saved || undefined)
  } catch {
    return DEFAULT_LANGUAGE
  }
}

// Save language to cookie (consistent with server-side approach)
export function saveLanguage(language: Language): void {
  if (typeof window === 'undefined') return
  
  try {
    // Set the same cookie that the server expects
    const maxAge = 60 * 60 * 24 * 365 // 1 year
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `language=${language}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`
    
    // Also save to localStorage as backup for client-only components
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language)
  } catch {
    // Ignore cookie/localStorage errors
  }
}

// Detect browser language
export function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE
  
  const browserLang = navigator.language.split('-')[0]
  return validateLanguage(browserLang)
}

// Get initial language with hydration-safe approach
export function getInitialLanguage(): Language {
  // During SSR, always return default language to prevent hydration mismatch
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE
  
  const saved = getSavedLanguage()
  if (saved !== DEFAULT_LANGUAGE) return saved
  
  return detectBrowserLanguage()
}

// Hydration-safe language hook for components
export function useHydrationSafeLanguage(): Language {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // During SSR and initial hydration, use default language
  if (!isClient) return DEFAULT_LANGUAGE
  
  // After hydration, use the actual detected language
  return getInitialLanguage()
}

// Translation loading utilities
export async function loadTranslations(language: Language): Promise<Translations> {
  try {
    const translationModule = await import(`./translations/${language}`)
    return translationModule.default
  } catch {
    console.warn(`Failed to load translations for ${language}, falling back to English`)
    const fallback = await import('./translations/en')
    return fallback.default
  }
}

// Translation key validation (for development)
export function validateTranslationKey(key: string): boolean {
  // Basic validation - could be extended with more sophisticated checks
  return key.length > 0 && !key.includes('..') && !key.startsWith('.') && !key.endsWith('.')
}

// Pluralization helper
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return singular
  return plural || `${singular}s`
}

// Number formatting by locale
export function formatNumber(num: number, language: Language): string {
  return num.toLocaleString(getLocaleString(language))
}

// Currency formatting by locale
export function formatCurrency(amount: number, language: Language, currency: string = 'EUR'): string {
  return new Intl.NumberFormat(getLocaleString(language), {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// Relative time formatting
export function formatRelativeTime(date: Date, language: Language): string {
  const now = new Date()
  const diffInMs = date.getTime() - now.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (Math.abs(diffInDays) === 0) {
    return language === 'de' ? 'heute' : language === 'es' ? 'hoy' : 'today'
  } else if (diffInDays === 1) {
    return language === 'de' ? 'morgen' : language === 'es' ? 'mañana' : 'tomorrow'
  } else if (diffInDays === -1) {
    return language === 'de' ? 'gestern' : language === 'es' ? 'ayer' : 'yesterday'
  } else {
    return formatDate(date, language)
  }
} 