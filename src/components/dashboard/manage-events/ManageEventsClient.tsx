'use client'

import React from 'react'
import { Container } from '@/components/layout'
import EventGrid from '@/components/events/EventGrid'
import { 
  EventsControlPanel,
  EventsEmptyState,
  FloatingActionButtons
} from '@/components/events'
import { NewTagForm } from '@/components/tags'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DataLoader from '@/components/ui/data-loader'
import { ManageEventsSkeleton } from '@/components/ui/skeleton'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { useSupabaseMutation } from '@/lib/hooks/useSupabaseMutation'
import { useCalendarSync } from '@/lib/hooks/useCalendarSync'
import { useAllTags } from '@/lib/hooks/useAllTags'
import { Event } from '@/lib/types'
import { convertToEventTag, EventTag } from '@/lib/event-types'
import { convertEventToCardProps } from '@/lib/event-utils'
import { createBrowserClient } from '@supabase/ssr'
import { VisibilityFilter, TimeFilter } from '@/components/events/EventsControlPanel'
import { useTranslation } from '@/lib/i18n/context'

// Types for component
interface PendingEventUpdate {
  id: string
  tags: string[]
  visibility: string
}

interface EventStats {
  total: number
  public: number
  private: number
}

interface ManageEventsClientProps {
  userId: string
}

