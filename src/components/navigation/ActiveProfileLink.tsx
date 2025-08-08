'use client'

import { LoadingNavLink } from '@/components/ui'
import { PATHS, getLocalizedPath, extractLocaleFromPath } from '@/lib/paths'
import { User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useSmartPreload } from '@/lib/hooks/useSmartPreload'

interface ActiveProfileLinkProps {
  profileImage?: string | null
  userProfile?: { name?: string | null } | null
  user: { id: string; email?: string | undefined }
}

export function ActiveProfileLink({ profileImage, userProfile, user }: ActiveProfileLinkProps) {
  const pathname = usePathname()
  const locale = extractLocaleFromPath(pathname)
  const { preloadProfile } = useSmartPreload()
  
  return (
    <div
      onMouseEnter={() => preloadProfile(user.id)}
      onFocus={() => preloadProfile(user.id)}
    >
      <LoadingNavLink
        href={getLocalizedPath(PATHS.APP.PROFILE, locale)}
        text="Profile"
        icon={User}
        avatarSrc={profileImage || undefined}
        avatarAlt={userProfile?.name || user.email}
        activeClassName="bg-white/90 text-foreground shadow-md border border-white/80"
        className="group border border-white/30 backdrop-blur-sm hover:bg-white/40 hover:border-white/50 lg:bg-transparent lg:border-0 lg:shadow-none"
      />
    </div>
  )
} 