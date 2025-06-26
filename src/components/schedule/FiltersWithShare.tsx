'use client'

import React from 'react'
import { ScheduleFilters } from './ScheduleFilters'
import { ShareCTA } from './ShareCTA'

interface FiltersWithShareProps {
  currentUserId?: string
  teacherProfileId?: string
  teacherName?: string
}

export function FiltersWithShare({ 
  currentUserId, 
  teacherProfileId, 
  teacherName 
}: FiltersWithShareProps) {
  return (
    <div className="space-y-4">
      {/* Share CTA on top for both desktop and mobile */}
      <ShareCTA 
        currentUserId={currentUserId}
        teacherProfileId={teacherProfileId}
        teacherName={teacherName}
      />
      
      {/* Filter accordion below */}
      <ScheduleFilters />
    </div>
  )
} 