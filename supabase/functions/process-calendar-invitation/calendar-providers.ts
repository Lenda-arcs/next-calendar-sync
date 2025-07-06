// calendar-providers.ts
// Calendar provider detection and configuration

import { CalendarProvider, CalendarProviderConfig } from './types.ts'

export const CALENDAR_PROVIDERS: Record<CalendarProvider, CalendarProviderConfig> = {
  google: {
    urlPatterns: [
      /https:\/\/calendar\.google\.com\/calendar\/ical\/[^\/]+\/[^\/]+\/basic\.ics/g,
      /https:\/\/calendar\.google\.com\/calendar\/embed/g
    ],
    subjectPatterns: [
      /invitation.*google calendar/i,
      /google calendar.*invitation/i,
      /has invited you.*google/i
    ],
    feedUrlExtractors: [
      (content: string) => {
        const match = content.match(/https:\/\/calendar\.google\.com\/calendar\/ical\/[^\/\s]+\/[^\/\s]+\/basic\.ics/)
        return match ? match[0] : undefined
      }
    ]
  },
  outlook: {
    urlPatterns: [
      /https:\/\/outlook\.live\.com\/owa\/calendar\/[^\/]+\/[^\/]+\/calendar\.ics/g,
      /https:\/\/outlook\.office365\.com\/owa\/calendar/g
    ],
    subjectPatterns: [
      /invitation.*outlook/i,
      /outlook.*invitation/i,
      /has shared.*outlook/i
    ],
    feedUrlExtractors: [
      (content: string) => {
        const match = content.match(/https:\/\/outlook\.live\.com\/owa\/calendar\/[^\s]+\/calendar\.ics/)
        return match ? match[0] : undefined
      }
    ]
  },
  apple: {
    urlPatterns: [
      /https:\/\/www\.icloud\.com\/calendar\/share\/[^"\s<>]+/g,
      /webcal:\/\/[^\/\s]+apple[^\/\s]+\.ics/g
    ],
    subjectPatterns: [
      /Kalender.*beitreten/i,
      /calendar.*join/i,
      /invitation.*icloud/i,
      /icloud.*invitation/i
    ],
    feedUrlExtractors: [
      (content: string) => {
        const match = content.match(/https:\/\/www\.icloud\.com\/calendar\/share\/[^\s"<>]+/)
        return match ? match[0] : undefined
      }
    ]
  },
  unknown: {
    urlPatterns: [
      /webcal:\/\/[^\s]+\.ics/g,
      /https:\/\/[^\s]+\.ics/g
    ],
    subjectPatterns: [],
    feedUrlExtractors: [
      (content: string) => {
        const match = content.match(/webcal:\/\/[^\s]+\.ics/)
        if (match) {
          return match[0].replace('webcal://', 'https://')
        }
        const httpMatch = content.match(/https:\/\/[^\s]+\.ics/)
        return httpMatch ? httpMatch[0] : undefined
      }
    ]
  }
}

export function detectCalendarProvider(email: string, subject: string): CalendarProvider {
  const domain = email.split('@')[1]?.toLowerCase()
  
  // Check domain-based detection first
  if (domain?.includes('google') || domain?.includes('gmail')) {
    return 'google'
  }
  
  if (domain?.includes('outlook') || domain?.includes('hotmail') || domain?.includes('live')) {
    return 'outlook'
  }
  
  if (domain?.includes('icloud') || domain?.includes('apple')) {
    return 'apple'
  }
  
  // Check subject-based detection
  const lowerSubject = subject.toLowerCase()
  
  for (const [provider, config] of Object.entries(CALENDAR_PROVIDERS)) {
    if (config.subjectPatterns.some(pattern => pattern.test(lowerSubject))) {
      return provider as CalendarProvider
    }
  }
  
  return 'unknown'
}

export function extractCalendarNameFromSubject(subject: string): string | undefined {
  const patterns = [
    /Kalender\s*[„"'"]([^"'"„]+?)[„"'"]\s*von/i, // German: Kalender "Name" von
    /Kalender\s*[„"'"]([^"'"„]+)[„"'"]/i, // German: Kalender "Name"
    /Calendar\s*[„"'"]([^"'"„]+)[„"'"]/i, // English: Calendar "Name"
    /Join\s+calendar\s*[„"'"]([^"'"„]+)[„"'"]/i, // English: Join calendar "Name"
    /([^„"'"]+)\s+has\s+invited\s+you/i, // "Name has invited you"
    /Invitation.*\s+([A-Z][^\s]+)/i // Generic invitation pattern
  ]
  
  for (const pattern of patterns) {
    const match = subject.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  
  return undefined
} 