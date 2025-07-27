import { createServerClient } from '@/lib/supabase-server'
import { createClient } from '@/lib/supabase'

export interface CreateInvitationRequest {
  email: string
  invitedName?: string
  personalMessage?: string
  expiryDays?: number
  notes?: string
}

export interface InvitationData {
  id: string
  email: string
  token: string
  status: 'pending' | 'accepted' | 'expired' | 'cancelled'
  invited_name?: string
  personal_message?: string
  invited_by?: string
  expires_at: string
  used_at?: string
  used_by?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface CreateInvitationResult {
  success: boolean
  invitation?: InvitationData
  invitationLink?: string
  error?: string
}

export interface ValidateInvitationResult {
  valid: boolean
  invitation?: InvitationData
  error?: string
}

/**
 * Generate a secure random token for invitations
 */
function generateInvitationToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Create a new teacher invitation
 */
export async function createInvitation(
  request: CreateInvitationRequest,
  invitedById?: string
): Promise<CreateInvitationResult> {
  try {
    const supabase = await createServerClient()
    
    const { email, invitedName, personalMessage, expiryDays = 7, notes } = request
    
    // Check if there's already a pending invitation for this email
    const { data: existingInvitation } = await supabase
      .from('user_invitations')
      .select('id, status, expires_at')
      .eq('email', email)
      .eq('status', 'pending')
      .gte('expires_at', new Date().toISOString())
      .single()
    
    if (existingInvitation) {
      return {
        success: false,
        error: 'An active invitation already exists for this email address'
      }
    }
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single()
    
    if (existingUser) {
      return {
        success: false,
        error: 'A user with this email address already exists'
      }
    }
    
    // Generate unique token
    const token = generateInvitationToken()
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString()
    
    // Create invitation
    const { data, error } = await supabase
      .from('user_invitations')
      .insert({
        email,
        token,
        invited_name: invitedName,
        personal_message: personalMessage,
        invited_by: invitedById,
        expires_at: expiresAt,
        notes,
        status: 'pending'
      })
      .select()
      .single()
    
    if (error) {
      console.error('Failed to create invitation:', error)
      return {
        success: false,
        error: 'Failed to create invitation'
      }
    }
    
    // Generate invitation link
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const invitationLink = `${baseUrl}/auth/register?token=${token}`
    
    return {
      success: true,
      invitation: data as InvitationData,
      invitationLink
    }
  } catch (error) {
    console.error('Error in createInvitation:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}

/**
 * Validate an invitation token
 */
export async function validateInvitation(token: string): Promise<ValidateInvitationResult> {
  try {
    const supabase = createClient() // Use client-side for anonymous access
    
    const { data: invitation, error } = await supabase
      .from('user_invitations')
      .select('*')
      .eq('token', token)
      .single()
    
    if (error || !invitation) {
      return {
        valid: false,
        error: 'Invalid invitation token'
      }
    }
    
    // Check if invitation is expired
    if (new Date(invitation.expires_at) < new Date()) {
      return {
        valid: false,
        error: 'Invitation has expired'
      }
    }
    
    // Check if invitation is already used
    if (invitation.status !== 'pending') {
      return {
        valid: false,
        error: `Invitation has already been ${invitation.status}`
      }
    }
    
    return {
      valid: true,
      invitation: invitation as InvitationData
    }
  } catch (error) {
    console.error('Error in validateInvitation:', error)
    return {
      valid: false,
      error: 'Failed to validate invitation'
    }
  }
}

/**
 * Mark an invitation as used
 */
export async function markInvitationAsUsed(
  token: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient()
    
    const { error } = await supabase
      .from('user_invitations')
      .update({
        status: 'accepted',
        used_at: new Date().toISOString(),
        used_by: userId
      })
      .eq('token', token)
      .eq('status', 'pending')
    
    if (error) {
      console.error('Failed to mark invitation as used:', error)
      return {
        success: false,
        error: 'Failed to update invitation status'
      }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error in markInvitationAsUsed:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}

/**
 * Get all invitations (admin only)
 */
export async function getAllInvitations(): Promise<{
  success: boolean
  invitations?: InvitationData[]
  error?: string
}> {
  try {
    const supabase = await createServerClient()
    
    const { data: invitations, error } = await supabase
      .from('user_invitations')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Failed to fetch invitations:', error)
      return {
        success: false,
        error: 'Failed to fetch invitations'
      }
    }
    
    return {
      success: true,
      invitations: invitations as InvitationData[]
    }
  } catch (error) {
    console.error('Error in getAllInvitations:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}

/**
 * Cancel an invitation
 */
export async function cancelInvitation(
  invitationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient()
    
    const { error } = await supabase
      .from('user_invitations')
      .update({ status: 'cancelled' })
      .eq('id', invitationId)
      .eq('status', 'pending')
    
    if (error) {
      console.error('Failed to cancel invitation:', error)
      return {
        success: false,
        error: 'Failed to cancel invitation'
      }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error in cancelInvitation:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
} 