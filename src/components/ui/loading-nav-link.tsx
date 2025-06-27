'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
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

export function LoadingNavLink({
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
  
  const isActive = pathname === href
  const itemIsLoading = isLoading(href)

  const handleClick = () => {
    setLoading(href)
  }

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
} 