// types.ts
// Type definitions for calendar invitation processing

export interface CalendarInvitationPayload {
  to: string // The invitation email (user-abc123@yourdomain.com)
  from: string // Sender's email
  subject: string
  attachments?: Array<{
    filename: string
    content: string // Base64 encoded .ics content
    contentType: string
  }>
  text?: string
  html?: string
}

export interface ExtractedCalendarData {
  feedUrl?: string
  calendarName?: string
  provider?: string
  metadata?: Record<string, unknown>
}

export interface CalendarInvitation {
  id: string
  user_id: string
  invitation_email: string
  calendar_provider?: string
  status: 'pending' | 'accepted' | 'expired' | 'cancelled'
  calendar_metadata?: Record<string, unknown>
  expires_at: string
  created_at: string
  updated_at: string
}

export interface ProcessingResult {
  success: boolean
  message: string
  calendarName?: string
  feedUrl?: string
  icloudSharingUrl?: string
  requiresManualSetup?: boolean
  instructions?: string
}

export interface MimeHeaders {
  [key: string]: string
}

export interface MimePart {
  headers: MimeHeaders
  body: string
}

export interface ParsedMimeMessage {
  headers: MimeHeaders
  text: string
  html: string
  attachments: Array<{
    filename: string
    content: string
    contentType: string
  }>
}

export type CalendarProvider = 'google' | 'outlook' | 'apple' | 'unknown'

export interface CalendarProviderConfig {
  urlPatterns: RegExp[]
  subjectPatterns: RegExp[]
  feedUrlExtractors: Array<(content: string) => string | undefined>
} 