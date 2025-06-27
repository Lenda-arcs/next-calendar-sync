'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'

type LoadingStyle = 'spinner' | 'progress' | 'wait'

export function useNavLoading(style: LoadingStyle = 'progress') {
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

  const getLoadingProps = (href: string, fallbackIcon?: LucideIcon) => {
    const itemIsLoading = isLoading(href)
    
    if (style === 'spinner') {
      return {
        isLoading: itemIsLoading,
        icon: itemIsLoading ? undefined : fallbackIcon, // Will use Loader2 in component
        animateIcon: itemIsLoading,
        className: itemIsLoading ? 'opacity-75 cursor-wait' : ''
      }
    }
    
    // For progress/wait styles, use cursor-only approach
    return {
      isLoading: itemIsLoading,
      icon: fallbackIcon, // Keep original icon
      animateIcon: false,
      className: itemIsLoading 
        ? `opacity-90 ${style === 'progress' ? 'cursor-progress' : 'cursor-wait'}` 
        : ''
    }
  }

  return {
    setLoading,
    isLoading,
    getLoadingProps,
    clearLoading: () => setLoadingHref(null)
  }
} 