'use client'

import { usePathname } from 'next/navigation'
import { ReactNode, useCallback, memo } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NavLink } from './nav-link'
import { useNavLoading } from '@/lib/hooks/useNavLoading'


interface LoadingNavLinkProps {
  href: string
  text: string
  icon?: LucideIcon
  avatarSrc?: string
  avatarAlt?: string
  activeClassName?: string
  showTextOnMobile?: boolean
  className?: string
  children?: ReactNode
}

export const LoadingNavLink = memo(function LoadingNavLink({
  href,
  text,
  icon,
  avatarSrc,
  avatarAlt,
  activeClassName = 'bg-white/20 text-foreground shadow-md',
  showTextOnMobile = false,
  className,
  children
}: LoadingNavLinkProps) {
  const pathname = usePathname()
  const { isLoading, setLoading } = useNavLoading()
  
  // Simple exact match - href should already be localized by layout
  const isActive = pathname === href
  const itemIsLoading = isLoading(href)

  const handleClick = useCallback(() => {
    // Don't set loading if we're clicking on the current page
    if (pathname !== href) {
      setLoading(href)
    }
  }, [setLoading, href, pathname])

  return (
    <div onClick={handleClick}>
      <NavLink
        href={href}
        text={text}
        avatarSrc={avatarSrc}
        avatarAlt={avatarAlt}
        fallbackIcon={icon}
        isLoading={itemIsLoading}
        showTextOnMobile={showTextOnMobile}
        className={cn(
          'transition-all duration-200',
          isActive && activeClassName,
          className
        )}
      />
      {children}
    </div>
  )
}) 