import { Container } from '@/components/layout/container'
import { EmailConfirmationOnboarding } from '@/components/auth/email-confirmation-onboarding'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function ConfirmEmailPage({
  searchParams
}: {
  searchParams: Promise<{ 
    email?: string
    redirectTo?: string
  }>
}) {
  const supabase = await createServerClient()
  const resolvedSearchParams = await searchParams

  // Check if user is already authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    // User is already authenticated, redirect to app
    const redirectTo = resolvedSearchParams.redirectTo || '/app'
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