import { Container } from '@/components/layout/container'
import { EmailConfirmationOnboarding } from '@/components/auth/email-confirmation-onboarding'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getValidLocale } from '@/lib/i18n/config'

interface ConfirmEmailPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ 
    email?: string
    redirectTo?: string
  }>
}

export default async function ConfirmEmailPage({
  params,
  searchParams
}: ConfirmEmailPageProps) {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  const supabase = await createServerClient()
  const resolvedSearchParams = await searchParams

  // Check if user is already authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    // User is already authenticated, redirect to app with locale
    const redirectTo = resolvedSearchParams.redirectTo || (locale === 'en' ? '/app' : `/${locale}/app`)
    redirect(redirectTo)
  }

  return (
    <Container className="flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md">
        <EmailConfirmationOnboarding 
          email={resolvedSearchParams.email}
          redirectTo={resolvedSearchParams.redirectTo}
        />
      </div>
    </Container>
  )
} 