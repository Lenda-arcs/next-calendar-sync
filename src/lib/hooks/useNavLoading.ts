'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function useNavLoading() {
  const pathname = usePathname()
  const [loadingHref, setLoadingHref] = useState<string | null>(null)

  // Clear loading state when pathname changes (navigation completes)
  useEffect(() => {
    setLoadingHref(null)
  }, [pathname])

  const setLoading = (href: string) => {
    // Don't set loading if we're already on this page
    if (pathname !== href) {
      setLoadingHref(href)
    }
  }

  const isLoading = (href: string) => loadingHref === href

  return {
    setLoading,
    isLoading,
    clearLoading: () => setLoadingHref(null)
  }
} 