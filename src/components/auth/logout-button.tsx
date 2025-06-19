'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase'
import { LogOut, Loader2 } from 'lucide-react'

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showIcon?: boolean
  showText?: boolean
}

export function LogoutButton({ 
  variant = 'ghost', 
  size = 'sm',
  className,
  showIcon = true,
  showText = true
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
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        showIcon && <LogOut className="h-4 w-4" />
      )}
      {showText && (
        <span className={showIcon ? 'ml-2' : ''}>
          {loading ? 'Signing out...' : 'Sign Out'}
        </span>
      )}
    </Button>
  )
} 