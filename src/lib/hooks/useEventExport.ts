import { useCallback, useState } from 'react'
// @ts-expect-error - No types available for dom-to-image-more
import domtoimage from 'dom-to-image-more'

interface UseEventExportProps {
  teacherName?: string
}

export function useEventExport({ teacherName }: UseEventExportProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const exportAsImage = useCallback(async (elementId: string) => {
    try {
      setIsExporting(true)
      setExportError(null)

      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error('Export element not found')
      }

      // Generate PNG from the element using dom-to-image
      const dataUrl = await domtoimage.toPng(element, {
        width: 1080,
        height: 1920,
        bgcolor: null, // Transparent background
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      })

      // Convert to blob and download
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `${teacherName || 'schedule'}-events-${new Date().toISOString().split('T')[0]}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

    } catch (error) {
      console.error('Export failed:', error)
      setExportError(error instanceof Error ? error.message : 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }, [teacherName])

  return {
    exportAsImage,
    isExporting,
    exportError,
    clearError: () => setExportError(null)
  }
} 