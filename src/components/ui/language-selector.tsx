'use client'

import React from 'react'
import { Globe } from 'lucide-react'
import { Button } from './button'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from './popover'
import { usePathname, useRouter } from 'next/navigation'
import { Language, LOCALES, DEFAULT_LANGUAGE } from '@/lib/i18n/types'

interface LanguageSelectorProps {
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'outline' | 'ghost'
}

export function LanguageSelector({ 
  className, 
  showLabel = false, 
  variant = 'ghost' 
}: LanguageSelectorProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  
  // Prevent hydration mismatch by not rendering language-specific content until mounted
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // Extract current locale from pathname
  const getCurrentLocale = (): Language => {
    const segments = pathname.split('/')
    const firstSegment = segments[1]
    
    if (firstSegment && ['de', 'es'].includes(firstSegment)) {
      return firstSegment as Language
    }
    return 'en' // Default to English
  }

  const handleLanguageChange = (newLanguage: Language) => {
    const currentLocale = getCurrentLocale()
    
    if (currentLocale === newLanguage) {
      setIsOpen(false)
      return
    }

    // Build new pathname with the new locale
    let newPathname = pathname
    
    if (currentLocale === 'en') {
      // Currently on English route (no locale prefix or /en prefix)
      if (pathname.startsWith('/en/')) {
        // Replace /en/ with new locale
        newPathname = pathname.replace('/en/', `/${newLanguage}/`)
      } else {
        // Add locale prefix
        newPathname = `/${newLanguage}${pathname}`
      }
    } else {
      // Currently on a non-English route, replace the locale
      newPathname = pathname.replace(`/${currentLocale}/`, `/${newLanguage}/`)
    }
    
    // Handle special case for English (remove prefix if needed)
    if (newLanguage === 'en') {
      // For English, we can either go to /en/... or remove the prefix entirely
      // Based on your redirects, let's use /en/... for consistency
      if (!newPathname.startsWith('/en/')) {
        newPathname = newPathname.replace(/^\/[a-z]{2}\//, '/en/')
      }
    }

    router.push(newPathname)
    setIsOpen(false)
  }

  // Show default language during SSR and initial hydration
  const displayLanguage = isMounted ? getCurrentLocale() : DEFAULT_LANGUAGE
  const currentLocale = LOCALES[displayLanguage]

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={className}
          aria-label="Select language"
        >
          <Globe className="h-4 w-4" />
          {showLabel && (
            <span className="ml-2 hidden sm:inline">
              {currentLocale.code} • {currentLocale.label}
            </span>
          )}
          {!showLabel && (
            <span className="ml-1 text-xs font-semibold text-muted-foreground">
              {currentLocale.code}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-1">
        {Object.entries(LOCALES).map(([langCode, locale]) => (
          <button
            key={langCode}
            onClick={() => handleLanguageChange(langCode as Language)}
            className={`w-full text-left px-3 py-2 rounded-lg hover:bg-accent flex items-center gap-2 transition-colors ${
              langCode === displayLanguage ? 'bg-accent' : ''
            }`}
          >
            <span className="inline-flex items-center justify-center w-6 h-5 text-xs font-semibold bg-muted rounded text-muted-foreground">
              {locale.code}
            </span>
            <span className="text-sm">{locale.label}</span>
            {langCode === displayLanguage && (
              <span className="ml-auto text-primary text-sm">✓</span>
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

// Compact version for mobile or space-constrained areas
export function CompactLanguageSelector({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  
  // Prevent hydration mismatch by not rendering language-specific content until mounted
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // Extract current locale from pathname
  const getCurrentLocale = (): Language => {
    const segments = pathname.split('/')
    const firstSegment = segments[1]
    
    if (firstSegment && ['de', 'es'].includes(firstSegment)) {
      return firstSegment as Language
    }
    return 'en' // Default to English
  }
  
  const handleLanguageChange = (newLanguage: Language) => {
    const currentLocale = getCurrentLocale()
    
    if (currentLocale === newLanguage) {
      setIsOpen(false)
      return
    }

    // Build new pathname with the new locale
    let newPathname = pathname
    
    if (currentLocale === 'en') {
      // Currently on English route
      if (pathname.startsWith('/en/')) {
        newPathname = pathname.replace('/en/', `/${newLanguage}/`)
      } else {
        newPathname = `/${newLanguage}${pathname}`
      }
    } else {
      // Currently on a non-English route, replace the locale
      newPathname = pathname.replace(`/${currentLocale}/`, `/${newLanguage}/`)
    }
    
    // Handle special case for English
    if (newLanguage === 'en') {
      if (!newPathname.startsWith('/en/')) {
        newPathname = newPathname.replace(/^\/[a-z]{2}\//, '/en/')
      }
    }

    router.push(newPathname)
    setIsOpen(false)
  }

  // Show default flag during SSR and initial hydration
  const displayLanguage = isMounted ? getCurrentLocale() : DEFAULT_LANGUAGE

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-auto min-w-[2.5rem] px-2 ${className}`}
          aria-label="Select language"
        >
          <Globe className="h-3.5 w-3.5 mr-1" />
          <span className="text-xs font-semibold">
            {LOCALES[displayLanguage].code}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-36 p-1">
        {Object.entries(LOCALES).map(([langCode, locale]) => (
          <button
            key={langCode}
            onClick={() => handleLanguageChange(langCode as Language)}
            className={`w-full text-left px-3 py-2 rounded-lg hover:bg-accent flex items-center gap-2 transition-colors ${
              langCode === displayLanguage ? 'bg-accent' : ''
            }`}
          >
            <span className="inline-flex items-center justify-center w-6 h-5 text-xs font-semibold bg-muted rounded text-muted-foreground">
              {locale.code}
            </span>
            <span className="text-sm">{locale.label}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

// Inline language selector for settings pages
export function InlineLanguageSelector({ 
  className, 
  label 
}: { 
  className?: string
  label?: string 
}) {
  const pathname = usePathname()
  const router = useRouter()

  // Extract current locale from pathname
  const getCurrentLocale = (): Language => {
    const segments = pathname.split('/')
    const firstSegment = segments[1]
    
    if (firstSegment && ['de', 'es'].includes(firstSegment)) {
      return firstSegment as Language
    }
    return 'en' // Default to English
  }

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value as Language
    const currentLocale = getCurrentLocale()
    
    if (currentLocale === newLanguage) return

    // Build new pathname with the new locale
    let newPathname = pathname
    
    if (currentLocale === 'en') {
      if (pathname.startsWith('/en/')) {
        newPathname = pathname.replace('/en/', `/${newLanguage}/`)
      } else {
        newPathname = `/${newLanguage}${pathname}`
      }
    } else {
      newPathname = pathname.replace(`/${currentLocale}/`, `/${newLanguage}/`)
    }
    
    if (newLanguage === 'en') {
      if (!newPathname.startsWith('/en/')) {
        newPathname = newPathname.replace(/^\/[a-z]{2}\//, '/en/')
      }
    }

    router.push(newPathname)
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor="language-select" className="text-sm font-medium">
          {label}
        </label>
      )}
      <select
        id="language-select"
        value={getCurrentLocale()}
        onChange={handleLanguageChange}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background"
      >
        {Object.entries(LOCALES).map(([langCode, locale]) => (
          <option key={langCode} value={langCode}>
            {locale.code} • {locale.label}
          </option>
        ))}
      </select>
    </div>
  )
} 