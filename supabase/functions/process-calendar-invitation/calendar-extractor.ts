// calendar-extractor.ts
// Calendar data extraction from email payloads

import { CalendarInvitationPayload, ExtractedCalendarData } from './types.ts'
import { CALENDAR_PROVIDERS, detectCalendarProvider, extractCalendarNameFromSubject } from './calendar-providers.ts'

export async function extractCalendarData(payload: CalendarInvitationPayload): Promise<ExtractedCalendarData> {
  const provider = detectCalendarProvider(payload.from, payload.subject)
  
  console.log('Detected calendar provider:', provider)
  
  const result: ExtractedCalendarData = {
    provider,
    metadata: {
      originalSender: payload.from,
      subject: payload.subject,
      detectedProvider: provider
    }
  }

  // Method 1: Check for .ics attachments
  const feedUrlFromAttachments = extractFeedUrlFromAttachments(payload.attachments)
  if (feedUrlFromAttachments) {
    result.feedUrl = feedUrlFromAttachments.url
    result.calendarName = feedUrlFromAttachments.name || extractCalendarNameFromSubject(payload.subject)
    console.log('Found feed URL from attachments:', result.feedUrl)
    return result
  }

  // Method 2: Extract from email content
  const feedUrlFromContent = extractFeedUrlFromContent(payload.html, payload.text, provider)
  if (feedUrlFromContent) {
    result.feedUrl = feedUrlFromContent
    result.calendarName = extractCalendarNameFromContent(payload.html, payload.text) || 
                          extractCalendarNameFromSubject(payload.subject)
    console.log('Found feed URL from content:', result.feedUrl)
    return result
  }

  // Method 3: Handle provider-specific special cases
  result.calendarName = extractCalendarNameFromSubject(payload.subject) || 'Calendar'
  
  if (provider === 'apple') {
    // Apple/iCloud invitations typically don't contain direct feed URLs
    console.log('Apple invitation detected - no direct feed URL available')
    result.metadata = {
      ...result.metadata,
      requiresManualSetup: true,
      instructions: 'Apple Calendar invitations require manual setup. Please get the calendar feed URL from your Apple Calendar settings.'
    }
  }

  return result
}

function extractFeedUrlFromAttachments(attachments?: Array<{ filename: string; content: string; contentType: string }>): { url: string; name?: string } | undefined {
  if (!attachments || attachments.length === 0) return undefined
  
  for (const attachment of attachments) {
    if (attachment.filename.toLowerCase().endsWith('.ics') || 
        attachment.contentType?.includes('text/calendar')) {
      
      try {
        // Decode base64 content
        const icsContent = atob(attachment.content)
        const feedUrl = extractFeedUrlFromIcs(icsContent)
        
        if (feedUrl) {
          return {
            url: feedUrl,
            name: extractCalendarNameFromIcs(icsContent)
          }
        }
      } catch (error) {
        console.error('Error processing .ics attachment:', error)
      }
    }
  }
  
  return undefined
}

function extractFeedUrlFromContent(html?: string, text?: string, provider?: string): string | undefined {
  const config = provider && provider !== 'unknown' ? CALENDAR_PROVIDERS[provider] : null
  
  // Try provider-specific extractors first
  if (config) {
    for (const extractor of config.feedUrlExtractors) {
      const url = html ? extractor(html) : undefined
      if (url) return url
      
      const textUrl = text ? extractor(text) : undefined
      if (textUrl) return textUrl
    }
  }
  
  // Try generic extraction
  if (html) {
    const htmlUrl = extractFeedUrlFromHtml(html)
    if (htmlUrl) return htmlUrl
  }
  
  if (text) {
    const textUrl = extractFeedUrlFromText(text)
    if (textUrl) return textUrl
  }
  
  return undefined
}

function extractFeedUrlFromIcs(icsContent: string): string | undefined {
  // Look for SOURCE property in ICS which often contains the feed URL
  const sourceMatch = icsContent.match(/SOURCE:(.+)/i)
  if (sourceMatch) {
    return sourceMatch[1].trim()
  }

  // Look for URL property
  const urlMatch = icsContent.match(/URL:(.+)/i)
  if (urlMatch) {
    return urlMatch[1].trim()
  }

  return undefined
}

function extractCalendarNameFromIcs(icsContent: string): string | undefined {
  const nameMatch = icsContent.match(/X-WR-CALNAME:(.+)/i) || icsContent.match(/SUMMARY:(.+)/i)
  return nameMatch ? nameMatch[1].trim() : undefined
}

function extractFeedUrlFromHtml(html: string): string | undefined {
  // Look for various calendar feed and sharing URLs
  const patterns = [
    // Google Calendar iCal feeds
    /https:\/\/calendar\.google\.com\/calendar\/ical\/[^\/]+\/[^\/]+\/basic\.ics/g,
    // Outlook calendar feeds
    /https:\/\/outlook\.live\.com\/owa\/calendar\/[^\/]+\/[^\/]+\/calendar\.ics/g,
    // WebCal feeds
    /webcal:\/\/[^\/\s]+\/[^\/\s]+\.ics/g,
    // iCloud calendar sharing URLs
    /https:\/\/www\.icloud\.com\/calendar\/share\/[^"\s<>]+/g
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) {
      let url = match[0]
      // Convert webcal to https
      if (url.startsWith('webcal://')) {
        url = url.replace('webcal://', 'https://')
      }
      return url
    }
  }

  return undefined
}

function extractFeedUrlFromText(text: string): string | undefined {
  // Similar patterns for plain text
  const patterns = [
    /https:\/\/calendar\.google\.com\/calendar\/ical\/[^\s]+\/basic\.ics/g,
    /https:\/\/outlook\.live\.com\/owa\/calendar\/[^\s]+\/calendar\.ics/g,
    /webcal:\/\/[^\s]+\.ics/g,
    /https:\/\/www\.icloud\.com\/calendar\/share\/[^\s]+/g
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      let url = match[0]
      if (url.startsWith('webcal://')) {
        url = url.replace('webcal://', 'https://')
      }
      return url
    }
  }

  return undefined
}

function extractCalendarNameFromContent(html?: string, text?: string): string | undefined {
  if (html) {
    // Look for calendar name in common HTML patterns
    const htmlPatterns = [
      /<title>(.+?)<\/title>/i,
      /calendar[^>]*>([^<]+)</i,
      /event[^>]*>([^<]+)</i
    ]

    for (const pattern of htmlPatterns) {
      const match = html.match(pattern)
      if (match) {
        return match[1].trim()
      }
    }
  }
  
  if (text) {
    // Look for calendar name in common text patterns
    const lines = text.split('\n')
    for (const line of lines) {
      if (line.toLowerCase().includes('calendar') && line.length < 100) {
        return line.trim()
      }
    }
  }
  
  return undefined
} 