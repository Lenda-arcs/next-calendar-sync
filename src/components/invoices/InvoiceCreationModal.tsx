'use client'

import React from 'react'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EditableEventItem } from '@/components/events/EditableEventItem'
import { useInvoiceCreationState } from './useInvoiceCreationState'
import { useSupabaseQuery, useSupabaseMutation } from '@/lib/hooks/useQueryWithSupabase'
import {
  getUserStudios,
  createInvoice,
  updateInvoice,
  linkEventsToInvoice,
  unlinkEventsFromInvoice,
  generateInvoicePDF,
  bulkUpdateEventStudentCounts,
  EventWithStudio,
  InvoiceWithDetails
} from '@/lib/invoice-utils'
import { InvoiceInsert } from '@/lib/types'
import { toast } from 'sonner'
import { Loader2, CheckCircle, FileText } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface InvoiceCreationModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  studioId: string
  eventIds: string[]
  events: EventWithStudio[]
  mode?: 'create' | 'edit'
  existingInvoice?: InvoiceWithDetails
  onSuccess?: () => void
}

export function InvoiceCreationModal({
  isOpen,
  onClose,
  userId,
  studioId,
  eventIds,
  events,
  mode,
  existingInvoice,
  onSuccess
}: InvoiceCreationModalProps) {
  const { t } = useTranslation()
  
  // Use the custom hook for state management
  const {
    invoiceNumber,
    setInvoiceNumber,
    notes,
    setNotes,
    showSuccess,
    setShowSuccess,
    editableEvents,
    selectedEvents,
    totalAmount,
    handleEventUpdate,
    isReady,
    hasChanges
  } = useInvoiceCreationState({
    isOpen,
    userId,
    eventIds,
    events,
    mode,
    existingInvoice
  })

  // State for PDF generation
  const [createdInvoiceId, setCreatedInvoiceId] = React.useState<string | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false)
  const [selectedLanguage, setSelectedLanguage] = React.useState<'en' | 'de' | 'es'>('en')

  // Reset PDF state when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setCreatedInvoiceId(null)
      setIsGeneratingPDF(false)
    }
  }, [isOpen])

  // Get studio details
  const { data: studios } = useSupabaseQuery(
    ['user-studios', userId],
    () => getUserStudios(userId),
    { enabled: !!userId && isOpen }
  )

  const studio = studios?.find((s) => s.id === studioId) || existingInvoice?.studio

  // Invoice creation/update mutation
  const invoiceMutation = useSupabaseMutation(
    async (supabase, data: { type: 'create'; invoice: InvoiceInsert } | { type: 'update'; id: string; updates: Partial<InvoiceInsert> }) => {
      if (data.type === 'update') {
        return await updateInvoice(data.id, data.updates)
      } else {
        return await createInvoice(data.invoice)
      }
    },
    {
      onSuccess: async (invoice) => {
      // Update student counts for all events
      const studentCountUpdates = editableEvents.map(event => ({
        eventId: event.id,
        studentsStudio: event.studentsStudio,
        studentsOnline: event.studentsOnline
      }))
      
      try {
        await bulkUpdateEventStudentCounts(studentCountUpdates)
      } catch (error) {
        console.error('Failed to update student counts:', error)
        // Don't fail the entire operation, just log the error
      }
      
      if (mode === 'create') {
        await linkEventsToInvoice(eventIds, invoice.id)
      } else if (mode === 'edit' && existingInvoice) {
        // In edit mode, unlink old events and link new ones if they changed
        const oldEventIds = existingInvoice.events.map(e => e.id)
        const newEventIds = eventIds
        
        // Find events to unlink and link
        const eventsToUnlink = oldEventIds.filter(id => !newEventIds.includes(id))
        const eventsToLink = newEventIds.filter(id => !oldEventIds.includes(id))
        
        if (eventsToUnlink.length > 0) {
          await unlinkEventsFromInvoice(eventsToUnlink)
        }
        if (eventsToLink.length > 0) {
          await linkEventsToInvoice(eventsToLink, invoice.id)
        }
        
        // Auto-regenerate PDF for updated invoices
        try {
          const { pdf_url } = await generateInvoicePDF(invoice.id, 'en') // Default to English
          window.open(pdf_url, '_blank')
          toast('Invoice Updated & PDF Regenerated!', {
            description: 'Your invoice has been updated and the PDF has been regenerated.',
            duration: 4000
          })
        } catch (error) {
          console.error('Failed to auto-regenerate PDF:', error)
          // Don't fail the operation, just log the error
        }
      }
      
      // Store the invoice ID for PDF generation
      setCreatedInvoiceId(invoice.id)
      setShowSuccess(true)
      }
    }
  )

  const handleSubmitInvoice = async () => {
    if (!studio || editableEvents.length === 0) return
    
    try {
      const eventDates = selectedEvents.length > 0 
        ? selectedEvents.map(e => new Date(e.start_time!))
        : existingInvoice?.events.map(e => new Date(e.start_time!)) || []
      
      const periodStart = new Date(Math.min(...eventDates.map(d => d.getTime()))).toISOString()
      const periodEnd = new Date(Math.max(...eventDates.map(d => d.getTime()))).toISOString()

      if (mode === 'edit' && existingInvoice) {
        const updates: Partial<InvoiceInsert> = {
          invoice_number: invoiceNumber,
          amount_total: totalAmount,
          currency: studio.currency || 'EUR',
          period_start: periodStart,
          period_end: periodEnd,
          notes: notes || null,
        }
        
        await invoiceMutation.mutateAsync({ type: 'update', id: existingInvoice.id, updates })
      } else {
        const invoiceData: InvoiceInsert = {
          user_id: userId,
          studio_id: studioId,
          invoice_number: invoiceNumber,
          amount_total: totalAmount,
          currency: studio.currency || 'EUR',
          period_start: periodStart,
          period_end: periodEnd,
          notes: notes || null,
        }

        await invoiceMutation.mutateAsync({ type: 'create', invoice: invoiceData })
      }
    } catch (error) {
      console.error('Failed to save invoice:', error)
    }
  }

  const handleGeneratePDF = async () => {
    if (!createdInvoiceId) return
    
    setIsGeneratingPDF(true)
    try {
      const { pdf_url } = await generateInvoicePDF(createdInvoiceId, selectedLanguage)
      
      // Auto-open PDF in new tab
      window.open(pdf_url, '_blank')
      
      toast('PDF Generated Successfully!', {
        description: 'Your invoice PDF has been created and opened in a new tab.',
        duration: 4000
      })
      
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      toast.error('PDF Generation Failed', {
        description: 'Unable to generate PDF. Please try again.',
        duration: 6000
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  if (!isOpen) return null

  const footerContent = !showSuccess ? (
    <>
      <Button variant="outline" onClick={onClose} disabled={invoiceMutation.isPending}>
        Cancel
      </Button>
      <Button 
        onClick={handleSubmitInvoice} 
        disabled={invoiceMutation.isPending || !studio || editableEvents.length === 0 || !isReady || (mode === 'edit' && !hasChanges)}
      >
        {invoiceMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {mode === 'edit' ? 'Updating' : 'Creating'} Invoice...
          </>
        ) : (
          `${mode === 'edit' ? 'Update' : 'Create'} Invoice (€${totalAmount.toFixed(2)})`
        )}
      </Button>
    </>
  ) : undefined

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={onClose}
      title={t('invoices.creation.modalTitle', { 
        mode: mode === 'edit' ? t('invoices.creation.editTitle') : t('invoices.creation.createTitle'),
        studioName: studio?.entity_name || t('invoices.card.unknownStudio')
      })}
      size="lg"
      footer={footerContent}
    >
        {showSuccess ? (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                {mode === 'edit' ? t('invoices.creation.successUpdatedTitle') : t('invoices.creation.successTitle')}
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                {t('invoices.creation.successMessage', {
                  invoiceNumber,
                  mode: mode === 'edit' ? t('invoices.creation.editTitle').toLowerCase() : t('invoices.creation.createTitle').toLowerCase(),
                  total: totalAmount.toFixed(2)
                })}
              </p>
            </div>

            <div className="space-y-4">
              {/* Language Selection */}
              <div className="flex justify-center">
                <div className="flex items-center gap-2">
                  <Label htmlFor="pdf-language" className="text-sm font-medium">
                    PDF Language:
                  </Label>
                  <select
                    id="pdf-language"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'de' | 'es')}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF || !createdInvoiceId}
                  className="flex items-center gap-2"
                >
                  {isGeneratingPDF ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('invoices.creation.generating')}
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      {t('invoices.creation.generatePDF')}
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => {
                    onClose()
                    if (onSuccess) onSuccess()
                  }}
                >
                  View All Invoices
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('invoices.creation.invoiceDetails')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="invoice_number">{t('invoices.creation.invoiceNumber')}</Label>
                  <Input
                    id="invoice_number"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    disabled={invoiceMutation.isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">{t('invoices.creation.notes')}</Label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                    placeholder={t('invoices.creation.notesPlaceholder')}
                    rows={3}
                    disabled={invoiceMutation.isPending}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {isReady ? t('invoices.creation.events', { count: editableEvents.length.toString() }) : t('invoices.creation.events', { count: '0' })}
                </CardTitle>
                {isReady && (
                  <p className="text-sm text-gray-600 mt-1">
                    {t('invoices.creation.eventsDescription')}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {isReady ? (
                  <>
                    <div className="space-y-4">
                      {editableEvents.map(item => (
                        <EditableEventItem
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          rate={item.rate}
                          date={item.date}
                          studentsStudio={item.studentsStudio}
                          studentsOnline={item.studentsOnline}
                          onUpdate={handleEventUpdate}
                          disabled={invoiceMutation.isPending}
                        />
                      ))}
                    </div>
                    <div className="border-t pt-4 mt-6">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>{t('invoices.creation.total')}</span>
                        <span>€{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">{t('invoices.creation.noEvents')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
    </UnifiedDialog>
  )
} 