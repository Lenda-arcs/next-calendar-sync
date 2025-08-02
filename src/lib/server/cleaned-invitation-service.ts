/**
 * Cleaned up invitation service
 * Removes old custom token logic and focuses on Supabase integration
 */

import { createServerClient, createAdminClient } from '@/lib/supabase-server'
import type { 
  SupabaseInvitationRequest, 
  SupabaseInvitationResult,
  SupabaseUser,
  SupabaseAuthUser 
} from '@/lib/types/invitation'

export class InvitationService {
  /**
   * Send invitation using Supabase's built-in system
   */
  static async inviteUser(
    request: SupabaseInvitationRequest & { language?: string },
    invitedById?: string
  ): Promise<SupabaseInvitationResult> {
    try {
      const supabase = await createServerClient()
      const adminClient = createAdminClient()
      const { email, invitedName, personalMessage, role = 'teacher', redirectTo, language = 'en' } = request
      
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

      // Use Supabase's built-in invitation system with admin client
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const finalRedirectTo = redirectTo || `${baseUrl}/auth/register`
      
      const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
        redirectTo: finalRedirectTo,
        data: {
          full_name: invitedName,
          invited_by: invitedById,
          role: role,
          invitation_message: personalMessage,
          invited_at: new Date().toISOString(),
          language: language
        }
      })

      if (error) {
        console.error('Failed to send invitation:', error)
        return {
          success: false,
          error: error.message || 'Failed to send invitation'
        }
      }

      return {
        success: true,
        user: data.user as SupabaseUser
      }
    } catch (error) {
      console.error('Error in inviteUser:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  /**
   * Get all users from Supabase Auth
   */
  static async getAllUsers(): Promise<{
    success: boolean
    users?: SupabaseUser[]
    error?: string
  }> {
    try {
      const adminClient = createAdminClient()
      
      const { data: users, error } = await adminClient.auth.admin.listUsers()
      
      if (error) {
        return {
          success: false,
          error: 'Failed to fetch users'
        }
      }

      const mappedUsers = users.users?.map((user: SupabaseAuthUser) => ({
        id: user.id,
        email: user.email || '',
        invited_at: user.invited_at,
        email_confirmed_at: user.email_confirmed_at,
        last_sign_in_at: user.last_sign_in_at,
        created_at: user.created_at,
        user_metadata: user.user_metadata || {}
      })) || []

      return {
        success: true,
        users: mappedUsers as SupabaseUser[]
      }
    } catch (error) {
      console.error('Error in getAllUsers:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  /**
   * Get pending invitations
   */
  static async getPendingInvitations(): Promise<{
    success: boolean
    invitations?: SupabaseUser[]
    error?: string
  }> {
    try {
      const result = await this.getAllUsers()
      
      if (!result.success) {
        return {
          success: false,
          error: result.error
        }
      }

      const pendingInvitations = result.users?.filter(user => 
        user.invited_at && !user.email_confirmed_at
      ) || []

      return {
        success: true,
        invitations: pendingInvitations
      }
    } catch (error) {
      console.error('Error in getPendingInvitations:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  /**
   * Cancel invitation by deleting unconfirmed user
   */
  static async cancelInvitation(userId: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const adminClient = createAdminClient()
      
      // Get user to check if they're still pending
      const { data: user, error: getUserError } = await adminClient.auth.admin.getUserById(userId)
      
      if (getUserError || !user) {
        return {
          success: false,
          error: 'User not found'
        }
      }

      // Only allow cancellation of unconfirmed invitations
      if (user.user.email_confirmed_at) {
        return {
          success: false,
          error: 'Cannot cancel - user has already confirmed their account'
        }
      }

      // Delete the user (this cancels the invitation)
      const { error } = await adminClient.auth.admin.deleteUser(userId)
      
      if (error) {
        return {
          success: false,
          error: error.message || 'Failed to cancel invitation'
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
}