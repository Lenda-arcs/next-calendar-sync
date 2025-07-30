'use client'

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { PublicEvent, Tag } from '@/lib/types'
import { usePublicEvents, useAllTags } from '@/lib/hooks/useAppQuery'
import { useSupabaseQuery } from '@/lib/hooks/useQueryWithSupabase'
import type { PublicEventsOptions } from '@/lib/server/data-access'

// Extended server options for filtering
interface ExtendedPublicEventsOptions extends PublicEventsOptions {
  studioIds?: string[]
  yogaStyles?: string[]
}

// Types
export type WhenFilter = 'today' | 'week' | 'nextweek' | 'month' | 'nextmonth' | 'next3months'

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

// Convert client filters to server options
function filtersToServerOptions(
  filters: FilterState, 
  allTags: Tag[], 
  stableDates: { today: Date; now: Date }
): ExtendedPublicEventsOptions {
  const options: ExtendedPublicEventsOptions = {}

  // Apply date filter
  const dateRange = getDateRangeForFilter(filters.when, stableDates)
  if (dateRange) {
    options.startDate = dateRange.start.toISOString()
    options.endDate = dateRange.end.toISOString()
  }

  // Studio filtering (server-side)
  if (filters.studios.length > 0) {
    options.studioIds = filters.studios
  }

  // Yoga styles: client-side only (KISS)

  return options
}

// Date range calculation for time filters
function getDateRangeForFilter(filter: WhenFilter, stableDates: { today: Date; now: Date }) {
  const { today, now } = stableDates
  
  switch (filter) {
    case 'today':
      return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1) }
    case 'week':
      return { start: startOfWeek(now), end: endOfWeek(now) }
    case 'nextweek':
      const nextWeekStart = addDays(startOfWeek(now), 7)
      const nextWeekEnd = addDays(endOfWeek(now), 7)
      return { start: nextWeekStart, end: nextWeekEnd }
    case 'month':
      // Upcoming events in current month only
      return { start: today, end: endOfMonth(now) }
    case 'nextmonth':
      const nextMonth = addDays(now, 32)
      return { start: startOfMonth(nextMonth), end: endOfMonth(nextMonth) }
    case 'next3months':
      const threeMonthsAhead = new Date(now)
      threeMonthsAhead.setMonth(threeMonthsAhead.getMonth() + 3)
      return { start: today, end: threeMonthsAhead }
    default:
      return null
  }
}

export function FilterProvider({ children, userId }: FilterProviderProps) {
  // State
  const [filters, setFilters] = useState<FilterState>({
    when: 'week', // Initial load shows this week
    studios: [],
    yogaStyles: []
  })
  
  // Stable date ranges to prevent cache busting
  const stableDateRanges = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    const oneYearAhead = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
    
    return {
      discoveryStart: new Date(ninetyDaysAgo.getFullYear(), ninetyDaysAgo.getMonth(), ninetyDaysAgo.getDate()).toISOString(),
      discoveryEnd: new Date(oneYearAhead.getFullYear(), oneYearAhead.getMonth(), oneYearAhead.getDate()).toISOString(),
      today,
      now
    }
  }, [])
  
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
  
  // Future events query for studio discovery (optimized)
  const { data: stableEvents } = useSupabaseQuery<PublicEvent[]>(
    ['user-future-events', userId],
    async (supabase) => {
      if (!userId) return []
      
      // Only future events - much more efficient!
      const now = new Date()
      
      const { data, error } = await supabase
        .from('public_events')
        .select('*')
        .eq('user_id', userId)
        .gte('start_time', now.toISOString())
        .not('studio_id', 'is', null)
        .order('start_time', { ascending: true })
      
      if (error) throw error
      return data || []
    },
    { 
      enabled: !!userId,
      staleTime: 15 * 60 * 1000
    }
  )
  
  // Extract studio information from stable events
  const { data: studioInfo } = useSupabaseQuery<StudioInfo[]>(
    ['user-studio-entities', userId, stableEvents?.length || 0],
    async (supabase) => {
      if (!stableEvents || stableEvents.length === 0) return []
      
      // Get unique billing entity IDs from events
      const billingEntityIds = [...new Set(
        stableEvents
          .map((event: PublicEvent) => event.studio_id)
          .filter((id): id is string => id !== null)
      )]

      if (billingEntityIds.length === 0) return []

      try {
        // Get billing entities with linked studio info (optimized fields)
        const { data: enrichedEntities, error } = await supabase
          .from('billing_entities')
          .select(`
            id,
            entity_name,
            studio_id,
            studios:studio_id (
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
        return billingEntityIds.map((entityId: string) => ({
          id: entityId,
          name: `Studio ${entityId.slice(-6)}`,
          address: undefined
        }))
      }
    },
    { 
      enabled: !!stableEvents && stableEvents.length > 0,
      staleTime: 10 * 60 * 1000
    }
  )

  // Filtered events with client-side fallbacks
  const filteredEvents = useMemo(() => {
    if (!events) return []
    
    let filtered = events
    
    // Client-side studio filtering fallback
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

    // Client-side yoga style filtering
    if (filters.yogaStyles.length > 0) {
      filtered = filtered.filter(event => {
        if (!event.tags || event.tags.length === 0) return false
        
        // Match event tags to selected yoga styles
        return event.tags.some(eventTag => {
          const tagObj = allTags.find(t => t.name?.toLowerCase() === eventTag.toLowerCase())
          return tagObj?.class_type && filters.yogaStyles.includes(tagObj.class_type)
        })
      })
    }
    
    return filtered
  }, [events, filters.studios, filters.yogaStyles, allTags])

  // Enhanced studio info with stable event counts
  const availableStudioInfo = useMemo(() => {
    if (!studioInfo) return studioInfo
    
    // Use stable events for consistent counting regardless of time filter
    const eventData = stableEvents || []
    
    const enhanced = studioInfo.map(studio => {
      // Count events in stable data
      const eventCount = eventData.filter(event => event.studio_id === studio.id).length
      return {
      ...studio,
        eventCount,
        // Indicator if studio has events in current filter
        hasEventsInFilter: filteredEvents.some(event => event.studio_id === studio.id)
      }
    }).filter(studio => studio.eventCount > 0)
    
    return enhanced
  }, [studioInfo, stableEvents, filteredEvents])

  // Get yoga styles from tags
  const availableYogaStyles = useMemo(() => {
    const yogaStyleTags = allTags.filter(tag => tag.class_type)
    const uniqueStyles = [...new Set(yogaStyleTags.map(tag => tag.class_type!).filter(Boolean))]
    return uniqueStyles.sort()
  }, [allTags])

  // Calculate filter stats
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

  // Event handlers
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
      when: 'next3months',
      studios: [],
      yogaStyles: []
    })
  }, [])

  // Active filters check (next3months is reset default, so week shows reset button)
  const hasActiveFilters = filters.when !== 'next3months' || filters.studios.length > 0 || filters.yogaStyles.length > 0
  const totalEvents = filteredEvents.length

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
    
    // Legacy compatibility (no-op)
    setEvents: () => {},
    setTags: () => {}
  }

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  )
} 