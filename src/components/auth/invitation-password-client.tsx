'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { SetPasswordForm } from './set-password-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'

interface InvitationPasswordClientProps {
  accessToken?: string
  refreshToken?: string
  locale: string
}

export function InvitationPasswordClient({ 
  accessToken, 
  refreshToken, 
  locale 
}: InvitationPasswordClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [invitationData, setInvitationData] = useState<{
    email?: string
    full_name?: string
    role?: string
    invitation_message?: string
  } | null>(null)

  useEffect(() => {
    async function handleInvitationTokens() {
      if (!accessToken || !refreshToken) {
        setError('Missing invitation tokens')
        setIsLoading(false)
        return
      }

      try {
        console.log('🔄 Processing invitation tokens...')
        
        // Set the session using the tokens from the invitation
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })

        if (sessionError) {
          console.error('❌ Session error:', sessionError)
          setError(`Session error: ${sessionError.message}`)
          setIsLoading(false)
          return
        }

        if (data.user) {
          console.log('✅ Invitation session established for:', data.user.email)
          
          // Extract invitation data from user metadata
          const userData = data.user.user_metadata || {}
          setInvitationData({
            email: data.user.email,
            full_name: userData.full_name,
            role: userData.role,
            invitation_message: userData.invitation_message
          })
          
          setIsLoading(false)
        } else {
          setError('No user data found in invitation')
          setIsLoading(false)
        }
      } catch (err) {
        console.error('❌ Error processing invitation:', err)
        setError('Failed to process invitation')
        setIsLoading(false)
      }
    }

    handleInvitationTokens()
  }, [accessToken, refreshToken, supabase.auth])

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto border-pink-200 bg-gradient-to-br from-pink-50/50 to-purple-50/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            <div className="text-center">
              <h3 className="font-medium text-gray-900">Processing Invitation...</h3>
              <p className="text-sm text-gray-600 mt-1">Setting up your yoga instructor account</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto border-red-200 bg-red-50/50">
        <CardHeader className="text-center">
          <CardTitle className="text-red-800">Invitation Error</CardTitle>
          <CardDescription className="text-red-600">
            There was a problem processing your invitation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="border-red-200 bg-red-50/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Please contact support for assistance with your invitation.
            </p>
            <button
              onClick={() => router.push(`/${locale === 'en' ? '' : locale + '/'}auth/sign-in`)}
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              Try Sign In Instead
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return <SetPasswordForm invitationData={invitationData || undefined} />
}