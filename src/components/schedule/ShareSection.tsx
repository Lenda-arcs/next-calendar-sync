'use client'

import React, { useState } from 'react'
import { Download, Share2 } from 'lucide-react'
import { LoadingOverlay } from '@/components/ui'
import { useScheduleFilters } from './FilterProvider'
import { useScheduleExport, useOwnerAuth, useOrigin } from '@/lib/hooks'
import { SHARE_CTA_CONTENT, EXPORT_CONFIG } from '@/lib/constants/export-constants'
import { ExportPreview } from './ExportPreview'
import { ExportOptionsDialog } from './ExportOptionsDialog'
import { ShareDialog } from './ShareDialog'
import { InfoCardSection } from '@/components/events/shared/InfoCardSection'

interface ShareSectionProps {
  currentUserId?: string
  teacherProfileId?: string
  teacherName?: string
  teacherSlug?: string
}

export function ShareSection({ 
  currentUserId, 
  teacherProfileId, 
  teacherName = 'Teacher',
  teacherSlug
}: ShareSectionProps) {
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const { filteredEvents } = useScheduleFilters()
  const { isOwner } = useOwnerAuth({ currentUserId, teacherProfileId })
  const { handleExport, isExporting, showExportPreview, canExport } = useScheduleExport({
    teacherName,
    events: filteredEvents
  })
  const origin = useOrigin()
  
  // Don't render if not owner
  if (!isOwner) {
    return null
  }

  // Generate the share URL
  const shareUrl = teacherSlug ? `${origin}/schedule/${teacherSlug}` : window.location.href

  const handleExportClick = () => {
    setShowExportDialog(true)
  }

  const handlePngExport = () => {
    setShowExportDialog(false)
    handleExport()
  }

  const handleShareClick = () => {
    setShowShareDialog(true)
  }

  const colorScheme = {
    background: 'bg-gradient-to-br from-blue-50/80 to-blue-100/40',
    border: 'border-blue-200/80',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
    descriptionColor: 'text-blue-700/90',
    buttonBase: 'bg-blue-100 hover:bg-blue-200',
    buttonHover: 'hover:bg-blue-200',
    buttonText: 'text-blue-800',
    buttonBorder: 'border-blue-300'
  }

  return (
    <>
      <InfoCardSection
        title={SHARE_CTA_CONTENT.TITLE}
        count={filteredEvents.length}
        description={canExport 
          ? "Export your filtered events as PNG images or share your schedule link with your community."
          : "Apply filters to see your events and enable export functionality."
        }
        mobileDescription={canExport 
          ? "Export events as images or share your schedule link."
          : "Apply filters to enable export."
        }
        icon={Share2}
        colorScheme={colorScheme}
        actions={[]}
        layout="vertical"
        additionalContent={
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <button
              onClick={handleExportClick}
              disabled={!canExport || isExporting}
              className={`
                px-4 py-2.5 rounded-md font-medium text-sm w-full
                flex items-center justify-center gap-2
                transition-colors duration-200
                bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 shadow-sm
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isExporting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isExporting ? SHARE_CTA_CONTENT.BUTTONS.EXPORTING : SHARE_CTA_CONTENT.BUTTONS.EXPORT}
            </button>
            
            <button
              onClick={handleShareClick}
              className={`
                px-4 py-2.5 rounded-md font-medium text-sm w-full
                flex items-center justify-center gap-2
                transition-colors duration-200
                border border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 shadow-sm
              `}
            >
              <Share2 className="h-4 w-4" />
              {SHARE_CTA_CONTENT.BUTTONS.SHARE}
            </button>
          </div>
        }
      />

      {/* Export preview component */}
      <ExportPreview
        isVisible={showExportPreview}
        events={filteredEvents}
        teacherName={teacherName}
        elementId={EXPORT_CONFIG.EXPORT_ELEMENT_ID}
      />

      {/* Loading overlay */}
      <LoadingOverlay
        isVisible={isExporting}
        message={EXPORT_CONFIG.EXPORT_MESSAGES.EXPORTING}
      />

      {/* Export Options Dialog */}
      <ExportOptionsDialog
        isOpen={showExportDialog}
        onOpenChange={setShowExportDialog}
        onPngExport={handlePngExport}
        isExporting={isExporting}
        events={filteredEvents}
      />

      {/* Share Dialog */}
      <ShareDialog
        isOpen={showShareDialog}
        onOpenChange={setShowShareDialog}
        url={shareUrl}
        title={`${teacherName}'s Yoga Schedule`}
        description={`Check out ${teacherName}'s upcoming yoga classes and join for a session!`}
      />
    </>
  )
} 