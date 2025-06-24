import React from 'react'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from './alert'
import { Card, CardContent } from './card'
import { Skeleton } from './skeleton'

// Default Card Skeleton Component
const DefaultCardSkeleton: React.FC = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[180px]" />
        </div>
      </div>
    </CardContent>
  </Card>
)

interface DataLoaderProps<T> {
  data: T | null
  loading: boolean
  error: string | null
  empty?: React.ReactNode
  children: (data: T) => React.ReactNode
  // Skeleton loading props
  skeleton?: React.ComponentType | React.ReactNode
  skeletonCount?: number
  showSpinner?: boolean // Option to show spinner instead of skeleton
}

export default function DataLoader<T>({
  data,
  loading,
  error,
  empty = <div className="text-center py-8 text-gray-500">No data found</div>,
  children,
  skeleton: SkeletonComponent = DefaultCardSkeleton,
  skeletonCount = 3,
  showSpinner = false,
}: DataLoaderProps<T>) {
  if (loading) {
    // Show traditional spinner if requested
    if (showSpinner) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading...</span>
        </div>
      )
    }

    // Show skeleton loading
    return (
      <div className="space-y-4">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={`skeleton-${index}`}>
            {React.isValidElement(SkeletonComponent) ? (
              SkeletonComponent
            ) : typeof SkeletonComponent === 'function' ? (
              <SkeletonComponent />
            ) : (
              <DefaultCardSkeleton />
            )}
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <>{empty}</>
  }

  return <>{children(data)}</>
} 