'use client'

import React from 'react'
import { ScheduleFilters } from './ScheduleFilters'

export function FiltersWithShare() {
  return (
    <div className="space-y-4 screenshot-hide">
      {/* Filter accordion */}
      <ScheduleFilters />
    </div>
  )
} 