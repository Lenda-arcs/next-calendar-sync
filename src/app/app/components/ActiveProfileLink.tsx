'use client'

import { LoadingNavLink } from '@/components/ui'
import { PATHS } from '@/lib/paths'
import { User } from 'lucide-react'

interface ActiveProfileLinkProps {
  profileImage?: string | null
  userProfile?: { name?: string | null } | null
  mockUser: { email?: string } | { email: string }
}

export function ActiveProfileLink({ profileImage, userProfile, mockUser }: ActiveProfileLinkProps) {
  return (
    <LoadingNavLink
      href={PATHS.APP.PROFILE}
      text="Profile"
      icon={User}
      avatarSrc={profileImage || undefined}
      avatarAlt={userProfile?.name || mockUser.email}
    />
  )
} 