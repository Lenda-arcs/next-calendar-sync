import { notFound } from 'next/navigation'

export const locales = ['en', 'de', 'es'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'en'

// Validate locale parameter from URL
export function validateLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

// Get locale from params or redirect to 404
export function getValidLocale(locale: string): Locale {
  if (validateLocale(locale)) {
    return locale
  }
  notFound()
}

// Generate paths for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Server-side translation loading
export async function getTranslations(locale: Locale) {
  try {
    const translations = await import(`./translations/${locale}.ts`)
    return translations.default || translations.translations
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error)
    
    // Fallback to default locale
    if (locale !== defaultLocale) {
      const fallbackTranslations = await import(`./translations/${defaultLocale}.ts`)
      return fallbackTranslations.default || fallbackTranslations.translations
    }
    
    throw error
  }
}

// Generate translation function
export function createTranslator(translations: Record<string, unknown>) {
  return function t(key: string, variables?: Record<string, string>): string {
    const keys = key.split('.')
    let value: unknown = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        console.warn(`Translation key "${key}" not found`)
        return key
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
    
    return key
  }
} 