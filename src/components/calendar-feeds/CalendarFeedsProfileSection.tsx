'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'
import { ConnectedFeedsList } from './ConnectedFeedsList'
import { CalendarFeedsModal } from './CalendarFeedsModal'
import { type CalendarFeed } from '@/lib/calendar-feeds'

interface CalendarFeedsProfileSectionProps {
  feeds: CalendarFeed[]
  isLoading?: boolean
}

export function CalendarFeedsProfileSection({ 
  feeds, 
  isLoading 
}: CalendarFeedsProfileSectionProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const handleViewDetails = () => {
    setModalOpen(true)
  }

  return (
    <>
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Calendar className="h-5 w-5" />
            Calendar Integration
            {feeds.length > 0 && (
              <Badge variant="secondary">{feeds.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Manage your connected calendar feeds and sync settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConnectedFeedsList
            feeds={feeds}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
          />
        </CardContent>
      </Card>

      <CalendarFeedsModal
        open={modalOpen}
        feeds={feeds}
        onOpenChange={setModalOpen}
      />
    </>
  )
} 