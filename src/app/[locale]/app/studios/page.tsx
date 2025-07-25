import { Suspense } from 'react'
import { generateStudiosMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'
import { StudioManagement } from '@/components/studios'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getValidLocale } from '@/lib/i18n/config'

interface StudiosPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: StudiosPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  return generateStudiosMetadata(locale)
}

export default async function StudiosPage({ params }: StudiosPageProps) {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Note: Auth is handled by middleware, user should exist

  // Get user role from the database  
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user!.id)
    .single()

  const userRole = userData?.role || 'user'

  // Only admins and moderators can access studio management
  if (userRole !== 'admin' && userRole !== 'moderator') {
    const dashboardPath = locale === 'en' ? '/app' : `/${locale}/app`
    redirect(dashboardPath)
  }

  return (
    <div className="container mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <StudioManagement userId={user!.id} userRole={userRole} />
      </Suspense>
    </div>
  )
} 