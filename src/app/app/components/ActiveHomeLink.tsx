'use client'

import { LoadingNavLink } from '@/components/ui'
import { PATHS } from '@/lib/paths'
import { Home } from 'lucide-react'
import dummyLogo from '@/assets/dummy_logo.png'

export function ActiveHomeLink() {
  return (
    <LoadingNavLink
      href={PATHS.APP.DASHBOARD}
      text="Home"
      icon={Home}
      avatarSrc={dummyLogo.src}
      avatarAlt="Logo"
      className="group"
    />
  )
} 