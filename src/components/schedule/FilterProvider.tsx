'use client'

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'
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

// Database view type for studio entities (from studio_entities_view)
type StudioEntityView = {
  id: string
  name: string
  address: string | null
  is_verified: boolean
  has_studio_profile: boolean
  fallback_name: string
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
  userTimezone?: string | null
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
  stableDates: { today: Date; now: Date },
  userTimezone?: string | null
): ExtendedPublicEventsOptions {
  const options: ExtendedPublicEventsOptions = {}

  // Apply date filter (timezone-aware)
  const dateRange = getDateRangeForFilter(filters.when, stableDates, userTimezone)
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

// Date range calculation for time filters (timezone-aware)
function getDateRangeForFilter(
  filter: WhenFilter, 
  stableDates: { today: Date; now: Date }, 
  userTimezone?: string | null
) {
  const timezone = userTimezone || 'UTC'
  const { today, now } = stableDates
  
  // Convert browser times to user's timezone for accurate filtering
  const userNow = userTimezone ? toZonedTime(now, timezone) : now
  const userToday = userTimezone ? toZonedTime(today, timezone) : today
  
  let start: Date, end: Date
  
  switch (filter) {
    case 'today':
      start = userToday
      end = new Date(userToday.getTime() + 24 * 60 * 60 * 1000 - 1)
      break
    case 'week':
      // Only future events in this week (from now until end of week)
      // Use Monday as start of week (weekStartsOn: 1) - European standard
      start = userNow
      end = endOfWeek(userNow, { weekStartsOn: 1 })
      break
    case 'nextweek':
      const nextWeekStart = addDays(startOfWeek(userNow, { weekStartsOn: 1 }), 7)
      const nextWeekEnd = addDays(endOfWeek(userNow, { weekStartsOn: 1 }), 7)
      start = nextWeekStart
      end = nextWeekEnd
      break
    case 'month':
      // Only future events in current month (from now until end of month)
      start = userNow
      end = endOfMonth(userNow)
      break
    case 'nextmonth':
      const nextMonth = addDays(userNow, 32)
      start = startOfMonth(nextMonth)
      end = endOfMonth(nextMonth)
      break
    case 'next3months':
      const threeMonthsAhead = new Date(userNow)
      threeMonthsAhead.setMonth(threeMonthsAhead.getMonth() + 3)
      start = userNow
      end = threeMonthsAhead
      break
    default:
      return null
  }
  
  // Convert back to UTC for database queries (events are stored in UTC)
  return {
    start: userTimezone ? fromZonedTime(start, timezone) : start,
    end: userTimezone ? fromZonedTime(end, timezone) : end
  }
}

export function FilterProvider({ children, userId, userTimezone }: FilterProviderProps) {
  // State
  const [filters, setFilters] = useState<FilterState>({
    when: 'week', // Start with this week, auto-upgrade if needed
    studios: [],
    yogaStyles: []
  })
  
  // Track if we've already auto-upgraded to prevent infinite loops
  const [hasAutoUpgraded, setHasAutoUpgraded] = useState(false)
  // Track if user has ever manually interacted with filters
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  
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
    const options = filtersToServerOptions(filters, allTags, stableDateRanges, userTimezone)
    
    // Studio filtering enabled with server-side optimization
    
    return options
  }, [filters, allTags, stableDateRanges, userTimezone])
  
  // Fetch events with server-side filtering
  const { 
    data: events,
    isLoading: eventsLoading
  } = usePublicEvents(userId, { 
    ...serverOptions,
    enabled: !!userId 
  })
  
  // Smart filter upgrading: auto-upgrade if current filter has too few events
  // ONLY on initial load, never after user interaction
  useEffect(() => {
    if (!events || eventsLoading || hasAutoUpgraded || hasUserInteracted || filters.studios.length > 0 || filters.yogaStyles.length > 0) {
      return // Don't auto-upgrade if loading, already upgraded, user has interacted, or user has applied filters
    }
    
    const eventCount = events.length
    
    // Auto-upgrade logic based on current filter and event count
    if (filters.when === 'week' && eventCount <= 3) {
      // Upgrade from week to month
      setFilters(prev => ({ ...prev, when: 'month' }))
      setHasAutoUpgraded(true)
    } else if (filters.when === 'month' && eventCount <= 3) {
      // Upgrade from month to next3months
      setFilters(prev => ({ ...prev, when: 'next3months' }))
      setHasAutoUpgraded(true)
    }
  }, [events, eventsLoading, filters.when, filters.studios.length, filters.yogaStyles.length, hasAutoUpgraded, hasUserInteracted])
  
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
        // Use optimized database view (much faster!)
        const { data: studioEntities, error } = await supabase
          .from('studio_entities_view')
          .select('*')
          .in('id', billingEntityIds)

        if (error) throw error

        // Transform to our interface
        const studios: StudioInfo[] = studioEntities?.map((entity: StudioEntityView) => ({
          id: entity.id,
          name: entity.name,
          address: entity.address || undefined,
          isVerified: entity.is_verified || false,
          hasStudioProfile: entity.has_studio_profile || false
        })) || []

        return studios

      } catch (error) {
        console.warn('Error loading studio entities from view, using fallback:', error)
        
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
    // Mark that user has interacted - disable auto-upgrading forever
    setHasUserInteracted(true)
  }, [])

  const toggleStudio = useCallback((studioId: string) => {
    setFilters(prev => ({
      ...prev,
      studios: prev.studios.includes(studioId)
        ? prev.studios.filter(s => s !== studioId)
        : [...prev.studios, studioId]
    }))
    // Mark that user has interacted - disable auto-upgrading forever
    setHasUserInteracted(true)
  }, [])

  const toggleYogaStyle = useCallback((style: string) => {
    setFilters(prev => ({
      ...prev,
      yogaStyles: prev.yogaStyles.includes(style)
        ? prev.yogaStyles.filter(s => s !== style)
        : [...prev.yogaStyles, style]
    }))
    // Mark that user has interacted - disable auto-upgrading forever
    setHasUserInteracted(true)
  }, [])

  const clearAllFilters = useCallback(() => {
    setFilters({
      when: 'week', // Reset to week, let auto-upgrade handle it
      studios: [],
      yogaStyles: []
    })
    // Reset both flags to allow auto-upgrading again (user is starting fresh)
    setHasAutoUpgraded(false)
    setHasUserInteracted(false)
  }, [])

  // Active filters check (week is reset default, any manual filter changes show reset button)
  const hasActiveFilters = (filters.when !== 'week' && !hasAutoUpgraded) || filters.studios.length > 0 || filters.yogaStyles.length > 0
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