'use client'

import { Container } from '@/components/layout/container'
import { ProfileForm } from '@/components/auth'
import { AccountSettingsForm } from '@/components/auth/account-settings-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Shield, Eye, UserCog, Settings, ArrowLeft, LogOut } from 'lucide-react'
import { PATHS } from '@/lib/paths'
import { useTranslationNamespace } from '@/lib/i18n/context'
import { User } from '@/lib/types'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'

interface ProfileContentProps {
  user: User
}

export default function ProfileContent({ user }: ProfileContentProps) {
  const { t } = useTranslationNamespace('dashboard.profilePage')
  const [activeSection, setActiveSection] = useState<'profile' | 'account'>('profile')
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error('Failed to sign out')
        return
      }
      router.push('/')
      router.refresh()
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <Container
      title={activeSection === 'account' ? 'Account Settings' : t('title')}
      subtitle={activeSection === 'account' ? 'Manage your account and authentication' : t('subtitle')}
    >
      {activeSection === 'account' && (
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setActiveSection('profile')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        </div>
      )}

      <div className="space-y-8">
        {activeSection === 'profile' ? (
          <>
            {/* Public Profile Information */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Eye className="h-5 w-5" />
                  Public Profile Information
                </CardTitle>
                <CardDescription>
                  This information is visible to visitors on your public profile page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm user={user} />
              </CardContent>
            </Card>
            
            {/* Account Settings */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <UserCog className="h-5 w-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account, authentication, and access permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" asChild>
                    <Link href={PATHS.APP.DASHBOARD}>
                      <Eye className="mr-2 h-4 w-4" />
                      {t('accountSettings.viewDashboard')}
                    </Link>
                  </Button>
                  
                  {/* Admin Dashboard Access - Only for admins */}
                  {(user.role === 'admin' || user.role === 'moderator') && (
                    <Button variant="outline" asChild>
                      <Link href={PATHS.APP.ADMIN}>
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </Button>
                  )}
                  
                  {/* Email & Password Management */}
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveSection('account')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Email & Password
                  </Button>
                  
                  {/* Sign Out */}
                  <Button 
                    variant="outline" 
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isSigningOut ? 'Signing out...' : 'Sign Out'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Account Settings Section */
          <AccountSettingsForm user={user} />
        )}
      </div>
    </Container>
  )
} 