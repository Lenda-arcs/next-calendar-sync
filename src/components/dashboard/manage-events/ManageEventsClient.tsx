'use client'

import React from 'react'
import { toast } from 'sonner'
import { Container } from '@/components/layout'
import {
  EventsControlPanel,
  EventsEmptyState,
  NewEventForm,
  CreateEventData,
  EditEventData,
  CreateEventFAB
} from '@/components/events'
import EventGrid from '@/components/events/EventGrid'
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

  // Filtering state
  const [visibilityFilter, setVisibilityFilter] = React.useState<VisibilityFilter>('all')
  const [timeFilter, setTimeFilter] = React.useState<TimeFilter>('future')

  // Create tag form state
  const [isCreateTagFormOpen, setIsCreateTagFormOpen] = React.useState(false)

  // Create event form state
  const [isCreateEventFormOpen, setIsCreateEventFormOpen] = React.useState(false)

  // Edit event form state
  const [isEditEventFormOpen, setIsEditEventFormOpen] = React.useState(false)
  const [editingEvent, setEditingEvent] = React.useState<EditEventData | null>(null)

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

  // Create event mutation
  const createEventMutation = useSupabaseMutation({
    mutationFn: async (supabase, eventData: CreateEventData) => {
      if (!userId) throw new Error('User not authenticated')

      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create event')
      }

      return await response.json()
    },
    onSuccess: () => {
      // Refetch events to update the UI
      refetchEvents()
      setIsCreateEventFormOpen(false)
      toast.success('Event created successfully and synced to Google Calendar!')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create event')
    }
  })

  // Update event mutation
  const updateEventMutation = useSupabaseMutation({
    mutationFn: async (supabase, eventData: CreateEventData & { id: string }) => {
      if (!userId) throw new Error('User not authenticated')

      const response = await fetch('/api/calendar/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: eventData.id,
          summary: eventData.summary,
          description: eventData.description,
          start: eventData.start,
          end: eventData.end,
          location: eventData.location,
          custom_tags: eventData.custom_tags,
          visibility: eventData.visibility
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update event')
      }

      return await response.json()
    },
    onSuccess: () => {
      // Refetch events to update the UI
      refetchEvents()
      setIsEditEventFormOpen(false)
      setEditingEvent(null)
      toast.success('Event updated successfully and synced to Google Calendar!')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update event')
    }
  })

  // Delete event mutation
  const deleteEventMutation = useSupabaseMutation({
    mutationFn: async (supabase, eventId: string) => {
      if (!userId) throw new Error('User not authenticated')

      const response = await fetch(`/api/calendar/events?eventId=${eventId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete event')
      }

      return await response.json()
    },
    onSuccess: () => {
      // Refetch events to update the UI
      refetchEvents()
      setIsEditEventFormOpen(false)
      setEditingEvent(null)
      toast.success('Event deleted successfully!')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete event')
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

      // Visibility filter
      if (visibilityFilter !== 'all' && event.visibility !== visibilityFilter) {
        return false
      }

      return true
    })
  }, [timeFilter, visibilityFilter])

  // Convert database events to display events for EventGrid
  const displayEvents = React.useMemo(() => {
    if (!events) return []

    const filteredEvents = applyEventFilters(events)
    
    return filteredEvents.map(event => {
      return convertEventToCardProps(event, allAvailableTags)
    })
  }, [events, allAvailableTags, applyEventFilters])

  // ==================== EVENT HANDLERS ====================
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

  // Create event handlers
  const handleCreateEventFormClose = () => {
    setIsCreateEventFormOpen(false)
  }

  // Edit event handlers
  const handleEditEvent = (event: Event) => {
    // Convert Event to EditEventData format
    const editData: EditEventData = {
      id: event.id,
      summary: event.title || '',
      description: event.description || '',
      start: {
        dateTime: event.start_time || '',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: event.end_time || '',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      location: event.location || '',
      custom_tags: event.custom_tags || [],
      visibility: (event.visibility as 'public' | 'private') || 'public'
    }
    
    setEditingEvent(editData)
    setIsEditEventFormOpen(true)
  }

  // Wrapper function for EventGrid's onEdit prop
  const handleEventGridEdit = (event: { id: string }) => {
    // Find the full event data from our events array
    const fullEvent = events?.find(e => e.id === event.id)
    if (fullEvent) {
      handleEditEvent(fullEvent)
    }
  }

  // Unified event handler for both create and edit
  const handleUpdateEvent = async (eventData: CreateEventData | (CreateEventData & { id: string })) => {
    if ('id' in eventData) {
      // Edit mode
      await updateEventMutation.mutateAsync(eventData)
    } else {
      // Create mode
      await createEventMutation.mutateAsync(eventData)
    }
  }

  // Handle delete event
  const handleDeleteEvent = async (eventId: string) => {
    await deleteEventMutation.mutateAsync(eventId)
  }

  // Handle create new tag from dialog
  const handleCreateNewTag = () => {
    setIsCreateTagFormOpen(true)
  }

  const handleEditEventFormClose = () => {
    setIsEditEventFormOpen(false)
    setEditingEvent(null)
  }

  // Calculate stats for overview cards
  const eventStats: EventStats = React.useMemo(() => {
    if (!events) return { total: 0, public: 0, private: 0 }
    
    const filteredEvents = applyEventFilters(events)
    
    const publicCount = filteredEvents.filter(event => event.visibility === 'public').length
    const privateCount = filteredEvents.filter(event => event.visibility === 'private').length
    
    return {
      total: filteredEvents.length,
      public: publicCount,
      private: privateCount
    }
  }, [events, applyEventFilters])

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
            {/* Create Event Button */}
            <CreateEventFAB
              onClick={() => setIsCreateEventFormOpen(true)}
            />

            <EventsControlPanel
              timeFilter={timeFilter}
              visibilityFilter={visibilityFilter}
              eventStats={eventStats}
              userTags={allTags.filter(tag => tag.user_id) || undefined}
              globalTags={allTags.filter(tag => !tag.user_id) || undefined}
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
              events={loadedEvents}
              loading={false}
              error={null}
              availableTags={availableEventTags}
              onEventEdit={handleEventGridEdit}
              isInteractive={false}
              maxColumns={2}
            />
          </div>
        )}
      </DataLoader>

      {/* Create Event Form */}
      <NewEventForm
        isOpen={isCreateEventFormOpen}
        onSave={handleUpdateEvent}
        onCancel={handleCreateEventFormClose}
        availableTags={allTags.filter(tag => tag.name && tag.color && tag.slug).map(tag => ({
          id: tag.id,
          name: tag.name!,
          color: tag.color!,
          slug: tag.slug!
        }))}
        onCreateTag={handleCreateNewTag}
        isSubmitting={createEventMutation.isLoading}
      />

      {/* Edit Event Form */}
      <NewEventForm
        isOpen={isEditEventFormOpen}
        onSave={handleUpdateEvent}
        onCancel={handleEditEventFormClose}
        onDelete={handleDeleteEvent}
        editEvent={editingEvent}
        availableTags={allTags.filter(tag => tag.name && tag.color && tag.slug).map(tag => ({
          id: tag.id,
          name: tag.name!,
          color: tag.color!,
          slug: tag.slug!
        }))}
        onCreateTag={handleCreateNewTag}
        isSubmitting={updateEventMutation.isLoading || deleteEventMutation.isLoading}
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