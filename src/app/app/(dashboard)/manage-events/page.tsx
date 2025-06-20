'use client'

import React from 'react'
import { Container } from '@/components/layout'
import { PageSection } from '@/components/layout'
import EventGrid from '@/components/events/EventGrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { useEventsStore, useTagsStore, useUserStore } from '@/lib/stores'
import { 
  Settings, 
  Calendar, 
  Tag, 
  Eye, 
  EyeOff,
  Plus,
  RefreshCw
} from 'lucide-react'

// Metadata is handled by the layout since this is a client component

export default function ManageEventsPage() {
  const { 
    enhancedEvents: events, 
    loading: eventsLoading, 
    error: eventsError,
    updateEventTags,
    updateEventVisibility,
    fetchEvents
  } = useEventsStore()
  
  const { 
    eventTags: availableTags, 
    loading: tagsLoading, 
    error: tagsError,
    fetchTags,
    fetchTagRules
  } = useTagsStore()

  const { user } = useUserStore()

  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // Debug logging
  React.useEffect(() => {
    console.log('Manage Events Page - Events:', events.length, events)
    console.log('Manage Events Page - Available Tags:', availableTags.length, availableTags)
    console.log('Manage Events Page - User:', user)
    console.log('Manage Events Page - Loading states:', { eventsLoading, tagsLoading })
    console.log('Manage Events Page - Errors:', { eventsError, tagsError })
  }, [events, availableTags, user, eventsLoading, tagsLoading, eventsError, tagsError])

  const handleEventUpdate = React.useCallback(async (updates: {
    id: string
    tags: string[]
    visibility: string
  }) => {
    try {
      // Handle tag updates
      if (updates.tags) {
        await updateEventTags(updates.id, updates.tags)
      }
      
      // Handle visibility updates
      const isPublic = updates.visibility === 'public'
      await updateEventVisibility(updates.id, isPublic)
    } catch (error) {
      console.error('Error updating event:', error)
    }
  }, [updateEventTags, updateEventVisibility])

  const handleRefresh = React.useCallback(async () => {
    if (!user) return
    
    setIsRefreshing(true)
    try {
      await Promise.all([
        fetchEvents(user.id),
        fetchTags(user.id),
        fetchTagRules(user.id)
      ])
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [user, fetchEvents, fetchTags, fetchTagRules])

  const isLoading = eventsLoading || tagsLoading
  const error = eventsError || tagsError

  // Convert enhanced events to BaseEventForGrid format
  const gridEvents = React.useMemo(() => {
    return events.map(event => ({
      id: event.id,
      title: event.title || 'Untitled Event',
      dateTime: event.dateTime,
      location: event.location,
      imageQuery: event.imageQuery,
      tags: event.processedTags, // Use the processed tags instead of raw database tags
      start_time: event.start_time
    }))
  }, [events])

  // Calculate stats
  const publicEventsCount = events.filter(event => event.isPublic).length
  const privateEventsCount = events.filter(event => !event.isPublic).length

  if (isLoading && events.length === 0) {
    return (
      <Container maxWidth="4xl" className="px-4 sm:px-6 lg:px-8">
        <PageSection>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          </div>
        </PageSection>
      </Container>
    )
  }

  if (error && events.length === 0) {
    return (
      <Container maxWidth="4xl" className="px-4 sm:px-6 lg:px-8">
        <PageSection>
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Error Loading Events</h1>
            <p className="text-foreground/70">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </PageSection>
      </Container>
    )
  }

  return (
    <Container maxWidth="4xl" className="px-4 sm:px-6 lg:px-8">
      <PageSection>
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Manage Events</h1>
              <p className="text-muted-foreground mt-2">
                Edit tags, manage visibility, and organize your classes
              </p>
            </div>
            <Button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Total Events</p>
                    <p className="text-2xl font-bold">{events.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Public</p>
                    <p className="text-2xl font-bold">{publicEventsCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <EyeOff className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Private</p>
                    <p className="text-2xl font-bold">{privateEventsCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Available Tags</p>
                    <p className="text-2xl font-bold">{availableTags.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Tag
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Make All Public
                </Button>
                <Button variant="outline" size="sm">
                  <EyeOff className="h-4 w-4 mr-2" />
                  Make All Private
                </Button>
              </div>
              
              {availableTags.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Available Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <Badge 
                        key={tag.id} 
                        variant="secondary"
                        style={{ backgroundColor: `${tag.color || '#3b82f6'}20`, color: tag.color || '#3b82f6' }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Events Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Events</h2>
            <p className="text-sm text-muted-foreground">
              Click on events to edit tags and visibility
            </p>
          </div>

          {gridEvents.length > 0 ? (
            <EventGrid
              events={gridEvents}
              loading={isLoading}
              error={error ? new Error(error) : null}
              variant="compact"
              isInteractive={true}
              availableTags={availableTags}
              onEventUpdate={handleEventUpdate}
              maxColumns={2}
              className="pb-8"
            />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-foreground mb-2">No Events Found</h3>
              <p className="text-foreground/70 mb-4">
                You don&apos;t have any events yet. Connect your calendar feeds to start managing events.
              </p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Events
              </Button>
            </div>
          )}
        </div>
      </PageSection>
    </Container>
  )
} 