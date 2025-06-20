'use client'

import React from 'react'
import { Container } from '@/components/layout'
import { PageSection } from '@/components/layout'
import EventGrid from '@/components/events/EventGrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Settings, 
  Calendar, 
  Tag, 
  Eye, 
  EyeOff,
  Plus,
  RefreshCw,
  Loader2,
  Save,
  X
} from 'lucide-react'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { Event, Tag as TagType } from '@/lib/types'
import { convertToEventTag } from '@/lib/event-types'
import { convertEventToCardProps } from '@/lib/event-utils'
import { createBrowserClient } from '@supabase/ssr'
import { cn } from '@/lib/utils'

// Type for tracking pending changes
interface PendingEventUpdate {
  id: string
  tags: string[]
  visibility: string
}

// Metadata is handled by the layout since this is a client component

export default function ManageEventsPage() {
  // Get current user ID from auth session
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [userId, setUserId] = React.useState<string | null>(null)
  const [authLoading, setAuthLoading] = React.useState(true)
  
  // State for tracking pending changes
  const [pendingChanges, setPendingChanges] = React.useState<Map<string, PendingEventUpdate>>(new Map())
  const [isSaving, setIsSaving] = React.useState(false)

  // Get user session
  React.useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUserId(session?.user.id || null)
      setAuthLoading(false)
    }
    getSession()
  }, [supabase.auth])

  // Fetch events using the custom hook
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

  // Fetch user tags using the custom hook
  const {
    data: userTags,
    isLoading: userTagsLoading,
  } = useSupabaseQuery<TagType[]>({
    queryKey: ['user_tags', userId || 'no-user'],
    fetcher: async (supabase) => {
      if (!userId) return []
      
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', userId)
        .order('priority', { ascending: false, nullsLast: true })
      
      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })

  // Fetch global tags using the custom hook
  const {
    data: globalTags,
    isLoading: globalTagsLoading,
  } = useSupabaseQuery<TagType[]>({
    queryKey: ['global_tags'],
    fetcher: async (supabase) => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .is('user_id', null)
        .order('priority', { ascending: false, nullsLast: true })
      
      if (error) throw error
      return data || []
    },
  })

  // Get all available tags for processing
  const allAvailableTags = [...(userTags || []), ...(globalTags || [])]

  // Convert database events to display events for EventGrid using centralized utility
  const displayEvents = React.useMemo(() => {
    if (!events || !allAvailableTags.length) return []

    return events.map(event => {
      // Check if there are pending changes for this event
      const pendingUpdate = pendingChanges.get(event.id)
      
      // If there are pending changes, create a modified event object
      const eventToConvert = pendingUpdate ? {
        ...event,
        tags: pendingUpdate.tags,
        visibility: pendingUpdate.visibility
      } : event

      return convertEventToCardProps(eventToConvert, allAvailableTags)
    })
  }, [events, allAvailableTags, pendingChanges])

  // Convert tags to EventTag format for the grid
  const availableEventTags = React.useMemo(() => {
    return allAvailableTags.map(tag => convertToEventTag(tag))
  }, [allAvailableTags])

  // Handle event changes locally (no immediate DB update)
  const handleEventUpdate = React.useCallback((updates: {
    id: string
    tags: string[]
    visibility: string
  }) => {
    setPendingChanges(prev => {
      const newChanges = new Map(prev)
      newChanges.set(updates.id, updates)
      return newChanges
    })
  }, [])

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
    setPendingChanges(new Map())
  }, [])

  const handleRefresh = React.useCallback(async () => {
    await refetchEvents()
  }, [refetchEvents])

  // Calculate stats (using original data, not pending changes)
  const publicEventsCount = events?.filter(event => event.visibility === 'public').length || 0
  const privateEventsCount = events?.filter(event => event.visibility === 'private').length || 0
  const totalEventsCount = events?.length || 0

  // Check if there are pending changes
  const hasPendingChanges = pendingChanges.size > 0

  // Loading state
  const isLoading = authLoading || eventsLoading || userTagsLoading || globalTagsLoading

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-destructive">Authentication required</p>
          <p className="text-sm text-muted-foreground">Please sign in to manage your events.</p>
        </div>
      </div>
    )
  }

  if (eventsError) {
    return (
      <Container maxWidth="4xl" className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <p className="text-lg font-medium text-destructive mb-2">Failed to load events</p>
          <p className="text-sm text-muted-foreground mb-4">{eventsError.message}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
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
                {hasPendingChanges && (
                  <span className="ml-2 text-amber-600 font-medium">
                    • {pendingChanges.size} unsaved change{pendingChanges.size !== 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </div>
            <Button 
              onClick={handleRefresh}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
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
                    <p className="text-2xl font-bold">{totalEventsCount}</p>
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
                    <p className="text-2xl font-bold">{(userTags?.length || 0) + (globalTags?.length || 0)}</p>
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
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Available Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {userTags?.map(tag => (
                    <Badge 
                      key={tag.id} 
                      variant="secondary"
                      style={{ 
                        backgroundColor: tag.color ? `${tag.color}20` : '#f0f0f0', 
                        color: tag.color || '#666' 
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                  {globalTags?.map(tag => (
                    <Badge 
                      key={tag.id} 
                      variant="secondary"
                      style={{ 
                        backgroundColor: tag.color ? `${tag.color}20` : '#f0f0f0', 
                        color: tag.color || '#666' 
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">Loading events...</p>
            </div>
          </div>
        ) : displayEvents.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
                <p className="text-muted-foreground mb-6">
                  Connect your calendar feeds to start importing events.
                </p>
                <Button asChild>
                  <a href="/app/add-calendar">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Calendar Feed
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <EventGrid
            events={displayEvents}
            loading={isLoading}
            error={eventsError}
            availableTags={availableEventTags}
            onEventUpdate={handleEventUpdate}
            isInteractive={true}
            maxColumns={2}
          />
        )}
      </PageSection>

      {/* Floating Action Button for Batch Updates */}
      {hasPendingChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex flex-col gap-2">
            {/* Discard button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDiscardChanges}
              className="bg-background shadow-lg border-2"
              disabled={isSaving}
            >
              <X className="h-4 w-4" />
            </Button>
            
            {/* Save button */}
            <Button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className={cn(
                "shadow-lg min-w-[120px] transition-all duration-200",
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                isSaving && "bg-primary/50"
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save {pendingChanges.size} Change{pendingChanges.size !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </Container>
  )
} 