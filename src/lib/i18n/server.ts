import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { Locale, locales, defaultLocale } from './config'

/**
 * Detect language from various sources on the server side
 * Priority: URL param > Cookie > Accept-Language header > Default
 */
export function getServerLanguage(request: NextRequest): Locale {
  // 1. Check URL parameter (?lang=de)
  const urlLang = request.nextUrl.searchParams.get('lang')
  if (urlLang && locales.includes(urlLang as Locale)) {
    return urlLang as Locale
  }

  // 2. Check cookie
  const cookieLang = request.cookies.get('language')?.value
  if (cookieLang && locales.includes(cookieLang as Locale)) {
    return cookieLang as Locale
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
  return defaultLocale
}

/**
 * Safe server-side language detection for static generation
 * This function handles the case where cookies aren't available during build time
 */
export async function getServerLanguageSafe(): Promise<Locale> {
  try {
    const cookieStore = await cookies()
    const languageCookie = cookieStore.get('language')?.value
    
    if (languageCookie && locales.includes(languageCookie as Locale)) {
      return languageCookie as Locale
    }
  } catch {
    // During static generation, cookies aren't available
    // This is expected behavior, not an error
    return defaultLocale
  }
  
  return defaultLocale
}

/**
 * Parse Accept-Language header and return best matching language
 */
function detectBrowserLanguage(acceptLanguage: string): Locale | null {
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
    if (locales.includes(lang.code as Locale)) {
      return lang.code as Locale
    }
    
    // Check language prefix (en-US -> en, de-DE -> de, es-ES -> es)
    const prefix = lang.code.split('-')[0]
    if (locales.includes(prefix as Locale)) {
      return prefix as Locale
    }
  }

  return null
}

/**
 * Get language from pathname if using lang-based routing
 * e.g., /de/dashboard -> 'de'
 */
export function getLanguageFromPathname(pathname: string): Locale | null {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]
  
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale
  }
  
  return null
}

/**
 * Generate locale string for OpenGraph and other metadata
 */
export function getLocaleString(language: Locale): string {
  const localeMap: Record<Locale, string> = {
    'en': 'en_US',
    'de': 'de_DE',
    'es': 'es_ES'
  }
  
  return localeMap[language] || localeMap[defaultLocale]
}

/**
 * Generate language alternates for hreflang tags
 */
export function generateLanguageAlternates(basePath: string): Record<string, string> {
  const alternates: Record<string, string> = {}
  
  // Add each supported language
  for (const lang of locales) {
    if (lang === defaultLocale) {
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
export async function getServerTranslation(language: Locale, key: string, variables?: Record<string, string>): Promise<string> {
  try {
    // Dynamic import to avoid bundling all translations
    const translations = await import(`./translations/${language}`)
    const t = translations.default || translations.translations
    
    // Navigate the translation object using dot notation
    const keys = key.split('.')
    let value: unknown = t
    
    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        // Fallback to English if key not found
        const fallbackTranslations = await import(`./translations/${defaultLocale}`)
        const fallbackT = fallbackTranslations.default || fallbackTranslations.translations
        let fallbackValue: unknown = fallbackT
        
        for (const fk of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fallbackValue !== null && fk in fallbackValue) {
            fallbackValue = (fallbackValue as Record<string, unknown>)[fk]
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
          (result, [varKey, varValue]) => result.replace(new RegExp(`{${varKey}}`, 'g'), varValue),
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