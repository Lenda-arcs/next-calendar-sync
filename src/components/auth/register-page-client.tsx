'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InvitationPasswordClient } from '@/components/auth/invitation-password-client'
import Link from 'next/link'
import { PATHS } from '@/lib/paths'
import { Lock } from 'lucide-react'

interface RegisterPageClientProps {
  locale: string
  homePath: string
  signInPath: string
}

export function RegisterPageClient({ locale, signInPath }: RegisterPageClientProps) {
  const [isInvitation, setIsInvitation] = useState(false)
  const [invitationTokens, setInvitationTokens] = useState<{
    access_token?: string
    refresh_token?: string
    type?: string
    error?: string
    error_description?: string
  }>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Parse URL fragment (hash) for invitation tokens
    const hash = window.location.hash.substring(1) // Remove the # symbol
    const params = new URLSearchParams(hash)
    
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')
    const type = params.get('type')
    const error = params.get('error')
    const error_description = params.get('error_description')

    console.log('🔍 Checking URL fragment for invitation tokens:', {
      access_token: access_token ? '***' : null,
      refresh_token: refresh_token ? '***' : null,
      type,
      error,
      error_description
    })

    // Check if this is a Supabase invitation flow
    const isInvitationFlow = Boolean(access_token && type === 'invite')
    
    setInvitationTokens({
      access_token: access_token || undefined,
      refresh_token: refresh_token || undefined,
      type: type || undefined,
      error: error || undefined,
      error_description: error_description || undefined
    })
    
    setIsInvitation(isInvitationFlow)
    setIsLoading(false)

    // Clean up the URL hash after extracting tokens (optional, for cleaner URLs)
    if (isInvitationFlow) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [])

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto border-pink-200 bg-gradient-to-br from-pink-50/50 to-purple-50/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <div className="text-center">
              <h3 className="font-medium text-gray-900">Loading...</h3>
              <p className="text-sm text-gray-600 mt-1">Checking for invitation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Handle invitation errors from URL fragment
  if (invitationTokens.error) {
    return (
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
              {invitationTokens.error_description || 'The invitation link may have expired or is invalid.'}
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
    )
  }

  // Show invitation flow if we have valid tokens
  if (isInvitation && invitationTokens.access_token && invitationTokens.refresh_token) {
    console.log('✅ Displaying InvitationPasswordClient')
    return (
      <InvitationPasswordClient 
        accessToken={invitationTokens.access_token}
        refreshToken={invitationTokens.refresh_token}
        locale={locale}
      />
    )
  }

  // Default: Show closed beta message (no invitation detected)
  return (
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
            Thank you for your interest in avara.studio! We&apos;re working hard to perfect the experience
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
  )
}