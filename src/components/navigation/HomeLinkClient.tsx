'use client'

import { LoadingNavLink } from '@/components/ui'
import { PATHS, getLocalizedPath, extractLocaleFromPath } from '@/lib/paths'
import { Home } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useSmartPreload } from '@/lib/hooks/useSmartPreload'
import dummyLogo from '@/assets/dummy_logo.png'

interface HomeLinkClientProps {
  appName: string
  userId: string // ✨ Pass userId directly instead of using useAuth
}

export function HomeLinkClient({ appName, userId }: HomeLinkClientProps) {
  const pathname = usePathname()
  const locale = extractLocaleFromPath(pathname)
  const { preloadDashboard } = useSmartPreload()
  
  // Fallback to default name if translation is not available
  const displayName = appName || 'avara.'

  return (
    <div
      onMouseEnter={() => preloadDashboard(userId)}
      onFocus={() => preloadDashboard(userId)}
    >
      <LoadingNavLink
        href={getLocalizedPath(PATHS.APP.DASHBOARD, locale)}
        text={displayName}
        icon={Home}
        avatarSrc={dummyLogo.src}
        avatarAlt="Logo"
        className="group"
      />
    </div>
  )
} 