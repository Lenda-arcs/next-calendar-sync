'use client'

import { Container } from '@/components/layout/container'
import { ProfileForm } from '@/components/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Shield, Eye, UserCog } from 'lucide-react'
import { PATHS } from '@/lib/paths'
import { useTranslationNamespace } from '@/lib/i18n/context'
import { User } from '@/lib/types'

interface ProfileContentProps {
  user: User
}

export default function ProfileContent({ user }: ProfileContentProps) {
  const { t } = useTranslationNamespace('dashboard.profilePage')

  return (
    <Container
      title={t('title')}
      subtitle={t('subtitle')}
    >
      <div className="space-y-8">
        <ProfileForm user={user} />
        
        {/* Account Settings */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <UserCog className="h-5 w-5" />
              {t('accountSettings.title')}
            </CardTitle>
            <CardDescription>
              {t('accountSettings.description')}
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
              <Button variant="outline" asChild>
                <Link href={PATHS.AUTH.SIGNOUT}>
                  <Shield className="mr-2 h-4 w-4" />
                  {t('accountSettings.signOut')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
} 