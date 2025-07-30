'use client'

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { PublicEvent, Tag } from '@/lib/types'

// Types
export type WhenFilter = 'all' | 'today' | 'tomorrow' | 'weekend' | 'week' | 'month' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

// Simplified studio interface
export interface StudioInfo {
  id: string
  name: string
  address?: string
  eventCount?: number
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
  
  // Actions
  updateFilter: (key: keyof FilterState, value: WhenFilter | string[] | string) => void
  toggleStudio: (studioId: string) => void
  toggleYogaStyle: (style: string) => void
  clearAllFilters: () => void
  
  // Data setters (called by parent components)
  setEvents: (events: PublicEvent[]) => void
  setTags: (tags: Tag[]) => void
  setStudioInfo: (studios: StudioInfo[]) => void
}

interface FilterProviderProps {
  children: React.ReactNode
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined)

export function useScheduleFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useScheduleFilters must be used within a FilterProvider')
  }
  return context
}

export function FilterProvider({ children }: FilterProviderProps) {
  // State
  const [filters, setFilters] = useState<FilterState>({
    when: 'week',
    studios: [],
    yogaStyles: []
  })
  
  const [events, setEvents] = useState<PublicEvent[]>([])
  const [allTags, setTags] = useState<Tag[]>([])
  const [studioInfo, setStudioInfo] = useState<StudioInfo[] | undefined>(undefined) // Start with undefined for loading state

  // ==================== COMPUTED DATA ====================
  // Enhanced studio info with event counts
  const availableStudioInfo = useMemo(() => {
    if (!studioInfo) return undefined // Return undefined during loading
    
    return studioInfo.map(studio => ({
      ...studio,
      eventCount: events.filter(event => event.studio_id === studio.id).length
    })).filter(studio => studio.eventCount && studio.eventCount > 0)
  }, [studioInfo, events])

  // Get yoga styles from tags
  const availableYogaStyles = useMemo(() => {
    const yogaStyleTags = allTags.filter(tag => tag.class_type)
    const uniqueStyles = [...new Set(yogaStyleTags.map(tag => tag.class_type!).filter(Boolean))]
    return uniqueStyles.sort()
  }, [allTags])

  // ==================== FILTERING LOGIC ====================
  const getDateRange = useCallback((filter: WhenFilter) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (filter) {
      case 'today':
        return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1) }
      case 'tomorrow':
        const tomorrow = addDays(today, 1)
        return { start: tomorrow, end: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000 - 1) }
      case 'weekend':
        const saturday = addDays(today, 6 - today.getDay()) // Next Saturday
        const sunday = addDays(saturday, 1)
        return { start: saturday, end: new Date(sunday.getTime() + 24 * 60 * 60 * 1000 - 1) }
      case 'week':
        return { start: startOfWeek(now), end: endOfWeek(now) }
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) }
      default:
        return null
    }
  }, [])

  const applyFilters = useCallback((eventList: PublicEvent[]) => {
    return eventList.filter(event => {
      if (!event.start_time) return false
      
      const eventDate = new Date(event.start_time)
      
      // When filter (combines date range and weekday logic)
      if (filters.when !== 'all') {
        // Check if it's a date range filter
        if (['today', 'tomorrow', 'weekend', 'week', 'month'].includes(filters.when)) {
          const dateRange = getDateRange(filters.when)
          if (dateRange && (eventDate < dateRange.start || eventDate > dateRange.end)) {
            return false
          }
        }
        // Check if it's a weekday filter
        else if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(filters.when)) {
          const eventWeekday = format(eventDate, 'EEEE').toLowerCase()
          if (eventWeekday !== filters.when) {
            return false
          }
        }
      }

      // Simple studio filter using studio_id
      if (filters.studios.length > 0 && event.studio_id) {
        if (!filters.studios.includes(event.studio_id)) {
          return false
        }
      }

      // Yoga styles filter
      if (filters.yogaStyles.length > 0 && event.tags) {
        const eventTags = event.tags || []
        const hasMatchingStyle = filters.yogaStyles.some(style => 
          eventTags.some(tag => {
            const matchingTag = allTags.find(t => t.name?.toLowerCase() === tag.toLowerCase())
            return matchingTag?.class_type === style
          })
        )
        if (!hasMatchingStyle) {
          return false
        }
      }

      return true
    })
  }, [filters, getDateRange, allTags])

  // Apply filters to events
  const filteredEvents = useMemo(() => {
    if (!events.length) return []
    return applyFilters(events)
  }, [events, applyFilters])

  // Calculate filter stats
  const filterStats: FilterStats = useMemo(() => {
    if (!events.length) return { total: 0, byStudio: {}, byYogaStyle: {}, byWeekday: {} }

    const filtered = applyFilters(events)
    
    const byStudio: Record<string, number> = {}
    const byYogaStyle: Record<string, number> = {}
    const byWeekday: Record<string, number> = {}

    filtered.forEach(event => {
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
      total: filtered.length,
      byStudio,
      byYogaStyle,
      byWeekday
    }
  }, [events, applyFilters, allTags, availableStudioInfo])

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

  // Computed values
  const hasActiveFilters = filters.when !== 'week' || filters.studios.length > 0 || filters.yogaStyles.length > 0
  const totalEvents = events.length

  const value: FilterContextValue = {
    // State
    filters,
    filteredEvents,
    totalEvents,
    filterStats,
    availableStudioInfo,
    availableYogaStyles,
    hasActiveFilters,
    
    // Actions
    updateFilter,
    toggleStudio,
    toggleYogaStyle,
    clearAllFilters,
    
    // Data setters
    setEvents,
    setTags,
    setStudioInfo
  }

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  )
} 