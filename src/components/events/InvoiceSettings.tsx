'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DataLoader from '@/components/ui/data-loader'
import { InfoSection, InfoItem, InfoGrid } from '@/components/ui/info-section'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { getUserInvoiceSettings } from '@/lib/invoice-utils'
import { UserInvoiceSettingsModal } from './UserInvoiceSettingsModal'
import { UserInvoiceSettings } from '@/lib/types'
import { BillingEntityManagement } from './BillingEntityManagement'

interface InvoiceSettingsProps {
  userId: string
}

export function InvoiceSettings({ userId }: InvoiceSettingsProps) {
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // Load user invoice settings
  const { 
    data: userSettings, 
    isLoading: loadingSettings, 
    error: settingsError,
    refetch: refetchSettings
  } = useSupabaseQuery({
    queryKey: ['user-invoice-settings', userId],
    fetcher: () => getUserInvoiceSettings(userId),
    enabled: !!userId
  })

  const handleSettingsUpdated = () => {
    refetchSettings()
    setShowSettingsModal(false)
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
                  Your Invoice Information
                </CardTitle>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Set up your personal billing details for generating invoices
                </p>
              </div>
              {userSettings && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowSettingsModal(true)}
                  className="w-full sm:w-auto flex-shrink-0"
                  size="sm"
                >
                  Edit Settings
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <DataLoader
            data={userSettings}
            loading={loadingSettings}
            error={settingsError?.message || null}
            empty={
              <div className="text-center py-6 sm:py-8 px-4">
                <div className="text-gray-600 mb-4 sm:mb-6">
                  <p className="text-base sm:text-lg mb-2 font-medium">No invoice settings configured</p>
                  <p className="text-sm sm:text-base mb-4 sm:mb-6 text-gray-500">Set up your billing information to generate invoices</p>
                  <Button 
                    onClick={() => setShowSettingsModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  >
                    Set up Invoice Settings
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
                      Setup Complete
                    </Badge>
                  </div>
                </div>

                {/* Information Sections */}
                <InfoGrid>
                  {/* Contact Information */}
                  <InfoSection title="Contact Information">
                    {settings.email && (
                      <InfoItem 
                        label="Email" 
                        value={settings.email}
                        valueClassName="font-mono break-all"
                      />
                    )}
                    
                    {settings.phone && (
                      <InfoItem 
                        label="Phone" 
                        value={settings.phone}
                      />
                    )}
                    
                    {settings.address && (
                      <InfoItem 
                        label="Address" 
                        value={settings.address}
                        valueClassName="whitespace-pre-line"
                      />
                    )}
                  </InfoSection>

                  {/* Banking & Tax Information */}
                  <InfoSection title="Banking & Tax Information">
                    {settings.iban && (
                      <InfoItem 
                        label="IBAN" 
                        value={settings.iban}
                        valueClassName="font-mono break-all"
                      />
                    )}
                    
                    {settings.bic && (
                      <InfoItem 
                        label="BIC/SWIFT" 
                        value={settings.bic}
                        valueClassName="font-mono"
                      />
                    )}
                    
                    {settings.tax_id && (
                      <InfoItem 
                        label="Tax ID" 
                        value={settings.tax_id}
                      />
                    )}
                    
                    {settings.vat_id && (
                      <InfoItem 
                        label="VAT ID" 
                        value={settings.vat_id}
                      />
                    )}
                    
                    {!settings.iban && !settings.bic && !settings.tax_id && !settings.vat_id && (
                      <p className="text-sm text-gray-600 italic">No banking or tax information provided</p>
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
                  Billing Profiles
                </CardTitle>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Set up billing information for studios and teachers
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BillingEntityManagement userId={userId} />
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
    </div>
  )
} 