'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Form, FormField, Button, useForm } from '@/components/ui'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'

interface SetPasswordFormProps {
  invitationData?: {
    email?: string
    full_name?: string
    role?: string
    invitation_message?: string
  }
  className?: string
}

interface SetPasswordFormData {
  password: string
  confirmPassword: string
}

export function SetPasswordForm({ invitationData, className }: SetPasswordFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [authError, setAuthError] = React.useState<string>('')
  const [isProcessing, setIsProcessing] = React.useState(false)

  const {
    values,
    errors,
    loading,
    setValue,
    validateFieldOnBlur,
    handleSubmit,
  } = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationRules: {
      password: {
        required: 'Password is required',
        minLength: {
          value: 8,
          message: 'Password must be at least 8 characters'
        },
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        }
      },
      confirmPassword: {
        required: 'Please confirm your password',
        custom: (value) => {
          if (value !== (values as unknown as SetPasswordFormData).password) {
            return 'Passwords do not match'
          }
          return undefined
        }
      }
    },
    onSubmit: async (formData) => {
      const { password } = formData as unknown as SetPasswordFormData
      setAuthError('')
      setIsProcessing(true)

      try {
        // Update user's password to complete the invitation
        const { data, error } = await supabase.auth.updateUser({
          password: password
        })

        if (error) {
          setAuthError(error.message)
          return
        }

        if (data.user) {
          console.log('✅ Password set successfully for invited user:', data.user.email)
          
          // Redirect to onboarding with success message
          router.push('/app/add-calendar?invitation_completed=true&force_onboarding=true')
          router.refresh()
        }
      } catch (error) {
        console.error('❌ Error setting password:', error)
        setAuthError('Failed to set password. Please try again.')
      } finally {
        setIsProcessing(false)
      }
    },
  })

  return (
    <div className={`w-full max-w-md mx-auto ${className || ''}`}>
      <Card className="border-border bg-background">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary">
              <Lock className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Welcome to avara.studio!
            </CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">
              {invitationData?.full_name ? (
                <>Hi {invitationData.full_name}! Complete your yoga instructor account by setting a password.</>
              ) : (
                <>Complete your yoga instructor account by setting a password.</>
              )}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Invitation Details */}
          {invitationData && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-pink-100/50 to-purple-100/50 border border-pink-200">
              <div className="space-y-2 text-sm">
                {invitationData.email && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{invitationData.email}</span>
                  </div>
                )}
                {invitationData.role && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-medium capitalize">
                      {invitationData.role === 'teacher' ? '🧘‍♀️ Yoga Instructor' : '👑 Admin'}
                    </span>
                  </div>
                )}
              </div>
              
              {invitationData.invitation_message && (
                <div className="mt-3 pt-3 border-t border-pink-200">
                  <p className="text-sm text-gray-700 italic">
                    &quot;{invitationData.invitation_message}&quot;
                  </p>
                </div>
              )}
            </div>
          )}

          <Form onSubmit={handleSubmit} loading={loading || isProcessing}>
            <FormField
              label="Create Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a secure password"
              value={(values as unknown as SetPasswordFormData).password}
              onChange={(e) => setValue('password', e.target.value)}
              onBlur={() => validateFieldOnBlur('password')}
              error={errors.password}
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading || isProcessing}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              required
              autoComplete="new-password"
            />

            <FormField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={(values as unknown as SetPasswordFormData).confirmPassword}
              onChange={(e) => setValue('confirmPassword', e.target.value)}
              onBlur={() => validateFieldOnBlur('confirmPassword')}
              error={errors.confirmPassword}
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  disabled={loading || isProcessing}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              required
              autoComplete="new-password"
            />

            {/* Error Display */}
            {authError && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:text-red-400 dark:bg-red-950/50 dark:border-red-800">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || isProcessing}
              className="w-full"
              size="lg"
              loading={loading || isProcessing}
            >
              {loading || isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Setting up your account...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </Form>

          {/* Security Notice */}
          <div className="text-center text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            🔒 Your password is encrypted and secure. You can change it anytime in your profile settings.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}