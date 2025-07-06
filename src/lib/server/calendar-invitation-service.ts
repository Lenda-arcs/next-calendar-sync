import { createServerClient } from '@/lib/supabase-server'
import { CalendarInvitation, CreateInvitationRequest, CreateInvitationResponse } from '@/lib/types'

export interface CreateInvitationResult {
  invitation?: CreateInvitationResponse
  error?: string
}

export interface GetInvitationsResult {
  invitations: CalendarInvitation[]
  error?: string
}

/**
 * Creates a new calendar invitation for a user
 */
export async function createCalendarInvitation(
  userId: string,
  request: CreateInvitationRequest = {}
): Promise<CreateInvitationResult> {
  try {
    const supabase = await createServerClient()
    
    // Generate unique email
    const uniqueCode = Math.random().toString(36).substring(2, 10)
    const baseDomain = request.base_domain || process.env.CALENDAR_INVITATION_DOMAIN || 'calendar.lennartdiedrichsen.de'
    const invitationEmail = `user-${uniqueCode}@${baseDomain}`
    const expiryHours = request.expiry_hours || 72
    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString()
    
    // Insert invitation directly
    const { data, error } = await supabase
      .from('calendar_invitations')
      .insert({
        user_id: userId,
        invitation_email: invitationEmail,
        expires_at: expiresAt,
        status: 'pending'
      })
      .select('id, invitation_email, expires_at, status')
      .single()

    if (error) {
      console.error('Failed to create calendar invitation:', error)
      return { error: 'Failed to create calendar invitation' }
    }

    return { 
      invitation: {
        id: data.id,
        invitation_email: data.invitation_email,
        expires_at: data.expires_at,
        status: data.status
      }
    }
  } catch (error) {
    console.error('Error in createCalendarInvitation:', error)
    return { error: 'Internal server error' }
  }
}

/**
 * Gets all calendar invitations for a user
 */
export async function getCalendarInvitations(userId: string): Promise<GetInvitationsResult> {
  try {
    const supabase = await createServerClient()
    
    const { data, error } = await supabase
      .from('calendar_invitations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to get calendar invitations:', error)
      return { invitations: [], error: 'Failed to fetch calendar invitations' }
    }

    return { invitations: data as CalendarInvitation[] }
  } catch (error) {
    console.error('Error in getCalendarInvitations:', error)
    return { invitations: [], error: 'Internal server error' }
  }
}

/**
 * Gets a specific calendar invitation by ID
 */
export async function getCalendarInvitation(
  userId: string,
  invitationId: string
): Promise<{ invitation?: CalendarInvitation; error?: string }> {
  try {
    const supabase = await createServerClient()
    
    const { data, error } = await supabase
      .from('calendar_invitations')
      .select('*')
      .eq('user_id', userId)
      .eq('id', invitationId)
      .single()

    if (error) {
      console.error('Failed to get calendar invitation:', error)
      return { error: 'Calendar invitation not found' }
    }

    return { invitation: data as CalendarInvitation }
  } catch (error) {
    console.error('Error in getCalendarInvitation:', error)
    return { error: 'Internal server error' }
  }
}

/**
 * Updates a calendar invitation status
 */
export async function updateCalendarInvitationStatus(
  userId: string,
  invitationId: string,
  status: CalendarInvitation['status'],
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient()
    
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString()
    }

    if (metadata) {
      updateData.calendar_metadata = metadata
    }

    const { error } = await supabase
      .from('calendar_invitations')
      .update(updateData)
      .eq('user_id', userId)
      .eq('id', invitationId)

    if (error) {
      console.error('Failed to update calendar invitation:', error)
      return { success: false, error: 'Failed to update calendar invitation' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in updateCalendarInvitationStatus:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Cancels a calendar invitation
 */
export async function cancelCalendarInvitation(
  userId: string,
  invitationId: string
): Promise<{ success: boolean; error?: string }> {
  return updateCalendarInvitationStatus(userId, invitationId, 'cancelled')
}

/**
 * Cleans up expired invitations for all users
 */
export async function cleanupExpiredInvitations(): Promise<{ cleanedCount: number; error?: string }> {
  try {
    const supabase = await createServerClient()
    
    const { data, error } = await supabase
      .from('calendar_invitations')
      .update({ status: 'expired' })
      .eq('status', 'pending')
      .lt('expires_at', new Date().toISOString())
      .select('id')

    if (error) {
      console.error('Failed to cleanup expired invitations:', error)
      return { cleanedCount: 0, error: 'Failed to cleanup expired invitations' }
    }

    return { cleanedCount: data?.length || 0 }
  } catch (error) {
    console.error('Error in cleanupExpiredInvitations:', error)
    return { cleanedCount: 0, error: 'Internal server error' }
  }
}

/**
 * Gets active (pending) calendar invitations for a user
 */
export async function getActiveCalendarInvitations(userId: string): Promise<GetInvitationsResult> {
  try {
    const supabase = await createServerClient()
    
    const { data, error } = await supabase
      .from('calendar_invitations')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to get active calendar invitations:', error)
      return { invitations: [], error: 'Failed to fetch active calendar invitations' }
    }

    return { invitations: data as CalendarInvitation[] }
  } catch (error) {
    console.error('Error in getActiveCalendarInvitations:', error)
    return { invitations: [], error: 'Internal server error' }
  }
}

/**
 * Processes incoming calendar invitation (for email processing)
 */
export async function processIncomingCalendarInvitation(
  invitationEmail: string,
  calendarData: {
    provider?: string
    feedUrl?: string
    calendarName?: string
    metadata?: Record<string, unknown>
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient()
    
    // Find the invitation by email
    const { data: invitation, error: findError } = await supabase
      .from('calendar_invitations')
      .select('*')
      .eq('invitation_email', invitationEmail)
      .eq('status', 'pending')
      .single()

    if (findError || !invitation) {
      console.error('Calendar invitation not found:', findError)
      return { success: false, error: 'Calendar invitation not found or expired' }
    }

    // Check if invitation is expired
    if (new Date(invitation.expires_at) < new Date()) {
      await updateCalendarInvitationStatus(invitation.user_id, invitation.id, 'expired')
      return { success: false, error: 'Calendar invitation has expired' }
    }

    // Update invitation status to accepted
    const existingMetadata = invitation.calendar_metadata && typeof invitation.calendar_metadata === 'object' 
      ? invitation.calendar_metadata as Record<string, unknown>
      : {}
    
    const newMetadata = {
      ...existingMetadata,
      ...calendarData.metadata,
      feed_url: calendarData.feedUrl,
      calendar_name: calendarData.calendarName,
      processed_at: new Date().toISOString()
    }
    
    await updateCalendarInvitationStatus(
      invitation.user_id,
      invitation.id,
      'accepted',
      newMetadata
    )

    // If we have a feed URL, create a calendar_feed entry
    if (calendarData.feedUrl && calendarData.calendarName) {
      const { error: feedError } = await supabase
        .from('calendar_feeds')
        .insert({
          user_id: invitation.user_id,
          calendar_name: calendarData.calendarName,
          feed_url: calendarData.feedUrl,
          is_active: true,
          created_via: 'email_invitation'
        })

      if (feedError) {
        console.error('Failed to create calendar feed:', feedError)
        return { success: false, error: 'Failed to create calendar feed' }
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in processIncomingCalendarInvitation:', error)
    return { success: false, error: 'Internal server error' }
  }
} 