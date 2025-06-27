'use client'

import { NavLink } from '@/components/ui'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useNavLoading } from '@/lib/hooks'
import { PATHS } from '@/lib/paths'
import { Home } from 'lucide-react'

export function ActiveHomeLink() {
  const pathname = usePathname()
  const { setLoading, getLoadingProps } = useNavLoading('wait')
  const isActive = pathname === PATHS.APP.DASHBOARD
  const loadingProps = getLoadingProps(PATHS.APP.DASHBOARD, Home)

  return (
    <div onClick={() => setLoading(PATHS.APP.DASHBOARD)}>
      <NavLink
        href={PATHS.APP.DASHBOARD}
        text="Home"
        avatarSrc="/assets/dummy_logo.png"
        avatarAlt="Logo"
        fallbackIcon={loadingProps.icon}
        animateIcon={loadingProps.animateIcon}
        className={cn(
          "group transition-all duration-200",
          isActive && "bg-white/60 text-foreground shadow-sm border border-white/60",
          loadingProps.className
        )}
      />
    </div>
  )
} 