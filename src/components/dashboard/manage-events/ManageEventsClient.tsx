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
import { 
  useUserEvents, 
  useCreateTag, 
  useAllTags,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  useSyncAllCalendarFeeds
} from '@/lib/hooks/useAppQuery'
import { Event, Tag } from '@/lib/types'
import { getBrowserTimezone } from '@/lib/utils'
import { convertToEventTag, EventTag } from '@/lib/event-types'
import { convertEventToCardProps } from '@/lib/event-utils'
import { VisibilityFilter } from '@/components/events/EventsControlPanel'
import { useTranslation } from '@/lib/i18n/context'
import { useEventFilters } from '@/lib/hooks/useEventFilters'

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

  // Use the new event filters hook
  const {
    filters,
    availableStudioInfo,
    eventFilters,
    updateTimeFilter,
    toggleStudioFilter,
    clearAllFilters
  } = useEventFilters(userId)

  // Filtering state (legacy compatibility)
  const [visibilityFilter, setVisibilityFilter] = React.useState<VisibilityFilter>('all')

  // Create tag form state
  const [isCreateTagFormOpen, setIsCreateTagFormOpen] = React.useState(false)

  // Create event form state
  const [isCreateEventFormOpen, setIsCreateEventFormOpen] = React.useState(false)

  // Edit event form state
  const [isEditEventFormOpen, setIsEditEventFormOpen] = React.useState(false)
  const [editingEvent, setEditingEvent] = React.useState<EditEventData | null>(null)

  // Data fetching hooks
  const {
    data: events,
    isLoading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents
  } = useUserEvents(userId, eventFilters, { enabled: !!userId })

  const { 
    data: tagsData,
    isLoading: tagsLoading, 
    refetch: refetchTags 
  } = useAllTags(userId, { enabled: !!userId })
  
  const allAvailableTags = React.useMemo(() => {
    return tagsData?.allTags || []
  }, [tagsData?.allTags])

  // Mutation hooks
  const createTagMutation = useCreateTag()
  
  // Handle tag creation with proper data transformation
  const handleCreateTagWithRefetch = React.useCallback((tagData: EventTag) => {
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

    createTagMutation.mutate(dbTag, {
      onSuccess: () => {
        // Refetch tags to update the UI
        refetchTags()
        setIsCreateTagFormOpen(false)
      }
    })
  }, [createTagMutation, refetchTags, userId])


  const createEventMutation = useCreateEvent()
  const updateEventMutation = useUpdateEvent()
  const deleteEventMutation = useDeleteEvent()


  // Convert tags to EventTag format for the grid
  const availableEventTags = React.useMemo(() => {
    return allAvailableTags.map((tag: Tag) => convertToEventTag(tag))
  }, [allAvailableTags])

  // Event filtering and processing
  const applyEventFilters = React.useCallback((eventList: Event[]) => {
    return eventList.filter(event => {
      // Only apply visibility filter client-side (time filter is server-side)
      return !(visibilityFilter !== 'all' && event.visibility !== visibilityFilter);
    })
  }, [visibilityFilter])

  // Convert database events to display events for EventGrid
  const displayEvents = React.useMemo(() => {
    if (!events) return []

    const filteredEvents = applyEventFilters(events)
    
    return filteredEvents.map(event => {
      return convertEventToCardProps(event, allAvailableTags)
    })
  }, [events, allAvailableTags, applyEventFilters])

  // Event handlers
  const handleRefresh = React.useCallback(async () => {
    await refetchEvents()
  }, [refetchEvents])

  const syncCalendarFeedsMutation = useSyncAllCalendarFeeds()
  

  const handleSyncFeeds = React.useCallback(async () => {
    if (!userId) return
    
    try {
      const result = await syncCalendarFeedsMutation.mutateAsync(userId)
      refetchEvents()
      toast.success(t('pages.manageEvents.toast.syncSuccess', {
        successfulSyncs: result.successfulSyncs.toString(),
        totalFeeds: result.totalFeeds.toString(),
        totalEvents: result.totalEvents.toString()
      }))
    } catch (error) {
      console.error('Failed to sync calendar feeds:', error)
      toast.error(t('pages.manageEvents.toast.syncError'))
    }
  }, [userId, syncCalendarFeedsMutation, refetchEvents, t])
  
  // Handle create tag form
  const handleCreateTag = (tagData: EventTag) => {
    handleCreateTagWithRefetch(tagData)
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
        timeZone: getBrowserTimezone()
      },
      end: {
        dateTime: event.end_time || '',
        timeZone: getBrowserTimezone()
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
    const fullEvent = events?.find((e: Event) => e.id === event.id)
    if (fullEvent) {
      handleEditEvent(fullEvent)
    }
  }

  // Unified event handler for both create and edit
  const handleUpdateEvent = async (eventData: CreateEventData | (CreateEventData & { id: string })) => {
    try {
      if ('id' in eventData) {
        // Edit mode - extract id first, then sanitize the rest
        const { id, ...updateData } = eventData
        
        // Ensure dateTime fields are required strings for API compatibility
        const sanitizedUpdateData = {
          ...updateData,
          start: {
            ...updateData.start,
            dateTime: updateData.start.dateTime || ''
          },
          end: {
            ...updateData.end,
            dateTime: updateData.end.dateTime || ''
          }
        }
        
        const updateEventData = {
          eventId: id,
          ...sanitizedUpdateData
        }
        await updateEventMutation.mutateAsync(updateEventData)
        refetchEvents()
        setIsEditEventFormOpen(false)
        setEditingEvent(null)
        toast.success(t('pages.manageEvents.toast.eventUpdated'))
      } else {
        // Create mode - sanitize eventData
        const sanitizedEventData = {
          ...eventData,
          start: {
            ...eventData.start,
            dateTime: eventData.start.dateTime || ''
          },
          end: {
            ...eventData.end,
            dateTime: eventData.end.dateTime || ''
          }
        }
        
        await createEventMutation.mutateAsync(sanitizedEventData)
        refetchEvents()
        setIsCreateEventFormOpen(false)
        toast.success(t('pages.manageEvents.toast.eventCreated'))
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 
        ('id' in eventData ? t('pages.manageEvents.toast.eventUpdateError') : t('pages.manageEvents.toast.eventCreateError'))
      toast.error(errorMessage)
    }
  }

  // Handle delete event
  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEventMutation.mutateAsync(eventId)
      refetchEvents()
      setIsEditEventFormOpen(false)
      setEditingEvent(null)
      toast.success(t('pages.manageEvents.toast.eventDeleted'))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('pages.manageEvents.toast.eventDeleteError')
      toast.error(errorMessage)
    }
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
      <div className="space-y-8">
        {/* Create Event Button */}
        <CreateEventFAB
          onClick={() => setIsCreateEventFormOpen(true)}
        />

        {/* EventsControlPanel - Always visible, even during loading */}
        <EventsControlPanel
          timeFilter={filters.timeFilter}
          visibilityFilter={visibilityFilter}
          eventStats={eventStats}
          userTags={allAvailableTags.filter((tag: Tag) => tag.user_id) || undefined}
          globalTags={allAvailableTags.filter((tag: Tag) => !tag.user_id) || undefined}
          isSyncing={syncCalendarFeedsMutation.isPending}
          isLoading={isLoading}
          userId={userId}
          // Updated filter props - only studio filters now
          studioFilter={filters.studioFilter}
          availableStudioInfo={availableStudioInfo}
          onTimeFilterChange={updateTimeFilter}
          onVisibilityFilterChange={setVisibilityFilter}
          onStudioFilterChange={(studioIds) => {
            // Update the studio filter in the hook
            studioIds.forEach(studioId => {
              if (!filters.studioFilter.includes(studioId)) {
                toggleStudioFilter(studioId)
              }
            })
            // Remove studio IDs not in the new list
            filters.studioFilter.forEach(studioId => {
              if (!studioIds.includes(studioId)) {
                toggleStudioFilter(studioId)
              }
            })
          }}
          onCreateTag={() => setIsCreateTagFormOpen(true)}
          onCreateEvent={() => setIsCreateEventFormOpen(true)}
          onSyncFeeds={handleSyncFeeds}
          onRefresh={handleRefresh}
          onClearAllFilters={clearAllFilters}
        />

        {/* EventGrid with its own loading state */}
        <DataLoader
          data={displayEvents}
          loading={isLoading}
          error={eventsError ? t('pages.manageEvents.loadError') : null}
          skeleton={ManageEventsSkeleton}
          skeletonCount={1}
          empty={
            <EventsEmptyState
              totalEventsCount={events?.length || 0}
              timeFilter={filters.timeFilter}
              visibilityFilter={visibilityFilter}
              onChangeVisibilityFilter={setVisibilityFilter}
              onChangeTimeFilter={updateTimeFilter}
            />
          }
        >
          {(loadedEvents) => (
            <EventGrid
              events={loadedEvents}
              loading={false}
              error={null}
              availableTags={availableEventTags}
              onEventEdit={handleEventGridEdit}
              isInteractive={false}
              maxColumns={2}
            />
          )}
        </DataLoader>
      </div>

      {/* Create Event Form */}
      <NewEventForm
        isOpen={isCreateEventFormOpen}
        onSave={handleUpdateEvent}
        onCancel={handleCreateEventFormClose}
        availableTags={allAvailableTags.filter((tag: Tag) => tag.name && tag.color && tag.slug).map((tag: Tag) => ({
          id: tag.id,
          name: tag.name!,
          color: tag.color!,
          slug: tag.slug!
        }))}
        onCreateTag={handleCreateNewTag}
        isSubmitting={createEventMutation.isPending}
      />

      {/* Edit Event Form */}
      <NewEventForm
        isOpen={isEditEventFormOpen}
        onSave={handleUpdateEvent}
        onCancel={handleEditEventFormClose}
        onDelete={handleDeleteEvent}
        editEvent={editingEvent}
        availableTags={allAvailableTags.filter((tag: Tag) => tag.name && tag.color && tag.slug).map((tag: Tag) => ({
          id: tag.id,
          name: tag.name!,
          color: tag.color!,
          slug: tag.slug!
        }))}
        onCreateTag={handleCreateNewTag}
        isSubmitting={updateEventMutation.isPending || deleteEventMutation.isPending}
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