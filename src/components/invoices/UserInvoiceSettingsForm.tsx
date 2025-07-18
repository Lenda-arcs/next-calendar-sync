'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useSupabaseMutation } from '@/lib/hooks/useSupabaseMutation'
import { UserInvoiceSettings, UserInvoiceSettingsInsert, UserInvoiceSettingsUpdate } from '@/lib/types'
import { useTranslation } from '@/lib/i18n/context'
import { Loader2 } from 'lucide-react'

interface UserInvoiceSettingsFormProps {
  userId: string
  existingSettings?: UserInvoiceSettings | null
  onSettingsUpdated?: () => void
  isModal?: boolean
  onLoadingChange?: (loading: boolean) => void
  formRef?: React.RefObject<HTMLFormElement | null>
}

export function UserInvoiceSettingsForm({
  userId,
  existingSettings,
  onSettingsUpdated,
  isModal = false,
  onLoadingChange,
  formRef
}: UserInvoiceSettingsFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    iban: '',
    bic: '',
    tax_id: '',
    vat_id: '',
    kleinunternehmerregelung: false
  })

  // Populate form with existing settings
  useEffect(() => {
    if (existingSettings) {
      setFormData({
        full_name: existingSettings.full_name || '',
        email: existingSettings.email || '',
        phone: existingSettings.phone || '',
        address: existingSettings.address || '',
        iban: existingSettings.iban || '',
        bic: existingSettings.bic || '',
        tax_id: existingSettings.tax_id || '',
        vat_id: existingSettings.vat_id || '',
        kleinunternehmerregelung: false
      })
    }
  }, [existingSettings])

  // Mutation for creating/updating settings
  const settingsMutation = useSupabaseMutation({
    mutationFn: async (supabase, data: UserInvoiceSettingsInsert | UserInvoiceSettingsUpdate) => {
      if (existingSettings) {
        // Update existing settings
        const { data: result, error } = await supabase
          .from('user_invoice_settings')
          .update(data)
          .eq('user_id', userId)
          .select()
          .single()
        
        if (error) throw error
        return result
      } else {
        // Create new settings
        const { data: result, error } = await supabase
          .from('user_invoice_settings')
          .insert({ ...data, user_id: userId })
          .select()
          .single()
        
        if (error) throw error
        return result
      }
    },
    onSuccess: () => {
      if (onSettingsUpdated) {
        onSettingsUpdated()
      }
    }
  })

  // Notify parent about loading state changes
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(settingsMutation.isLoading)
    }
  }, [settingsMutation.isLoading, onLoadingChange])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    const data = {
      full_name: formData.full_name,
      email: formData.email || null,
      phone: formData.phone || null,
      address: formData.address || null,
      iban: formData.iban || null,
      bic: formData.bic || null,
      tax_id: formData.tax_id || null,
      vat_id: formData.vat_id || null,
      kleinunternehmerregelung: formData.kleinunternehmerregelung
    }

    await settingsMutation.mutateAsync(data)
  }, [formData, settingsMutation])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'kleinunternehmerregelung' ? value === 'true' : value
    }))
  }

  const isFormValid = formData.full_name.trim() !== ''

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{t('invoices.settingsForm.basicInfo')}</h3>
        
        <div>
          <Label htmlFor="full_name">{t('invoices.settingsForm.fullNameRequired')}</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            required
            disabled={settingsMutation.isLoading}
          />
        </div>

        <div>
          <Label htmlFor="email">{t('invoices.settingsForm.email')}</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={settingsMutation.isLoading}
          />
        </div>

        <div>
          <Label htmlFor="phone">{t('invoices.settingsForm.phone')}</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={settingsMutation.isLoading}
          />
        </div>

        <div>
          <Label htmlFor="address">{t('invoices.settingsForm.address')}</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            rows={3}
            disabled={settingsMutation.isLoading}
          />
        </div>
      </div>

      {/* Banking Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{t('invoices.settingsForm.bankingInfo')}</h3>
        
        <div>
          <Label htmlFor="iban">{t('invoices.settingsForm.iban')}</Label>
          <Input
            id="iban"
            value={formData.iban}
            onChange={(e) => handleInputChange('iban', e.target.value)}
            placeholder={t('invoices.settingsForm.ibanPlaceholder')}
            disabled={settingsMutation.isLoading}
          />
        </div>

        <div>
          <Label htmlFor="bic">{t('invoices.settingsForm.bic')}</Label>
          <Input
            id="bic"
            value={formData.bic}
            onChange={(e) => handleInputChange('bic', e.target.value)}
            placeholder={t('invoices.settingsForm.bicPlaceholder')}
            disabled={settingsMutation.isLoading}
          />
        </div>
      </div>

      {/* Tax Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{t('invoices.settingsForm.taxInfo')}</h3>
        
        <div>
          <Label htmlFor="tax_id">{t('invoices.settingsForm.taxId')}</Label>
          <Input
            id="tax_id"
            value={formData.tax_id}
            onChange={(e) => handleInputChange('tax_id', e.target.value)}
            disabled={settingsMutation.isLoading}
          />
        </div>

        <div>
          <Label htmlFor="vat_id">{t('invoices.settingsForm.vatId')}</Label>
          <Input
            id="vat_id"
            value={formData.vat_id}
            onChange={(e) => handleInputChange('vat_id', e.target.value)}
            placeholder={t('invoices.settingsForm.vatIdPlaceholder')}
            disabled={settingsMutation.isLoading}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="kleinunternehmerregelung"
            checked={formData.kleinunternehmerregelung}
            onChange={(e) => handleInputChange('kleinunternehmerregelung', e.target.checked.toString())}
            disabled={settingsMutation.isLoading}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <Label htmlFor="kleinunternehmerregelung" className="text-sm">
            {t('invoices.settingsForm.kleinunternehmerregelung')}
          </Label>
        </div>
        <p className="text-sm text-gray-500 ml-6">
          {t('invoices.settingsForm.kleinunternehmerregelungDesc')}
        </p>
      </div>

      {/* Error Display */}
      {settingsMutation.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            {settingsMutation.error.message}
          </p>
        </div>
      )}

      {/* Submit Button - Only show when not in modal mode */}
      {!isModal && (
        <div className="flex justify-end space-x-3">
          <Button
            type="submit"
            disabled={settingsMutation.isLoading || !isFormValid}
          >
            {settingsMutation.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('invoices.settingsForm.saving')}
              </>
            ) : (
              existingSettings ? t('invoices.settingsForm.updateSettings') : t('invoices.settingsForm.saveSettings')
            )}
          </Button>
        </div>
      )}
    </form>
  )
} 