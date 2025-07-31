/**
 * Enhanced invitation service with language support and branded templates
 */

import { createServerClient, createAdminClient } from '@/lib/supabase-server'
import type { 
  SupabaseInvitationRequest, 
  SupabaseInvitationResult,
  SupabaseUser,
  UserRole 
} from '@/lib/types/invitation'

export interface EnhancedInvitationRequest extends SupabaseInvitationRequest {
  language?: 'en' | 'de' | 'es'
  timeZone?: string
  source?: 'admin' | 'self_signup' | 'referral'
}

export class EnhancedInvitationService {
  /**
   * Send branded invitation with language support
   */
  static async inviteUser(
    request: EnhancedInvitationRequest,
    invitedById?: string
  ): Promise<SupabaseInvitationResult> {
    try {
      const supabase = await createServerClient()
      const adminClient = createAdminClient()
      const { 
        email, 
        invitedName, 
        personalMessage, 
        role = 'teacher', 
        language = 'en',
        timeZone,
        source = 'admin',
        redirectTo 
      } = request
      
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

      // Generate localized redirect URL for registration
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const localizedPath = language === 'en' 
        ? '/auth/register'
        : `/${language}/auth/register`
      const finalRedirectTo = redirectTo || `${baseUrl}${localizedPath}`
      
      // Use Supabase's built-in invitation system with enhanced metadata
      const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
        redirectTo: finalRedirectTo,
        data: {
          full_name: invitedName,
          invited_by: invitedById,
          role: role,
          invitation_message: personalMessage,
          invited_at: new Date().toISOString(),
          language: language,
          time_zone: timeZone || 'UTC',
          invitation_source: source,
          app_name: 'avara.studio',
          app_type: 'yoga_class_planner'
        }
      })

      if (error) {
        console.error('Failed to send invitation:', error)
        return {
          success: false,
          error: error.message || 'Failed to send invitation'
        }
      }

      // Optional: Store enhanced invitation metadata
      if (data.user) {
        await supabase
          .from('user_invitations')
          .insert({
            email,
            invited_name: invitedName,
            personal_message: personalMessage,
            invited_by: invitedById,
            status: 'pending',
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            token: crypto.randomUUID(),
            notes: `Enhanced invitation: ${language}, ${source}, timezone: ${timeZone}`
          })
      }

      // Transform User to SupabaseUser format
      const supabaseUser: SupabaseUser = {
        id: data.user.id,
        email: data.user.email || email, // Fallback to invitation email
        email_confirmed_at: data.user.email_confirmed_at,
        last_sign_in_at: data.user.last_sign_in_at,
        created_at: data.user.created_at,
        user_metadata: data.user.user_metadata || {}
      }

      return {
        success: true,
        user: supabaseUser
      }
    } catch (error) {
      console.error('Error in enhanced inviteUser:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  /**
   * Generate localized invitation message
   */
  static generateLocalizedSubject(language: string, userRole: UserRole): string {
    const subjects = {
      en: {
        teacher: '🧘‍♀️ Welcome to avara.studio Beta - Your Yoga Teaching Platform Awaits',
        admin: '🌟 Admin Invitation - Welcome to avara.studio Beta'
      },
      de: {
        teacher: '🧘‍♀️ Willkommen bei avara.studio Beta - Ihre Yoga-Lehrplattform wartet',
        admin: '🌟 Admin-Einladung - Willkommen bei avara.studio Beta'
      },
      es: {
        teacher: '🧘‍♀️ Bienvenido a avara.studio Beta - Tu plataforma de enseñanza de yoga te espera',
        admin: '🌟 Invitación de administrador - Bienvenido a avara.studio Beta'
      }
    }

    return subjects[language as keyof typeof subjects]?.[userRole] || subjects.en[userRole]
  }

  /**
   * Bulk invite with language preferences
   */
  static async bulkInviteUsers(
    invitations: EnhancedInvitationRequest[],
    invitedById?: string
  ): Promise<{
    success: boolean
    results: { email: string; success: boolean; error?: string }[]
    summary: { total: number; successful: number; failed: number }
  }> {
    const results: { email: string; success: boolean; error?: string }[] = []
    
    for (const invitation of invitations) {
      const result = await this.inviteUser(invitation, invitedById)
      results.push({
        email: invitation.email,
        success: result.success,
        error: result.error
      })
    }

    const successful = results.filter(r => r.success).length
    const failed = results.length - successful

    return {
      success: failed === 0,
      results,
      summary: {
        total: results.length,
        successful,
        failed
      }
    }
  }

  /**
   * Get invitation statistics by language
   */
  static async getInvitationStats(): Promise<{
    success: boolean
    stats?: {
      total: number
      byLanguage: Record<string, number>
      byRole: Record<string, number>
      byStatus: Record<string, number>
      recentInvitations: number
    }
    error?: string
  }> {
    try {
      const adminClient = createAdminClient()
      
      // Get all users with invitation metadata
      const { data: users, error } = await adminClient.auth.admin.listUsers()
      
      if (error) {
        return { success: false, error: 'Failed to fetch invitation stats' }
      }

      const invitedUsers = users.users?.filter(user => user.invited_at) || []
      
      const stats = {
        total: invitedUsers.length,
        byLanguage: {} as Record<string, number>,
        byRole: {} as Record<string, number>,
        byStatus: {
          pending: 0,
          confirmed: 0
        },
        recentInvitations: 0
      }

      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

      invitedUsers.forEach(user => {
        // Language stats
        const language = user.user_metadata?.language || 'en'
        stats.byLanguage[language] = (stats.byLanguage[language] || 0) + 1

        // Role stats
        const role = user.user_metadata?.role || 'teacher'
        stats.byRole[role] = (stats.byRole[role] || 0) + 1

        // Status stats
        if (user.email_confirmed_at) {
          stats.byStatus.confirmed++
        } else {
          stats.byStatus.pending++
        }

        // Recent invitations
        if (new Date(user.invited_at!) > oneWeekAgo) {
          stats.recentInvitations++
        }
      })

      return { success: true, stats }
    } catch (error) {
      console.error('Error getting invitation stats:', error)
      return { success: false, error: 'Internal server error' }
    }
  }
}