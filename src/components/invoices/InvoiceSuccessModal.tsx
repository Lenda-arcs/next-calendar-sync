'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectOption } from '@/components/ui/select'
import { CheckCircle2, FileText, Copy, ExternalLink, Calendar, Euro } from 'lucide-react'
import { InvoiceWithDetails } from '@/lib/invoice-utils'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/i18n/context'

interface InvoiceSuccessModalProps {
  invoice: InvoiceWithDetails
  mode: 'create' | 'edit'
  onGeneratePDF: (language: 'en' | 'de' | 'es') => Promise<void>
  onCopyToClipboard: () => Promise<void>
  onViewInvoices: () => void
  onClose: () => void
  isGeneratingPDF: boolean
}

export function InvoiceSuccessModal({
  invoice,
  mode,
  onGeneratePDF,
  onCopyToClipboard,
  onViewInvoices,
  onClose,
  isGeneratingPDF
}: InvoiceSuccessModalProps) {
  const { t } = useTranslation()
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'de' | 'es'>('en')
  const [isCopying, setIsCopying] = useState(false)

  // Language options for the select dropdown
  const languageOptions: SelectOption[] = [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
    { value: 'es', label: 'Español' }
  ]

  const handleCopyToClipboard = async () => {
    setIsCopying(true)
    try {
      await onCopyToClipboard()
      toast.success(t('invoices.success.copySuccess'), {
        description: t('invoices.success.copySuccessDesc'),
        duration: 3000
      })
    } catch {
      toast.error(t('invoices.success.copyError'), {
        description: t('invoices.success.copyErrorDesc'),
        duration: 4000
      })
    } finally {
      setIsCopying(false)
    }
  }

  const handleGeneratePDF = async () => {
    try {
      await onGeneratePDF(selectedLanguage)
      // Close the modal after PDF is generated and opened
      onClose()
    } catch {
      // Error handling is done in the parent component
    }
  }

  const eventCount = invoice.events?.length || 0
  const totalAmount = invoice.amount_total || 0

  return (
    <div className="space-y-6">
      {/* Success Header with Animation */}
      <div className="text-center">
        <div className="relative mb-6">
          <div className="relative mx-auto flex items-center justify-center w-16 h-16">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === 'edit' ? t('invoices.success.updatedTitle') : t('invoices.success.title')}
        </h3>
        <p className="text-lg text-gray-600 mb-6">
          {t('invoices.success.subtitle')}
        </p>
      </div>

      {/* Invoice Summary Card */}
      <Card className="border-gray-200 bg-gray-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            {t('invoices.success.invoiceSummary')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center sm:text-left">
              <div className="text-sm text-gray-600 mb-1">{t('invoices.success.invoiceNumber')}</div>
              <div className="font-semibold text-gray-900">{invoice.invoice_number}</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-sm text-gray-600 mb-1">{t('invoices.success.totalAmount')}</div>
              <div className="font-semibold text-gray-900 flex items-center justify-center sm:justify-start gap-1">
                <Euro className="w-4 h-4" />
                {totalAmount.toFixed(2)}
              </div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-sm text-gray-600 mb-1">{t('invoices.success.eventCount')}</div>
              <div className="font-semibold text-gray-900 flex items-center justify-center sm:justify-start gap-1">
                <Calendar className="w-4 h-4" />
                {eventCount}
              </div>
            </div>
          </div>
          
          {invoice.studio && (
            <div className="pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-1">{t('invoices.success.studio')}</div>
              <div className="font-medium text-gray-900">{invoice.studio.entity_name}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps Card */}
      <Card className="border-gray-200 bg-gray-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-gray-900">
            {t('invoices.success.nextSteps')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* PDF Generation Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">{t('invoices.success.generatePDF')}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                options={languageOptions}
                value={selectedLanguage}
                onChange={(value) => setSelectedLanguage(value as 'en' | 'de' | 'es')}
                placeholder="Select language..."
                className="flex-1"
              />
              
              <Button
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('invoices.success.generating')}
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    {t('invoices.success.generatePDF')}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Copy to Clipboard Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Copy className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">{t('invoices.success.copyDetails')}</span>
            </div>
            
            <Button
              onClick={handleCopyToClipboard}
              disabled={isCopying}
              variant="outline"
              className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {isCopying ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  {t('invoices.success.copying')}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  {t('invoices.success.copyToClipboard')}
                </>
              )}
            </Button>
          </div>

          {/* View All Invoices Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">{t('invoices.success.viewAllInvoices')}</span>
            </div>
            
            <Button
              onClick={onViewInvoices}
              className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {t('invoices.success.viewInvoices')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={onClose}
          variant="outline"
          className="flex-1"
        >
          {t('invoices.success.close')}
        </Button>
        <Button
          onClick={onViewInvoices}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
        >
          {t('invoices.success.viewAllInvoices')}
        </Button>
      </div>
    </div>
  )
} 