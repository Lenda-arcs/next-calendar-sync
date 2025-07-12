'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { LoginForm } from '@/components/auth'
import { PATHS } from '@/lib/paths'
import { ArrowLeft } from 'lucide-react'
import { useTranslationNamespace } from '@/lib/i18n/context'

export default function SignInContent() {
  const { t } = useTranslationNamespace('auth.signIn')

  return (
    <>
      <div className="text-center mb-8">
        <Link href={PATHS.HOME} className="inline-flex items-center text-sm text-foreground/70 hover:text-foreground font-sans transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>
      </div>
      
      <Card variant="glass">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription>
            {t('subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </>
  )
} 