'use client'

import { useState, useEffect } from 'react'

interface BreakpointConfig {
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

const defaultBreakpoints: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export function useResponsive(breakpoints: Partial<BreakpointConfig> = {}) {
  const config = { ...defaultBreakpoints, ...breakpoints }
  
  const [screenSize, setScreenSize] = useState<{
    width: number
    height: number
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
    isLarge: boolean
  }>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLarge: false,
  })

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setScreenSize({
        width,
        height,
        isMobile: width < config.md,
        isTablet: width >= config.md && width < config.lg,
        isDesktop: width >= config.lg && width < config.xl,
        isLarge: width >= config.xl,
      })
    }

    // Initial check
    updateScreenSize()

    // Add event listener
    window.addEventListener('resize', updateScreenSize)

    // Cleanup
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [config.md, config.lg, config.xl])

  return screenSize
}

// Specific hooks for common use cases
export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])

  return isMobile
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('sm')

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      
      if (width >= defaultBreakpoints['2xl']) {
        setBreakpoint('2xl')
      } else if (width >= defaultBreakpoints.xl) {
        setBreakpoint('xl')
      } else if (width >= defaultBreakpoints.lg) {
        setBreakpoint('lg')
      } else if (width >= defaultBreakpoints.md) {
        setBreakpoint('md')
      } else {
        setBreakpoint('sm')
      }
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)

    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return breakpoint
} 