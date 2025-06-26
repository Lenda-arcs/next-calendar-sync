'use client'

import { useState, useCallback, useEffect } from 'react'

interface ScreenshotModeState {
  isScreenshotMode: boolean
  activateScreenshotMode: () => void
}

/**
 * Hook to manage screenshot mode functionality
 * 
 * When activated, adds 'screenshot-mode' class to body for 5 seconds,
 * which hides elements with 'screenshot-hide' class via CSS.
 * This allows users to take clean screenshots of just the events and navbar.
 */
export function useScreenshotMode(): ScreenshotModeState {
  const [isScreenshotMode, setIsScreenshotMode] = useState(false)

  const activateScreenshotMode = useCallback(() => {
    setIsScreenshotMode(true)
    
    // Auto-disable after 5 seconds
    const timer = setTimeout(() => {
      setIsScreenshotMode(false)
    }, 5000)

    // Return cleanup function
    return () => clearTimeout(timer)
  }, [])

  // Add body class when screenshot mode is active
  useEffect(() => {
    if (isScreenshotMode) {
      document.body.classList.add('screenshot-mode')
    } else {
      document.body.classList.remove('screenshot-mode')
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('screenshot-mode')
    }
  }, [isScreenshotMode])

  return {
    isScreenshotMode,
    activateScreenshotMode
  }
} 