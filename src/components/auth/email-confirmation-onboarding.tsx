'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase'
import { Mail, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface EmailConfirmationOnboardingProps {
  email?: string
  redirectTo?: string
}

export function EmailConfirmationOnboarding({ 
  email 
}: EmailConfirmationOnboardingProps) {
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [resendMessage, setResendMessage] = useState('')
  const supabase = createClient()

  const handleResendEmail = async () => {
    if (!email) {
      setResendStatus('error')
      setResendMessage('Email address is required to resend confirmation')
      return
    }

    setIsResending(true)
    setResendStatus('idle')
    setResendMessage('')

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) {
        setResendStatus('error')
        setResendMessage(error.message)
      } else {
        setResendStatus('success')
        setResendMessage('Confirmation email sent! Check your inbox.')
      }
    } catch {
      setResendStatus('error')
      setResendMessage('Failed to resend confirmation email. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Check your email
        </h1>
        <p className="text-muted-foreground">
          We&apos;ve sent a confirmation link to your email address
        </p>
      </div>

      {/* Main Card */}
      <Card className="p-6 space-y-4">
        <div className="space-y-4">
          {/* Email Display */}
          {email && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{email}</span>
            </div>
          )}

          {/* Instructions */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-primary">1</span>
              </div>
              <div>
                <p className="font-medium">Check your inbox</p>
                <p className="text-sm text-muted-foreground">
                  Look for an email from Calendar Sync with the subject &quot;Confirm your email&quot;
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-primary">2</span>
              </div>
              <div>
                <p className="font-medium">Click the confirmation link</p>
                <p className="text-sm text-muted-foreground">
                  This will verify your email and activate your account
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-primary">3</span>
              </div>
              <div>
                <p className="font-medium">Get started</p>
                <p className="text-sm text-muted-foreground">
                  You&apos;ll be redirected to your dashboard to begin setting up your calendar
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resend Email Section */}
        <div className="pt-4 border-t">
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email?
            </p>
            
            {resendStatus === 'success' && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950/50">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-700 dark:text-green-400">
                  {resendMessage}
                </AlertDescription>
              </Alert>
            )}

            {resendStatus === 'error' && (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-950/50">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-700 dark:text-red-400">
                  {resendMessage}
                </AlertDescription>
              </Alert>
            )}

            <Button
              variant="outline"
              onClick={handleResendEmail}
              disabled={isResending || !email}
              className="w-full"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend confirmation email
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Additional Help */}
      <Card className="p-4">
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Still having trouble?</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Check your spam/junk folder</p>
            <p>• Make sure {email} is correct</p>
            <p>• Try waiting a few minutes and checking again</p>
            <p>• The confirmation link expires after 24 hours</p>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center">
        <Link
          href="/auth/sign-in"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          Back to sign in
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
} 