'use client'

import { useState } from 'react'
import { useEventExport } from './useEventExport'
import { EXPORT_CONFIG } from '@/lib/constants/export-constants'
import { PublicEvent } from '@/lib/types'

interface UseScheduleExportProps {
  teacherName: string
  events: PublicEvent[]
}

export function useScheduleExport({ teacherName, events }: UseScheduleExportProps) {
  const [showExportPreview, setShowExportPreview] = useState(false)
  const { exportAsImage, isExporting } = useEventExport({ teacherName })

  const handleExport = async () => {
    if (events.length === 0) {
      alert(EXPORT_CONFIG.EXPORT_MESSAGES.NO_EVENTS)
      return
    }

    try {
      setShowExportPreview(true)
      
      // Add a small delay to let the DOM render
      setTimeout(() => {
        exportAsImage(EXPORT_CONFIG.EXPORT_ELEMENT_ID)
        setShowExportPreview(false)
      }, EXPORT_CONFIG.RENDER_DELAY_MS)
    } catch (error) {
      console.error(EXPORT_CONFIG.EXPORT_MESSAGES.EXPORT_FAILED, error)
      setShowExportPreview(false)
    }
  }

  return {
    handleExport,
    isExporting,
    showExportPreview,
    canExport: events.length > 0
  }
} 