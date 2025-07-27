import { createGoogleCalendarService, BatchCreateResult } from './google-calendar-service'
import { getValidAccessToken } from './oauth-utils'

export interface ImportableEvent {
  id: string
  title: string
  description?: string
  start: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  end: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  location?: string
  source: 'google' | 'ics'
  sourceCalendarId?: string
  sourceCalendarName?: string
  selected: boolean
  isPrivate?: boolean
  suggestedTags?: string[]
  // Recurring event properties
  isRecurringGroup?: boolean
  recurringInstanceCount?: number
  recurringPattern?: string
  originalInstances?: ImportableEvent[]
  isYogaLikely?: boolean
}

export interface CalendarSource {
  id: string
  name: string
  description?: string
  primary?: boolean
  accessRole?: string
  backgroundColor?: string
}

export interface ImportPreviewResult {
  events: ImportableEvent[]
  totalCount: number
  yogaLikelyCount: number
  privateLikelyCount: number
}

export interface ImportResult {
  success: boolean
  importedCount: number
  skippedCount: number
  errors: string[]
  importedEventIds: string[]
}

export class CalendarImportService {
  private accessToken: string
  private yogaCalendarId: string

  constructor(accessToken: string, yogaCalendarId: string) {
    this.accessToken = accessToken
    this.yogaCalendarId = yogaCalendarId
  }

  /**
   * Get available calendars for import (excluding the yoga calendar)
   */
  async getAvailableCalendars(): Promise<CalendarSource[]> {
    const calendarService = await createGoogleCalendarService(this.accessToken)
    const calendars = await calendarService.getCalendars()
    
    // Filter out the yoga calendar and read-only calendars
    return calendars
      .filter(cal => 
        cal.id !== this.yogaCalendarId && 
        cal.accessRole !== 'reader' &&
        !cal.summary?.includes('(synced with lenna.yoga)')
      )
      .map(cal => ({
        id: cal.id,
        name: cal.summary,
        description: cal.description,
        primary: cal.primary,
        accessRole: cal.accessRole,
        backgroundColor: cal.backgroundColor,
      }))
  }

