'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase'
import { EventTag } from '@/lib/event-types'
import { Tables } from '../../../database-generated.types'

// Use the database-generated type for events
export type AppEvent = Tables<'events'>

// Enhanced event with processed tags for display
export interface EnhancedEvent extends Omit<AppEvent, 'title'> {
  title: string // Override to make non-nullable
  processedTags: EventTag[]
  dateTime: string
  imageQuery: string
  isPublic: boolean // computed from visibility
}

// Enhanced event with processed tags for display
export interface EnhancedEvent extends AppEvent {
  processedTags: EventTag[]
  dateTime: string
  imageQuery: string
}

interface EventsState {
  // Data
  events: AppEvent[]
  enhancedEvents: EnhancedEvent[]
  loading: boolean
  error: string | null
  lastFetch: number | null

  // Actions
  fetchEvents: (userId: string) => Promise<void>
  updateEvent: (eventId: string, updates: Partial<AppEvent>) => Promise<void>
  updateEventTags: (eventId: string, tagIds: string[]) => Promise<void>
  updateEventVisibility: (eventId: string, isPublic: boolean) => Promise<void>
  enhanceEventsWithTags: (tags: EventTag[]) => void
  clearEvents: () => void
}

export const useEventsStore = create<EventsState>()(
  persist(
    (set, get) => ({
      // Initial state
      events: [],
      enhancedEvents: [],
      loading: false,
      error: null,
      lastFetch: null,

      // Fetch events from database
      fetchEvents: async (userId: string) => {
        const { lastFetch } = get()
        const now = Date.now()
        
        console.log('Events store - fetchEvents called with userId:', userId)
        console.log('Events store - lastFetch:', lastFetch, 'now:', now)
        
        // Temporarily disable caching for debugging
        // Skip if fetched within last 5 minutes
        // if (lastFetch && now - lastFetch < 5 * 60 * 1000) {
        //   console.log('Events store - Skipping fetch due to cache')
        //   return
        // }

        set({ loading: true, error: null })

        try {
          const supabase = createClient()
          console.log('Events store - Fetching events for user:', userId)
          
          const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('user_id', userId)
            .order('start_time', { ascending: true })

          console.log('Events store - Query result:', { data, error })

          if (error) {
            console.error('Events store - Database error:', error)
            throw error
          }

          const events = data || []
          
          console.log('Events store - Events fetched from database:', events.length, events)
          
          // Debug: Check if there are any events in the database at all
          const { data: allEvents } = await supabase
            .from('events')
            .select('id, title, user_id')
            .limit(5)
          
          console.log('Events store - Sample events in database:', allEvents?.length || 0, allEvents)
          
          set({ 
            events, 
            loading: false, 
            lastFetch: now 
          })

          // Enhance events if tags are available
          const { enhanceEventsWithTags } = get()
          enhanceEventsWithTags([]) // Will be called again when tags are loaded

        } catch (error) {
          console.error('Error fetching events:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch events',
            loading: false 
          })
        }
      },

      // Update event
      updateEvent: async (eventId: string, updates: Partial<AppEvent>) => {
        try {
          const supabase = createClient()
          const { error } = await supabase
            .from('events')
            .update(updates)
            .eq('id', eventId)

          if (error) throw error

          // Update local state
          set(state => ({
            events: state.events.map(event =>
              event.id === eventId ? { ...event, ...updates } : event
            )
          }))

        } catch (error) {
          console.error('Error updating event:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to update event' })
        }
      },

      // Update event tags
      updateEventTags: async (eventId: string, tagIds: string[]) => {
        await get().updateEvent(eventId, { tags: tagIds })
      },

      // Update event visibility
      updateEventVisibility: async (eventId: string, isPublic: boolean) => {
        await get().updateEvent(eventId, { visibility: isPublic ? 'public' : 'private' })
      },

      // Enhance events with tag data for display
      enhanceEventsWithTags: (tags: EventTag[]) => {
        const { events } = get()
        
        console.log('Enhancing events:', events.length, 'with tags:', tags.length)
        
        const enhancedEvents: EnhancedEvent[] = events
          .filter(event => event.title && event.id) // Filter out events without title or id
          .map(event => {
            // Get event tags
            const eventTags = (event.tags || [])
              .map((tagId: string) => tags.find(tag => tag.id === tagId))
              .filter(Boolean) as EventTag[]

            // Generate display fields
            const dateTime = formatEventDateTime(event.start_time || '')
            const imageQuery = generateImageQuery(event, eventTags)
            const isPublic = event.visibility === 'public'

            return {
              ...event,
              title: event.title || 'Untitled Event', // Ensure title is never null
              processedTags: eventTags,
              dateTime,
              imageQuery,
              isPublic
            }
          })

        set({ enhancedEvents })
      },

      // Clear events (for logout)
      clearEvents: () => {
        set({
          events: [],
          enhancedEvents: [],
          loading: false,
          error: null,
          lastFetch: null
        })
      }
    }),
    {
      name: 'events-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        events: state.events,
        lastFetch: state.lastFetch
      })
    }
  )
)

// Helper functions
function formatEventDateTime(startTime: string): string {
  try {
    const date = new Date(startTime)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const eventDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    
    if (diffDays === 0) {
      return `Today, ${timeStr}`
    } else if (diffDays === 1) {
      return `Tomorrow, ${timeStr}`
    } else if (diffDays <= 7) {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
      return `${dayName}, ${timeStr}`
    } else {
      const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
      return `${dateStr}, ${timeStr}`
    }
  } catch {
    return startTime
  }
}

function generateImageQuery(event: AppEvent, tags: EventTag[]): string {
  const parts = []
  
  if (event.title) parts.push(event.title)
  if (event.location) parts.push(event.location)
  if (tags.length > 0) {
    parts.push(...tags.slice(0, 2).map(tag => tag.name).filter(Boolean))
  }
  
  return parts.join(' ').toLowerCase() || 'yoga class'
} 