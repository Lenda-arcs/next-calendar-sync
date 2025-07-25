'use client'

import { LoadingNavLink } from '@/components/ui'
import { PATHS } from '@/lib/paths'
import { Home } from 'lucide-react'
import dummyLogo from '@/assets/dummy_logo.png'

interface HomeLinkClientProps {
  appName: string
}

export function HomeLinkClient({ appName }: HomeLinkClientProps) {
  // Fallback to default name if translation is not available
  const displayName = appName || 'avara.'

  return (
    <LoadingNavLink
      href={PATHS.APP.DASHBOARD}
      text={displayName}
      icon={Home}
      avatarSrc={dummyLogo.src}
      avatarAlt="Logo"
      className="group"
    />
  )
} 