import { cn } from "@/lib/utils"
import { Card, CardContent } from "./card"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

// Event Card Skeleton for loading states
const EventCardSkeleton: React.FC<{ variant?: 'compact' | 'full' | 'minimal' }> = ({ 
  variant = 'compact' 
}) => {
  const getHeight = () => {
    switch (variant) {
      case 'minimal':
        return 'h-32'
      case 'full':
        return 'h-80'
      case 'compact':
      default:
        return 'h-64'
    }
  }

  return (
    <Card variant="outlined" className={cn('animate-pulse', getHeight())}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
          {variant === 'full' && (
            <>
              <Skeleton className="h-32 w-full rounded" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Interactive Event Card Skeleton that matches the manage-events layout
const InteractiveEventCardSkeleton: React.FC<{ variant?: 'compact' | 'full' | 'minimal' }> = ({ 
  variant = 'compact' 
}) => {
  const getHeight = () => {
    switch (variant) {
      case 'minimal':
        return 'h-32'
      case 'full':
        return 'h-80'
      case 'compact':
      default:
        return 'h-64'
    }
  }

  return (
    <Card variant="outlined" className={cn('animate-pulse', getHeight())}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Title and date */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          
          {/* Tags area */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          
          {/* Bottom section with visibility and controls */}
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-4 w-20" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Manage Events Layout Skeleton - matches the complete layout structure
const ManageEventsSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Control Panel Skeleton */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-12" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-12" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-12" />
              </div>
            </Card>
          </div>
          
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </Card>

      {/* Events Grid Skeleton - Mobile Layout */}
      <div className="block md:hidden space-y-8">
        {Array.from({ length: 2 }).map((_, dayIndex) => (
          <div key={`mobile-day-${dayIndex}`} className="space-y-4">
            {/* Date Header */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 space-y-1">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex-1 h-px bg-border" />
              <Skeleton className="h-4 w-16" />
            </div>
            
            {/* Events for this day */}
            <div className="grid grid-cols-1 gap-6">
              {Array.from({ length: 2 }).map((_, eventIndex) => (
                <InteractiveEventCardSkeleton key={`mobile-event-${dayIndex}-${eventIndex}`} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Events Grid Skeleton - Desktop Layout */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`desktop-event-${index}`} className="flex flex-col relative">
              {index === 0 && (
                <div className="absolute -top-2 -left-2 z-10">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              )}
              <InteractiveEventCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Profile Skeleton
const ProfileSkeleton: React.FC = () => (
  <div className="flex items-center space-x-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
)

// List Item Skeleton
const ListItemSkeleton: React.FC = () => (
  <div className="flex items-center space-x-3 py-3">
    <Skeleton className="h-8 w-8 rounded" />
    <div className="space-y-1 flex-1">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-6 w-16" />
  </div>
)

// Table Row Skeleton
const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => (
  <div className="flex items-center space-x-4 py-3 border-b">
    {Array.from({ length: columns }).map((_, index) => (
      <Skeleton 
        key={index} 
        className={cn(
          "h-4",
          index === 0 && "w-1/4",
          index === 1 && "w-1/3", 
          index === 2 && "w-1/6",
          index >= 3 && "w-20"
        )}
      />
    ))}
  </div>
)

export { 
  Skeleton, 
  EventCardSkeleton,
  InteractiveEventCardSkeleton,
  ManageEventsSkeleton,
  ProfileSkeleton, 
  ListItemSkeleton, 
  TableRowSkeleton 
}
