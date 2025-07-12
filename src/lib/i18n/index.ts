// Export all i18n types and utilities
export * from './types'
export * from './utils'

// Export translation loading function
export { loadTranslations } from './utils'

// Main i18n configuration
export const i18nConfig = {
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'de', 'es'],
  fallbackLanguage: 'en'
} as const 