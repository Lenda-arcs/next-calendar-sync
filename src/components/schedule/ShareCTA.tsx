'use client'

import React, { useState } from 'react'
import { Download, Share2 } from 'lucide-react'
import { Button, Card, LoadingOverlay } from '@/components/ui'
import { useScheduleFilters } from './FilterProvider'
import { useScheduleExport, useOwnerAuth, useOrigin } from '@/lib/hooks'
import { SHARE_CTA_CONTENT, EXPORT_CONFIG } from '@/lib/constants/export-constants'
import { ExportPreview } from './ExportPreview'
import { ExportOptionsDialog } from '.'
import { ShareDialog } from './ShareDialog'

interface ShareCTAProps {
  currentUserId?: string
  teacherProfileId?: string
  teacherName?: string
  teacherSlug?: string
}

export function ShareCTA({ 
  currentUserId, 
  teacherProfileId, 
  teacherName = 'Teacher',
  teacherSlug
}: ShareCTAProps) {
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

  return (
    <>
      {/* Share CTA Card */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {SHARE_CTA_CONTENT.TITLE}
            </h3>
            <p className="text-sm text-gray-600">
              {canExport 
                ? "Export your filtered events as PNG images or share your schedule link with your community."
                : "Apply filters to see your events and enable export functionality."
              }
            </p>
          </div>
          
          <div className="flex gap-2 sm:flex-shrink-0">
            <Button
              onClick={handleExportClick}
              disabled={!canExport || isExporting}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  {SHARE_CTA_CONTENT.BUTTONS.EXPORTING}
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  {SHARE_CTA_CONTENT.BUTTONS.EXPORT}
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="min-w-[100px]"
              onClick={handleShareClick}
            >
              <Share2 className="h-5 w-5 mr-2" />
              {SHARE_CTA_CONTENT.BUTTONS.SHARE}
            </Button>
          </div>
        </div>
      </Card>

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