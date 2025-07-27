import { ImportableEvent, ImportPreviewResult } from './calendar-import-service'
import { getPublicYogaStudios, isEventYogaRelated } from './yoga-location-service'

interface ICSEvent {
  uid: string
  summary: string
  description?: string
  dtstart: string
  dtend: string
  location?: string
  rrule?: string
  exdate?: string[]
  status?: string
  originalUid?: string
  isRecurringInstance?: boolean
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
          case 'EXDATE':
            if (!currentEvent.exdate) currentEvent.exdate = []
            // Handle multiple dates in EXDATE or multiple EXDATE lines
            const dates = value.split(',').map(d => this.parseDateTime(d.trim()))
            currentEvent.exdate.push(...dates)
            break
          case 'STATUS':
            currentEvent.status = value
            break
        }
      }
          } catch (error) {
        result.errors.push(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      console.log(`ICS Parse complete: ${result.events.length} events parsed, ${result.errors.length} errors`)
      return result
  }

  /**
   * Expand recurring events based on RRULE
   */
  private static expandRecurringEvent(baseEvent: ICSEvent, maxDate: Date): ICSEvent[] {
    if (!baseEvent.rrule) {
      return [baseEvent]
    }

    const events: ICSEvent[] = []
    const startDate = new Date(baseEvent.dtstart)
    const endDate = new Date(baseEvent.dtend)
    const duration = endDate.getTime() - startDate.getTime()

    // Parse RRULE
    const rruleParts = baseEvent.rrule.split(';').reduce((acc, part) => {
      const [key, value] = part.split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)

    const freq = rruleParts.FREQ
    const until = rruleParts.UNTIL ? new Date(this.parseDateTime(rruleParts.UNTIL)) : maxDate
    const interval = parseInt(rruleParts.INTERVAL || '1')
    const count = rruleParts.COUNT ? parseInt(rruleParts.COUNT) : null

    // Excluded dates for comparison
    const excludedDates = new Set(baseEvent.exdate || [])

    // eslint-disable-next-line prefer-const
    let currentDate = new Date(startDate)
    let occurrenceCount = 0
    const maxOccurrences = count || 1000 // Reasonable limit

    while (currentDate <= until && currentDate <= maxDate && occurrenceCount < maxOccurrences) {
      const currentDateStr = currentDate.toISOString()
      const currentEndDate = new Date(currentDate.getTime() + duration)

      // Check if this occurrence is excluded
      if (!excludedDates.has(currentDateStr)) {
        // Create event occurrence
        events.push({
          ...baseEvent,
          uid: `${baseEvent.uid}-${currentDate.toISOString()}`,
          dtstart: currentDateStr,
          dtend: currentEndDate.toISOString(),
          // Keep reference to original recurring event
          originalUid: baseEvent.uid,
          isRecurringInstance: true,
          // Remove RRULE from individual occurrences
          rrule: undefined,
          exdate: undefined
        })
      }

      occurrenceCount++

      // Calculate next occurrence
      switch (freq) {
        case 'DAILY':
          currentDate.setDate(currentDate.getDate() + interval)
          break
        case 'WEEKLY':
          currentDate.setDate(currentDate.getDate() + (7 * interval))
          break
        case 'MONTHLY':
          currentDate.setMonth(currentDate.getMonth() + interval)
          break
        case 'YEARLY':
          currentDate.setFullYear(currentDate.getFullYear() + interval)
          break
        default:
          // Unknown frequency, break to avoid infinite loop
          break
      }
    }

    console.log(`Expanded recurring event "${baseEvent.summary}": ${events.length} occurrences (FREQ=${freq}, UNTIL=${until.toDateString()})`)
    return events
  }

  /**
   * Group recurring events by their original UID
   */
  private static groupRecurringEvents(events: ImportableEvent[]): ImportableEvent[] {
    const groupedEvents: ImportableEvent[] = []
    const recurringGroups: Map<string, ImportableEvent[]> = new Map()
    const singleEvents: ImportableEvent[] = []

    // Separate single events from recurring instances
    for (const event of events) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const originalUid = (event as any).originalUid
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (originalUid && (event as any).isRecurringInstance) {
        if (!recurringGroups.has(originalUid)) {
          recurringGroups.set(originalUid, [])
        }
        recurringGroups.get(originalUid)!.push(event)
      } else {
        singleEvents.push(event)
      }
    }

    // Add single events
    groupedEvents.push(...singleEvents)

    // Create grouped recurring events
    for (const [originalUid, instances] of recurringGroups) {
      if (instances.length === 0) continue

      const firstInstance = instances[0]
      const lastInstance = instances[instances.length - 1]
      
      // Determine recurring pattern
      let pattern = 'Unknown'
      if (instances.length > 1) {
        const firstDate = new Date(firstInstance.start.dateTime || firstInstance.start.date || 0)
        const secondDate = new Date(instances[1]?.start.dateTime || instances[1]?.start.date || 0)
        const daysDiff = Math.round((secondDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysDiff === 1) pattern = 'Daily'
        else if (daysDiff === 7) pattern = 'Weekly'
        else if (daysDiff >= 28 && daysDiff <= 31) pattern = 'Monthly'
        else if (daysDiff >= 365 && daysDiff <= 366) pattern = 'Yearly'
        else pattern = `Every ${daysDiff} days`
      }

      // Create group event
      const groupEvent: ImportableEvent = {
        id: originalUid,
        title: firstInstance.title,
        description: firstInstance.description,
        start: firstInstance.start,
        end: lastInstance.end,
        location: firstInstance.location,
        source: firstInstance.source,
        sourceCalendarName: firstInstance.sourceCalendarName,
        selected: firstInstance.selected,
        isPrivate: firstInstance.isPrivate,
        suggestedTags: firstInstance.suggestedTags,
        isYogaLikely: firstInstance.isYogaLikely,
        // Recurring group properties
        isRecurringGroup: true,
        recurringInstanceCount: instances.length,
        recurringPattern: pattern,
        originalInstances: instances
      }

      groupedEvents.push(groupEvent)
    }

    return groupedEvents
  }

  /**
   * Convert parsed ICS events to ImportableEvent format
   */
  static async convertToImportableEvents(
    icsResult: ICSParseResult,
    maxDaysAhead: number = 90,
    maxDaysBack: number = 30
  ): Promise<ImportPreviewResult> {
    const now = new Date()
    const maxPastDate = new Date(now.getTime() - maxDaysBack * 24 * 60 * 60 * 1000)
    const maxFutureDate = new Date(now.getTime() + maxDaysAhead * 24 * 60 * 60 * 1000)

    const events: ImportableEvent[] = []

    const totalEvents = icsResult.events.length
    let dateFilteredCount = 0
    let cancelledCount = 0
    let expandedEventCount = 0

    // First, expand all recurring events
    const expandedEvents: ICSEvent[] = []
    for (const icsEvent of icsResult.events) {
      const expanded = this.expandRecurringEvent(icsEvent, maxFutureDate)
      expandedEvents.push(...expanded)
      expandedEventCount += expanded.length
    }

    console.log(`Expanded ${icsResult.events.length} base events into ${expandedEventCount} total occurrences`)

    // Fetch public yoga studios for enhanced location matching
    const yogaStudios = await getPublicYogaStudios()
    console.log(`Loaded ${yogaStudios.length} public yoga studios for location matching`)

    for (const icsEvent of expandedEvents) {
      try {
        // Skip events that are too far in the past or future
        const startDate = new Date(icsEvent.dtstart)
        if (startDate < maxPastDate || startDate > maxFutureDate) {
          dateFilteredCount++
          continue
        }

        // Skip cancelled events
        if (icsEvent.status?.toUpperCase() === 'CANCELLED') {
          cancelledCount++
          continue
        }

        const eventTitle = icsEvent.summary?.toLowerCase() || ''
        const eventDescription = icsEvent.description?.toLowerCase() || ''
        
        // Enhanced yoga detection with location matching
        const isYogaLikely = isEventYogaRelated(
          icsEvent.summary,
          icsEvent.description,
          icsEvent.location,
          yogaStudios
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
          isYogaLikely,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(icsEvent.originalUid && { originalUid: icsEvent.originalUid } as any),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(icsEvent.isRecurringInstance && { isRecurringInstance: icsEvent.isRecurringInstance } as any),
        })
      } catch (error) {
        console.error(`Error processing ICS event ${icsEvent.uid}:`, error)
      }
    }

    // Group recurring events
    const groupedEvents = this.groupRecurringEvents(events)

    // Sort events by start time
    groupedEvents.sort((a, b) => {
      const aTime = new Date(a.start.dateTime || a.start.date || 0).getTime()
      const bTime = new Date(b.start.dateTime || b.start.date || 0).getTime()
      return aTime - bTime
    })

    const yogaLikelyCount = groupedEvents.filter(e => e.selected).length
    const privateLikelyCount = groupedEvents.filter(e => e.isPrivate).length

    console.log(`ICS Convert complete: ${totalEvents} base events → ${expandedEventCount} expanded → ${dateFilteredCount} date filtered, ${cancelledCount} cancelled → ${events.length} instances → ${groupedEvents.length} grouped events`)

    return {
      events: groupedEvents,
      totalCount: groupedEvents.length,
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
      // Add timezone if not already present in RFC3339 format
      let startDateTime = dtstart
      let endDateTime = dtend
      
      // If datetime doesn't end with Z or timezone offset, add UTC timezone
      if (!startDateTime.endsWith('Z') && !startDateTime.match(/[+-]\d{2}:\d{2}$/)) {
        // Convert to RFC3339 format with UTC timezone
        if (!startDateTime.includes('T')) {
          startDateTime = `${startDateTime}T00:00:00Z`
        } else if (!startDateTime.endsWith('Z')) {
          startDateTime = `${startDateTime}Z`
        }
      }
      
      if (!endDateTime.endsWith('Z') && !endDateTime.match(/[+-]\d{2}:\d{2}$/)) {
        if (!endDateTime.includes('T')) {
          endDateTime = `${endDateTime}T00:00:00Z`
        } else if (!endDateTime.endsWith('Z')) {
          endDateTime = `${endDateTime}Z`
        }
      }
      
      return {
        start: { 
          dateTime: startDateTime,
          timeZone: 'UTC'
        },
        end: { 
          dateTime: endDateTime,
          timeZone: 'UTC'
        }
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
      'jivamukti': ['jivamukti', 'jiva'],
      'ashtanga': ['ashtanga'],
      'kundalini': ['kundalini'],
      'bikram': ['bikram', 'hot'],
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