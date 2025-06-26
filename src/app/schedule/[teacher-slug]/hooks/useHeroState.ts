'use client'

import { useState, useEffect } from 'react'
import { useScrollIntoView } from '@/lib/hooks'

type HeroState = 'auto' | 'expanded' | 'closed'

export function useHeroState() {
  const [heroState, setHeroState] = useState<HeroState>('auto')
  
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

  // Determine if hero should be collapsed based on state and scroll position
  const isCollapsed = heroState === 'closed' || (heroState === 'auto' && !isInView)

  const handleToggleHero = () => {
    if (isCollapsed) {
      setHeroState('expanded')
    } else {
      setHeroState('closed')
    }
  }

  const handleCloseHero = () => {
    setHeroState('closed')
  }

  return {
    elementRef,
    isCollapsed,
    handleToggleHero,
    handleCloseHero
  }
} 