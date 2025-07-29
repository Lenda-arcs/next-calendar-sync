'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Form, FormField, Button, useForm } from '@/components/ui'
import { createClient } from '@/lib/supabase'
import { useMarkInvitationAsUsed } from '@/lib/hooks/useAppQuery'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, User } from 'lucide-react'

interface RegisterFormProps {
  redirectTo?: string
  className?: string
  invitationToken?: string
}

interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  fullName: string
}

export function RegisterForm({ redirectTo = '/app', className, invitationToken }: RegisterFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [authError, setAuthError] = React.useState<string>('')

  const markInvitationMutation = useMarkInvitationAsUsed()

  const {
    values,
    errors,
    loading,
    setValue,
    validateFieldOnBlur,
    handleSubmit,
  } = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    },
    validationRules: {
      fullName: {
        required: 'Full name is required',
        minLength: {
          value: 2,
          message: 'Name must be at least 2 characters'
        }
      },
      email: {
        required: 'Email is required',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Please enter a valid email address'
        }
      },
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
          if (value !== values.password) {
            return 'Passwords do not match'
          }
          return undefined
        }
      }
    },
    onSubmit: async (formData) => {
      const { email, password, fullName } = formData as unknown as RegisterFormData
      setAuthError('')

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent('/app/add-calendar?force_onboarding=true')}`
          }
        })

        if (error) {
          setAuthError(error.message)
          return
        }

        if (data.user) {
          // ✨ NEW: Mark invitation as used if we have an invitation token
          if (invitationToken) {
            try {
              await markInvitationMutation.mutateAsync({
                token: invitationToken,
                userId: data.user.id
              })
            } catch (error) {
              console.error('Failed to mark invitation as used:', error)
              // Don't block the registration flow if this fails
            }
          }

          // Check if email confirmation is required
          if (!data.session) {
            // Redirect to email confirmation page
            router.push(`/auth/confirm-email?email=${encodeURIComponent(email)}&redirectTo=${encodeURIComponent(redirectTo)}`)
          } else {
            // Successful registration with immediate login
            router.push(redirectTo)
            router.refresh()
          }
        }
      } catch (error) {
        setAuthError('An unexpected error occurred. Please try again.')
        console.error('Registration error:', error)
      }
    }
  })

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent(redirectTo)}`
        }
      })

      if (error) {
        setAuthError(error.message)
      }
    } catch (error) {
      setAuthError('Failed to sign up with Google')
      console.error('Google sign-up error:', error)
    }
  }

  return (
    <div className={className}>
      <Form onSubmit={handleSubmit} loading={loading}>
        {authError && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:text-red-400 dark:bg-red-950/50 dark:border-red-800">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <FormField
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={values.fullName as string}
          onChange={(e) => setValue('fullName', e.target.value)}
          onBlur={() => validateFieldOnBlur('fullName')}
          error={errors.fullName}
          leftIcon={<User className="h-4 w-4" />}
          required
          autoComplete="name"
        />

        <FormField
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={values.email as string}
          onChange={(e) => setValue('email', e.target.value)}
          onBlur={() => validateFieldOnBlur('email')}
          error={errors.email}
          leftIcon={<Mail className="h-4 w-4" />}
          required
          autoComplete="email"
        />

        <FormField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a password"
          value={values.password as string}
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
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          required
          autoComplete="new-password"
          helperText="Must contain at least 8 characters with uppercase, lowercase, and number"
        />

        <FormField
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm your password"
          value={values.confirmPassword as string}
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
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          required
          autoComplete="new-password"
        />

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          loading={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleGoogleSignUp}
        >
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>
      </Form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link 
          href="/auth/sign-in"
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Sign in here
        </Link>
      </div>
    </div>
  )
} 