'use client'

import { LoadingNavLink } from '@/components/ui'
import { PATHS, getLocalizedPath, extractLocaleFromPath } from '@/lib/paths'
import { Home } from 'lucide-react'
import { usePathname } from 'next/navigation'
import dummyLogo from '@/assets/dummy_logo.png'

interface HomeLinkClientProps {
  appName: string
}

export function HomeLinkClient({ appName }: HomeLinkClientProps) {
  const pathname = usePathname()
  const locale = extractLocaleFromPath(pathname)
  
  // Fallback to default name if translation is not available
  const displayName = appName || 'avara.'

  return (
    <LoadingNavLink
      href={getLocalizedPath(PATHS.APP.DASHBOARD, locale)}
      text={displayName}
      icon={Home}
      avatarSrc={dummyLogo.src}
      avatarAlt="Logo"
      className="group"
    />
  )
} 