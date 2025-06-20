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
  RefreshCw
} from 'lucide-react'

// Metadata is handled by the layout since this is a client component

// Mock data for development - replace with actual data fetching
const mockEvents = [
  {
    id: '1',
    title: 'Morning Vinyasa Flow',
    dateTime: 'Today, 8:00 AM',
    location: 'Studio A',
    imageQuery: 'yoga vinyasa flow morning',
    tags: [
      {
        id: 'tag1',
        name: 'Vinyasa',
        color: '#8B5CF6',
        chip: { color: '#8B5CF6' },
        classType: ['Vinyasa'],
        audience: ['Intermediate']
      }
    ],
    start_time: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Gentle Restorative Yoga',
    dateTime: 'Tomorrow, 6:30 PM',
    location: 'Studio B',
    imageQuery: 'restorative yoga gentle evening',
    tags: [
      {
        id: 'tag2',
        name: 'Restorative',
        color: '#10B981',
        chip: { color: '#10B981' },
        classType: ['Restorative'],
        audience: ['Beginner', 'All Levels']
      }
    ],
    start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }
]

const mockAvailableTags = [
  {
    id: 'tag1',
    name: 'Vinyasa',
    color: '#8B5CF6',
    chip: { color: '#8B5CF6' },
    classType: ['Vinyasa'],
    audience: ['Intermediate']
  },
  {
    id: 'tag2',
    name: 'Restorative',
    color: '#10B981',
    chip: { color: '#10B981' },
    classType: ['Restorative'],
    audience: ['Beginner', 'All Levels']
  },
  {
    id: 'tag3',
    name: 'Hatha',
    color: '#F59E0B',
    chip: { color: '#F59E0B' },
    classType: ['Hatha'],
    audience: ['All Levels']
  },
  {
    id: 'tag4',
    name: 'Power Yoga',
    color: '#EF4444',
    chip: { color: '#EF4444' },
    classType: ['Power'],
    audience: ['Advanced']
  },
  {
    id: 'tag5',
    name: 'Yin Yoga',
    color: '#6366F1',
    chip: { color: '#6366F1' },
    classType: ['Yin'],
    audience: ['All Levels']
  }
]

export default function ManageEventsPage() {
  const [events, setEvents] = React.useState(mockEvents)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error] = React.useState<Error | null>(null)

  const handleEventUpdate = React.useCallback((updates: {
    id: string
    tags: string[]
    visibility: string
  }) => {
    console.log('Event update:', updates)
    // Here you would typically make an API call to update the event
    // For now, we'll just log it
    
    // Optionally update local state
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === updates.id 
          ? { 
              ...event, 
              // Update with new tag IDs if needed
              tags: updates.tags.map(tagId => 
                mockAvailableTags.find(tag => tag.id === tagId)
              ).filter(Boolean) as typeof event.tags
            }
          : event
      )
    )
  }, [])

  const handleRefresh = React.useCallback(() => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Optionally refetch data here
    }, 1000)
  }, [])

  const publicEventsCount = events.length // Mock - in real app, count based on visibility
  const privateEventsCount = 0 // Mock

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
                    <p className="text-2xl font-bold">{mockAvailableTags.length}</p>
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
                  {mockAvailableTags.map(tag => (
                    <Badge 
                      key={tag.id} 
                      variant="secondary"
                      style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
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

          <EventGrid
            events={events}
            loading={isLoading}
            error={error}
            variant="compact"
            isInteractive={true}
            availableTags={mockAvailableTags}
            onEventUpdate={handleEventUpdate}
            maxColumns={2}
            className="pb-8"
          />
        </div>
      </PageSection>
    </Container>
  )
} 