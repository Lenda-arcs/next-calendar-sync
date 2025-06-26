'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, RefreshCw, Plus } from 'lucide-react'

interface UnmatchedEvent {
  id: string
  location?: string | null
  // Add other event properties as needed
}

interface UnmatchedEventsSectionProps {
  unmatchedEvents: UnmatchedEvent[]
  isLoading: boolean
  onRefresh: () => void
  onCreateStudio: () => void
}

export function UnmatchedEventsSection({ 
  unmatchedEvents, 
  isLoading, 
  onRefresh, 
  onCreateStudio 
}: UnmatchedEventsSectionProps) {
  if (!unmatchedEvents || unmatchedEvents.length === 0) {
    return null
  }

  return (
    <Card className="bg-orange-50/50 border-orange-200">
      <CardContent className="py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-5 w-5 text-orange-600" />
              <h4 className="text-sm font-medium text-orange-900">
                Unmatched Events ({unmatchedEvents.length})
              </h4>
            </div>
            <p className="text-xs text-orange-700 mb-3">
              These events don&apos;t have a studio assigned yet. Create studio profiles to automatically match events and generate invoices.
            </p>
            
            {/* Show first few event locations as examples */}
            <div className="flex flex-wrap gap-1">
              {Array.from(new Set(
                unmatchedEvents
                  .map(event => event.location)
                  .filter(Boolean)
                  .slice(0, 3)
              )).map((location, index) => (
                <span key={index} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                  {location}
                </span>
              ))}
              {unmatchedEvents.filter(e => e.location).length > 3 && (
                <span className="text-xs text-orange-600">
                  +{unmatchedEvents.filter(e => e.location).length - 3} more locations
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
            <Button 
              onClick={onCreateStudio}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white whitespace-nowrap"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Studio
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 