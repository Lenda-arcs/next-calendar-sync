'use client'

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { PublicEvent, Tag } from '@/lib/types'
import { usePublicEvents, useAllTags } from '@/lib/hooks/useAppQuery'
import { useSupabaseQuery } from '@/lib/hooks/useQueryWithSupabase'
import type { PublicEventsOptions } from '@/lib/server/data-access'

// Extended options for filtering
interface ExtendedPublicEventsOptions extends PublicEventsOptions {
  studioIds?: string[]
  yogaStyles?: string[]
  weekdays?: string[]
}

// Types
export type WhenFilter = 'all' | 'today' | 'tomorrow' | 'weekend' | 'week' | 'month' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

// Database types for studio entities
type BillingEntityWithStudio = {
  id: string
  entity_name: string
  entity_type: string
  studio_id: string | null
  studios: {
    id: string
    name: string
    address: string | null
    verified: boolean | null
  } | null
}

// Comprehensive studio interface
export interface StudioInfo {
  id: string // Billing entity ID (what events reference)
  name: string
  address?: string
  eventCount?: number
  hasEventsInFilter?: boolean // Whether this studio has events in current filter
  isVerified?: boolean // Whether the linked studio is verified
  hasStudioProfile?: boolean // Whether there's a full studio profile
}

export interface FilterState {
  when: WhenFilter
  studios: string[]
  yogaStyles: string[]
}

interface FilterStats {
  total: number
  byStudio: Record<string, number>
  byYogaStyle: Record<string, number>
  byWeekday: Record<string, number>
}

interface FilterContextValue {
  // State
  filters: FilterState
  filteredEvents: PublicEvent[]
  totalEvents: number
  filterStats: FilterStats
  availableStudioInfo: StudioInfo[] | undefined
  availableYogaStyles: string[]
  hasActiveFilters: boolean
  isLoading: boolean // Loading state for server queries
  
  // Actions
  updateFilter: (key: keyof FilterState, value: WhenFilter | string[] | string) => void
  toggleStudio: (studioId: string) => void
  toggleYogaStyle: (style: string) => void
  clearAllFilters: () => void
  
  // Legacy data setters (kept for compatibility)
  setEvents: (events: PublicEvent[]) => void
  setTags: (tags: Tag[]) => void
}

interface FilterProviderProps {
  children: React.ReactNode
  userId: string
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined)

export function useScheduleFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useScheduleFilters must be used within a FilterProvider')
  }
  return context
}

// Helper function to convert client-side filters to server-side options
function filtersToServerOptions(
  filters: FilterState, 
  allTags: Tag[], 
  stableDates: { today: Date; now: Date }
): ExtendedPublicEventsOptions {
  const options: ExtendedPublicEventsOptions = {}

  // Convert date filter to startDate/endDate
  if (filters.when !== 'week') { // 'week' is now our default, not 'all'
    const dateRange = getDateRangeForFilter(filters.when, stableDates)
    if (dateRange) {
      options.startDate = dateRange.start.toISOString()
      options.endDate = dateRange.end.toISOString()
    }
    
    // Handle weekday filters
    if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(filters.when)) {
      options.weekdays = [filters.when]
    }
  } else {
    // Default to current week - use stable dates
    const startOfWeekDate = startOfWeek(stableDates.now)
    const endOfWeekDate = endOfWeek(stableDates.now)
    options.startDate = startOfWeekDate.toISOString()
    options.endDate = endOfWeekDate.toISOString()
  }

  // Studio filtering - re-enabled with proper billing entity IDs
  if (filters.studios.length > 0) {
    options.studioIds = filters.studios // These are billing entity IDs
  }

  // Yoga styles filtering - DISABLED for server-side (using client-side instead)
  // KISS approach: handle yoga styles on client-side for simplicity

  return options
}

// Helper function for date range calculation - now using stable dates
function getDateRangeForFilter(filter: WhenFilter, stableDates: { today: Date; now: Date }) {
  const { today, now } = stableDates
  
  switch (filter) {
    case 'today':
      return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1) }
    case 'tomorrow':
      const tomorrow = addDays(today, 1)
      return { start: tomorrow, end: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000 - 1) }
    case 'weekend':
      const saturday = addDays(today, 6 - today.getDay())
      const sunday = addDays(saturday, 1)
      return { start: saturday, end: new Date(sunday.getTime() + 24 * 60 * 60 * 1000 - 1) }
    case 'month':
      return { start: startOfMonth(now), end: endOfMonth(now) }
    default:
      return null
  }
}

