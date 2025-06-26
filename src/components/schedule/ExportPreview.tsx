'use client'

import React from 'react'
import { InstagramStoryExport } from '@/components/events/InstagramStoryExport'
import { PublicEvent } from '@/lib/types'

interface ExportPreviewProps {
  isVisible: boolean
  events: PublicEvent[]
  teacherName: string
  elementId?: string
}

export function ExportPreview({ 
  isVisible, 
  events, 
  teacherName, 
  elementId = 'instagram-story-export' 
}: ExportPreviewProps) {
  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed -top-[2000px] -left-[1200px] z-[-1]" aria-hidden="true">
      <div id={elementId}>
        <InstagramStoryExport
          events={events.slice(0, 4)} // Limit to 4 events for better layout
          tags={[]} // We could fetch tags here or pass them as prop
          teacherName={teacherName}
        />
      </div>
    </div>
  )
} 