  /**
   * Fetch events from a source calendar for preview
   */
  async fetchEventsForPreview(
    sourceCalendarId: string, 
    daysAhead: number = 90,
    daysBack: number = 30
  ): Promise<ImportPreviewResult> {
    const calendarService = await createGoogleCalendarService(this.accessToken)
    
    const now = new Date()
    const timeMin = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000).toISOString()
    const timeMax = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000).toISOString()

    const googleEvents = await calendarService.getEvents(sourceCalendarId, {
      timeMin,
      timeMax,
      maxResults: 250,
      singleEvents: true,
      orderBy: 'startTime'
    })

    // Get source calendar info
    const sourceCalendar = await calendarService.getCalendar(sourceCalendarId)

    const events: ImportableEvent[] = googleEvents.map(event => {
      const eventTitle = event.summary?.toLowerCase() || ''
      const eventDescription = event.description?.toLowerCase() || ''
      
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

      // Suggest tags based on content
      const suggestedTags = this.generateSuggestedTags(event.summary || '', event.description || '')

      return {
        id: event.id || crypto.randomUUID(),
        title: event.summary || 'Untitled Event',
        description: event.description,
        start: event.start,
        end: event.end,
        location: event.location,
        source: 'google' as const,
        sourceCalendarId,
        sourceCalendarName: sourceCalendar.summary,
        selected: isYogaLikely && !isPrivateLikely, // Auto-select likely yoga events
        isPrivate: isPrivateLikely,
        suggestedTags,
      }
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
   * Import selected events into the yoga calendar using batch API
   */
  async importSelectedEvents(
    events: ImportableEvent[],
    userId: string
  ): Promise<ImportResult> {
    const calendarService = await createGoogleCalendarService(this.accessToken)
    const selectedEvents = events.filter(e => e.selected)
    
    const result: ImportResult = {
      success: true,
      importedCount: 0,
      skippedCount: 0,
      errors: [],
      importedEventIds: [],
    }

    if (selectedEvents.length === 0) {
      console.log('No events selected for import')
      return result
    }

    // Prepare batch events
    const batchEvents = selectedEvents.map(event => ({
      calendarId: this.yogaCalendarId,
      summary: event.title,
      description: this.enhanceEventDescription(event),
      start: event.start,
      end: event.end,
      location: event.location,
      extendedProperties: {
        private: {
          'lenna.yoga.imported': 'true',
          'lenna.yoga.import_source': event.source,
          'lenna.yoga.import_source_calendar': event.sourceCalendarId || '',
          'lenna.yoga.import_date': new Date().toISOString(),
          'lenna.yoga.imported_by': userId,
          'lenna.yoga.tags': JSON.stringify(event.suggestedTags || []),
        }
      }
    }))

    try {
      // Use batch import - single API call for all events!
      console.log(`🚀 Starting batch import of ${selectedEvents.length} events...`)
      const batchResult: BatchCreateResult = await calendarService.batchCreateEvents(batchEvents)
      
      // Process batch results
      batchResult.results.forEach((eventResult, index) => {
        const originalEvent = selectedEvents[index]
        
        if (eventResult.success && eventResult.event?.id) {
          result.importedCount++
          result.importedEventIds.push(eventResult.event.id)
          console.log(`✅ Imported: ${originalEvent.title}`)
        } else {
          result.skippedCount++
          const errorMsg = eventResult.error || 'Unknown error'
          result.errors.push(`Failed to import "${originalEvent.title}": ${errorMsg}`)
          console.error(`❌ Failed: ${originalEvent.title} - ${errorMsg}`)
        }
      })

      // Consider it a success if majority of events were imported (>= 90% success rate)
      const successRate = selectedEvents.length > 0 ? result.importedCount / selectedEvents.length : 0
      result.success = successRate >= 0.9
      
      if (result.success && result.errors.length > 0) {
        console.log(`🎉 Batch import mostly successful! ${result.importedCount} imported, ${result.skippedCount} failed (${Math.round(successRate * 100)}% success rate)`)
      } else if (result.success) {
        console.log(`🎉 Batch import complete! ${result.importedCount} imported, 0 failed (100% success rate)`)
      } else {
        console.log(`⚠️ Batch import had issues: ${result.importedCount} imported, ${result.skippedCount} failed (${Math.round(successRate * 100)}% success rate)`)
      }

      // If any events were successfully imported, trigger sync to pull them into our database
      if (result.importedCount > 0) {
        console.log('🔄 Triggering calendar sync to update dashboard...')
        await this.triggerCalendarSync()
      }
      
    } catch (error) {
      console.error('❌ Batch import failed:', error)
      result.success = false
      result.errors.push(`Batch import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      result.skippedCount = selectedEvents.length
    }

    return result
  }

  /**
   * Trigger calendar sync to pull imported events into our database
   */
  private async triggerCalendarSync(): Promise<void> {
    try {
      // Trigger sync to pull imported events into our database
      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        console.warn('Failed to trigger calendar sync:', response.statusText)
        return
      }

      const result = await response.json()
      console.log('✅ Calendar sync triggered successfully:', result.message)
    } catch (error) {
      console.warn('Failed to trigger calendar sync:', error)
      // Don't throw - sync failure shouldn't block import success
    }
  }

  /**
   * Generate suggested tags based on event content
   */
  private generateSuggestedTags(title: string, description: string): string[] {
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

  /**
   * Enhance event description with import metadata
   */
  private enhanceEventDescription(event: ImportableEvent): string {
    let description = event.description || ''
    
    if (event.source === 'google' && event.sourceCalendarName) {
      const importNote = `\n\n📅 Imported from "${event.sourceCalendarName}" calendar`
      description += importNote
    }

    if (event.suggestedTags && event.suggestedTags.length > 0) {
      const tagsNote = `\n🏷️ Suggested tags: ${event.suggestedTags.join(', ')}`
      description += tagsNote
    }

    return description.trim()
  }
}

/**
 * Create import service instance for a user
 */
export async function createCalendarImportService(
  oauthIntegration: {
    access_token: string
    refresh_token: string | null
    expires_at: string | null
  },
  yogaCalendarId: string,
  clientId: string,
  clientSecret: string,
  updateTokenCallback: (newToken: string, newExpiresAt: string) => Promise<void>
): Promise<CalendarImportService> {
  const accessToken = await getValidAccessToken(
    {
      access_token: oauthIntegration.access_token,
      refresh_token: oauthIntegration.refresh_token,
      expires_at: oauthIntegration.expires_at,
    },
    clientId,
    clientSecret,
    updateTokenCallback
  )

  return new CalendarImportService(accessToken, yogaCalendarId)
} 