'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Form, FormField, Button, useForm } from '@/components/ui'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

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
      <Card className="border-pink-200 bg-gradient-to-br from-pink-50/50 to-purple-50/50 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              🎉 Welcome to avara.studio!
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600">
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

          <Form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Field */}
            <FormField
              label="Create Password"
              error={errors.password}
              required
              className="space-y-2"
            >
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-4 w-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={(values as unknown as SetPasswordFormData).password}
                  onChange={(e) => setValue('password', e.target.value)}
                  onBlur={() => validateFieldOnBlur('password')}
                  placeholder="Create a secure password"
                  disabled={loading || isProcessing}
                  className="w-full pl-10 pr-10 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-400 hover:text-pink-600"
                  disabled={loading || isProcessing}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>

            {/* Confirm Password Field */}
            <FormField
              label="Confirm Password"
              error={errors.confirmPassword}
              required
              className="space-y-2"
            >
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={(values as unknown as SetPasswordFormData).confirmPassword}
                  onChange={(e) => setValue('confirmPassword', e.target.value)}
                  onBlur={() => validateFieldOnBlur('confirmPassword')}
                  placeholder="Confirm your password"
                  disabled={loading || isProcessing}
                  className="w-full pl-10 pr-10 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600"
                  disabled={loading || isProcessing}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>

            {/* Error Display */}
            {authError && (
              <Alert variant="destructive" className="border-red-200 bg-red-50/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || isProcessing}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading || isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Setting Password...
                </div>
              ) : (
                'Complete Setup & Enter avara.studio'
              )}
            </Button>
          </Form>

          {/* Security Notice */}
          <div className="text-center text-xs text-gray-500 bg-gray-50/50 p-3 rounded-lg">
            🔒 Your password is encrypted and secure. You can change it anytime in your profile settings.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}