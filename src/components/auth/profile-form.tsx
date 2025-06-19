'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Form, FormField, Button, useForm } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  Globe, 
  Instagram, 
  Clock, 
  AlertCircle,
  Camera,
  Check
} from 'lucide-react'

interface User {
  id: string
  email: string
  name?: string
  bio?: string
  profile_image_url?: string
  public_url?: string
  timezone?: string
  instagram_url?: string
  website_url?: string
  yoga_styles?: string[]
  event_display_variant?: 'minimal' | 'compact' | 'full'
}

interface ProfileFormProps {
  user: User
  onUpdate?: (user: User) => void
}



// Profile Picture Upload Component
const ProfilePictureUpload: React.FC<{
  currentImageUrl?: string
  onImageChange: (file: File | null) => void
  uploading: boolean
}> = ({ currentImageUrl, onImageChange, uploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be smaller than 5MB')
        return
      }
      onImageChange(file)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group backdrop-blur-md bg-white/30 border border-white/40 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
        onClick={handleClick}
      >
        {currentImageUrl ? (
          <img
            src={currentImageUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="h-12 w-12 text-foreground/60" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {uploading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <p className="text-xs text-foreground/60 text-center">
        Click to upload photo<br />
        Max 5MB • JPG, PNG, WEBP
      </p>
    </div>
  )
}

// Multi-Select Component for Yoga Styles
const YogaStylesSelect: React.FC<{
  value: string[]
  onChange: (styles: string[]) => void
}> = ({ value, onChange }) => {
  const yogaStyles = [
    'Hatha Yoga',
    'Vinyasa Flow', 
    'Ashtanga',
    'Bikram/Hot Yoga',
    'Iyengar',
    'Kundalini',
    'Yin Yoga',
    'Restorative',
    'Power Yoga',
    'Prenatal Yoga',
    'Meditation',
    'Breathwork'
  ]

  const toggleStyle = (style: string) => {
    if (value.includes(style)) {
      onChange(value.filter(s => s !== style))
    } else {
      onChange([...value, style])
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Yoga Styles You Teach
      </label>
      <div className="flex flex-wrap gap-2">
        {yogaStyles.map(style => (
          <Badge
            key={style}
            variant={value.includes(style) ? 'default' : 'outline'}
            className="cursor-pointer transition-all hover:scale-105 backdrop-blur-sm"
            onClick={() => toggleStyle(style)}
          >
            {style}
          </Badge>
        ))}
      </div>
      <p className="text-xs text-foreground/60">
        Select the yoga styles you teach (click to toggle)
      </p>
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
        className={`flex w-full rounded-xl bg-background text-sm ring-offset-background backdrop-blur-sm bg-white/50 border border-white/40 shadow-md placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-in-out p-3 resize-none font-sans ${
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

// Enhanced Select Component
const Select: React.FC<{
  label?: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}> = ({ label, value, onChange, options, placeholder }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex w-full rounded-xl bg-background text-sm ring-offset-background backdrop-blur-sm bg-white/50 border border-white/40 shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-in-out h-10 px-3 font-sans"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [uploadingImage, setUploadingImage] = useState(false)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [authError, setAuthError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [publicUrlPreview, setPublicUrlPreview] = useState<string>('')

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

  const {
    values,
    errors,
    loading,
    setValue,
    validateFieldOnBlur,
    handleSubmit,
  } = useForm({
    initialValues: {
      name: user.name || '',
      bio: user.bio || '',
      public_url: user.public_url || '',
      timezone: user.timezone || 'UTC',
      instagram_url: user.instagram_url || '',
      website_url: user.website_url || '',
      yoga_styles: user.yoga_styles || [],
      event_display_variant: user.event_display_variant || 'compact',
    },
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
          if (value && typeof value === 'string' && value.trim()) {
            const instagramRegex = /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/.+/
            if (!instagramRegex.test(value)) {
              return 'Please enter a valid Instagram URL'
            }
          }
          return undefined
        }
      },
      website_url: {
        custom: (value) => {
          if (value && typeof value === 'string' && value.trim()) {
            try {
              new URL(value)
              return undefined
            } catch {
              return 'Please enter a valid website URL'
            }
          }
          return undefined
        }
      }
    },
    onSubmit: async (formData) => {
      setAuthError('')
      setSuccessMessage('')

      try {
        // Simulate API call for development
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        setSuccessMessage('Profile updated successfully!')
        
        if (onUpdate) {
          const updatedUser: User = {
            ...user,
            name: formData.name as string,
            bio: formData.bio as string,
            public_url: formData.public_url as string,
            timezone: formData.timezone as string,
            instagram_url: formData.instagram_url as string,
            website_url: formData.website_url as string,
            yoga_styles: formData.yoga_styles as string[],
            event_display_variant: formData.event_display_variant as 'minimal' | 'compact' | 'full',
          }
          onUpdate(updatedUser)
        }

        setProfileImageFile(null)

      } catch (error) {
        setAuthError('An error occurred while updating your profile')
        console.error('Profile update error:', error)
      }
    }
  })

  // Update public URL preview
  useEffect(() => {
    if (values.public_url && typeof window !== 'undefined') {
      setPublicUrlPreview(`${window.location.origin}/schedule/${values.public_url}`)
    } else {
      setPublicUrlPreview('')
    }
  }, [values.public_url])

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Messages */}
      {authError && (
        <div className="flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50/30 border border-red-200 rounded-xl backdrop-blur-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 p-4 text-sm text-green-600 bg-green-50/30 border border-green-200 rounded-xl backdrop-blur-sm">
          <Check className="h-4 w-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <Form onSubmit={handleSubmit} loading={loading || uploadingImage}>
        {/* Profile Picture Section */}
        <Card variant="glass">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 font-serif">
              <User className="h-5 w-5" />
              Profile Picture
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ProfilePictureUpload
              currentImageUrl={user.profile_image_url}
              onImageChange={setProfileImageFile}
              uploading={uploadingImage}
            />
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              value={user.email}
              disabled
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <div className="md:col-span-2">
              <TextArea
                label="Bio"
                value={values.bio as string}
                onChange={(e) => setValue('bio', e.target.value)}
                placeholder="Tell people about yourself and your yoga practice..."
                maxLength={500}
                rows={4}
                error={errors.bio}
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

            <YogaStylesSelect
              value={values.yoga_styles as string[]}
              onChange={(styles) => setValue('yoga_styles', styles)}
            />
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

        {/* Social Links */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Instagram className="h-5 w-5" />
              Social Links
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Instagram URL"
              type="url"
              placeholder="https://instagram.com/yourusername"
              value={values.instagram_url as string}
              onChange={(e) => setValue('instagram_url', e.target.value)}
              onBlur={() => validateFieldOnBlur('instagram_url')}
              error={errors.instagram_url}
              leftIcon={<Instagram className="h-4 w-4" />}
            />

            <FormField
              label="Website URL"
              type="url"
              placeholder="https://your-website.com"
              value={values.website_url as string}
              onChange={(e) => setValue('website_url', e.target.value)}
              onBlur={() => validateFieldOnBlur('website_url')}
              error={errors.website_url}
              leftIcon={<Globe className="h-4 w-4" />}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card variant="glass">
          <CardContent className="pt-6">
            <Button
              type="submit"
              variant="glass"
              className="w-full"
              size="lg"
              loading={loading || uploadingImage}
            >
              {loading || uploadingImage ? 'Updating Profile...' : 'Update Profile'}
            </Button>
          </CardContent>
        </Card>
      </Form>
    </div>
  )
} 