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
  Eye, 
  EyeOff,
  Plus,
  RefreshCw,
  Loader2,
  Save,
  X,
  Filter
} from 'lucide-react'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { Event, Tag as TagType } from '@/lib/types'
import { convertToEventTag } from '@/lib/event-types'
import { convertEventToCardProps } from '@/lib/event-utils'
import { createBrowserClient } from '@supabase/ssr'
import { cn } from '@/lib/utils'

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

type VisibilityFilter = 'all' | 'public' | 'private'
type TimeFilter = 'future' | 'all'

// Metadata is handled by the layout since this is a client component

export default function ManageEventsPage() {
  // ==================== SETUP & STATE ====================
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Authentication state
  const [userId, setUserId] = React.useState<string | null>(null)
  const [authLoading, setAuthLoading] = React.useState(true)
  
  // Event management state
  const [pendingChanges, setPendingChanges] = React.useState<Map<string, PendingEventUpdate>>(new Map())
  const [isSaving, setIsSaving] = React.useState(false)

  // Filtering state
  const [visibilityFilter, setVisibilityFilter] = React.useState<VisibilityFilter>('all')
  const [timeFilter, setTimeFilter] = React.useState<TimeFilter>('future')

  // UI state
  const [resetSignal, setResetSignal] = React.useState(0)

  // ==================== AUTHENTICATION ====================
  React.useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUserId(session?.user.id || null)
      setAuthLoading(false)
    }
    getSession()
  }, [supabase.auth])

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

  // ==================== COMPUTED DATA ====================
  // Combine user and global tags
  const allAvailableTags = [...(userTags || []), ...(globalTags || [])]

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
    if (!events || !allAvailableTags.length) return []

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

          {/* Filter & Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filter Controls */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">Time:</span>
                  <div className="flex flex-wrap gap-1">
                    <Button
                      variant={timeFilter === 'future' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeFilter('future')}
                    >
                      Future Events
                    </Button>
                    <Button
                      variant={timeFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeFilter('all')}
                    >
                      All Events
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">Visibility:</span>
                  <div className="flex flex-wrap gap-1">
                    <Button
                      variant={visibilityFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVisibilityFilter('all')}
                    >
                      All <span className="md:hidden">({eventStats.total})</span>
                    </Button>
                    <Button
                      variant={visibilityFilter === 'public' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVisibilityFilter('public')}
                    >
                      Public Only <span className="md:hidden">({eventStats.public})</span>
                    </Button>
                    <Button
                      variant={visibilityFilter === 'private' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVisibilityFilter('private')}
                    >
                      Private Only <span className="md:hidden">({eventStats.private})</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Overview Stats - Hidden on mobile */}
              <div className="hidden md:grid grid-cols-3 gap-4 pt-2 border-t border-border">
                <div 
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md",
                    visibilityFilter === 'all' 
                      ? "bg-blue-50 border-blue-200 ring-2 ring-blue-500 ring-opacity-50" 
                      : "bg-muted/50 hover:bg-muted"
                  )}
                  onClick={() => setVisibilityFilter('all')}
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                      <p className="text-2xl font-bold">{eventStats.total}</p>
                    </div>
                  </div>
                </div>

                <div 
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md",
                    visibilityFilter === 'public' 
                      ? "bg-green-50 border-green-200 ring-2 ring-green-500 ring-opacity-50" 
                      : "bg-muted/50 hover:bg-muted"
                  )}
                  onClick={() => setVisibilityFilter('public')}
                >
                  <div className="flex items-center space-x-3">
                    <Eye className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Public</p>
                      <p className="text-2xl font-bold">{eventStats.public}</p>
                    </div>
                  </div>
                </div>

                <div 
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md",
                    visibilityFilter === 'private' 
                      ? "bg-orange-50 border-orange-200 ring-2 ring-orange-500 ring-opacity-50" 
                      : "bg-muted/50 hover:bg-muted"
                  )}
                  onClick={() => setVisibilityFilter('private')}
                >
                  <div className="flex items-center space-x-3">
                    <EyeOff className="h-6 w-6 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Private</p>
                      <p className="text-2xl font-bold">{eventStats.private}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {(events?.length || 0) === 0 
                    ? "No events found" 
                    : "No events match your filters"
                  }
                </h3>
                <p className="text-muted-foreground mb-6">
                  {(events?.length || 0) === 0 
                    ? "Connect your calendar feeds to start importing events."
                    : timeFilter === 'future' && visibilityFilter !== 'all'
                      ? `Try changing your filters to see ${visibilityFilter === 'public' ? 'private' : 'public'} events or past events.`
                      : timeFilter === 'future'
                        ? "Try changing the time filter to see all events including past ones."
                        : "Try changing the visibility filter to see all events."
                  }
                </p>
                {(events?.length || 0) === 0 ? (
                  <Button asChild>
                    <a href="/app/add-calendar">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Calendar Feed
                    </a>
                  </Button>
                ) : (
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" onClick={() => setVisibilityFilter('all')}>
                      Show All Visibility
                    </Button>
                    <Button variant="outline" onClick={() => setTimeFilter('all')}>
                      Show All Time
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <EventGrid
            key={resetSignal}
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
              title="Discard all pending changes"
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