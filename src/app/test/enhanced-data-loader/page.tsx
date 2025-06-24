'use client'

import React from 'react'
import { Container } from '@/components/layout'
import DataLoader from '@/components/ui/data-loader'
import { ManageEventsSkeleton, InteractiveEventCardSkeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MockEvent {
  id: string
  title: string
  dateTime: string
  location: string
  tags: string[]
}

export default function EnhancedDataLoaderTestPage() {
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState<MockEvent[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const simulateLoad = async () => {
    setLoading(true)
    setError(null)
    setData(null)

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Simulate random success/error
    if (Math.random() > 0.8) {
      setError('Failed to load events')
    } else {
      setData([
        {
          id: '1',
          title: 'Morning Yoga Flow',
          dateTime: '2024-01-15 09:00',
          location: 'Studio A',
          tags: ['Yoga', 'Beginner', 'Morning']
        },
        {
          id: '2',
          title: 'Advanced Pilates',
          dateTime: '2024-01-15 14:00',
          location: 'Studio B',
          tags: ['Pilates', 'Advanced']
        },
        {
          id: '3',
          title: 'Meditation Session',
          dateTime: '2024-01-16 18:00',
          location: 'Zen Room',
          tags: ['Meditation', 'Relaxation']
        }
      ])
    }

    setLoading(false)
  }

  const reset = () => {
    setLoading(false)
    setData(null)
    setError(null)
  }

  return (
    <Container
      title="Enhanced DataLoader Test"
      subtitle="Testing skeleton loading states that match the final loaded components"
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex gap-4 justify-center">
          <Button onClick={simulateLoad} disabled={loading}>
            {loading ? 'Loading...' : 'Simulate Load (3s)'}
          </Button>
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
        </div>

        {/* Manage Events Layout Test */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Events Layout Skeleton</CardTitle>
          </CardHeader>
          <CardContent>
            <DataLoader
              data={data}
              loading={loading}
              error={error}
              skeleton={ManageEventsSkeleton}
              skeletonCount={1}
            >
              {(events) => (
                <div className="space-y-6">
                  {/* Mock Control Panel */}
                  <Card className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Total Events</p>
                            <p className="text-2xl font-bold">{events.length}</p>
                          </div>
                        </Card>
                        <Card className="p-4">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Public</p>
                            <p className="text-2xl font-bold">{Math.floor(events.length * 0.7)}</p>
                          </div>
                        </Card>
                        <Card className="p-4">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Private</p>
                            <p className="text-2xl font-bold">{events.length - Math.floor(events.length * 0.7)}</p>
                          </div>
                        </Card>
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                        <Button variant="outline" size="sm">Time Filter</Button>
                        <Button variant="outline" size="sm">Visibility Filter</Button>
                        <Button variant="outline" size="sm">Refresh</Button>
                        <Button variant="outline" size="sm">Sync</Button>
                      </div>
                    </div>
                  </Card>

                  {/* Mock Events Grid */}
                  <div className="space-y-8">
                    {/* Mobile Layout */}
                    <div className="block md:hidden space-y-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="text-xl font-semibold">Today</div>
                            <div className="text-sm text-muted-foreground">Jan 15</div>
                          </div>
                          <div className="flex-1 h-px bg-border" />
                          <span className="text-sm text-muted-foreground">2 classes</span>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6">
                          {events.slice(0, 2).map((event) => (
                            <Card key={event.id} variant="outlined" className="h-64">
                              <CardContent className="p-4">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">{event.title}</h3>
                                    <p className="text-sm text-muted-foreground">{event.dateTime}</p>
                                    <p className="text-sm text-muted-foreground">{event.location}</p>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-2">
                                    {event.tags.map((tag) => (
                                      <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  
                                  <div className="flex items-center justify-between pt-2">
                                    <span className="text-sm text-muted-foreground">Public</span>
                                    <div className="flex space-x-2">
                                      <Button size="sm" variant="outline">Edit</Button>
                                      <Button size="sm" variant="outline">Tags</Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:block">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {events.map((event, index) => (
                          <div key={event.id} className="flex flex-col relative">
                            {index === 0 && (
                              <div className="absolute -top-2 -left-2 z-10">
                                <div className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
                                  Today
                                </div>
                              </div>
                            )}
                            <Card variant="outlined" className="h-64">
                              <CardContent className="p-4">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">{event.title}</h3>
                                    <p className="text-sm text-muted-foreground">{event.dateTime}</p>
                                    <p className="text-sm text-muted-foreground">{event.location}</p>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-2">
                                    {event.tags.map((tag) => (
                                      <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  
                                  <div className="flex items-center justify-between pt-2">
                                    <span className="text-sm text-muted-foreground">Public</span>
                                    <div className="flex space-x-2">
                                      <Button size="sm" variant="outline">Edit</Button>
                                      <Button size="sm" variant="outline">Tags</Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DataLoader>
          </CardContent>
        </Card>

        {/* Individual Event Card Skeleton Test */}
        <Card>
          <CardHeader>
            <CardTitle>Individual Event Card Skeleton</CardTitle>
          </CardHeader>
          <CardContent>
            <DataLoader
              data={data}
              loading={loading}
              error={error}
              skeleton={InteractiveEventCardSkeleton}
              skeletonCount={3}
            >
              {(events) => (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((event) => (
                    <Card key={event.id} variant="outlined" className="h-64">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h3 className="font-semibold">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">{event.dateTime}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {event.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-sm">Public</span>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost">✏️</Button>
                              <Button size="sm" variant="ghost">🏷️</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </DataLoader>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
} 