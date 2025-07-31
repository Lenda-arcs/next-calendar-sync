// Auto-derived types from English translations
import enTranslations from './translations/en'

// Language types
export type Language = 'en' | 'de' | 'es'

export interface LocaleConfig {
  label: string
  code: string
  dateFormat: string
}

export const LOCALES: Record<Language, LocaleConfig> = {
  en: {
    label: 'English',
    code: 'EN',
    dateFormat: 'MM/dd/yyyy'
  },
  de: {
    label: 'Deutsch',
    code: 'DE',
    dateFormat: 'dd.MM.yyyy'
  },
  es: {
    label: 'Español',
    code: 'ES',
    dateFormat: 'dd/MM/yyyy'
  }
}

export const DEFAULT_LANGUAGE: Language = 'en'
export const SUPPORTED_LANGUAGES: Language[] = ['en', 'de', 'es']

// Automatically derive the Translations type from the English translations
export type Translations = typeof enTranslations

// Helper type to get deeply nested paths for type-safe translation keys
type Join<K, P> = K extends string | number ?
  P extends string | number ?
    `${K}${"" extends P ? "" : "."}${P}`
    : never : never

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]

type Paths<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
  { [K in keyof T]-?: K extends string | number ?
    `${K}` | Join<K, Paths<T[K], Prev[D]>>
    : never
  }[keyof T] : ""

// Type-safe translation key path
export type TranslationKey = Paths<Translations>

// Helper type to get the value type at a given translation path
type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}` ?
  K extends keyof T ?
    PathValue<T[K], Rest>
    : never
  : P extends keyof T ?
    T[P]
    : never

// Get the return type of a translation key
export type TranslationValue<K extends TranslationKey> = PathValue<Translations, K>

// Utility type to ensure other language files match the structure but allow different string values
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends readonly (infer U)[]
    ? U extends string
      ? readonly string[]
      : readonly DeepStringify<U>[]
    : T[K] extends Record<string, unknown>
      ? DeepStringify<T[K]>
      : string
}

export type TranslationStructure = DeepStringify<Translations>