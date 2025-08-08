'use client'

import React, { useCallback, memo, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { LucideIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavLoading } from '@/lib/hooks/useNavLoading'
import { useNavPreloadMap } from '@/lib/hooks/useNavPreloadMap'
import { navIconMap } from '@/components/navigation/navIcons'
import { useIsActivePath } from '@/lib/hooks/useIsActivePath'

type NavigationItem = {
  name: string
  href: string
  iconName: string
}

interface BottomNavProps {
  navigation: NavigationItem[]
  userId?: string
}

// Icon mapping mirrors other nav components to avoid serializing icon components
const iconMap: Record<string, LucideIcon> = navIconMap as Record<string, LucideIcon>

export const BottomNav = memo(function BottomNav({ navigation, userId }: BottomNavProps) {
  const { isActive: isActivePath } = useIsActivePath()
  const { isLoading, setLoading } = useNavLoading()
  const { getPreloadFunction } = useNavPreloadMap(userId)
  const [isCompact, setIsCompact] = useState(false)
  const isCompactRef = useRef(false)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY || window.pageYOffset
      const isScrollingDown = currentY > lastScrollYRef.current
      // Enter compact mode when scrolled down past 80px and scrolling down
      const nextCompact = currentY > 80 && isScrollingDown
      const shouldExpand = !isScrollingDown || currentY < 40
      const finalCompact = shouldExpand ? false : nextCompact
      if (finalCompact !== isCompactRef.current) {
        isCompactRef.current = finalCompact
        setIsCompact(finalCompact)
      }
      lastScrollYRef.current = currentY
    }

    // Passive listener for performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const resolvePreload = useCallback((href: string) => getPreloadFunction(href), [getPreloadFunction])

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="backdrop-blur-lg bg-white/70 border-t border-white/40 shadow-xl transition-all">
        <ul className="flex justify-around items-stretch">
          {navigation.map((item) => {
            const IconComponent = iconMap[item.iconName]
            const isActive = isActivePath(item.href)
            const loading = isLoading(item.href)
            const preloadFn = resolvePreload(item.href)

            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  onMouseEnter={preloadFn}
                  onFocus={preloadFn}
                  onClick={() => {
                    if (!isActive) setLoading(item.href)
                  }}
                  className={cn(
                    'relative flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-all duration-200',
                    isCompact ? 'py-1.5' : 'py-2.5',
                    isActive ? 'text-foreground' : 'text-foreground/70 hover:text-foreground'
                  )}
                  aria-label={item.name}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute top-0 h-0.5 w-6 rounded-full bg-primary" />
                  )}
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <IconComponent
                      className={cn(
                        'h-5 w-5',
                        isActive ? 'text-primary' : 'text-foreground/70'
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      'leading-none overflow-hidden transition-all duration-200',
                      loading && 'opacity-70',
                      isCompact ? 'max-h-0 opacity-0 scale-95' : 'max-h-4 opacity-100 scale-100'
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      {/* Respect iOS safe area inset */}
      <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
    </nav>
  )
})


