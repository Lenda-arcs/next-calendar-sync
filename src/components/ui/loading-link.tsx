'use client'

import { ReactNode, useCallback, memo } from 'react'
import { LucideIcon, Loader2, Calendar, Eye, Tags, Receipt, Link as LinkIcon, Home, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavLoading } from '@/lib/hooks/useNavLoading'
import Link from 'next/link'

// Icon mapping for server-safe icon passing
const iconMap: Record<string, LucideIcon> = {
  Calendar,
  Eye,
  Tags,
  Receipt,
  LinkIcon,
  Home,
  User
}

interface LoadingLinkProps {
  href: string
  children: ReactNode
  className?: string
  variant?: 'simple' | 'button'
  disabled?: boolean
  onClick?: () => void
}

export const LoadingLink = memo(function LoadingLink({
  href,
  children,
  className,
  variant = 'simple',
  disabled = false,
  onClick
}: LoadingLinkProps) {
  const { isLoading, setLoading } = useNavLoading()
  const itemIsLoading = isLoading(href)

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    
    if (onClick) {
      onClick()
    }
    
    setLoading(href)
  }, [setLoading, href, disabled, onClick])

  const baseClassName = cn(
    'transition-all duration-200',
    itemIsLoading && 'cursor-wait opacity-75',
    disabled && 'pointer-events-none opacity-50',
    className
  )

  if (variant === 'button') {
    // For button-style links, we need to handle the loading state differently
    // since the Button component expects specific content structure
    return (
      <Link 
        href={href} 
        onClick={handleClick}
        className={baseClassName}
      >
        {children}
      </Link>
    )
  }

  // For simple links, we can show a spinner inline
  return (
    <Link 
      href={href} 
      onClick={handleClick}
      className={baseClassName}
    >
      <span className="flex items-center gap-2">
        {itemIsLoading && (
          <Loader2 className="h-3 w-3 animate-spin text-primary" />
        )}
        {children}
      </span>
    </Link>
  )
})

// Higher-order component for Button + LoadingLink combination
interface LoadingButtonLinkProps {
  href: string
  children: ReactNode
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  iconName?: string // Changed from icon to iconName
}

export const LoadingButtonLink = memo(function LoadingButtonLink({
  href,
  children,
  variant = 'default',
  size = 'md',
  className,
  disabled = false,
  iconName
}: LoadingButtonLinkProps) {
  const { isLoading, setLoading } = useNavLoading()
  const itemIsLoading = isLoading(href)

  const handleClick = useCallback(() => {
    if (!disabled) {
      setLoading(href)
    }
  }, [setLoading, href, disabled])

  // Get icon component from iconName
  const IconComponent = iconName ? iconMap[iconName] : undefined

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 py-2',
    lg: 'h-10 px-8'
  }

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 backdrop-blur-sm shadow-lg',
    secondary: 'backdrop-blur-md bg-white/30 border border-white/40 hover:bg-white/50 shadow-lg text-foreground',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground backdrop-blur-sm',
    ghost: 'hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-md'
  }

  const buttonClassName = cn(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    sizeClasses[size],
    variantClasses[variant],
    itemIsLoading && 'cursor-wait',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  )

  return (
    <Link 
      href={href} 
      onClick={handleClick}
      className={buttonClassName}
    >
      {itemIsLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
          {children}
        </>
      )}
    </Link>
  )
}) 