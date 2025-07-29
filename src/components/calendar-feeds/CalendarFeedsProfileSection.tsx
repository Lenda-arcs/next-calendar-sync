'use client'

import {useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {Calendar} from 'lucide-react'
import {CalendarFeedsModal, ConnectedFeedsList} from '@/components'
import {type CalendarFeed} from '@/lib/calendar-feeds'
import {useTranslationNamespace} from '@/lib/i18n/context'

interface CalendarFeedsProfileSectionProps {
  feeds: CalendarFeed[]
  isLoading?: boolean
}

export function CalendarFeedsProfileSection({ 
  feeds, 
  isLoading 
}: CalendarFeedsProfileSectionProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { t } = useTranslationNamespace('calendar')

  const handleViewDetails = () => {
    setModalOpen(true)
  }

  return (
    <>
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Calendar className="h-5 w-5" />
            {t('integration.title')}
            {feeds.length > 0 && (
              <Badge variant="secondary">{feeds.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            {t('integration.description')}
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