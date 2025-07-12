'use client'

import React from 'react'
import Link from 'next/link'
import { Form, FormField, Button, useForm } from '@/components/ui'
import { createClient } from '@/lib/supabase'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { useTranslationNamespace } from '@/lib/i18n/context'
// Uncomment when you want to add CAPTCHA protection
// import HCaptcha from '@hcaptcha/react-hcaptcha'

interface LoginFormProps {
  redirectTo?: string
  className?: string
}

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm({ redirectTo = '/app', className }: LoginFormProps) {
  const { t } = useTranslationNamespace('auth.signIn')
  const supabase = createClient()
  const [showPassword, setShowPassword] = React.useState(false)
  const [authError, setAuthError] = React.useState<string>('')
  const [finalRedirectTo, setFinalRedirectTo] = React.useState(redirectTo)
  // Uncomment when you want to add CAPTCHA protection
  // const [captchaToken, setCaptchaToken] = React.useState<string | null>(null)
  // const captchaRef = React.useRef<any>(null)

  // Check for returnTo parameter in URL
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const returnToParam = urlParams.get('returnTo')
    if (returnToParam) {
      setFinalRedirectTo(returnToParam)
    }
  }, [redirectTo])

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
    },
    validationRules: {
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
          value: 6,
          message: 'Password must be at least 6 characters'
        }
      }
    },
    onSubmit: async (formData) => {
      const { email, password } = formData as unknown as LoginFormData
      setAuthError('')

      try {
        // Get CAPTCHA token if enabled
        // let token = captchaToken
        // if (!token) {
        //   const captchaResponse = await captchaRef.current?.execute({ async: true })
        //   token = captchaResponse?.response ?? null
        // }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
          // Uncomment when CAPTCHA is enabled
          // options: { captchaToken: token ?? undefined },
        })

        if (error) {
          setAuthError(error.message)
          return
        }

        if (data.user) {
          // Successful login - redirect without refresh to avoid loops
          window.location.href = finalRedirectTo
        }
      } catch (error: unknown) {
        // Handle rate limiting errors
        const errorObj = error as { status?: number; message?: string }
        if (errorObj?.status === 429) {
          setAuthError('Too many login attempts. Please wait a few minutes and try again.')
        } else {
          setAuthError('An unexpected error occurred. Please try again.')
        }
        console.error('Login error:', error)
      }
    }
  })

  const handleGoogleSignIn = async () => {
    try {
              const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent(finalRedirectTo)}`
        }
      })

      if (error) {
        setAuthError(error.message)
      }
    } catch (error) {
      setAuthError('Failed to sign in with Google')
      console.error('Google sign-in error:', error)
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
          label={t('emailLabel')}
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
          label={t('passwordLabel')}
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
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
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-sm">
          <Link 
            href="/auth/forgot-password"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            {t('forgotPassword')}
          </Link>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          loading={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            t('signInButton')
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
          onClick={handleGoogleSignIn}
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
        <span className="text-muted-foreground">Don&apos;t have an account? </span>
        <Link 
          href="/auth/register"
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Sign up here
        </Link>
      </div>
    </div>
  )
} 