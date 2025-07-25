'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function LocaleScript() {
  const pathname = usePathname()
  
  useEffect(() => {
    // Extract locale from pathname
    const localeMatch = pathname.match(/^\/([a-z]{2})(\/.*)?$/)
    const locale = localeMatch && ['de', 'es'].includes(localeMatch[1]) 
      ? localeMatch[1] 
      : 'en'
    
    // Update html lang attribute
    document.documentElement.lang = locale
  }, [pathname])

  return null
} 