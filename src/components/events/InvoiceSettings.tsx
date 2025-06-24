'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DataLoader from '@/components/ui/data-loader'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { getUserInvoiceSettings } from '@/lib/invoice-utils'
import { UserInvoiceSettingsModal } from './UserInvoiceSettingsModal'
import { UserInvoiceSettings } from '@/lib/types'
import { StudioManagement } from './StudioManagement'

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
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-gray-900">
                Your Invoice Information
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Set up your personal billing details for generating invoices
              </p>
            </div>
            {userSettings && (
              <Button 
                variant="outline" 
                onClick={() => setShowSettingsModal(true)}
              >
                Edit Settings
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <DataLoader
            data={userSettings}
            loading={loadingSettings}
            error={settingsError?.message || null}
            empty={
              <div className="text-center py-8">
                <div className="text-gray-600 mb-4">
                  <p className="text-lg mb-2">No invoice settings configured</p>
                  <p className="mb-4">Set up your billing information to generate invoices</p>
                  <Button 
                    onClick={() => setShowSettingsModal(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Set up Invoice Settings
                  </Button>
                </div>
              </div>
            }
          >
            {(settings: UserInvoiceSettings) => (
              <div className="space-y-6">
                {/* Header with Status */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {settings.full_name}
                    </h3>
                    <Badge className="bg-green-100 text-green-800">
                      Setup Complete
                    </Badge>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                      Contact Information
                    </h4>
                    
                    {settings.email && (
                      <div className="space-y-1">
                        <span className="text-xs text-gray-600 uppercase tracking-wide">Email</span>
                        <p className="text-sm text-gray-900 font-mono">{settings.email}</p>
                      </div>
                    )}
                    
                    {settings.phone && (
                      <div className="space-y-1">
                        <span className="text-xs text-gray-600 uppercase tracking-wide">Phone</span>
                        <p className="text-sm text-gray-900">{settings.phone}</p>
                      </div>
                    )}
                    
                    {settings.address && (
                      <div className="space-y-1">
                        <span className="text-xs text-gray-600 uppercase tracking-wide">Address</span>
                        <p className="text-sm text-gray-900 whitespace-pre-line">{settings.address}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                      Banking & Tax Information
                    </h4>
                    
                    {settings.iban && (
                      <div className="space-y-1">
                        <span className="text-xs text-gray-600 uppercase tracking-wide">IBAN</span>
                        <p className="text-sm text-gray-900 font-mono">{settings.iban}</p>
                      </div>
                    )}
                    
                    {settings.bic && (
                      <div className="space-y-1">
                        <span className="text-xs text-gray-600 uppercase tracking-wide">BIC/SWIFT</span>
                        <p className="text-sm text-gray-900 font-mono">{settings.bic}</p>
                      </div>
                    )}
                    
                    {settings.tax_id && (
                      <div className="space-y-1">
                        <span className="text-xs text-gray-600 uppercase tracking-wide">Tax ID</span>
                        <p className="text-sm text-gray-900">{settings.tax_id}</p>
                      </div>
                    )}
                    
                    {settings.vat_id && (
                      <div className="space-y-1">
                        <span className="text-xs text-gray-600 uppercase tracking-wide">VAT ID</span>
                        <p className="text-sm text-gray-900">{settings.vat_id}</p>
                      </div>
                    )}
                    
                    {!settings.iban && !settings.bic && !settings.tax_id && !settings.vat_id && (
                      <p className="text-sm text-gray-600 italic">No banking or tax information provided</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DataLoader>
        </CardContent>
      </Card>

      {/* Studio Management Section */}
      <Card className="backdrop-blur-md border border-white/40">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">
            Studio Profiles
          </CardTitle>
          <p className="text-gray-600 mt-1">
            Set up billing information for studios you teach at
          </p>
        </CardHeader>
        <CardContent>
          <StudioManagement userId={userId} />
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