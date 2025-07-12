'use client'

import React from 'react'
import { Languages } from 'lucide-react'
import { Button } from './button'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from './popover'
import { useLanguage } from '@/lib/i18n/context'
import { Language, LOCALES } from '@/lib/i18n/types'

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
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = React.useState(false)

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    setIsOpen(false)
  }

  const currentLocale = LOCALES[language]

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={className}
          aria-label="Select language"
        >
          <Languages className="h-4 w-4" />
          {showLabel && (
            <span className="ml-2 hidden sm:inline">
              {currentLocale.flag} {currentLocale.label}
            </span>
          )}
          {!showLabel && (
            <span className="ml-2 text-sm">
              {currentLocale.flag}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-1">
        {Object.entries(LOCALES).map(([langCode, locale]) => (
          <button
            key={langCode}
            onClick={() => handleLanguageChange(langCode as Language)}
            className={`w-full text-left px-3 py-2 rounded-md hover:bg-accent flex items-center ${
              langCode === language ? 'bg-accent' : ''
            }`}
          >
            <span className="mr-2 text-lg">{locale.flag}</span>
            <span className="flex-1">{locale.label}</span>
            {langCode === language && (
              <span className="text-primary text-sm">✓</span>
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

// Compact version for mobile or space-constrained areas
export function CompactLanguageSelector({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = React.useState(false)
  
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`p-2 h-8 w-8 ${className}`}
          aria-label="Select language"
        >
          <span className="text-sm">{LOCALES[language].flag}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-36 p-1">
        {Object.entries(LOCALES).map(([langCode, locale]) => (
          <button
            key={langCode}
            onClick={() => handleLanguageChange(langCode as Language)}
            className={`w-full text-left px-3 py-2 rounded-md hover:bg-accent flex items-center ${
              langCode === language ? 'bg-accent' : ''
            }`}
          >
            <span className="mr-2">{locale.flag}</span>
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
  const { language, setLanguage } = useLanguage()

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as Language)
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
        value={language}
        onChange={handleLanguageChange}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
      >
        {Object.entries(LOCALES).map(([langCode, locale]) => (
          <option key={langCode} value={langCode}>
            {locale.flag} {locale.label}
          </option>
        ))}
      </select>
    </div>
  )
} 