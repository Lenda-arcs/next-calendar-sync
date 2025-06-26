'use client'

import React, { useState, useCallback, useEffect, createContext, useContext } from 'react'

interface ScreenshotModeState {
  isScreenshotMode: boolean
  activateScreenshotMode: () => void
}

// Create context
const ScreenshotModeContext = createContext<ScreenshotModeState | undefined>(undefined)

// Provider component
export const ScreenshotModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScreenshotMode, setIsScreenshotMode] = useState(false)

  const activateScreenshotMode = useCallback(() => {
    setIsScreenshotMode(true)
    
    // Auto-disable after 5 seconds
    setTimeout(() => {
      setIsScreenshotMode(false)
    }, 5000)
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

  return (
    <ScreenshotModeContext.Provider value={{ isScreenshotMode, activateScreenshotMode }}>
      {children}
    </ScreenshotModeContext.Provider>
  )
}

/**
 * Hook to manage screenshot mode functionality
 * 
 * When activated, adds 'screenshot-mode' class to body for 5 seconds,
 * which hides elements with 'screenshot-hide' class via CSS.
 * This allows users to take clean screenshots of just the events and navbar.
 */
export function useScreenshotMode(): ScreenshotModeState {
  const context = useContext(ScreenshotModeContext)
  
  if (context === undefined) {
    throw new Error('useScreenshotMode must be used within a ScreenshotModeProvider')
  }
  
  return context
} 