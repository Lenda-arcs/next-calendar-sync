'use client'

import { usePathname } from 'next/navigation'

export function useIsActivePath() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  return { isActive, pathname }
}


