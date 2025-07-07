'use client'

import React from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EXPORT_DIALOG_CONTENT } from '@/lib/constants/export-constants'

interface ExportOptionsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onPngExport: () => void
  isExporting?: boolean
}

export function ExportOptionsDialog({
  isOpen,
  onOpenChange,
  onPngExport,
  isExporting = false
}: ExportOptionsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Your Schedule</DialogTitle>
          <DialogDescription>
            Generate a clean PNG image optimized for sharing on social media.
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
              disabled={isExporting}
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
        </div>
      </DialogContent>
    </Dialog>
  )
} 