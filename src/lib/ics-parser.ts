import { ImportableEvent, ImportPreviewResult } from './calendar-import-service'

interface ICSEvent {
  uid: string
  summary: string
  description?: string
  dtstart: string
  dtend: string
  location?: string
  rrule?: string
  status?: string
}

interface ICSParseResult {
  events: ICSEvent[]
  calendarName?: string
  errors: string[]
}

export class ICSParser {
  /**
   * Parse ICS file content and extract events
   */
  static parseICSContent(icsContent: string): ICSParseResult {
    const result: ICSParseResult = {
      events: [],
      errors: []
    }

    try {
      // Clean and normalize the ICS content
      const lines = icsContent
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)

      // Find calendar name
      const calNameLine = lines.find(line => line.startsWith('X-WR-CALNAME:'))
      if (calNameLine) {
        result.calendarName = calNameLine.split(':').slice(1).join(':').trim()
      }

      // Parse events
      let currentEvent: Partial<ICSEvent> | null = null
      let currentProperty = ''
      let isInEvent = false

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        if (line === 'BEGIN:VEVENT') {
          isInEvent = true
          currentEvent = {}
          continue
        }

        if (line === 'END:VEVENT') {
          if (currentEvent && this.isValidEvent(currentEvent)) {
            result.events.push(currentEvent as ICSEvent)
          }
          isInEvent = false
          currentEvent = null
          continue
        }

        if (!isInEvent || !currentEvent) continue

        // Handle line continuations (lines starting with space or tab)
        if (line.startsWith(' ') || line.startsWith('\t')) {
          if (currentProperty && currentEvent[currentProperty as keyof ICSEvent]) {
            const existing = currentEvent[currentProperty as keyof ICSEvent] as string
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(currentEvent as any)[currentProperty] = existing + line.substring(1)
          }
          continue
        }

        // Parse property
        const colonIndex = line.indexOf(':')
        if (colonIndex === -1) continue

        const property = line.substring(0, colonIndex).toUpperCase()
        const value = line.substring(colonIndex + 1)

        // Handle properties with parameters (e.g., DTSTART;TZID=...)
        const [propertyName] = property.split(';')
        currentProperty = propertyName.toLowerCase()

        switch (propertyName) {
          case 'UID':
            currentEvent.uid = value
            break
          case 'SUMMARY':
            currentEvent.summary = this.unescapeText(value)
            break
          case 'DESCRIPTION':
            currentEvent.description = this.unescapeText(value)
            break
          case 'DTSTART':
            currentEvent.dtstart = this.parseDateTime(value)
            break
          case 'DTEND':
            currentEvent.dtend = this.parseDateTime(value)
            break
          case 'LOCATION':
            currentEvent.location = this.unescapeText(value)
            break
          case 'RRULE':
            currentEvent.rrule = value
            break
          case 'STATUS':
            currentEvent.status = value
            break
        }
      }
    } catch (error) {
      result.errors.push(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    return result
  }

  /**
   * Convert parsed ICS events to ImportableEvent format
   */
  static convertToImportableEvents(
    icsResult: ICSParseResult,
    maxDaysAhead: number = 90,
    maxDaysBack: number = 30
  ): ImportPreviewResult {
    const now = new Date()
    const maxPastDate = new Date(now.getTime() - maxDaysBack * 24 * 60 * 60 * 1000)
    const maxFutureDate = new Date(now.getTime() + maxDaysAhead * 24 * 60 * 60 * 1000)

    const events: ImportableEvent[] = []

    for (const icsEvent of icsResult.events) {
      try {
        // Skip events that are too far in the past or future
        const startDate = new Date(icsEvent.dtstart)
        if (startDate < maxPastDate || startDate > maxFutureDate) {
          continue
        }

        // Skip cancelled events
        if (icsEvent.status?.toUpperCase() === 'CANCELLED') {
          continue
        }

        const eventTitle = icsEvent.summary?.toLowerCase() || ''
        const eventDescription = icsEvent.description?.toLowerCase() || ''
        
        // Detect yoga-related events
        const yogaKeywords = ['yoga', 'pilates', 'meditation', 'wellness', 'fitness', 'class', 'workshop', 'retreat']
        const isYogaLikely = yogaKeywords.some(keyword => 
          eventTitle.includes(keyword) || eventDescription.includes(keyword)
        )

        // Detect private/personal events
        const privateKeywords = ['personal', 'private', 'dentist', 'doctor', 'appointment', 'meeting', 'call', 'birthday']
        const isPrivateLikely = privateKeywords.some(keyword => 
          eventTitle.includes(keyword) || eventDescription.includes(keyword)
        )

        // Generate suggested tags
        const suggestedTags = this.generateSuggestedTags(icsEvent.summary || '', icsEvent.description || '')

        // Convert to ImportableEvent format
        const { start, end } = this.convertDateTimes(icsEvent.dtstart, icsEvent.dtend)

        events.push({
          id: icsEvent.uid || crypto.randomUUID(),
          title: icsEvent.summary || 'Untitled Event',
          description: icsEvent.description,
          start,
          end,
          location: icsEvent.location,
          source: 'ics',
          sourceCalendarName: icsResult.calendarName || 'Imported Calendar',
          selected: isYogaLikely && !isPrivateLikely,
          isPrivate: isPrivateLikely,
          suggestedTags,
        })
      } catch (error) {
        console.error(`Error processing ICS event ${icsEvent.uid}:`, error)
      }
    }

    // Sort events by start time
    events.sort((a, b) => {
      const aTime = new Date(a.start.dateTime || a.start.date || 0).getTime()
      const bTime = new Date(b.start.dateTime || b.start.date || 0).getTime()
      return aTime - bTime
    })

    const yogaLikelyCount = events.filter(e => e.selected).length
    const privateLikelyCount = events.filter(e => e.isPrivate).length

    return {
      events,
      totalCount: events.length,
      yogaLikelyCount,
      privateLikelyCount,
    }
  }

  /**
   * Validate that an ICS event has required fields
   */
  private static isValidEvent(event: Partial<ICSEvent>): event is ICSEvent {
    return !!(
      event.uid &&
      event.summary &&
      event.dtstart &&
      event.dtend
    )
  }

  /**
   * Parse ICS date/time strings
   */
  private static parseDateTime(value: string): string {
    // Handle different date formats
    if (value.includes('T')) {
      // DateTime format: 20231201T143000Z or 20231201T143000
      if (value.endsWith('Z')) {
        // UTC time
        const year = value.substring(0, 4)
        const month = value.substring(4, 6)
        const day = value.substring(6, 8)
        const hour = value.substring(9, 11)
        const minute = value.substring(11, 13)
        const second = value.substring(13, 15)
        return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`
      } else {
        // Local time - convert to ISO format
        const year = value.substring(0, 4)
        const month = value.substring(4, 6)
        const day = value.substring(6, 8)
        const hour = value.substring(9, 11)
        const minute = value.substring(11, 13)
        const second = value.substring(13, 15)
        return `${year}-${month}-${day}T${hour}:${minute}:${second}`
      }
    } else {
      // Date only format: 20231201
      const year = value.substring(0, 4)
      const month = value.substring(4, 6)
      const day = value.substring(6, 8)
      return `${year}-${month}-${day}`
    }
  }

  /**
   * Convert ICS date/time to Google Calendar format
   */
  private static convertDateTimes(dtstart: string, dtend: string) {
    const isAllDay = !dtstart.includes('T')
    
    if (isAllDay) {
      return {
        start: { date: dtstart },
        end: { date: dtend }
      }
    } else {
      return {
        start: { dateTime: dtstart },
        end: { dateTime: dtend }
      }
    }
  }

  /**
   * Unescape ICS text (handle \n, \, etc.)
   */
  private static unescapeText(text: string): string {
    return text
      .replace(/\\n/g, '\n')
      .replace(/\\,/g, ',')
      .replace(/\\;/g, ';')
      .replace(/\\\\/g, '\\')
  }

  /**
   * Generate suggested tags based on event content
   */
  private static generateSuggestedTags(title: string, description: string): string[] {
    const content = `${title} ${description}`.toLowerCase()
    const tags: string[] = []

    const tagKeywords = {
      'vinyasa': ['vinyasa', 'flow'],
      'hatha': ['hatha', 'gentle'],
      'yin': ['yin', 'restorative'],
      'power': ['power', 'strength', 'strong'],
      'beginner': ['beginner', 'basics', 'intro'],
      'advanced': ['advanced', 'challenging'],
      'meditation': ['meditation', 'mindfulness'],
      'workshop': ['workshop', 'training'],
      'private': ['private', '1:1', 'personal'],
      'online': ['online', 'virtual', 'zoom'],
      'studio': ['studio', 'in-person'],
    }

    for (const [tag, keywords] of Object.entries(tagKeywords)) {
      if (keywords.some(keyword => content.includes(keyword))) {
        tags.push(tag)
      }
    }

    return tags
  }
} 