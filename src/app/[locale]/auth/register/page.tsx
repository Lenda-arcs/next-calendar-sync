import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RegisterForm } from '@/components/auth/register-form'

import { InvitationPasswordClient } from '@/components/auth/invitation-password-client'
import Link from 'next/link'
import { PATHS } from '@/lib/paths'
import { ArrowLeft, Lock, UserPlus } from 'lucide-react'
import { generateAuthMetadata } from '@/lib/i18n/metadata'
import { getValidLocale } from '@/lib/i18n/config'
import { validateInvitation } from '@/lib/server/invitation-service'
import type { Metadata } from 'next'

interface RegisterPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ 
    token?: string
    access_token?: string
    refresh_token?: string
    type?: string
    error?: string
    error_description?: string
  }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  return generateAuthMetadata('signUp', locale)
}

export default async function RegisterPage({ params, searchParams }: RegisterPageProps) {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  const { 
    token, 
    access_token, 
    refresh_token, 
    type, 
    error, 
    error_description 
  } = await searchParams
  
  // Check if user is already authenticated
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Redirect to localized app
    const appPath = locale === 'en' ? '/app' : `/${locale}/app`
    redirect(appPath)
  }

  // Create localized paths
  const homePath = locale === 'en' ? PATHS.HOME : `/${locale}`
  const signInPath = locale === 'en' ? PATHS.AUTH.SIGN_IN : `/${locale}/auth/sign-in`

  // Check for Supabase invitation flow
  const isSupabaseInvitation = access_token && type === 'invite'
  
  // Check for old token-based invitation (legacy support)
  let validInvitation = null
  if (token && !isSupabaseInvitation) {
    const validationResult = await validateInvitation(token)
    if (validationResult.valid) {
      validInvitation = validationResult.invitation
    }
  }

  // Handle Supabase invitation errors
  if (error) {
    return (
      <>
        <div className="text-center mb-8">
          <Link href={homePath} className="inline-flex items-center text-sm text-foreground/70 hover:text-foreground font-sans transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
        </div>

        <Card variant="glass" className="border-red-200 bg-red-50/50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-800">Invitation Error</CardTitle>
            <CardDescription className="text-lg text-red-600">
              There was a problem with your invitation link
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <p className="text-red-700">
                {error_description || 'The invitation link may have expired or is invalid.'}
              </p>
              <p className="text-foreground/70">
                Please contact your administrator for a new invitation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg">
                <Link href={signInPath}>Try Sign In</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="mailto:hello@avara.studio?subject=Invitation%20Issue">
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    )
  }

  // Handle Supabase invitation flow (new approach)
  if (isSupabaseInvitation) {
    return (
      <>
        <div className="text-center mb-8">
          <Link href={homePath} className="inline-flex items-center text-sm text-foreground/70 hover:text-foreground font-sans transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
        </div>

        <InvitationPasswordClient 
          accessToken={access_token}
          refreshToken={refresh_token}
          locale={locale}
        />
      </>
    )
  }

  // Show registration form if we have a valid legacy invitation
  if (validInvitation) {
    const redirectTo = locale === 'en' ? '/app' : `/${locale}/app`
    
    return (
      <>
        <div className="text-center mb-8">
          <Link href={homePath} className="inline-flex items-center text-sm text-foreground/70 hover:text-foreground font-sans transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
        </div>

        <Card variant="glass">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Welcome to avara.</CardTitle>
            <CardDescription className="text-lg">
              {validInvitation.invited_name 
                ? `Hi ${validInvitation.invited_name}! You've been invited to join avara.`
                : "You've been invited to join avara."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {validInvitation.personal_message && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground/70 italic">
                  &quot;{validInvitation.personal_message}&quot;
                </p>
              </div>
            )}
            
            <RegisterForm 
              redirectTo={redirectTo} 
              invitationToken={token}
            />
            
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link
                href={signInPath}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </>
    )
  }

  // Show closed beta message if no valid invitation
  //TODO: translate this texts
  return (
    <>
      <div className="text-center mb-8">
        <Link href={homePath} className="inline-flex items-center text-sm text-foreground/70 hover:text-foreground font-sans transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>
      </div>

      <Card variant="glass">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Closed Beta</CardTitle>
          <CardDescription className="text-lg">
            We&apos;re currently in closed beta and testing with select yoga instructors
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <p className="text-foreground/70">
              Thank you for your interest in avara.! We&apos;re working hard to perfect the experience
              for yoga instructors before opening to everyone.
            </p>
            <p className="text-foreground/70">
              <strong>Already have an account?</strong> You can still sign in below.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href={signInPath}>Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="mailto:hello@avara.studio?subject=Beta%20Access%20Request">
                Request Beta Access
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-foreground/60">
              Want to see how it works? Check out our{' '}
              <Link href={PATHS.DYNAMIC.TEACHER_SCHEDULE('demo')} className="text-primary hover:text-primary/80 font-medium">
                example schedule page
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  )
} 