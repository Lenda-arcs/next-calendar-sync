import React, { useState } from 'react'
import DataLoader from '../ui/data-loader'
import { 
  EventCardSkeleton, 
  ProfileSkeleton, 
  ListItemSkeleton, 
  TableRowSkeleton 
} from '../ui/skeleton'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface ExampleData {
  id: string
  title: string
  description: string
}

const DataLoaderShowcase: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ExampleData[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const simulateDataLoad = async () => {
    setLoading(true)
    setError(null)
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate data or error
    if (Math.random() > 0.8) {
      setError('Failed to load data')
      setData(null)
    } else {
      setData([
        { id: '1', title: 'Sample Event 1', description: 'This is a sample event description' },
        { id: '2', title: 'Sample Event 2', description: 'Another sample event description' },
        { id: '3', title: 'Sample Event 3', description: 'Yet another sample event description' },
      ])
    }
    
    setLoading(false)
  }

  const reset = () => {
    setData(null)
    setError(null)
    setLoading(false)
  }

  return (
    <div className="space-y-8 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Enhanced DataLoader Examples</h1>
        <div className="space-x-4">
          <Button onClick={simulateDataLoad} disabled={loading}>
            {loading ? 'Loading...' : 'Load Data'}
          </Button>
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Default Card Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>Default Card Skeleton</CardTitle>
          </CardHeader>
          <CardContent>
            <DataLoader
              data={data}
              loading={loading}
              error={error}
              skeletonCount={2}
            >
              {(events) => (
                <div className="space-y-4">
                  {events.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </DataLoader>
          </CardContent>
        </Card>

        {/* Event Card Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>Event Card Skeleton</CardTitle>
          </CardHeader>
          <CardContent>
            <DataLoader
              data={data}
              loading={loading}
              error={error}
              skeleton={EventCardSkeleton}
              skeletonCount={2}
            >
              {(events) => (
                <div className="space-y-4">
                  {events.map((event) => (
                    <Card key={event.id} variant="outlined" className="h-64">
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </DataLoader>
          </CardContent>
        </Card>

        {/* Profile Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Skeleton</CardTitle>
          </CardHeader>
          <CardContent>
            <DataLoader
              data={data}
              loading={loading}
              error={error}
              skeleton={ProfileSkeleton}
              skeletonCount={3}
            >
              {(events) => (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                        {event.title[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DataLoader>
          </CardContent>
        </Card>

        {/* List Item Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>List Item Skeleton</CardTitle>
          </CardHeader>
          <CardContent>
            <DataLoader
              data={data}
              loading={loading}
              error={error}
              skeleton={ListItemSkeleton}
              skeletonCount={4}
            >
              {(events) => (
                <div className="space-y-0 divide-y">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center space-x-3 py-3">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium">{event.id}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{event.title}</h3>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                      </div>
                      <span className="text-xs bg-secondary px-2 py-1 rounded">Active</span>
                    </div>
                  ))}
                </div>
              )}
            </DataLoader>
          </CardContent>
        </Card>

        {/* Traditional Spinner */}
        <Card>
          <CardHeader>
            <CardTitle>Traditional Spinner</CardTitle>
          </CardHeader>
          <CardContent>
            <DataLoader
              data={data}
              loading={loading}
              error={error}
              showSpinner={true}
            >
              {(events) => (
                <div className="space-y-4">
                  {events.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </DataLoader>
          </CardContent>
        </Card>

        {/* Table Row Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>Table Skeleton</CardTitle>
          </CardHeader>
          <CardContent>
            <DataLoader
              data={data}
              loading={loading}
              error={error}
              skeleton={() => <TableRowSkeleton columns={3} />}
              skeletonCount={5}
            >
              {(events) => (
                <div className="space-y-0">
                  <div className="flex items-center space-x-4 py-2 border-b font-medium text-sm">
                    <div className="w-1/4">ID</div>
                    <div className="w-1/3">Title</div>
                    <div className="w-1/6">Status</div>
                  </div>
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center space-x-4 py-3 border-b">
                      <div className="w-1/4 text-sm">{event.id}</div>
                      <div className="w-1/3 text-sm">{event.title}</div>
                      <div className="w-1/6">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DataLoader>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DataLoaderShowcase 