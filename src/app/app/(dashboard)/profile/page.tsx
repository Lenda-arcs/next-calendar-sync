'use client'

import { Container } from '@/components/layout/container'
import { ProfileForm } from '@/components/auth'

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

// Mock user data for development
const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'user@example.com',
  name: 'John Doe',
  bio: 'Passionate yoga instructor with 10+ years of experience teaching various styles including Vinyasa, Hatha, and Restorative yoga.',
  profile_image_url: undefined as string | undefined,
  public_url: 'john-doe',
  timezone: 'UTC',
  instagram_url: 'https://instagram.com/johndoe',
  website_url: 'https://johndoe.com',
  yoga_styles: ['Hatha Yoga', 'Vinyasa Flow', 'Restorative'],
  event_display_variant: 'compact' as const,
}

export default function ProfilePage() {
  const handleProfileUpdate = (updatedUser: User) => {
    console.log('Profile updated:', updatedUser)
    // Here you could update local state, make API calls, etc.
  }

  return (
    <div className="p-6">
      <Container>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 font-serif">
            Profile Settings
          </h1>
          <p className="text-foreground/70 text-lg">
            Manage your account settings and public profile information.
          </p>
        </div>

        <ProfileForm 
          user={mockUser}
          onUpdate={handleProfileUpdate}
        />
      </Container>
    </div>
  )
} 