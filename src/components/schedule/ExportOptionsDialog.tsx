'use client'

import React, { useState } from 'react'
import { Download, Copy, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EXPORT_DIALOG_CONTENT } from '@/lib/constants/export-constants'
import { PublicEvent } from '@/lib/types'
import { toast } from 'sonner'
import { format, parseISO } from 'date-fns'

interface ExportOptionsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onPngExport: () => void
  isExporting?: boolean
  events?: PublicEvent[]
}

export function ExportOptionsDialog({
  isOpen,
  onOpenChange,
  onPngExport,
  isExporting = false,
  events = []
}: ExportOptionsDialogProps) {
  const [includeLocation, setIncludeLocation] = useState(true)
  const [textCopied, setTextCopied] = useState(false)

  const generateTextExport = () => {
    if (!events.length) return ''

    // Group events by date
    const eventsByDate = events.reduce((acc, event) => {
      if (!event.start_time) return acc
      
      const date = format(parseISO(event.start_time), 'EEEE, MMMM d')
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(event)
      return acc
    }, {} as Record<string, PublicEvent[]>)

    // Format the text
    let text = ''
    Object.entries(eventsByDate).forEach(([date, dayEvents]) => {
      text += `${date}\n`
      
      dayEvents.forEach(event => {
        text += `${event.title || 'Yoga Class'}\n`
        
        if (event.start_time) {
          const time = format(parseISO(event.start_time), 'H:mm')
          text += `${time}\n`
        }
        
        if (includeLocation && event.location) {
          text += `${event.location}\n`
        }
        
        text += '\n' // Empty line between events
      })
    })

    return text.trim()
  }

  const copyTextToClipboard = async () => {
    const text = generateTextExport()
    
    try {
      await navigator.clipboard.writeText(text)
      setTextCopied(true)
      toast.success('Schedule text copied to clipboard!')
      setTimeout(() => setTextCopied(false), 2000)
    } catch {
      toast.error('Failed to copy text')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Your Schedule</DialogTitle>
          <DialogDescription>
            Choose how you&apos;d like to export your filtered events for sharing.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
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

          <div className="border-t pt-4">
            {/* Text Export Option */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Text Export</h4>
              <p className="text-xs text-muted-foreground">
                Copy formatted text for easy pasting into social media posts or stories.
              </p>
              
              {/* Location Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="include-location"
                  checked={includeLocation}
                  onChange={(e) => setIncludeLocation(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="include-location" className="text-sm font-medium text-gray-700">
                  Include location
                </label>
              </div>

              {/* Preview */}
              {events.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-md border">
                  <p className="text-xs text-gray-600 mb-2">Preview:</p>
                  <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
                    {generateTextExport().split('\n').slice(0, 6).join('\n')}
                    {generateTextExport().split('\n').length > 6 && '\n...'}
                  </pre>
                </div>
              )}

              <Button
                onClick={copyTextToClipboard}
                disabled={!events.length}
                variant="outline"
                className="w-full"
                size="lg"
              >
                {textCopied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Text Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Text
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 