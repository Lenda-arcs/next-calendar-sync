'use client'

import React, { useState, useEffect } from 'react'
import { Form, FormField, Button, useForm, Select } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  User as UserIcon, 
  Mail, 
  Globe, 
  Clock, 
  Save,
  RotateCcw,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

import { User } from '@/lib/types'
import { useSupabaseUpdate } from '@/lib/hooks/useSupabaseMutation'
import ImageUpload from '@/components/ui/image-upload'
import { YogaStylesSelect } from '@/components/ui/yoga-styles-select'
import { cn, urlValidation } from '@/lib/utils'
import { PATHS } from '@/lib/paths'

interface ProfileFormProps {
  user: User
  onUpdate?: (user: User) => void
}

// Floating Action Button Component for Profile Updates
const ProfileUpdateFAB: React.FC<{
  hasChanges: boolean
  isSaving: boolean
  onSave: () => void
  onReset: () => void
}> = ({ hasChanges, isSaving, onSave, onReset }) => {
  if (!hasChanges) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col gap-2">
        {/* Reset button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="bg-background shadow-lg border-2"
          disabled={isSaving}
          title="Reset all changes"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        {/* Save button */}
        <Button
          onClick={onSave}
          disabled={isSaving}
          className={cn(
            "shadow-lg min-w-[140px] transition-all duration-200",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            isSaving && "bg-primary/50"
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Update Profile
            </>
          )}
        </Button>
      </div>
    </div>
  )
}



