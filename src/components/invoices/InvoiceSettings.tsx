'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DataLoader from '@/components/ui/data-loader'
import { InfoSection, InfoItem, InfoGrid } from '@/components/ui/info-section'
import { useSupabaseQuery, useSupabaseMutation } from '@/lib/hooks/useQueryWithSupabase'
import { getUserInvoiceSettings, generatePDFPreview } from '@/lib/invoice-utils'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { UserInvoiceSettingsModal } from './UserInvoiceSettingsModal'
import { UserInvoiceSettings, PDFTemplateConfig, PDFTemplateTheme } from '@/lib/types'
import { BillingEntityManagement } from '@/components/billing/BillingEntityManagement'
import { PDFTemplateCustomization } from '@/components/export/PDFTemplateCustomizationSimple'
import { useTranslation } from '@/lib/i18n/context'
import { Loader2 } from 'lucide-react'

interface InvoiceSettingsProps {
  userId: string
}

export function InvoiceSettings({ userId }: InvoiceSettingsProps) {
  const { t } = useTranslation()
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showPdfCustomModal, setShowPdfCustomModal] = useState(false)
  const [pdfConfig, setPdfConfig] = useState<PDFTemplateConfig | null>(null)
  const [pdfTheme, setPdfTheme] = useState<PDFTemplateTheme>('professional')
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)

  // Load user invoice settings
  //TODO: CURSOR Migrate to new query system
  const { 
    data: userSettings, 
    isLoading: loadingSettings, 
    error: settingsError,
    refetch: refetchSettings
  } = useSupabaseQuery(
    ['user-invoice-settings', userId],
    () => getUserInvoiceSettings(userId),
    { enabled: !!userId }
  )

  const handleSettingsUpdated = () => {
    refetchSettings()
    setShowSettingsModal(false)
  }

  // Initialize PDF config from user settings
  useEffect(() => {
    if (userSettings) {
      // Check if the settings have PDF template fields (after migration)
      const settings = userSettings as UserInvoiceSettings & {
        pdf_template_config?: PDFTemplateConfig | null
        template_theme?: PDFTemplateTheme
      }
      if (settings.pdf_template_config) {
        setPdfConfig(settings.pdf_template_config)
      }
      if (settings.template_theme) {
        setPdfTheme(settings.template_theme)
      }
    }
  }, [userSettings])

  // Mutation for updating PDF template settings
  //TODO: CURSOR Migrate to new query system (Utilise TanStack Query's optimistic updates, instead of manual state management)
  const pdfTemplateMutation = useSupabaseMutation(
    async (supabase, data: { pdf_template_config: PDFTemplateConfig | null; template_theme: PDFTemplateTheme }) => {
      // First, try to update existing record
      const { data: updateResult, error: updateError } = await supabase
        .from('user_invoice_settings')
        .update(data)
        .eq('user_id', userId)
        .select()
        .single()
      
      if (updateError) {
        // If update fails because record doesn't exist, try to insert
        if (updateError.code === 'PGRST116') {
          // Get user's name from users table for the required full_name field
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('name')
            .eq('id', userId)
            .single()
          
          if (userError) throw new Error(`Could not fetch user data: ${userError.message}`)
          
          const { data: insertResult, error: insertError } = await supabase
            .from('user_invoice_settings')
            .insert([{ 
              user_id: userId, 
              full_name: userData.name || 'Unknown User',
              ...data 
            }])
            .select()
            .single()
          
          if (insertError) throw insertError
          return insertResult
        }
        throw updateError
      }
      
      return updateResult
    },
    {
      onSuccess: () => {
        toast.success(t('invoices.settings.pdfTemplateSettingsSaved'))
        refetchSettings()
      },
      onError: (error) => {
        toast.error(`${t('invoices.settings.pdfTemplateSettingsFailed')}: ${error.message}`)
      }
    }
  )

  const handleSavePdfTemplate = async (config: PDFTemplateConfig, theme: PDFTemplateTheme) => {
    // Save the actual current state from the modal, not parent state
    await pdfTemplateMutation.mutateAsync({
      pdf_template_config: config,
      template_theme: theme
    })
    // Update parent state after successful save
    setPdfConfig(config)
    setPdfTheme(theme)
    // Close modal after successful save
    setShowPdfCustomModal(false)
  }

  const handlePreviewCurrentTemplate = async () => {
    setIsPreviewLoading(true)
    try {
      if (!pdfConfig && pdfTheme === 'professional') {
        toast.info(t('invoices.settings.noCustomTemplateToPreview'))
        return
      }

      const { pdf_url } = await generatePDFPreview(
        pdfConfig,
        pdfTheme,
        userSettings ? { kleinunternehmerregelung: userSettings.kleinunternehmerregelung || false } : null,
        'en' // Default to English for preview
      )
      
      // Convert data URI to blob URL for better browser compatibility
      if (pdf_url.startsWith('data:application/pdf;base64,')) {
        try {
          // Extract base64 data
          const base64Data = pdf_url.split(',')[1]
          
          // Convert base64 to byte array
          const byteCharacters = atob(base64Data)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          
          // Create blob and URL
          const blob = new Blob([byteArray], { type: 'application/pdf' })
          const blobUrl = URL.createObjectURL(blob)
          
          // Open PDF in new tab
          const newWindow = window.open(blobUrl, '_blank')
          
          // Clean up blob URL after a delay (when PDF is likely loaded)
          if (newWindow) {
            setTimeout(() => {
              URL.revokeObjectURL(blobUrl)
            }, 1000)
          }
        } catch (blobError) {
          console.warn('Failed to create blob URL, falling back to data URI:', blobError)
          window.open(pdf_url, '_blank')
        }
      } else {
        // For regular URLs, open directly
        window.open(pdf_url, '_blank')
      }
      
      toast.success(t('invoices.settings.pdfPreviewGenerated'))
    } catch (error) {
      console.error('Failed to generate PDF preview:', error)
      toast.error(`${t('invoices.settings.pdfPreviewFailed')}: ${error instanceof Error ? error.message : 'Please try again.'}`)
    } finally {
      setIsPreviewLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* User Invoice Settings Section */}
      <Card className="bg-white/80 backdrop-blur-md border border-white/40">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg sm:text-xl text-gray-900">
                  {t('invoices.settings.invoiceInfoTitle')}
                </CardTitle>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {t('invoices.settings.invoiceInfoDesc')}
                </p>
              </div>
              {userSettings && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowSettingsModal(true)}
                  className="w-full sm:w-auto flex-shrink-0"
                  size="sm"
                >
                  {t('invoices.settings.editSettings')}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <DataLoader
            data={userSettings ?? null}
            loading={loadingSettings}
            error={settingsError?.message || null}
            empty={
              <div className="text-center py-6 sm:py-8 px-4">
                <div className="text-gray-600 mb-4 sm:mb-6">
                  <p className="text-base sm:text-lg mb-2 font-medium">{t('invoices.settings.noSettingsTitle')}</p>
                  <p className="text-sm sm:text-base mb-4 sm:mb-6 text-gray-500">{t('invoices.settings.noSettingsDesc')}</p>
                  <Button 
                    onClick={() => setShowSettingsModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  >
                    {t('invoices.settings.setupSettings')}
                  </Button>
                </div>
              </div>
            }
          >
            {(settings: UserInvoiceSettings) => (
              <div className="space-y-4 sm:space-y-6">
                {/* Header with Status */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      {settings.full_name}
                    </h3>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {t('invoices.settings.setupComplete')}
                    </Badge>
                  </div>
                </div>

                {/* Information Sections */}
                <InfoGrid>
                  {/* Contact Information */}
                  <InfoSection title={t('invoices.settings.contactInfo')}>
                    {settings.email && (
                      <InfoItem 
                        label={t('invoices.settings.email')} 
                        value={settings.email}
                        valueClassName="font-mono break-all"
                      />
                    )}
                    
                    {settings.phone && (
                      <InfoItem 
                        label={t('invoices.settings.phone')} 
                        value={settings.phone}
                      />
                    )}
                    
                    {settings.address && (
                      <InfoItem 
                        label={t('invoices.settings.address')} 
                        value={settings.address}
                        valueClassName="whitespace-pre-line"
                      />
                    )}
                  </InfoSection>

                  {/* Banking & Tax Information */}
                  <InfoSection title={t('invoices.settings.bankingTax')}>
                    {settings.iban && (
                      <InfoItem 
                        label={t('invoices.settings.iban')} 
                        value={settings.iban}
                        valueClassName="font-mono break-all"
                      />
                    )}
                    
                    {settings.bic && (
                      <InfoItem 
                        label={t('invoices.settings.bic')} 
                        value={settings.bic}
                        valueClassName="font-mono"
                      />
                    )}
                    
                    {settings.tax_id && (
                      <InfoItem 
                        label={t('invoices.settings.taxId')} 
                        value={settings.tax_id}
                      />
                    )}
                    
                    {settings.vat_id && (
                      <InfoItem 
                        label={t('invoices.settings.vatId')} 
                        value={settings.vat_id}
                      />
                    )}
                    
                    {!settings.iban && !settings.bic && !settings.tax_id && !settings.vat_id && (
                      <p className="text-sm text-gray-600 italic">{t('invoices.settings.noBankingTaxInfo')}</p>
                    )}
                  </InfoSection>
                </InfoGrid>
              </div>
            )}
          </DataLoader>
        </CardContent>
      </Card>

      {/* Billing Profiles Section */}
      <Card className="backdrop-blur-md border border-white/40">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg sm:text-xl text-gray-900">
                  {t('invoices.settings.billingProfilesTitle')}
                </CardTitle>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {t('invoices.settings.billingProfilesDesc')}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BillingEntityManagement userId={userId} />
        </CardContent>
      </Card>

      {/* PDF Template Customization Section */}
      <Card className="backdrop-blur-md border border-white/40">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg sm:text-xl text-gray-900">
                  {t('invoices.settings.pdfCustomizationTitle')}
                </CardTitle>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {t('invoices.settings.pdfCustomizationDesc')}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 sm:py-8 px-4">
            <div className="text-gray-600 mb-4 sm:mb-6">
              <p className="text-base sm:text-lg mb-2 font-medium">
                {t('invoices.settings.currentTheme')} <span className="capitalize font-semibold text-gray-900">{pdfTheme}</span>
              </p>
              <p className="text-sm sm:text-base mb-4 sm:mb-6 text-gray-500">
                {pdfConfig ? t('invoices.settings.customConfiguration') : t('invoices.settings.defaultConfiguration')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => setShowPdfCustomModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {t('invoices.settings.openTemplateEditor')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handlePreviewCurrentTemplate}
                  disabled={pdfTemplateMutation.isPending || isPreviewLoading}
                  className="flex items-center gap-2"
                >
                  {isPreviewLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      {t('invoices.settings.generating')}
                    </>
                  ) : (
                    t('invoices.settings.previewCurrentTemplate')
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Invoice Settings Modal */}
      <UserInvoiceSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        userId={userId}
        existingSettings={userSettings}
        onSettingsUpdated={handleSettingsUpdated}
      />

      {/* PDF Template Customization Modal */}
      <PDFTemplateCustomization
        isOpen={showPdfCustomModal}
        onClose={() => setShowPdfCustomModal(false)}
        userId={userId}
        currentConfig={pdfConfig}
        currentTheme={pdfTheme}
        onConfigChange={setPdfConfig}
        onThemeChange={setPdfTheme}
        onSave={handleSavePdfTemplate}
        isLoading={pdfTemplateMutation.isPending}
      />
    </div>
  )
} 