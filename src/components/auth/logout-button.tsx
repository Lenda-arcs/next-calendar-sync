'use client'

import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { NavLink } from '@/components/ui'
import { createClient } from '@/lib/supabase'
import { LogOut } from 'lucide-react'

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

  const handleLogout = useCallback(async () => {
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
  }, [router, supabase])

  return (
    <NavLink
      text={loading ? 'Signing out...' : 'Sign Out'}
      fallbackIcon={LogOut}
      onClick={handleLogout}
      disabled={loading}
      isLoading={loading}
      className={className}
      avatarSize={avatarSize}
      showTextOnMobile={showTextOnMobile}
    />
  )
} 