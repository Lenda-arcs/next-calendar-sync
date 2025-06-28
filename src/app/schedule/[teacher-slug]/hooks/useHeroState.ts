'use client'

import { useState, useEffect } from 'react'
import { useScrollIntoView } from '@/lib/hooks'

type HeroState = 'auto' | 'expanded' | 'closed'

export function useHeroState() {
  const [heroState, setHeroState] = useState<HeroState>('closed') // Start closed by default
  const [isAnimating, setIsAnimating] = useState(false)
  const [isExpanding, setIsExpanding] = useState(false)
  const [shouldShowJumpingCTA, setShouldShowJumpingCTA] = useState(false)
  const [hasPageLoaded, setHasPageLoaded] = useState(false)
  const [hasUsedCTA, setHasUsedCTA] = useState(false) // Track if user has ever opened the hero
  const [wasManuallyOpened, setWasManuallyOpened] = useState(false) // Track if hero was manually opened while out of view
  
  const { elementRef, isInView } = useScrollIntoView({
    threshold: 0.8, // High threshold - collapse when mostly out of view
    rootMargin: '-80px 0px 0px 0px' // Account for navbar
  })

  // Track page load
  useEffect(() => {
    setHasPageLoaded(true)
  }, [])

  // Show jumping CTA after 5 seconds, only if hero is still closed AND user hasn't used CTA before
  useEffect(() => {
    if (!hasPageLoaded || hasUsedCTA) return

    const timer = setTimeout(() => {
      if (heroState === 'closed') {
        setShouldShowJumpingCTA(true)
        // Stop jumping after 3 seconds
        setTimeout(() => {
          setShouldShowJumpingCTA(false)
        }, 3000)
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [hasPageLoaded, heroState, hasUsedCTA])

  // Reset to auto state when scrolling back into view from collapsed state
  useEffect(() => {
    if (isInView && heroState === 'expanded') {
      setHeroState('auto')
    }
  }, [isInView, heroState])

  // Auto-close expanded hero when scrolling out of view (but not if manually opened while out of view)
  useEffect(() => {
    if (!isInView && heroState === 'expanded' && !wasManuallyOpened) {
      const timer = setTimeout(() => {
        setHeroState('auto')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isInView, heroState, wasManuallyOpened])

  // Reset wasManuallyOpened flag when hero is closed or when back in view
  useEffect(() => {
    if (heroState === 'closed' || isInView) {
      setWasManuallyOpened(false)
    }
  }, [heroState, isInView])

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
      // Stop jumping animation when user interacts
      setShouldShowJumpingCTA(false)
      // Mark that user has used the CTA
      setHasUsedCTA(true)
      // Mark as manually opened if out of view
      if (!isInView) {
        setWasManuallyOpened(true)
      }
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
    shouldShowJumpingCTA,
    handleToggleHero,
    handleCloseHero
  }
} 