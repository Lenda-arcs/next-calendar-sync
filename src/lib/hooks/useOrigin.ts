'use client'

import { useState, useEffect } from 'react'

/**
 * Custom hook to get the current browser origin
 * Returns the origin (protocol + domain) or null if not available (SSR)
 */
export function useOrigin(): string | null {
  const [origin, setOrigin] = useState<string | null>(null)

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
    }
  }, [])

  return origin
}

/**
 * Custom hook to build a full URL from a path
 * @param path - The path to append to the origin
 * @returns Full URL or null if origin is not available
 */
export function useFullUrl(path: string): string | null {
  const origin = useOrigin()
  
  if (!origin) return null
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  
  return `${origin}${normalizedPath}`
} 