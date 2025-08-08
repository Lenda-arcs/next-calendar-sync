'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { InvoiceWithDetails } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ExternalLink, Download, Trash2, FileText, Loader2 } from 'lucide-react'
import { formatInvoiceDate } from '@/lib/date-utils'
import { useTranslation } from '@/lib/i18n/context'
import { generateInvoicePDF } from '@/lib/invoice-utils'
import { toast } from 'sonner'

interface InvoiceCardProps {
  invoice: InvoiceWithDetails
  selected?: boolean
  onToggleSelect?: (invoiceId: string) => void
  showCheckbox?: boolean
  onEdit?: (invoice: InvoiceWithDetails) => void
  onViewPDF?: (pdfUrl: string) => void
  onDelete?: (invoiceId: string) => void
  onPDFGenerated?: (invoiceId: string, pdfUrl: string) => void
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({ 
  invoice, 
  selected = false,
  onToggleSelect,
  showCheckbox = false,
  // onEdit disabled for now
  onViewPDF, 
  onDelete,
  onPDFGenerated
}) => {
  const { t } = useTranslation()
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  
  // ==================== HELPER FUNCTIONS ====================
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Draft', variant: 'secondary' as const, className: 'bg-gray-100 text-gray-700' },
      sent: { label: 'Sent', variant: 'default' as const, className: 'bg-blue-100 text-blue-700' },
      paid: { label: 'Paid', variant: 'default' as const, className: 'bg-green-100 text-green-700' },
      overdue: { label: 'Overdue', variant: 'destructive' as const, className: 'bg-red-100 text-red-700' },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const, className: 'bg-gray-100 text-gray-500' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    
    return (
      <Badge variant={config.variant} className={cn("text-xs", config.className)}>
        {config.label}
      </Badge>
    )
  }

  const handleViewPDF = () => {
    if (invoice.pdf_url) {
      if (onViewPDF) {
        onViewPDF(invoice.pdf_url)
      } else {
        // Fallback: open in new tab
        window.open(invoice.pdf_url, '_blank')
      }
    }
  }

  const handleDownloadPDF = () => {
    if (invoice.pdf_url) {
      const link = document.createElement('a')
      link.href = invoice.pdf_url
      link.download = `invoice-${invoice.invoice_number || invoice.id.slice(0, 8)}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleGeneratePDF = async () => {
    if (isGeneratingPDF) return
    
    setIsGeneratingPDF(true)
    try {
      const result = await generateInvoicePDF(invoice.id)
      toast.success('PDF generated successfully!')
      
      // Use callback if provided, otherwise reload the page
      if (onPDFGenerated) {
        onPDFGenerated(invoice.id, result.pdf_url)
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // ==================== COMPONENT RENDERS ====================
  const renderInvoiceInfo = () => (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
          {invoice.invoice_number || `Invoice ${invoice.id.slice(0, 8)}`}
        </h3>
        {getStatusBadge(invoice.status)}
      </div>
      <p className="text-sm text-gray-600 mb-2 truncate">
        {invoice.studio?.entity_name || 'Unknown Studio'}
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500">
        <span>Period: {formatInvoiceDate(invoice.period_start)} - {formatInvoiceDate(invoice.period_end)}</span>
        {invoice.event_count && (
          <Badge variant="outline" className="text-xs w-fit">
            {invoice.event_count} events
          </Badge>
        )}
      </div>
    </div>
  )

  const renderActionButtons = () => (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      {/* Edit temporarily disabled */}
      
      {invoice.pdf_url ? (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              handleViewPDF()
            }}
            className="flex-1 sm:flex-none h-9 sm:h-8 text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="w-4 h-4 sm:w-3 sm:h-3 mr-1" />
            <span className="sm:hidden">View</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              handleDownloadPDF()
            }}
            className="flex-1 sm:flex-none h-9 sm:h-8 text-gray-600 hover:text-gray-700"
          >
            <Download className="w-4 h-4 sm:w-3 sm:h-3 mr-1" />
            <span className="sm:hidden">Download</span>
          </Button>
        </>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation()
            handleGeneratePDF()
          }}
          disabled={isGeneratingPDF}
          className="flex-1 sm:flex-none h-9 sm:h-8 text-green-600 hover:text-green-700"
        >
          {isGeneratingPDF ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-3 sm:h-3 mr-1 animate-spin" />
              <span className="sm:hidden">Generating...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 sm:w-3 sm:h-3 mr-1" />
              <span className="sm:hidden">Generate PDF</span>
            </>
          )}
        </Button>
      )}
      
      {onDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 sm:flex-none h-9 sm:h-8 border-red-300 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 sm:w-3 sm:h-3 mr-1" />
              <span className="sm:hidden">Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('invoices.card.confirmDelete')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('invoices.card.confirmDeleteDesc')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.actions.cancel')}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(invoice.id)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {t('common.actions.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )

  const renderDesktopActions = () => (
    <div className="flex items-center gap-1 mb-2">
      {/* Edit temporarily disabled */}
      {onDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => e.stopPropagation()}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('invoices.card.confirmDelete')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('invoices.card.confirmDeleteDesc')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.actions.cancel')}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(invoice.id)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {t('common.actions.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )

  const renderPDFActions = () => (
    invoice.pdf_url ? (
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            handleViewPDF()
          }}
          className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          View
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            handleDownloadPDF()
          }}
          className="h-6 px-2 text-xs text-gray-600 hover:text-gray-700"
        >
          <Download className="w-3 h-3 mr-1" />
          Download
        </Button>
      </div>
    ) : (
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation()
          handleGeneratePDF()
        }}
        disabled={isGeneratingPDF}
        className="h-6 px-2 text-xs text-green-600 hover:text-green-700"
      >
        {isGeneratingPDF ? (
          <>
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FileText className="w-3 h-3 mr-1" />
            Generate PDF
          </>
        )}
      </Button>
    )
  )

  // ==================== MAIN RENDER ====================
  return (
    <Card 
      className={cn(
        "transition-all duration-150 hover:shadow-sm overflow-hidden",
        selected && "border-blue-400 bg-blue-50/30 shadow-sm",
        !selected && "border-gray-200",
        showCheckbox && onToggleSelect && "cursor-pointer hover:bg-gray-50/50"
      )}
      onClick={showCheckbox && onToggleSelect ? () => onToggleSelect(invoice.id) : undefined}
    >
      <CardContent className="p-3 sm:p-4">
        {/* Mobile Layout */}
        <div className="block sm:hidden">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {showCheckbox && onToggleSelect && (
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onToggleSelect(invoice.id)}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 border-gray-300 rounded flex-shrink-0 mt-0.5"
              />
            )}
            {renderInvoiceInfo()}
          </div>
          
          {/* Mobile Amount and Actions */}
          <div className="mt-3 flex flex-col gap-3">
            <div className="text-xl font-bold text-gray-900 text-center">
              €{invoice.amount_total?.toFixed(2) || '0.00'}
            </div>
            {renderActionButtons()}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {showCheckbox && onToggleSelect && (
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onToggleSelect(invoice.id)}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 border-gray-300 rounded flex-shrink-0"
              />
            )}
            {renderInvoiceInfo()}
          </div>

          <div className="text-right ml-3 flex flex-col items-end">
            {renderDesktopActions()}
            <div className="text-lg font-bold text-gray-900 mb-1">
              €{invoice.amount_total?.toFixed(2) || '0.00'}
            </div>
            {renderPDFActions()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 