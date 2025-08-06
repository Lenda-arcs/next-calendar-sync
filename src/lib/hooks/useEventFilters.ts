'use client'

import { useState, useMemo } from 'react'
import { useSupabaseQuery } from './useQueryWithSupabase'

// Studio info interface matching FilterProvider pattern
export interface StudioInfo {
  id: string // Billing entity ID (what events reference)
  name: string
  address?: string
  eventCount?: number
  isVerified?: boolean
  hasStudioProfile?: boolean
}

// Database view type for studio entities (from studio_entities_view)
type StudioEntityView = {
  id: string
  name: string
  address: string | null
  is_verified: boolean
  has_studio_profile: boolean
  fallback_name: string
}

interface EventFilterState {
  timeFilter: 'future' | 'all' | 'past' | 'today' | 'week' | 'month'
  studioFilter: string[]
}

export function useEventFilters(userId: string) {
  const [filters, setFilters] = useState<EventFilterState>({
    timeFilter: 'future',
    studioFilter: []
  })

  // Get future events for studio discovery (following FilterProvider pattern)
  const { data: stableEvents } = useSupabaseQuery<Array<{ studio_id: string | null; location: string | null }>>(
    ['user-future-events', userId],
    async (supabase) => {
      if (!userId) return []
      
      // Only future events - much more efficient!
      const now = new Date()
      
      const { data, error } = await supabase
        .from('events')
        .select('studio_id, location')
        .eq('user_id', userId)
        .gte('start_time', now.toISOString())
        .order('start_time', { ascending: true })
      
      if (error) throw error
      return data || []
    },
    { 
      enabled: !!userId,
      staleTime: 15 * 60 * 1000
    }
  )

  // Extract studio information from stable events (following FilterProvider pattern)
  const { data: studioInfo } = useSupabaseQuery<StudioInfo[]>(
    ['user-studio-entities', userId, stableEvents?.length || 0],
    async (supabase) => {
      if (!stableEvents || stableEvents.length === 0) return []
      
      // Get unique billing entity IDs from events
      const billingEntityIds = [...new Set(
        stableEvents
          .map(event => event.studio_id)
          .filter((id): id is string => id !== null)
      )]

      if (billingEntityIds.length === 0) return []

      try {
        // Use optimized database view (much faster!) - following FilterProvider pattern
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
        
        // Fallback: Use location names when studio matching fails
        const locationMap = new Map<string, string>()
        
        stableEvents.forEach(event => {
          if (event.studio_id && event.location) {
            // Use location as the "studio name" for events without proper studio matching
            locationMap.set(event.studio_id, event.location)
          }
        })

        return Array.from(locationMap.entries()).map(([entityId, locationName]) => ({
          id: entityId,
          name: locationName, // Use location name as fallback
          address: undefined,
          isVerified: false,
          hasStudioProfile: false
        }))
      }
    },
    { 
      enabled: !!stableEvents && stableEvents.length > 0,
      staleTime: 10 * 60 * 1000
    }
  )

  // Enhanced studio info with event counts (following FilterProvider pattern)
  const availableStudioInfo = useMemo(() => {
    if (!studioInfo) return studioInfo
    
    // Use stable events for consistent counting regardless of time filter
    const eventData = stableEvents || []
    
    const enhanced = studioInfo.map(studio => {
      // Count events in stable data
      const eventCount = eventData.filter(event => event.studio_id === studio.id).length
      return {
        ...studio,
        eventCount
      }
    }).filter(studio => studio.eventCount > 0)
    
    return enhanced
  }, [studioInfo, stableEvents])

  // Create filters object for useUserEvents
  const eventFilters = useMemo(() => ({
    timeFilter: filters.timeFilter,
    studioFilter: filters.studioFilter.length > 0 ? filters.studioFilter : undefined
  }), [filters])

  const updateTimeFilter = (timeFilter: EventFilterState['timeFilter']) => {
    setFilters(prev => ({ ...prev, timeFilter }))
  }

  const toggleStudioFilter = (studioId: string) => {
    setFilters(prev => ({
      ...prev,
      studioFilter: prev.studioFilter.includes(studioId)
        ? prev.studioFilter.filter(s => s !== studioId)
        : [...prev.studioFilter, studioId]
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      timeFilter: 'future',
      studioFilter: []
    })
  }

  const hasActiveFilters = filters.studioFilter.length > 0

  return {
    filters,
    availableStudioInfo,
    eventFilters,
    updateTimeFilter,
    toggleStudioFilter,
    clearAllFilters,
    hasActiveFilters
  }
} 