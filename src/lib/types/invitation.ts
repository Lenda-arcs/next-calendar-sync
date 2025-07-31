/**
 * Shared types for invitation system
 * Consolidates all invitation-related interfaces
 */

export type UserRole = 'teacher' | 'admin'

export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled'

export interface CreateInvitationForm {
  email: string
  invitedName: string
  personalMessage: string
  role: UserRole
  language?: 'en' | 'de' | 'es'
}

export interface SupabaseInvitationRequest {
  email: string
  invitedName?: string
  personalMessage?: string
  role?: UserRole
  redirectTo?: string
}

export interface EnhancedInvitationRequest extends SupabaseInvitationRequest {
  language?: 'en' | 'de' | 'es'
  timeZone?: string
  source?: 'admin' | 'self_signup' | 'referral'
}

export interface SupabaseInvitationResult {
  success: boolean
  user?: SupabaseUser
  error?: string
}

export interface SupabaseUser {
  id: string
  email: string
  invited_at?: string
  email_confirmed_at?: string
  last_sign_in_at?: string
  created_at: string
  user_metadata: UserMetadata
}

export interface UserMetadata {
  full_name?: string
  invited_by?: string
  role?: UserRole
  invitation_message?: string
  invited_at?: string
}

// Raw Supabase Auth user type
export interface SupabaseAuthUser {
  id: string
  email?: string
  invited_at?: string
  email_confirmed_at?: string
  last_sign_in_at?: string
  created_at: string
  user_metadata?: Record<string, unknown>
}

export interface InvitationStats {
  totalUsers: number
  pendingInvitations: number
  confirmedUsers: number
  activeUsers: number
}

export interface InvitationFormErrors {
  email?: string
  invitedName?: string
  personalMessage?: string
  role?: string
}