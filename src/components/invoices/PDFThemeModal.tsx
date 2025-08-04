'use client'

import React, { useState, useEffect } from 'react'
import { useSupabaseQuery, useSupabaseMutation } from '@/lib/hooks/useQueryWithSupabase'
import { getUserInvoiceSettings } from '@/lib/invoice-utils'
import { UserInvoiceSettings, PDFTemplateConfig, PDFTemplateTheme } from '@/lib/types'
import { PDFTemplateCustomization } from '@/components/export/PDFTemplateCustomizationSimple'
import { useTranslation } from '@/lib/i18n/context'
import { toast } from 'sonner'

interface PDFThemeModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function PDFThemeModal({ isOpen, onClose, userId }: PDFThemeModalProps) {
  const { t } = useTranslation()
  const [pdfConfig, setPdfConfig] = useState<PDFTemplateConfig | null>(null)
  const [pdfTheme, setPdfTheme] = useState<PDFTemplateTheme>('professional')

  // Load user invoice settings
  const { 
    data: userSettings, 
    refetch: refetchSettings 
  } = useSupabaseQuery(
    ['user-invoice-settings', userId],
    () => getUserInvoiceSettings(userId),
    { enabled: !!userId && isOpen }
  )

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
    try {
      // Save the actual current state from the modal, not parent state
      await pdfTemplateMutation.mutateAsync({
        pdf_template_config: config,
        template_theme: theme
      })
      // Update parent state after successful save
      setPdfConfig(config)
      setPdfTheme(theme)
      // Close modal after successful save
      onClose()
    } catch (error) {
      // Error is already handled by the mutation's onError
      console.error('Failed to save PDF template:', error)
    }
  }



  return (
    <PDFTemplateCustomization
      isOpen={isOpen}
      onClose={onClose}
      userId={userId}
      currentConfig={pdfConfig}
      currentTheme={pdfTheme}
      onConfigChange={setPdfConfig}
      onThemeChange={setPdfTheme}
      onSave={handleSavePdfTemplate}
      isLoading={pdfTemplateMutation.isPending}
    />
  )
}