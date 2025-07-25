'use client'

import { LoadingNavLink } from '@/components/ui'
import { PATHS, getLocalizedPath, extractLocaleFromPath } from '@/lib/paths'
import { User } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface ActiveProfileLinkProps {
  profileImage?: string | null
  userProfile?: { name?: string | null } | null
  user: { email?: string } | { email: string }
}

export function ActiveProfileLink({ profileImage, userProfile, user }: ActiveProfileLinkProps) {
  const pathname = usePathname()
  const locale = extractLocaleFromPath(pathname)
  
  return (
    <LoadingNavLink
      href={getLocalizedPath(PATHS.APP.PROFILE, locale)}
      text="Profile"
      icon={User}
      avatarSrc={profileImage || undefined}
      avatarAlt={userProfile?.name || user.email}
    />
  )
} 