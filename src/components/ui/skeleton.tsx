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

// Manage Events Layout Skeleton - matches the new accordion control panel structure
const ManageEventsSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
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

// Tag Rules Skeleton - matches TagRulesCard structure
const TagRulesSkeleton: React.FC = () => {
  return (
    <Card variant="default">
      <CardContent className="space-y-6 p-6">
        {/* Add New Rule Section Skeleton */}
        <div className="bg-gradient-to-r from-gray-50/50 to-blue-50/30 p-4 rounded-lg border border-gray-200/50">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 px-1">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex-1 sm:flex-initial space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full sm:w-48" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Active Rules Section Skeleton */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
          
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-gray-50/50 to-blue-50/30 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200/50"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                  <Skeleton className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded" />
                  <div className="flex flex-col min-w-0 space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-32 hidden sm:block" />
                  </div>
                </div>
                <Skeleton className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded hidden sm:block" />
                <div className="flex items-center gap-1 sm:gap-2">
                  <Skeleton className="h-3 w-12 hidden sm:block" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Tag Library Grid Skeleton - matches TagLibraryGrid structure
const TagLibraryGridSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Global Tags Section Skeleton */}
      <Card variant="default">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg backdrop-blur-sm bg-white/50 border border-white/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <Skeleton className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-3 rounded-full" />
                        </div>
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Skeleton className="h-7 w-7 rounded" />
                      <Skeleton className="h-7 w-7 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Tags Section Skeleton */}
      <Card variant="default">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg backdrop-blur-sm bg-white/50 border border-white/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <Skeleton className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Skeleton className="h-7 w-7 rounded" />
                      <Skeleton className="h-7 w-7 rounded" />
                    </div>
                  </div>
                </div>
              ))}
              {/* Create button skeleton */}
              <div className="p-4 rounded-lg border-2 border-dashed border-white/40 bg-white/20 flex items-center justify-center min-h-[84px]">
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Dashboard Upcoming Classes Skeleton - matches PrivateEventList structure
const DashboardUpcomingClassesSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col">
          <EventCardSkeleton variant="compact" />
        </div>
      ))}
    </div>
  )
}

// Dashboard Actions Grid Skeleton - matches the action cards layout
const DashboardActionsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} variant="outlined">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Public Event List Skeleton - matches the complex layout structure of public events
const PublicEventListSkeleton: React.FC<{ variant?: 'compact' | 'full' | 'minimal' }> = ({ 
  variant = 'compact' 
}) => {
  const getGridClasses = () => {
    switch (variant) {
      case 'full':
        return 'grid grid-cols-1 md:grid-cols-2 gap-8'
      case 'minimal':
        return 'grid grid-cols-1 md:grid-cols-4 gap-4'
      case 'compact':
      default:
        return 'grid grid-cols-1 md:grid-cols-3 gap-6'
    }
  }

  return (
    <div className="space-y-6">
      {/* Mobile Layout: Grouped by day with headers */}
      <div className="block md:hidden space-y-8">
        {Array.from({ length: 2 }).map((_, dayIndex) => (
          <div key={`mobile-day-${dayIndex}`} className="space-y-4">
            {/* Date Header */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-32" />
              <div className="flex-1 h-px bg-border" />
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Events Grid for Mobile */}
            <div className="grid grid-cols-1 gap-6">
              {Array.from({ length: 2 }).map((_, eventIndex) => (
                <div key={`mobile-event-${dayIndex}-${eventIndex}`} className="flex flex-col">
                  <EventCardSkeleton variant={variant} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Layout: Clean grid with date badges */}
      <div className="hidden md:block">
        <div className={getGridClasses()}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`desktop-${index}`} className="flex flex-col relative">
              {/* Date Badge - show on first event of each "day" */}
              {index % 3 === 0 && (
                <div className="absolute -top-2 -left-2 z-10">
                  <div className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
                    <Skeleton className="h-3 w-12 bg-white/30" />
                  </div>
                </div>
              )}
              <EventCardSkeleton variant={variant} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Full Dashboard Skeleton - matches the complete dashboard layout
const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Upcoming Classes Section */}
      <Card variant="glass">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-6 w-48" />
            </div>
            <DashboardUpcomingClassesSkeleton />
            <div className="text-right">
              <Skeleton className="h-4 w-32 ml-auto" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions Section */}
      <div className="space-y-6">
        <Skeleton className="h-6 w-36" />
        <DashboardActionsSkeleton />
        
        {/* Calendar Integration Section */}
        <div className="mt-6 space-y-4">
          <Card variant="default">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export { 
  Skeleton, 
  EventCardSkeleton,
  InteractiveEventCardSkeleton,
  ManageEventsSkeleton,
  TagRulesSkeleton,
  TagLibraryGridSkeleton,
  PublicEventListSkeleton,
  DashboardUpcomingClassesSkeleton,
  DashboardActionsSkeleton,
  DashboardSkeleton,
  ProfileSkeleton, 
  ListItemSkeleton, 
  TableRowSkeleton 
}
