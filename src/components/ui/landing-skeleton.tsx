import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function FeaturedTeacherSkeleton() {
  return (
    <Card variant="elevated">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl mb-4">
          <Skeleton className="h-8 w-48 mx-auto" />
        </CardTitle>
        <div className="text-lg space-y-2">
          <Skeleton className="h-6 w-96 mx-auto" />
          <Skeleton className="h-6 w-80 mx-auto" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Teacher Profile */}
        <div className="mb-8 flex items-center justify-center">
          <div className="text-center max-w-md">
            <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
            <Skeleton className="h-7 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-48 mx-auto mb-4" />
            <div className="flex justify-center gap-2 mb-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Events Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <Skeleton className="h-6 w-64 mx-auto mb-4" />
          <Skeleton className="h-12 w-48 mx-auto" />
        </div>
      </CardContent>
    </Card>
  )
}

export function EventCardSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <div className="aspect-[4/3] relative">
        <Skeleton className="absolute inset-0" />
        
        {/* Tags overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Date and time */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          
          {/* Title */}
          <Skeleton className="h-6 w-full" />
          
          {/* Location */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function LandingPageSkeleton() {
  return (
    <main className="flex flex-col">
      {/* Hero Section Skeleton */}
      <section className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <Skeleton className="h-6 w-64 mx-auto mb-6" />
            <Skeleton className="h-16 w-full max-w-4xl mx-auto mb-6" />
            <div className="space-y-2 mb-8 max-w-3xl mx-auto">
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-7 w-4/5 mx-auto" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Skeleton className="h-14 w-48" />
              <Skeleton className="h-14 w-36" />
            </div>
            <div className="mt-6">
              <Skeleton className="h-5 w-64 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} variant="glass" className="text-center">
                <CardContent className="p-8">
                  <Skeleton className="w-12 h-12 mx-auto mb-4 rounded-2xl" />
                  <Skeleton className="h-6 w-32 mx-auto mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Teacher Section Skeleton */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedTeacherSkeleton />
        </div>
      </section>
    </main>
  )
} 