'use client'

import { NavLink } from '@/components/ui'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { PATHS } from '@/lib/paths'
import { Home } from 'lucide-react'

export function ActiveHomeLink() {
  const pathname = usePathname()
  const isActive = pathname === PATHS.APP.DASHBOARD

  return (
    <NavLink
      href={PATHS.APP.DASHBOARD}
      text="Home"
      avatarSrc="/assets/dummy_logo.png"
      avatarAlt="Logo"
      fallbackIcon={Home}
      className={cn(
        "group",
        isActive && "bg-white/60 text-foreground shadow-sm border border-white/60"
      )}
    />
  )
} 