export function ManageEventsClient({ userId }: ManageEventsClientProps) {
  const { t } = useTranslation()
  
  // ==================== SETUP & STATE ====================
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  // Event management state
  const [pendingChanges, setPendingChanges] = React.useState<Map<string, PendingEventUpdate>>(new Map())
  const [isSaving, setIsSaving] = React.useState(false)

  // Filtering state
  const [visibilityFilter, setVisibilityFilter] = React.useState<VisibilityFilter>('all')
  const [timeFilter, setTimeFilter] = React.useState<TimeFilter>('all')

  // UI state
  const [resetSignal, setResetSignal] = React.useState(0)

  // Create tag form state
  const [isCreateTagFormOpen, setIsCreateTagFormOpen] = React.useState(false)

  // ==================== DATA FETCHING ====================
  const {
    data: events,
    isLoading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents
  } = useSupabaseQuery<Event[]>({
    queryKey: ['user_events', userId || 'no-user'],
    fetcher: async (supabase) => {
      if (!userId) return []
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: true, nullsLast: true })
      
      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })

  // Use shared tags hook instead of individual fetches
  const { allTags, isLoading: tagsLoading, refetch: refetchTags } = useAllTags({ 
    userId, 
    enabled: !!userId 
  })

  // Create tag mutation
  const createTagMutation = useSupabaseMutation({
    mutationFn: async (supabase, tagData: EventTag) => {
      if (!userId) throw new Error('User not authenticated')

      // Convert EventTag back to database format (following useTagOperations pattern)
      const dbTag = {
        name: tagData.name,
        slug: tagData.slug || tagData.name?.toLowerCase().replace(/\s+/g, '-'),
        color: tagData.color,
        // Use first class type only (matching useTagOperations pattern)
        class_type: tagData.classType?.[0] || null,
        audience: tagData.audience || null,
        priority: tagData.priority || null,
        cta_label: tagData.cta?.label || null,
        cta_url: tagData.cta?.url || null,
        image_url: tagData.imageUrl || null,
        user_id: userId,
      }

      const { data, error } = await supabase
        .from('tags')
        .insert([dbTag])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      // Refetch tags to update the UI
      refetchTags()
      setIsCreateTagFormOpen(false)
    }
  })

  // ==================== COMPUTED DATA ====================
  // Get all available tags from shared hook
  const allAvailableTags = allTags

  // Convert tags to EventTag format for the grid
  const availableEventTags = React.useMemo(() => {
    return allAvailableTags.map(tag => convertToEventTag(tag))
  }, [allAvailableTags])

  // ==================== EVENT FILTERING & PROCESSING ====================
  // Helper function to apply filters to events
  const applyEventFilters = React.useCallback((eventList: Event[]) => {
    const now = new Date()
    
    return eventList.filter(event => {
      // Time filter
      if (timeFilter === 'future') {
        const startTime = event.start_time ? new Date(event.start_time) : null
        if (startTime && startTime < now) {
          return false
        }
      }

      // Visibility filter (check pending changes first)
      const pendingUpdate = pendingChanges.get(event.id)
      const eventVisibility = pendingUpdate ? pendingUpdate.visibility : event.visibility
      
      if (visibilityFilter !== 'all' && eventVisibility !== visibilityFilter) {
        return false
      }

      return true
    })
  }, [timeFilter, visibilityFilter, pendingChanges])

  // Helper function to apply pending changes to an event
  const applyPendingChanges = React.useCallback((event: Event) => {
    const pendingUpdate = pendingChanges.get(event.id)
    return pendingUpdate ? {
      ...event,
      tags: pendingUpdate.tags,
      visibility: pendingUpdate.visibility
    } : event
  }, [pendingChanges])

  // Convert database events to display events for EventGrid
  const displayEvents = React.useMemo(() => {
    if (!events) return []

    const filteredEvents = applyEventFilters(events)
    
    return filteredEvents.map(event => {
      const eventWithChanges = applyPendingChanges(event)
      return convertEventToCardProps(eventWithChanges, allAvailableTags)
    })
  }, [events, allAvailableTags, applyEventFilters, applyPendingChanges])

  // ==================== EVENT HANDLERS ====================
  // Helper function to check if event state matches original
  const isEventStateOriginal = React.useCallback((eventId: string, tags: string[], visibility: string) => {
    const originalEvent = events?.find(event => event.id === eventId)
    if (!originalEvent) return false
    
    // Compare tags (handle both null and empty array cases)
    const originalTags = originalEvent.tags || []
    const tagsMatch = originalTags.length === tags.length && 
      originalTags.every(tag => tags.includes(tag)) &&
      tags.every(tag => originalTags.includes(tag))
    
    // Compare visibility
    const visibilityMatch = originalEvent.visibility === visibility
    
    return tagsMatch && visibilityMatch
  }, [events])

  // Handle event changes locally (no immediate DB update)
  const handleEventUpdate = React.useCallback((updates: {
    id: string
    tags: string[]
    visibility: string
  }) => {
    setPendingChanges(prev => {
      const newChanges = new Map(prev)
      
      // Check if the update matches the original state
      const isOriginal = isEventStateOriginal(updates.id, updates.tags, updates.visibility)
      
      if (isOriginal) {
        // If it matches original, remove from pending changes
        newChanges.delete(updates.id)
      } else {
        // If it's different from original, add/update pending changes
        newChanges.set(updates.id, updates)
      }
      
      return newChanges
    })
  }, [isEventStateOriginal])

  // Handle batch save of all pending changes
  const handleSaveChanges = React.useCallback(async () => {
    if (!userId || pendingChanges.size === 0) {
      return
    }

    setIsSaving(true)
    try {
      // Convert pending changes to batch update promises
      const updatePromises = Array.from(pendingChanges.values()).map(update => {
        return supabase
          .from('events')
          .update({
            tags: update.tags,
            visibility: update.visibility
          })
          .eq('id', update.id)
          .eq('user_id', userId)
      })

      // Execute all updates in parallel
      const results = await Promise.all(updatePromises)
      
      // Check for any errors
      const errors = results.filter(result => result.error)
      if (errors.length > 0) {
        throw new Error(`${errors.length} updates failed`)
      }

      // Clear pending changes and refresh data
      setPendingChanges(new Map())
      await refetchEvents()
      
    } catch (error) {
      console.error('Failed to save changes:', error)
      // You could add a toast notification here
    } finally {
      setIsSaving(false)
    }
  }, [userId, pendingChanges, supabase, refetchEvents])

  // Handle discarding all pending changes
  const handleDiscardChanges = React.useCallback(() => {
    // Clear all pending changes
    setPendingChanges(new Map())
    
    // Force all InteractiveEventCard components to reset by changing the key
    setResetSignal(prev => prev + 1)
  }, [])

  const handleRefresh = React.useCallback(async () => {
    await refetchEvents()
  }, [refetchEvents])

  // Calendar sync functionality using custom hook
  const { syncFeeds: handleSyncFeeds, isSyncing } = useCalendarSync({
    userId,
    supabase,
    onSyncComplete: refetchEvents
  })

  // Handle create tag form
  const handleCreateTag = (tagData: EventTag) => {
    createTagMutation.mutate(tagData)
  }

  const handleCreateTagFormClose = () => {
    setIsCreateTagFormOpen(false)
  }

  // Calculate stats for overview cards
  const eventStats: EventStats = React.useMemo(() => {
    if (!events) return { total: 0, public: 0, private: 0 }
    
    const filteredEvents = applyEventFilters(events)
    
    const publicCount = filteredEvents.filter(event => {
      const eventWithChanges = applyPendingChanges(event)
      return eventWithChanges.visibility === 'public'
    }).length
    
    const privateCount = filteredEvents.filter(event => {
      const eventWithChanges = applyPendingChanges(event)
      return eventWithChanges.visibility === 'private'
    }).length
    
    return {
      total: filteredEvents.length,
      public: publicCount,
      private: privateCount
    }
  }, [events, applyEventFilters, applyPendingChanges])

  // Check if there are pending changes
  const hasPendingChanges = pendingChanges.size > 0

  // Loading state
  const isLoading = eventsLoading || tagsLoading

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-destructive">{t('pages.manageEvents.authRequired')}</p>
          <p className="text-sm text-muted-foreground">{t('pages.manageEvents.authRequiredDesc')}</p>
        </div>
      </div>
    )
  }

  if (eventsError) {
    return (
      <Container>
        <div className="text-center py-12">
          <p className="text-lg font-medium text-destructive mb-2">{t('pages.manageEvents.loadError')}</p>
          <p className="text-sm text-muted-foreground mb-4">{eventsError.message}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('pages.manageEvents.tryAgain')}
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <Container 
      title={t('pages.manageEvents.title')}
      subtitle={t('pages.manageEvents.subtitle')}
    >
      <DataLoader
        data={displayEvents}
        loading={isLoading}
        error={eventsError ? t('pages.manageEvents.loadError') : null}
        skeleton={ManageEventsSkeleton}
        skeletonCount={1}
        empty={
          <EventsEmptyState
            totalEventsCount={events?.length || 0}
            timeFilter={timeFilter}
            visibilityFilter={visibilityFilter}
            onChangeVisibilityFilter={setVisibilityFilter}
            onChangeTimeFilter={setTimeFilter}
          />
        }
      >
        {(loadedEvents) => (
          <div className="space-y-8">
            <EventsControlPanel
              timeFilter={timeFilter}
              visibilityFilter={visibilityFilter}
              eventStats={eventStats}
              userTags={allTags.filter(tag => tag.user_id) || undefined}
              globalTags={allTags.filter(tag => !tag.user_id) || undefined}
              hasPendingChanges={hasPendingChanges}
              pendingChangesCount={pendingChanges.size}
              isSyncing={isSyncing}
              isLoading={false}
              userId={userId}
              onTimeFilterChange={setTimeFilter}
              onVisibilityFilterChange={setVisibilityFilter}
              onCreateTag={() => setIsCreateTagFormOpen(true)}
              onSyncFeeds={handleSyncFeeds}
              onRefresh={handleRefresh}
            />

            <EventGrid
              key={resetSignal}
              events={loadedEvents}
              loading={false}
              error={null}
              availableTags={availableEventTags}
              onEventUpdate={handleEventUpdate}
              isInteractive={true}
              maxColumns={2}
            />
          </div>
        )}
      </DataLoader>

      {/* Floating Action Button for Batch Updates */}
      <FloatingActionButtons
        pendingChangesCount={pendingChanges.size}
        isSaving={isSaving}
        onSave={handleSaveChanges}
        onDiscard={handleDiscardChanges}
      />

      {/* Create Tag Form */}
      <NewTagForm
        isOpen={isCreateTagFormOpen}
        isEditing={false}
        initialTag={null}
        onSave={handleCreateTag}
        onCancel={handleCreateTagFormClose}
        userId={userId || ''}
      />
    </Container>
  )
} 