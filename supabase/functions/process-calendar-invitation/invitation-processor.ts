// invitation-processor.ts
// Core invitation processing logic

import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { CalendarInvitationPayload, CalendarInvitation, ExtractedCalendarData, ProcessingResult } from './types.ts'
import { extractCalendarData } from './calendar-extractor.ts'

export async function processCalendarInvitation(
  supabase: SupabaseClient,
  payload: CalendarInvitationPayload
): Promise<ProcessingResult> {
  
  console.log('Processing calendar invitation:', {
    to: payload.to,
    from: payload.from,
    subject: payload.subject,
    attachmentCount: payload.attachments?.length || 0
  })

  // Extract invitation email and validate format
  const invitationEmail = payload.to.toLowerCase()
  if (!invitationEmail.includes('user-')) {
    console.error('Invalid invitation email format:', invitationEmail)
    throw new Error('Invalid invitation email format')
  }

  // Find the invitation in our database
  const invitation = await findPendingInvitation(supabase, invitationEmail)
  if (!invitation) {
    throw new Error('Calendar invitation not found or expired')
  }

  // Check if invitation is expired
  if (new Date(invitation.expires_at) < new Date()) {
    await markInvitationExpired(supabase, invitation.id)
    throw new Error('Calendar invitation has expired')
  }

  // Extract calendar data from the invitation
  const calendarData = await extractCalendarData(payload)
  
  console.log('Extracted calendar data:', {
    feedUrl: calendarData.feedUrl,
    calendarName: calendarData.calendarName,
    provider: calendarData.provider
  })

  // Process the invitation based on the type of URL/data found
  return await processInvitationData(supabase, invitation, payload, calendarData)
}

async function findPendingInvitation(
  supabase: SupabaseClient,
  invitationEmail: string
): Promise<CalendarInvitation | null> {
  
  const { data: invitation, error } = await supabase
    .from('calendar_invitations')
    .select('*')
    .eq('invitation_email', invitationEmail)
    .eq('status', 'pending')
    .single()

  if (error || !invitation) {
    console.error('Calendar invitation not found:', error)
    return null
  }

  return invitation
}

async function markInvitationExpired(supabase: SupabaseClient, invitationId: string): Promise<void> {
  await supabase
    .from('calendar_invitations')
    .update({ status: 'expired' })
    .eq('id', invitationId)
}

async function processInvitationData(
  supabase: SupabaseClient,
  invitation: CalendarInvitation,
  payload: CalendarInvitationPayload,
  calendarData: ExtractedCalendarData
): Promise<ProcessingResult> {
  
  // Handle different types of URLs
  let actualFeedUrl = calendarData.feedUrl
  let isICloudSharingUrl = false
  
  if (calendarData.feedUrl?.includes('icloud.com/calendar/share/')) {
    // This is an iCloud sharing URL, not a direct feed URL
    isICloudSharingUrl = true
    actualFeedUrl = undefined
    console.log('iCloud sharing URL detected:', calendarData.feedUrl)
  }
  
  // For invitations without direct feed URLs, create fallback data
  if (!actualFeedUrl && !isICloudSharingUrl) {
    console.log('No direct feed URL available - creating invitation record for manual processing')
  }

  const calendarName = calendarData.calendarName || 'Calendar'

  // Update invitation status 
  const updateData = {
    status: actualFeedUrl ? 'accepted' : 'pending',
    calendar_provider: calendarData.provider,
    calendar_metadata: {
      ...invitation.calendar_metadata,
      ...calendarData.metadata,
      calendar_name: calendarName,
      processed_at: new Date().toISOString(),
      sender_email: payload.from,
      subject: payload.subject,
      ...(actualFeedUrl && { feed_url: actualFeedUrl }),
      ...(isICloudSharingUrl && { 
        icloud_sharing_url: calendarData.feedUrl,
        requires_manual_setup: true,
        instructions: 'iCloud calendar sharing detected. Please accept the invitation through the iCloud link and then manually add the calendar feed URL.'
      })
    }
  }
  
  const { error: updateError } = await supabase
    .from('calendar_invitations')
    .update(updateData)
    .eq('id', invitation.id)

  if (updateError) {
    console.error('Failed to update invitation:', updateError)
    throw new Error('Failed to update invitation')
  }

  // Create calendar feed entry only if we have a direct feed URL
  if (actualFeedUrl) {
    await createCalendarFeed(supabase, invitation.user_id, calendarName, actualFeedUrl)
  }

  console.log('Successfully processed calendar invitation:', {
    invitationId: invitation.id,
    feedUrl: actualFeedUrl,
    calendarName: calendarName,
    isICloudSharingUrl,
    hasDirectFeedUrl: !!actualFeedUrl
  })

  return buildProcessingResult(calendarName, actualFeedUrl, isICloudSharingUrl, calendarData.feedUrl)
}

async function createCalendarFeed(
  supabase: SupabaseClient,
  userId: string,
  calendarName: string,
  feedUrl: string
): Promise<void> {
  
  const { error } = await supabase
    .from('calendar_feeds')
    .insert({
      user_id: userId,
      calendar_name: calendarName,
      feed_url: feedUrl,
      is_active: true,
      created_via: 'email_invitation'
    })

  if (error) {
    console.error('Failed to create calendar feed:', error)
    throw new Error('Failed to create calendar feed')
  }
}

function buildProcessingResult(
  calendarName: string,
  feedUrl?: string,
  isICloudSharingUrl?: boolean,
  icloudUrl?: string
): ProcessingResult {
  
  const result: ProcessingResult = {
    success: true,
    message: feedUrl ? 'Calendar invitation processed successfully' : 'Calendar invitation received - manual setup required',
    calendarName
  }

  if (feedUrl) {
    result.feedUrl = feedUrl
  }

  if (isICloudSharingUrl && icloudUrl) {
    result.icloudSharingUrl = icloudUrl
    result.requiresManualSetup = true
    result.instructions = 'Please accept the iCloud calendar invitation by clicking the link in your email, then manually add the calendar feed URL to complete the setup.'
  }

  return result
} 