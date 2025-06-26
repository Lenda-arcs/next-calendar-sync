'use client'

import { useState, useEffect } from 'react'
import { useScrollIntoView } from '@/lib/hooks'

type HeroState = 'auto' | 'expanded' | 'closed'

export function useHeroState() {
  const [heroState, setHeroState] = useState<HeroState>('auto')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isExpanding, setIsExpanding] = useState(false)
  
  const { elementRef, isInView } = useScrollIntoView({
    threshold: 0.8, // High threshold - collapse when mostly out of view
    rootMargin: '-80px 0px 0px 0px' // Account for navbar
  })

  // Reset to auto state when scrolling back into view from collapsed state
  useEffect(() => {
    if (isInView && heroState === 'expanded') {
      setHeroState('auto')
    }
  }, [isInView, heroState])

  // Auto-close expanded hero when scrolling out of view
  useEffect(() => {
    if (!isInView && heroState === 'expanded') {
      const timer = setTimeout(() => {
        setHeroState('auto')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isInView, heroState])

  // Handle morphing animation when collapsing
  useEffect(() => {
    if (heroState === 'closed' || (heroState === 'auto' && !isInView)) {
      setIsAnimating(true)
      setIsExpanding(false)
      // Reset animation state after animation completes
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 900) // Slightly longer than CSS animation duration
      return () => clearTimeout(timer)
    }
  }, [heroState, isInView])

  // Handle expanding animation reset
  useEffect(() => {
    if (isExpanding) {
      // Reset expanding state after animation completes
      const timer = setTimeout(() => {
        setIsExpanding(false)
      }, 900) // Slightly longer than CSS animation duration
      return () => clearTimeout(timer)
    }
  }, [isExpanding])

  // Determine if hero should be collapsed based on state and scroll position
  const isCollapsed = heroState === 'closed' || (heroState === 'auto' && !isInView)

  const handleToggleHero = () => {
    if (isCollapsed) {
      setHeroState('expanded')
      setIsExpanding(true)
      setIsAnimating(false)
    } else {
      setHeroState('closed')
      setIsAnimating(true)
      setIsExpanding(false)
    }
  }

  const handleCloseHero = () => {
    setHeroState('closed')
  }

  return {
    elementRef,
    isCollapsed,
    isAnimating,
    isExpanding,
    handleToggleHero,
    handleCloseHero
  }
} 