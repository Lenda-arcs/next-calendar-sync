import { Suspense } from 'react'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getValidLocale, getTranslations, createTranslator } from '@/lib/i18n/config'
import { Container } from '@/components/layout/container'
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient'
import type { Metadata } from 'next'

interface AdminPageProps {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Admin Dashboard - avara.',
  description: 'Administrative tools and user management for avara.',
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    const signInPath = locale === 'en' ? '/auth/sign-in' : `/${locale}/auth/sign-in`
    redirect(signInPath)
  }

  // Get user role from the database  
  const { data: userData } = await supabase
    .from('users')
    .select('role, name')
    .eq('id', user.id)
    .single()

  const userRole = userData?.role || 'user'
  const userName = userData?.name

  // Only admins can access this page
  if (userRole !== 'admin') {
    const dashboardPath = locale === 'en' ? '/app' : `/${locale}/app`
    redirect(dashboardPath)
  }

  // Get translations for the page
  const translations = await getTranslations(locale)
  const t = createTranslator(translations)

  return (
    <Container 
      title={t('dashboard.admin.title')}
      subtitle={userName ? t('dashboard.admin.subtitle', { userName }) : t('dashboard.admin.subtitleFallback')}
      maxWidth="4xl"
    >
      <Suspense fallback={<div className="text-center py-8">Loading admin dashboard...</div>}>
        <AdminDashboardClient 
          userRole={userRole}
          locale={locale}
        />
      </Suspense>
    </Container>
  )
} 