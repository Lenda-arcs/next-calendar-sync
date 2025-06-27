import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { LucideIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { memo } from 'react'

interface NavLinkProps {
  href?: string
  text: string
  avatarSrc?: string
  avatarAlt?: string
  fallbackIcon?: LucideIcon
  className?: string
  avatarSize?: 'sm' | 'md' | 'lg'
  showTextOnMobile?: boolean
  onClick?: () => void
  disabled?: boolean
  isLoading?: boolean
}

const avatarSizes = {
  sm: 'h-5 w-5',
  md: 'h-6 w-6', 
  lg: 'h-8 w-8'
}

const iconSizes = {
  sm: 'h-2.5 w-2.5',
  md: 'h-3 w-3',
  lg: 'h-4 w-4'
}

export const NavLink = memo(function NavLink({ 
  href, 
  text, 
  avatarSrc, 
  avatarAlt, 
  fallbackIcon: FallbackIcon,
  className,
  avatarSize = 'md',
  showTextOnMobile = false,
  onClick,
  disabled = false,
  isLoading = false
}: NavLinkProps) {
  const baseClassName = cn(
    "flex items-center px-3 py-2 text-sm font-medium font-sans text-foreground/80 hover:text-foreground hover:bg-white/30 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg space-x-2",
    disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-foreground/80",
    isLoading && "cursor-wait",
    className
  )

  const content = (
    <>
      {isLoading ? (
        <div className={cn(avatarSizes[avatarSize], 'flex items-center justify-center')}>
          <Loader2 className={cn(iconSizes[avatarSize], 'animate-spin text-primary')} />
        </div>
      ) : (
        <Avatar className={avatarSizes[avatarSize]}>
          {avatarSrc ? (
            <AvatarImage 
              src={avatarSrc} 
              alt={avatarAlt || text} 
            />
          ) : null}
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-white/30 text-xs">
            {FallbackIcon && (
              <FallbackIcon 
                className={cn(iconSizes[avatarSize] + ' text-primary')} 
              />
            )}
          </AvatarFallback>
        </Avatar>
      )}
      <span className={showTextOnMobile ? 'inline' : 'hidden md:inline'}>
        {text}
      </span>
    </>
  )

  // If onClick is provided, render as button
  if (onClick) {
    return (
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={baseClassName}
      >
        {content}
      </button>
    )
  }

  // If href is provided, render as Link
  if (href) {
    return (
      <Link href={href} className={baseClassName}>
        {content}
      </Link>
    )
  }

  // Fallback to span if neither href nor onClick is provided
  return (
    <span className={baseClassName}>
      {content}
    </span>
  )
}) 