// Enhanced Textarea Component
const TextArea: React.FC<{
  label?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  maxLength?: number
  rows?: number
  error?: string
}> = ({ label, value, onChange, placeholder, maxLength = 500, rows = 4, error }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        className={`flex w-full rounded-xl bg-background text-sm ring-offset-background backdrop-blur-sm bg-white/50 border border-white/40 shadow-md placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-in-out p-3 resize-none font-sans ${
          error ? 'border-red-300 focus:ring-red-500' : ''
        }`}
      />
      <div className="flex justify-between items-center text-xs text-foreground/60">
        <span>{error && <span className="text-red-500">{error}</span>}</span>
        <span className={value.length > maxLength * 0.9 ? 'text-orange-500' : ''}>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  )
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [publicUrlPreview, setPublicUrlPreview] = useState<string>('')
  const [hasFormChanges, setHasFormChanges] = useState(false)

  // Use the Supabase mutation hook for updating user profile
  const updateUserMutation = useSupabaseUpdate<User>('users', {
    onSuccess: (data) => {
      toast.success('Profile updated successfully!')
      setHasFormChanges(false) // Reset changes flag on successful save
      onUpdate?.(data[0]) // Call the optional callback with updated user data
    },
    onError: (error) => {
      console.error('Profile update error:', error)
      toast.error(`Failed to update profile: ${error.message}`)
    },
  })

  const timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'Europe/Berlin', label: 'Europe/Berlin' },
    { value: 'Europe/Vienna', label: 'Europe/Vienna' },
    { value: 'America/New_York', label: 'America/New_York' },
    { value: 'America/Los_Angeles', label: 'America/Los_Angeles' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
    { value: 'Asia/Kolkata', label: 'Asia/Kolkata' },
  ]

  const displayVariantOptions = [
    { value: 'minimal', label: 'Minimal - Compact view with basic info' },
    { value: 'compact', label: 'Compact - Standard card view (default)' },
    { value: 'full', label: 'Full - Detailed view with all information' },
  ]

  const initialValues = React.useMemo(() => ({
    name: user.name ?? '',
    bio: user.bio ?? '',
    profile_image_url: user.profile_image_url ?? '',
    public_url: user.public_url ?? '',
    timezone: user.timezone ?? 'UTC',
    instagram_url: user.instagram_url ?? '',
    website_url: user.website_url ?? '',
    yoga_styles: user.yoga_styles ?? [],
    event_display_variant: user.event_display_variant ?? 'compact',
  }), [user])

  const {
    values,
    errors,
    loading,
    setValue,
    validateFieldOnBlur,
    handleSubmit,
    reset,
  } = useForm({
    initialValues,
    validationRules: {
      name: {
        required: 'Name is required',
        minLength: {
          value: 2,
          message: 'Name must be at least 2 characters'
        }
      },
      bio: {
        maxLength: {
          value: 500,
          message: 'Bio must be less than 500 characters'
        }
      },
      public_url: {
        pattern: {
          value: /^[a-z0-9-]*$/,
          message: 'Public URL should contain only lowercase letters, numbers, and hyphens'
        }
      },
      instagram_url: {
        custom: (value) => {
          const validation = urlValidation.validateInstagramUrl(value as string)
          return validation.isValid ? undefined : validation.error
        }
      },
      website_url: {
        custom: (value) => {
          const validation = urlValidation.validateWebsiteUrl(value as string)
          return validation.isValid ? undefined : validation.error
        }
      }
    },
    onSubmit: async (formData) => {
      // Normalize URLs to match database constraints
      const normalizedInstagramUrl = urlValidation.normalizeUrl(formData.instagram_url as string)
      const normalizedWebsiteUrl = urlValidation.normalizeUrl(formData.website_url as string)

      // Prepare the update data
      const updateData: Partial<User> = {
        name: formData.name as string,
        bio: formData.bio as string || null,
        profile_image_url: formData.profile_image_url as string || null,
        public_url: formData.public_url as string || null,
        timezone: formData.timezone as string,
        instagram_url: normalizedInstagramUrl,
        website_url: normalizedWebsiteUrl,
        yoga_styles: formData.yoga_styles as string[],
        event_display_variant: formData.event_display_variant as 'minimal' | 'compact' | 'full',
      }

      // Use the mutation to update the user profile
      await updateUserMutation.mutateAsync({
        id: user.id,
        data: updateData,
      })
    }
  })

  // Check if form has changes by comparing current values with initial values
  useEffect(() => {
    const hasChanges = Object.keys(initialValues).some(key => {
      const initialValue = initialValues[key as keyof typeof initialValues]
      const currentValue = values[key as keyof typeof values]
      
      // Handle array comparison for yoga_styles
      if (key === 'yoga_styles') {
        const initial = Array.isArray(initialValue) ? initialValue : []
        const current = Array.isArray(currentValue) ? currentValue : []
        return JSON.stringify(initial.sort()) !== JSON.stringify(current.sort())
      }
      
      return initialValue !== currentValue
    })
    
    setHasFormChanges(hasChanges)
  }, [values, initialValues])

  // Handle form reset
  const handleReset = () => {
    reset()
    setHasFormChanges(false)
  }

  // Handle save action from FAB
  const handleSave = () => {
    handleSubmit()
  }

  // Update public URL preview
  useEffect(() => {
    if (values.public_url && typeof values.public_url === 'string' && typeof window !== 'undefined') {
              setPublicUrlPreview(`${window.location.origin}${PATHS.DYNAMIC.TEACHER_SCHEDULE(values.public_url)}`)
    } else {
      setPublicUrlPreview('')
    }
  }, [values.public_url])

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Form onSubmit={handleSubmit} loading={loading || updateUserMutation.isLoading}>
        {/* Basic Information */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <UserIcon className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex justify-center">
              <ImageUpload
                currentImageUrl={user.profile_image_url}
                onImageUrlChange={(url) => {
                  // Update the form data when a new image is uploaded
                  setValue('profile_image_url', url || '')
                }}
                userId={user.id}
                aspectRatio={1} // Square aspect ratio for profile pictures
                bucketName="profile-assets" // You'll need to create this bucket in Supabase
                folderPath="avatars"
                maxFileSize={5 * 1024 * 1024} // 5MB
                allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                className="w-32 h-32 rounded-full"
                placeholderText="Change Profile Picture"
                maxImages={5} // Limit: 5 avatar images per user
              />
            </div>

            {/* Name and Email Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Full Name"
                type="text"
                placeholder="Your full name"
                value={values.name as string}
                onChange={(e) => setValue('name', e.target.value)}
                onBlur={() => validateFieldOnBlur('name')}
                error={errors.name}
                required
              />

              <FormField
                label="Email"
                type="email"
                value={user.email ?? ''}
                disabled
                leftIcon={<Mail className="h-4 w-4" />}
              />
            </div>
          </CardContent>
        </Card>

        {/* Public Profile */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Globe className="h-5 w-5" />
              Public Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <TextArea
              label="Bio"
              value={values.bio as string}
              onChange={(e) => setValue('bio', e.target.value)}
              placeholder="Tell people about yourself and your yoga practice..."
              maxLength={500}
              rows={4}
              error={errors.bio}
            />

            <div className="space-y-2">
              <FormField
                label="Public URL"
                type="text"
                placeholder="your-username"
                value={values.public_url as string}
                onChange={(e) => setValue('public_url', e.target.value)}
                onBlur={() => validateFieldOnBlur('public_url')}
                error={errors.public_url}
                helperText="This will be your public schedule URL"
              />
              {publicUrlPreview && (
                <div className="pl-2 space-y-1">
                  <p className="text-xs text-foreground/60">
                    Your schedule will be available at:
                  </p>
                  <p className="text-xs text-primary font-medium break-all">
                    {publicUrlPreview}
                  </p>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Instagram URL"
                type="url"
                placeholder="instagram.com/yourusername or https://instagram.com/yourusername"
                value={values.instagram_url as string}
                onChange={(e) => setValue('instagram_url', e.target.value)}
                onBlur={() => {
                  const currentValue = values.instagram_url as string
                  const validation = urlValidation.validateInstagramUrl(currentValue)
                  if (validation.normalizedUrl !== currentValue) {
                    setValue('instagram_url', validation.normalizedUrl || '')
                  }
                  validateFieldOnBlur('instagram_url')
                }}
                error={errors.instagram_url}
                helperText="We'll automatically add https:// if needed"
              />

              <FormField
                label="Website URL"
                type="url"
                placeholder="your-website.com or https://your-website.com"
                value={values.website_url as string}
                onChange={(e) => setValue('website_url', e.target.value)}
                onBlur={() => {
                  const currentValue = values.website_url as string
                  const validation = urlValidation.validateWebsiteUrl(currentValue)
                  if (validation.normalizedUrl !== currentValue) {
                    setValue('website_url', validation.normalizedUrl || '')
                  }
                  validateFieldOnBlur('website_url')
                }}
                error={errors.website_url}
                helperText="We'll automatically add https:// if needed"
              />
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Clock className="h-5 w-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Timezone"
              value={values.timezone as string}
              onChange={(value) => setValue('timezone', value)}
              options={timezoneOptions}
            />

            <Select
              label="Event Display Style"
              value={values.event_display_variant as string}
              onChange={(value) => setValue('event_display_variant', value)}
              options={displayVariantOptions}
            />
          </CardContent>
        </Card>

        {/* Yoga Styles */}
        <YogaStylesSelect
          value={values.yoga_styles as string[]}
          onChange={(styles) => setValue('yoga_styles', styles)}
        />


      </Form>

      {/* Floating Action Button for Profile Update */}
      <ProfileUpdateFAB
        hasChanges={hasFormChanges}
        isSaving={loading || updateUserMutation.isLoading}
        onSave={handleSave}
        onReset={handleReset}
      />
    </div>
  )
} 