export function FilterProvider({ children, userId }: FilterProviderProps) {
  // State
  const [filters, setFilters] = useState<FilterState>({
    when: 'week',
    studios: [],
    yogaStyles: []
  })
  
  // ==================== STABLE DATE RANGES ====================
  // CRITICAL: Memoize date calculations to prevent cache busting!
  const stableDateRanges = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    const oneYearAhead = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
    
    return {
      // For studio discovery - use start of day to make it more stable
      discoveryStart: new Date(ninetyDaysAgo.getFullYear(), ninetyDaysAgo.getMonth(), ninetyDaysAgo.getDate()).toISOString(),
      discoveryEnd: new Date(oneYearAhead.getFullYear(), oneYearAhead.getMonth(), oneYearAhead.getDate()).toISOString(),
      // For current day/week calculations
      today,
      now
    }
  }, []) // Empty dependency array = calculate once and never change!
  
  // Fetch tags first (needed for filter conversion)
  const { 
    data: tagsData
  } = useAllTags(userId, { enabled: !!userId })
  
  const allTags = useMemo(() => tagsData?.allTags || [], [tagsData?.allTags])
  
  // Convert filters to server options
  const serverOptions = useMemo(() => {
    const options = filtersToServerOptions(filters, allTags, stableDateRanges)
    
    // Studio filtering enabled with server-side optimization
    
    return options
  }, [filters, allTags, stableDateRanges])
  
  // Fetch events with server-side filtering
  const { 
    data: events,
    isLoading: eventsLoading
  } = usePublicEvents(userId, { 
    ...serverOptions,
    enabled: !!userId 
  })
  
  // Fetch all user events (without filters) to get available studios
  const { data: allUserEvents } = usePublicEvents(userId, { 
    enabled: !!userId,
    // Use stable date range to prevent cache busting
    startDate: stableDateRanges.discoveryStart,
    endDate: stableDateRanges.discoveryEnd
  })
  
  // ROBUST: Extract all billing entities that serve as studios from user's events
  const { data: studioInfo } = useSupabaseQuery<StudioInfo[]>(
    ['user-studio-entities', userId, allUserEvents?.length || 0],
    async (supabase) => {
      if (!allUserEvents || allUserEvents.length === 0) return []
      
      // Get unique billing entity IDs from events that act as studios
      const billingEntityIds = [...new Set(
        allUserEvents
          .map(event => event.studio_id)
          .filter((id): id is string => id !== null)
      )]

      if (billingEntityIds.length === 0) return []

      try {
        // COMPREHENSIVE QUERY: Get billing entities with their linked studio info
        const { data: enrichedEntities, error } = await supabase
          .from('billing_entities')
          .select(`
            id,
            entity_name,
            entity_type,
            studio_id,
            studios:studio_id (
              id,
              name,
              address,
              verified
            )
          `)
          .in('id', billingEntityIds)
          .eq('entity_type', 'studio')

        if (error) throw error

        const studioEntities: StudioInfo[] = enrichedEntities?.map((entity: BillingEntityWithStudio) => {
          // Prefer actual studio info if available, fall back to billing entity
          const studioData = entity.studios
          
          return {
            id: entity.id, // IMPORTANT: Use billing entity ID (this is what events reference)
            name: studioData?.name || entity.entity_name || `Studio ${entity.id.slice(-6)}`,
            address: studioData?.address || undefined,
            // Additional metadata for better UX
            isVerified: studioData?.verified || false,
            hasStudioProfile: !!studioData
          }
        }).filter(Boolean) || []

        // Studio entities loaded successfully

        return studioEntities

      } catch (error) {
        console.warn('Error loading studio entities, using fallback:', error)
        
        // Fallback: Basic studio entities from billing IDs
        return billingEntityIds.map(entityId => ({
          id: entityId,
          name: `Studio ${entityId.slice(-6)}`,
          address: undefined
        }))
      }
    },
    { 
      enabled: !!allUserEvents && allUserEvents.length > 0,
      staleTime: 10 * 60 * 1000 // Cache for 10 minutes (more stable)
    }
  )

  // ==================== COMPUTED DATA ====================
  // Server-side filtering + client-side fallback for studios
  const filteredEvents = useMemo(() => {
    if (!events) return []
    
    let filtered = events
    
    // Client-side studio filtering (backup)
    if (filters.studios.length > 0) {
      const needsClientFilter = filtered.some(event => 
        event.studio_id && !filters.studios.includes(event.studio_id)
      )
      
      if (needsClientFilter) {
        filtered = filtered.filter(event => 
          event.studio_id && filters.studios.includes(event.studio_id)
        )
      }
    }

    // KISS: Client-side yoga style filtering (simple and reliable)
    if (filters.yogaStyles.length > 0) {
      filtered = filtered.filter(event => {
        if (!event.tags || event.tags.length === 0) return false
        
        // Check if any of the event's tags match the selected yoga styles
        return event.tags.some(eventTag => {
          // Find the tag object to get its class_type
          const tagObj = allTags.find(t => t.name?.toLowerCase() === eventTag.toLowerCase())
          return tagObj?.class_type && filters.yogaStyles.includes(tagObj.class_type)
        })
      })
    }
    
    return filtered
  }, [events, filters.studios, filters.yogaStyles, allTags])

  // Enhanced studio info with event counts - SHOW ALL STUDIOS regardless of current filter
  const availableStudioInfo = useMemo(() => {
    if (!studioInfo) return studioInfo
    
    // CRITICAL FIX: Show ALL studios, but update event counts based on ALL events (not filtered)
    // This allows users to see and select any studio, even if not currently visible
    const allEvents = events || [] // Use ALL events for counting, not filtered ones
    
    const enhanced = studioInfo.map(studio => {
      // Count events in ALL data (before client-side filtering)
      const eventCount = allEvents.filter(event => event.studio_id === studio.id).length
      return {
        ...studio,
        eventCount,
        // Add indicator if this studio has events in current filter
        hasEventsInFilter: filteredEvents ? 
          filteredEvents.filter(event => event.studio_id === studio.id).length > 0 : false
      }
    }).filter(studio => studio.eventCount > 0) // Only exclude studios with NO events at all
    
    // Enhanced studio info ready for UI
    
    return enhanced
  }, [studioInfo, events, filteredEvents])

  // Get yoga styles from tags
  const availableYogaStyles = useMemo(() => {
    const yogaStyleTags = allTags.filter(tag => tag.class_type)
    const uniqueStyles = [...new Set(yogaStyleTags.map(tag => tag.class_type!).filter(Boolean))]
    return uniqueStyles.sort()
  }, [allTags])

  // Calculate filter stats based on server-filtered events
  const filterStats: FilterStats = useMemo(() => {
    if (!filteredEvents.length) return { total: 0, byStudio: {}, byYogaStyle: {}, byWeekday: {} }
    
    const byStudio: Record<string, number> = {}
    const byYogaStyle: Record<string, number> = {}
    const byWeekday: Record<string, number> = {}

    filteredEvents.forEach(event => {
      // Studio stats using studio name
      if (event.studio_id && availableStudioInfo) {
        const studio = availableStudioInfo.find(s => s.id === event.studio_id)
        const studioKey = studio ? studio.name : event.studio_id
        byStudio[studioKey] = (byStudio[studioKey] || 0) + 1
      }

      // Weekday stats
      if (event.start_time) {
        const weekday = format(new Date(event.start_time), 'EEEE').toLowerCase()
        byWeekday[weekday] = (byWeekday[weekday] || 0) + 1
      }

      // Yoga style stats
      if (event.tags) {
        event.tags.forEach(tagName => {
          const tag = allTags.find(t => t.name?.toLowerCase() === tagName.toLowerCase())
          if (tag?.class_type) {
            byYogaStyle[tag.class_type] = (byYogaStyle[tag.class_type] || 0) + 1
          }
        })
      }
    })

    return {
      total: filteredEvents.length,
      byStudio,
      byYogaStyle,
      byWeekday
    }
  }, [filteredEvents, allTags, availableStudioInfo])

  // ==================== EVENT HANDLERS ====================
  const updateFilter = useCallback((key: keyof FilterState, value: WhenFilter | string[] | string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const toggleStudio = useCallback((studioId: string) => {
    setFilters(prev => ({
      ...prev,
      studios: prev.studios.includes(studioId)
        ? prev.studios.filter(s => s !== studioId)
        : [...prev.studios, studioId]
    }))
  }, [])

  const toggleYogaStyle = useCallback((style: string) => {
    setFilters(prev => ({
      ...prev,
      yogaStyles: prev.yogaStyles.includes(style)
        ? prev.yogaStyles.filter(s => s !== style)
        : [...prev.yogaStyles, style]
    }))
  }, [])

  const clearAllFilters = useCallback(() => {
    setFilters({
      when: 'week',
      studios: [],
      yogaStyles: []
    })
  }, [])

  // Computed values - check for active filters
  const hasActiveFilters = filters.when !== 'week' || filters.studios.length > 0 || filters.yogaStyles.length > 0
  const totalEvents = filteredEvents.length // With server-side filtering, this is the current result count

  const value: FilterContextValue = {
    // State
    filters,
    filteredEvents,
    totalEvents,
    filterStats,
    availableStudioInfo,
    availableYogaStyles,
    hasActiveFilters,
    isLoading: eventsLoading,
    
    // Actions
    updateFilter,
    toggleStudio,
    toggleYogaStyle,
    clearAllFilters,
    
    // Legacy data setters (kept for compatibility but not used)
    setEvents: () => {}, // No-op since we use server-side data
    setTags: () => {}    // No-op since we use server-side data
  }

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  )
} 