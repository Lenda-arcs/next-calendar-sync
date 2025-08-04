'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n/context'
import { Palette, Building, User } from 'lucide-react'
import { UserInvoiceSettingsModal } from './UserInvoiceSettingsModal'
import { BillingConfigurationModal } from './BillingConfigurationModal'
import { PDFThemeModal } from './PDFThemeModal'
import { useSupabaseQuery } from '@/lib/hooks/useQueryWithSupabase'
import { getUserInvoiceSettings } from '@/lib/invoice-utils'

interface InvoiceQuickActionsProps {
  userId: string
}

export function InvoiceQuickActions({ userId }: InvoiceQuickActionsProps) {
  const { t } = useTranslation()
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [showBillingModal, setShowBillingModal] = useState(false)

  // Load user invoice settings for the modal
  const { 
    data: userSettings, 
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

  const handlePdfThemeClick = () => {
    setShowPdfModal(true)
  }

  return (
    <>
      <div className="backdrop-blur-sm bg-white/20 border border-white/30 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          {/* Invoice Settings Button */}
          <Button 
            variant="outline" 
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-2 text-sm sm:text-base bg-white/50 hover:bg-white/70 border-white/40 hover:border-white/60 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:scale-105"
            size="sm"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{t('invoices.quickActions.invoiceSettings')}</span>
            <span className="sm:hidden">{t('invoices.quickActions.settings')}</span>
          </Button>

          {/* PDF Themes Button */}
          <Button 
            variant="outline" 
            onClick={handlePdfThemeClick}
            className="flex items-center gap-2 text-sm sm:text-base bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200 hover:border-purple-300 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:scale-105"
            size="sm"
          >
            <Palette className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline text-purple-800">{t('invoices.quickActions.pdfThemes')}</span>
            <span className="sm:hidden text-purple-800">{t('invoices.quickActions.themes')}</span>
          </Button>

          {/* Billing Setup Button */}
          <Button 
            variant="outline" 
            onClick={() => setShowBillingModal(true)}
            className="flex items-center gap-2 text-sm sm:text-base bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-blue-200 hover:border-blue-300 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:scale-105"
            size="sm"
          >
            <Building className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline text-blue-800">{t('invoices.quickActions.billingSetup')}</span>
            <span className="sm:hidden text-blue-800">{t('invoices.quickActions.billing')}</span>
          </Button>
        </div>
      </div>

      {/* Invoice Settings Modal */}
      <UserInvoiceSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        userId={userId}
        existingSettings={userSettings}
        onSettingsUpdated={handleSettingsUpdated}
      />

      {/* Billing Configuration Modal */}
      <BillingConfigurationModal
        isOpen={showBillingModal}
        onClose={() => setShowBillingModal(false)}
        userId={userId}
      />

      {/* PDF Theme Modal */}
      <PDFThemeModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        userId={userId}
      />
    </>
  )
}