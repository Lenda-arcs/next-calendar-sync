'use client'

import React from 'react'
import { Download, Camera, Clock } from 'lucide-react'
import { Button } from '@/components/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EXPORT_DIALOG_CONTENT } from '@/lib/constants/export-constants'

interface ExportOptionsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onPngExport: () => void
  onScreenshotMode: () => void
  isExporting?: boolean
  isScreenshotMode?: boolean
}

export function ExportOptionsDialog({
  isOpen,
  onOpenChange,
  onPngExport,
  onScreenshotMode,
  isExporting = false,
  isScreenshotMode = false
}: ExportOptionsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{EXPORT_DIALOG_CONTENT.TITLE}</DialogTitle>
          <DialogDescription>
            {EXPORT_DIALOG_CONTENT.DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* PNG Export Option */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">{EXPORT_DIALOG_CONTENT.PNG_EXPORT.TITLE}</h4>
            <p className="text-xs text-muted-foreground mb-3">
              {EXPORT_DIALOG_CONTENT.PNG_EXPORT.DESCRIPTION}
            </p>
            <Button
              onClick={onPngExport}
              disabled={isExporting || isScreenshotMode}
              className="w-full"
              size="lg"
            >
              {isExporting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  {EXPORT_DIALOG_CONTENT.PNG_EXPORT.BUTTON_LOADING}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  {EXPORT_DIALOG_CONTENT.PNG_EXPORT.BUTTON}
                </>
              )}
            </Button>
          </div>

          <div className="border-t pt-4">
            {/* Screenshot Mode Option */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">{EXPORT_DIALOG_CONTENT.SCREENSHOT_MODE.TITLE}</h4>
              <p className="text-xs text-muted-foreground mb-3">
                {EXPORT_DIALOG_CONTENT.SCREENSHOT_MODE.DESCRIPTION}
              </p>
              <Button
                onClick={onScreenshotMode}
                disabled={isExporting || isScreenshotMode}
                variant="outline"
                className="w-full"
                size="lg"
              >
                {isScreenshotMode ? (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    {EXPORT_DIALOG_CONTENT.SCREENSHOT_MODE.BUTTON_ACTIVE}
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    {EXPORT_DIALOG_CONTENT.SCREENSHOT_MODE.BUTTON}
                  </>
                )}
              </Button>
              {isScreenshotMode && (
                <p className="text-xs text-amber-600 text-center">
                  {EXPORT_DIALOG_CONTENT.SCREENSHOT_MODE.ACTIVE_MESSAGE}
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 