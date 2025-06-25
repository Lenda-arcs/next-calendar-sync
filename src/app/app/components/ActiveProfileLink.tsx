'use client'

import { NavLink } from '@/components/ui'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { PATHS } from '@/lib/paths'
import { User } from 'lucide-react'

interface ActiveProfileLinkProps {
  profileImage?: string | null
  userProfile?: { name?: string | null } | null
  mockUser: { email?: string } | { email: string }
}

export function ActiveProfileLink({ profileImage, userProfile, mockUser }: ActiveProfileLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === PATHS.APP.PROFILE

  return (
    <NavLink
      href={PATHS.APP.PROFILE}
      text="Profile"
      avatarSrc={profileImage || undefined}
      avatarAlt={userProfile?.name || mockUser.email}
      fallbackIcon={User}
      className={cn(
        isActive && "bg-white/60 text-foreground shadow-sm border border-white/60"
      )}
    />
  )
} 