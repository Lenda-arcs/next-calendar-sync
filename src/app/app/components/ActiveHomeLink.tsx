'use client'

import { LoadingNavLink } from '@/components/ui'
import { PATHS } from '@/lib/paths'
import { Home } from 'lucide-react'

export function ActiveHomeLink() {
  return (
    <LoadingNavLink
      href={PATHS.APP.DASHBOARD}
      text="Home"
      icon={Home}
      avatarSrc="/assets/dummy_logo.png"
      avatarAlt="Logo"
      className="group"
    />
  )
} 