'use client'

import { NavLink } from '@/components/ui'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useNavLoading } from '@/lib/hooks'
import { PATHS } from '@/lib/paths'
import { User } from 'lucide-react'

interface ActiveProfileLinkProps {
  profileImage?: string | null
  userProfile?: { name?: string | null } | null
  mockUser: { email?: string } | { email: string }
}

export function ActiveProfileLink({ profileImage, userProfile, mockUser }: ActiveProfileLinkProps) {
  const pathname = usePathname()
  const { setLoading, getLoadingProps } = useNavLoading('progress')
  const isActive = pathname === PATHS.APP.PROFILE
  const loadingProps = getLoadingProps(PATHS.APP.PROFILE, User)

  return (
    <div onClick={() => setLoading(PATHS.APP.PROFILE)}>
      <NavLink
        href={PATHS.APP.PROFILE}
        text="Profile"
        avatarSrc={profileImage || undefined}
        avatarAlt={userProfile?.name || mockUser.email}
        fallbackIcon={loadingProps.icon}
        animateIcon={loadingProps.animateIcon}
        className={cn(
          "transition-all duration-200",
          isActive && "bg-white/60 text-foreground shadow-sm border border-white/60",
          loadingProps.className
        )}
      />
    </div>
  )
} 