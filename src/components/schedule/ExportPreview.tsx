'use client'

import React from 'react'
import { InstagramStoryExport } from '@/components/export/InstagramStoryExport'
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
      <div 
        id={elementId}
        style={{
          padding: '0',
          margin: '0',
          border: '0',
          borderWidth: '0',
          borderStyle: 'none',
          borderColor: 'transparent',
          outline: '0',
          boxShadow: 'none',
          backgroundColor: 'transparent'
        }}
      >
        <InstagramStoryExport
          events={events}
          tags={[]}
          teacherName={teacherName}
          limitEvents={false}
        />
      </div>
    </div>
  )
} 