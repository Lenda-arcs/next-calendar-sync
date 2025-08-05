'use client'

import React, { useState, useEffect } from 'react'
import { Form, FormField, Button, useForm } from '@/components/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Mail, 
  Lock,
  Eye,
  EyeOff,
  Save,
  Loader2,
  User,
  Phone
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase'
import { User as UserType } from '@/lib/types'

interface AccountSettingsFormProps {
  user: UserType
}

interface AuthUserData {
  full_name?: string
  phone?: string
}

export function AccountSettingsForm({ user }: AccountSettingsFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [authUserData, setAuthUserData] = useState<AuthUserData>({})
  const [isLoadingAuthData, setIsLoadingAuthData] = useState(true)
  
  const supabase = createClient()

  // Get auth user data
  useEffect(() => {
    const getAuthUserData = async () => {
      try {
        // Try to get user from session first
        const { data: { session } } = await supabase.auth.getSession()
        
        // Also get user directly
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        // Use session user if available, otherwise fall back to direct user
        const user = session?.user || authUser
        
        if (user?.user_metadata) {
          setAuthUserData({
            full_name: user.user_metadata.full_name as string || 
                      user.user_metadata.display_name as string || 
                      user.user_metadata.name as string,
            phone: user.user_metadata.phone as string
          })
        }
      } catch (error) {
        console.error('Error fetching auth user data:', error)
      } finally {
        setIsLoadingAuthData(false)
      }
    }

    getAuthUserData()
  }, [supabase.auth])

  // Email change form
  const emailForm = useForm({
    initialValues: {
      newEmail: '',
    },
    validationRules: {
      newEmail: {
        required: 'New email is required',
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Please enter a valid email address'
        }
      }
    },
    onSubmit: async (formData) => {
      setIsUpdatingEmail(true)
      try {
        const { error } = await supabase.auth.updateUser({
          email: formData.newEmail as string
        })

        if (error) {
          toast.error(`Failed to update email: ${error.message}`)
          return
        }

        toast.success('Email update initiated. Please check your new email for confirmation.')
        emailForm.reset()
      } catch (error) {
        toast.error('An unexpected error occurred')
        console.error('Email update error:', error)
      } finally {
        setIsUpdatingEmail(false)
      }
    }
  })

  // Password change form
  const passwordForm = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationRules: {
      currentPassword: {
        required: 'Current password is required'
      },
      newPassword: {
        required: 'New password is required',
        minLength: {
          value: 8,
          message: 'Password must be at least 8 characters'
        }
      },
      confirmPassword: {
        required: 'Please confirm your new password',
        custom: (value) => {
          return value === passwordForm.values.newPassword ? undefined : 'Passwords do not match'
        }
      }
    },
    onSubmit: async (formData) => {
      setIsUpdatingPassword(true)
      try {
        const { error } = await supabase.auth.updateUser({
          password: formData.newPassword as string
        })

        if (error) {
          toast.error(`Failed to update password: ${error.message}`)
          return
        }

        toast.success('Password updated successfully!')
        passwordForm.reset()
        setShowPassword(false)
        setShowNewPassword(false)
      } catch (error) {
        toast.error('An unexpected error occurred')
        console.error('Password update error:', error)
      } finally {
        setIsUpdatingPassword(false)
      }
    }
  })

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email || '', {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        toast.error(`Failed to send reset email: ${error.message}`)
        return
      }

      toast.success('Password reset email sent. Please check your inbox.')
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Password reset error:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Account Info */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <User className="h-5 w-5" />
            Current Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Account Email</label>
              <div className="flex items-center gap-2 mt-1 p-3 bg-muted/50 rounded-md">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
            </div>
            
            {!isLoadingAuthData && authUserData.full_name && (
              <div>
                <label className="text-sm font-medium text-foreground">Auth Full Name</label>
                <div className="flex items-center gap-2 mt-1 p-3 bg-muted/50 rounded-md">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{authUserData.full_name}</span>
                </div>
              </div>
            )}

            {!isLoadingAuthData && authUserData.phone && (
              <div>
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <div className="flex items-center gap-2 mt-1 p-3 bg-muted/50 rounded-md">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{authUserData.phone}</span>
                </div>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-foreground">Account Created</label>
              <div className="mt-1 p-3 bg-muted/50 rounded-md">
                <span className="text-sm text-muted-foreground">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Change */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Mail className="h-5 w-5" />
            Change Email Address
          </CardTitle>
          <CardDescription>
            Update your email address. You&apos;ll need to confirm the new email before the change takes effect.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={emailForm.handleSubmit} loading={isUpdatingEmail}>
            <div className="space-y-4">
              <FormField
                label="New Email Address"
                type="email"
                placeholder="new-email@example.com"
                value={emailForm.values.newEmail as string}
                onChange={(e) => emailForm.setValue('newEmail', e.target.value)}
                onBlur={() => emailForm.validateFieldOnBlur('newEmail')}
                error={emailForm.errors.newEmail}
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />
              
              <Button 
                type="submit" 
                disabled={isUpdatingEmail}
                className="w-full sm:w-auto"
              >
                {isUpdatingEmail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Email...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Email
                  </>
                )}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Lock className="h-5 w-5" />
            Password Management
          </CardTitle>
          <CardDescription>
            Change your password or request a password reset email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Password Change Form */}
            <Form onSubmit={passwordForm.handleSubmit} loading={isUpdatingPassword}>
              <div className="space-y-4">
                <FormField
                  label="Current Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  value={passwordForm.values.currentPassword as string}
                  onChange={(e) => passwordForm.setValue('currentPassword', e.target.value)}
                  onBlur={() => passwordForm.validateFieldOnBlur('currentPassword')}
                  error={passwordForm.errors.currentPassword}
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  required
                />

                <FormField
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={passwordForm.values.newPassword as string}
                  onChange={(e) => passwordForm.setValue('newPassword', e.target.value)}
                  onBlur={() => passwordForm.validateFieldOnBlur('newPassword')}
                  error={passwordForm.errors.newPassword}
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  required
                />

                <FormField
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm your new password"
                  value={passwordForm.values.confirmPassword as string}
                  onChange={(e) => passwordForm.setValue('confirmPassword', e.target.value)}
                  onBlur={() => passwordForm.validateFieldOnBlur('confirmPassword')}
                  error={passwordForm.errors.confirmPassword}
                  leftIcon={<Lock className="h-4 w-4" />}
                  required
                />

                <Button 
                  type="submit" 
                  disabled={isUpdatingPassword}
                  className="w-full sm:w-auto"
                >
                  {isUpdatingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
            </Form>

            {/* Password Reset Option */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Forgot your password? We can send you a reset link.
              </p>
              <Button 
                variant="outline" 
                onClick={handlePasswordReset}
                className="w-full sm:w-auto"
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Password Reset Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 