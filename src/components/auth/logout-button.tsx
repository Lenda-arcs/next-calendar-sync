'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { NavLink } from '@/components/ui'
import { createClient } from '@/lib/supabase'
import { LogOut, Loader2 } from 'lucide-react'

interface LogoutButtonProps {
  className?: string
  avatarSize?: 'sm' | 'md' | 'lg'
  showTextOnMobile?: boolean
}

export function LogoutButton({ 
  className,
  avatarSize = 'sm',
  showTextOnMobile = false
}: LogoutButtonProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = React.useState(false)

  const handleLogout = async () => {
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Logout error:', error)
      }
      
      // Redirect to home page
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <NavLink
      text={loading ? 'Signing out...' : 'Sign Out'}
      fallbackIcon={loading ? Loader2 : LogOut}
      onClick={handleLogout}
      disabled={loading}
      className={className}
      avatarSize={avatarSize}
      showTextOnMobile={showTextOnMobile}
      animateIcon={loading}
    />
  )
} 