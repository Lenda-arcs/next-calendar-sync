import { NextRequest } from 'next/server'
import { Language, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './types'

/**
 * Detect language from various sources on the server side
 * Priority: URL param > Cookie > Accept-Language header > Default
 */
export function getServerLanguage(request: NextRequest): Language {
  // 1. Check URL parameter (?lang=de)
  const urlLang = request.nextUrl.searchParams.get('lang')
  if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang as Language)) {
    return urlLang as Language
  }

  // 2. Check cookie
  const cookieLang = request.cookies.get('language')?.value
  if (cookieLang && SUPPORTED_LANGUAGES.includes(cookieLang as Language)) {
    return cookieLang as Language
  }

  // 3. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const browserLang = detectBrowserLanguage(acceptLanguage)
    if (browserLang) {
      return browserLang
    }
  }

  // 4. Default fallback
  return DEFAULT_LANGUAGE
}

/**
 * Parse Accept-Language header and return best matching language
 */
function detectBrowserLanguage(acceptLanguage: string): Language | null {
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, quality = '1'] = lang.trim().split(';q=')
      return {
        code: code.toLowerCase(),
        quality: parseFloat(quality)
      }
    })
    .sort((a, b) => b.quality - a.quality)

  for (const lang of languages) {
    // Check exact match first (en, de, es)
    if (SUPPORTED_LANGUAGES.includes(lang.code as Language)) {
      return lang.code as Language
    }
    
    // Check language prefix (en-US -> en, de-DE -> de, es-ES -> es)
    const prefix = lang.code.split('-')[0]
    if (SUPPORTED_LANGUAGES.includes(prefix as Language)) {
      return prefix as Language
    }
  }

  return null
}

/**
 * Get language from pathname if using lang-based routing
 * e.g., /de/dashboard -> 'de'
 */
export function getLanguageFromPathname(pathname: string): Language | null {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]
  
  if (firstSegment && SUPPORTED_LANGUAGES.includes(firstSegment as Language)) {
    return firstSegment as Language
  }
  
  return null
}

/**
 * Generate locale string for OpenGraph and other metadata
 */
export function getLocaleString(language: Language): string {
  const localeMap: Record<Language, string> = {
    'en': 'en_US',
    'de': 'de_DE',
    'es': 'es_ES'
  }
  
  return localeMap[language] || localeMap[DEFAULT_LANGUAGE]
}

/**
 * Generate language alternates for hreflang tags
 */
export function generateLanguageAlternates(basePath: string): Record<string, string> {
  const alternates: Record<string, string> = {}
  
  // Add each supported language
  for (const lang of SUPPORTED_LANGUAGES) {
    if (lang === DEFAULT_LANGUAGE) {
      // Default language doesn't need language prefix
      alternates[lang] = basePath
    } else {
      alternates[lang] = `/${lang}${basePath}`
    }
  }
  
  // Add x-default for default language
  alternates['x-default'] = basePath
  
  return alternates
}

/**
 * Server-side translation function for metadata
 * Uses the same translation files but works on server
 */
export async function getServerTranslation(language: Language, key: string, variables?: Record<string, string>): Promise<string> {
  try {
    // Dynamic import to avoid bundling all translations
    const translations = await import(`./translations/${language}`)
    const t = translations.default || translations.translations
    
    // Navigate the translation object using dot notation
    const keys = key.split('.')
    let value = t
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English if key not found
        const fallbackTranslations = await import(`./translations/${DEFAULT_LANGUAGE}`)
        const fallbackT = fallbackTranslations.default || fallbackTranslations.translations
        let fallbackValue = fallbackT
        
        for (const fk of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
            fallbackValue = fallbackValue[fk]
          } else {
            return key // Return key if not found in fallback
          }
        }
        
        value = fallbackValue
        break
      }
    }
    
    if (typeof value === 'string') {
      // Handle variable interpolation
      if (variables) {
        return Object.entries(variables).reduce(
          (result, [key, val]) => result.replace(new RegExp(`{${key}}`, 'g'), val),
          value
        )
      }
      return value
    }
    
    return key // Return key if value is not a string
  } catch (error) {
    console.error('Server translation error:', error)
    return key
  }
} 