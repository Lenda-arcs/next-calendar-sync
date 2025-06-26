'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

interface UseScrollIntoViewOptions {
  threshold?: number
  rootMargin?: string
}

interface UseScrollIntoViewReturn {
  elementRef: React.RefObject<HTMLDivElement | null>
  isInView: boolean
  scrollToTop: () => void
}

export function useScrollIntoView(
  options: UseScrollIntoViewOptions = {}
): UseScrollIntoViewReturn {
  const { threshold = 0.1, rootMargin = '0px' } = options
  const elementRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(true) // Start with true since hero is initially visible

  const scrollToTop = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    } else {
      // Fallback to window scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin])

  return {
    elementRef,
    isInView,
    scrollToTop,
  }
} 