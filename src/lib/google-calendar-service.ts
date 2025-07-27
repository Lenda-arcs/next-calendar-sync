export interface GoogleCalendar {
  id: string
  summary: string
  description?: string
  primary?: boolean
  accessRole?: string
  backgroundColor?: string
}

export interface GoogleEvent {
  id?: string
  summary: string
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
  status?: 'confirmed' | 'tentative' | 'cancelled'
  extendedProperties?: {
    private?: Record<string, string>
  }
}

interface CalendarCreationOptions {
  name: string
  description?: string
  timeZone?: string
  backgroundColor?: string
}

interface EventCreationOptions {
  calendarId: string
  summary: string
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
  extendedProperties?: {
    private?: Record<string, string>
  }
}

export interface BatchEventResult {
  success: boolean
  event?: GoogleEvent
  error?: string
  originalIndex: number
}

export interface BatchCreateResult {
  results: BatchEventResult[]
  successCount: number
  errorCount: number
}

export class GoogleCalendarService {
  private baseUrl = 'https://www.googleapis.com/calendar/v3'

  constructor(private accessToken: string) {}

  /**
   * Retry function with exponential backoff for rate-limited requests
   */
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelayMs: number = 1000
  ): Promise<T> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        // Check if it's a rate limit error and we have retries left
        if (attempt < maxRetries && error instanceof Error && error.message.includes('403')) {
          const delayMs = baseDelayMs * Math.pow(2, attempt) // Exponential backoff
          console.log(`Rate limit hit, retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries + 1})`)
          await new Promise(resolve => setTimeout(resolve, delayMs))
          continue
        }
        throw error
      }
    }
    throw new Error('Max retries exceeded')
  }

  /**
   * Create a new calendar in the user's Google account
   */
  async createCalendar(options: CalendarCreationOptions): Promise<GoogleCalendar> {
    const response = await fetch(`${this.baseUrl}/calendars`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: options.name,
        description: options.description,
        timeZone: options.timeZone || 'UTC',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create calendar: ${response.status} ${error}`)
    }

    const calendar = await response.json()
    return calendar
  }

  /**
   * Get all calendars accessible to the user
   */
  async getCalendars(): Promise<GoogleCalendar[]> {
    const response = await fetch(`${this.baseUrl}/users/me/calendarList`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to fetch calendars: ${response.status} ${error}`)
    }

    const data = await response.json()
    return data.items || []
  }

  /**
   * Get a specific calendar by ID
   */
  async getCalendar(calendarId: string): Promise<GoogleCalendar> {
    const response = await fetch(`${this.baseUrl}/calendars/${encodeURIComponent(calendarId)}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to fetch calendar: ${response.status} ${error}`)
    }

    return await response.json()
  }

  /**
   * Create an event in a specific calendar
   */
  async createEvent(options: EventCreationOptions): Promise<GoogleEvent> {
    return await this.retryWithBackoff(async () => {
      const response = await fetch(`${this.baseUrl}/calendars/${encodeURIComponent(options.calendarId)}/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: options.summary,
          description: options.description,
          start: options.start,
          end: options.end,
          location: options.location,
          extendedProperties: options.extendedProperties,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to create event: ${response.status} ${error}`)
      }

      return await response.json()
    })
  }

  /**
   * Create multiple events in batch (much more efficient than individual calls)
   */
  async batchCreateEvents(events: EventCreationOptions[]): Promise<BatchCreateResult> {
    if (events.length === 0) {
      return { results: [], successCount: 0, errorCount: 0 }
    }

    console.log(`🚀 Starting batch import of ${events.length} events...`)

    // Google's batch API endpoint
    const batchUrl = 'https://www.googleapis.com/batch/calendar/v3'
    
    // Create multipart body for batch request
    const boundary = `batch_${Date.now()}_${Math.random().toString(36).substring(2)}`
    let batchBody = ''

    events.forEach((event, index) => {
      const eventData = {
        summary: event.summary,
        description: event.description,
        start: event.start,
        end: event.end,
        location: event.location,
        extendedProperties: event.extendedProperties,
      }

      batchBody += `--${boundary}\r\n`
      batchBody += `Content-Type: application/http\r\n`
      batchBody += `Content-ID: ${index}\r\n\r\n`
      batchBody += `POST /calendar/v3/calendars/${encodeURIComponent(event.calendarId)}/events\r\n`
      batchBody += `Content-Type: application/json\r\n\r\n`
      batchBody += JSON.stringify(eventData) + '\r\n'
    })

    batchBody += `--${boundary}--\r\n`

    return await this.retryWithBackoff(async () => {
      const response = await fetch(batchUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': `multipart/mixed; boundary=${boundary}`,
        },
        body: batchBody,
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Batch request failed: ${response.status} ${error}`)
      }

      return await this.parseBatchResponse(await response.text(), events.length)
    })
  }

  /**
   * Parse the multipart batch response from Google
   */
  private async parseBatchResponse(responseText: string, expectedCount: number): Promise<BatchCreateResult> {
    const results: BatchEventResult[] = []
    
    // Split by batch boundaries
    const parts = responseText.split(/--[a-zA-Z0-9_-]+/g).filter(part => part.trim())
    
    for (let i = 0; i < expectedCount; i++) {
      const part = parts[i + 1] // Skip first empty part
      
      if (!part) {
        results.push({
          success: false,
          error: 'No response received',
          originalIndex: i
        })
        continue
      }

      try {
        // Extract the JSON response from the HTTP response
        const jsonMatch = part.match(/\{[\s\S]*\}/g)
        if (!jsonMatch) {
          results.push({
            success: false,
            error: 'Invalid response format',
            originalIndex: i
          })
          continue
        }

        const jsonResponse = JSON.parse(jsonMatch[0])
        
        // Check for error response
        if (jsonResponse.error) {
          results.push({
            success: false,
            error: jsonResponse.error.message || 'Unknown error',
            originalIndex: i
          })
        } else {
          results.push({
            success: true,
            event: jsonResponse,
            originalIndex: i
          })
        }
      } catch (error) {
        results.push({
          success: false,
          error: `Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          originalIndex: i
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const errorCount = results.filter(r => !r.success).length

    console.log(`✅ Batch import complete: ${successCount} success, ${errorCount} errors`)

    return {
      results,
      successCount,
      errorCount
    }
  }

  /**
   * Update an existing event
   */
  async updateEvent(calendarId: string, eventId: string, updates: Partial<GoogleEvent>): Promise<GoogleEvent> {
    const response = await fetch(`${this.baseUrl}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to update event: ${response.status} ${error}`)
    }

    return await response.json()
  }

  /**
   * Delete an event
   */
  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    })

    if (!response.ok && response.status !== 410) { // 410 = already deleted
      const error = await response.text()
      throw new Error(`Failed to delete event: ${response.status} ${error}`)
    }
  }

  /**
   * Get events from a calendar
   */
  async getEvents(calendarId: string, options?: {
    timeMin?: string
    timeMax?: string
    maxResults?: number
    singleEvents?: boolean
    orderBy?: 'startTime' | 'updated'
  }): Promise<GoogleEvent[]> {
    const params = new URLSearchParams()
    
    if (options?.timeMin) params.set('timeMin', options.timeMin)
    if (options?.timeMax) params.set('timeMax', options.timeMax)
    if (options?.maxResults) params.set('maxResults', options.maxResults.toString())
    if (options?.singleEvents !== undefined) params.set('singleEvents', options.singleEvents.toString())
    if (options?.orderBy) params.set('orderBy', options.orderBy)

    const response = await fetch(`${this.baseUrl}/calendars/${encodeURIComponent(calendarId)}/events?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to fetch events: ${response.status} ${error}`)
    }

    const data = await response.json()
    return data.items || []
  }

  /**
   * Watch for changes to a calendar (webhooks)
   */
  async watchCalendar(calendarId: string, channelId: string, webhookUrl: string, expiration?: number): Promise<{
    id: string
    resourceId: string
    resourceUri: string
    token?: string
    expiration: string
  }> {
    const response = await fetch(`${this.baseUrl}/calendars/${encodeURIComponent(calendarId)}/events/watch`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: channelId,
        type: 'web_hook',
        address: webhookUrl,
        expiration: expiration || (Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days default
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to setup calendar watch: ${response.status} ${error}`)
    }

    return await response.json()
  }

  /**
   * Stop watching a calendar
   */
  async stopWatching(channelId: string, resourceId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/channels/stop`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: channelId,
        resourceId: resourceId,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to stop watching calendar: ${response.status} ${error}`)
    }
  }
}

/**
 * Create a Google Calendar service instance with a valid access token
 */
export async function createGoogleCalendarService(accessToken: string): Promise<GoogleCalendarService> {
  return new GoogleCalendarService(accessToken)
}

/**
 * Generate a standard yoga calendar name for users
 */
export function generateYogaCalendarName(userName?: string): string {
  const baseName = userName ? `${userName}'s Yoga Schedule` : "My Yoga Schedule"
  const suffix = "(synced with lenna.yoga)"
  return `${baseName} ${suffix}`
}

/**
 * Check if a calendar is our managed yoga calendar by name pattern
 */
export function isYogaCalendar(calendarName: string): boolean {
  return calendarName.includes("(synced with lenna.yoga)")
} 