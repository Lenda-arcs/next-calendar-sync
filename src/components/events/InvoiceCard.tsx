import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { InvoiceWithDetails } from '@/lib/invoice-utils'
import { Edit3, Eye, FileText, Loader2, Download, ExternalLink, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface InvoiceCardProps {
  invoice: InvoiceWithDetails
  onEdit?: (invoice: InvoiceWithDetails) => void
  onStatusChange?: (invoiceId: string, newStatus: 'sent' | 'paid' | 'overdue') => void
  onGeneratePDF?: (invoiceId: string) => void
  onViewPDF?: (pdfUrl: string) => void
  onDelete?: (invoiceId: string) => void
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onEdit, onStatusChange, onGeneratePDF, onViewPDF, onDelete }) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: { variant: 'secondary' as const, text: 'Draft', color: 'bg-gray-100 text-gray-800' },
      sent: { variant: 'default' as const, text: 'Sent', color: 'bg-blue-100 text-blue-800' },
      paid: { variant: 'default' as const, text: 'Paid', color: 'bg-green-100 text-green-800' },
      overdue: { variant: 'destructive' as const, text: 'Overdue', color: 'bg-red-100 text-red-800' },
      cancelled: { variant: 'outline' as const, text: 'Cancelled', color: 'bg-gray-100 text-gray-500' }
    }
    const config = variants[status as keyof typeof variants] || variants.draft
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.text}
      </Badge>
    )
  }

  const canEdit = invoice.status === 'draft'
  const canChangeStatus = !!invoice.pdf_url && invoice.status !== 'cancelled'
  const ButtonIcon = canEdit ? Edit3 : Eye
  const buttonText = canEdit ? 'Edit' : 'View'

  const statusOptions = [
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' }
  ]

  const handleStatusChange = async (newStatus: string) => {
    if (!onStatusChange || isUpdatingStatus) return
    
    setIsUpdatingStatus(true)
    try {
      await onStatusChange(invoice.id, newStatus as 'sent' | 'paid' | 'overdue')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleGeneratePDF = async () => {
    if (!onGeneratePDF || isGeneratingPDF) return
    
    setIsGeneratingPDF(true)
    try {
      await onGeneratePDF(invoice.id)
    } finally {
      setIsGeneratingPDF(false)
    }
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

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-3">
          {/* Top Row - Invoice info and amount */}
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 truncate">
                  {invoice.invoice_number || `Invoice ${invoice.id.slice(0, 8)}`}
                </h3>
                {getStatusBadge(invoice.status)}
                {invoice.pdf_url && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FileText className="w-3 h-3" />
                    <span className="hidden sm:inline">PDF</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1 truncate">
                {invoice.studio?.entity_name || 'Unknown Studio'}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="text-xs text-gray-600">
                  {invoice.currency || 'EUR'}
                </div>
                {invoice.event_count && (
                  <Badge variant="outline" className="text-xs">
                    {invoice.event_count} events
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right ml-3">
              <div className="text-lg sm:text-xl font-bold text-gray-900">
                €{invoice.amount_total?.toFixed(2) || '0.00'}
              </div>
            </div>
          </div>

          {/* Dates Row - Mobile friendly */}
          <div className="text-xs text-gray-600 space-y-1">
            <div>
              Period: {new Date(invoice.period_start).toLocaleDateString()} - {new Date(invoice.period_end).toLocaleDateString()}
            </div>
            <div>
              Created: {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'Unknown'}
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
            {/* PDF Controls Row */}
            {(invoice.status === 'draft' && onGeneratePDF) || invoice.pdf_url ? (
              <div className="flex flex-wrap gap-2">
                {/* PDF Generation for Drafts */}
                {invoice.status === 'draft' && onGeneratePDF && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGeneratePDF}
                    disabled={isGeneratingPDF}
                    className="flex items-center gap-1 flex-1 sm:flex-none min-w-0"
                  >
                    {isGeneratingPDF ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <FileText className="w-3 h-3" />
                    )}
                    <span className="truncate">
                      {invoice.pdf_url ? 'Regenerate PDF' : 'Generate PDF'}
                    </span>
                  </Button>
                )}
                
                {/* PDF View/Download for existing PDFs */}
                {invoice.pdf_url && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleViewPDF}
                      className="flex items-center gap-1 flex-1 sm:flex-none"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate">View PDF</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-1 flex-1 sm:flex-none sm:hidden"
                    >
                      <Download className="w-3 h-3" />
                      <span className="truncate">Download</span>
                    </Button>
                    {/* Desktop-only download button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadPDF}
                      className="hidden sm:flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  </>
                )}
              </div>
            ) : null}

            {/* Edit and Status Controls Row */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Edit/View Button - Always first */}
              {onEdit && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(invoice)}
                  className="flex items-center gap-1 justify-center sm:w-auto"
                >
                  <ButtonIcon className="w-3 h-3" />
                  <span className="hidden sm:inline">{buttonText}</span>
                </Button>
              )}
              
              {/* Status Change Controls - Next to edit button on desktop */}
              {canChangeStatus && (
                <div className="flex items-center gap-2 flex-1 sm:flex-none sm:min-w-[140px]">
                  <Select
                    value={invoice.status}
                    onChange={handleStatusChange}
                    options={statusOptions}
                    placeholder="Change status"
                    className="flex-1"
                    disabled={isUpdatingStatus}
                  />
                  {isUpdatingStatus && (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  )}
                </div>
              )}

              {/* Delete Button - Only for draft invoices */}
              {invoice.status === 'draft' && onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1 justify-center text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Invoice?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete invoice <strong>{invoice.invoice_number || `#${invoice.id.slice(0, 8)}`}</strong> and free all associated events for future invoicing. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDelete(invoice.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete Invoice
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {invoice.notes && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 break-words">{invoice.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 