'use client'

import React from 'react'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { BillingEntityManagement } from '@/components/billing/BillingEntityManagement'
import { useTranslation } from '@/lib/i18n/context'

interface BillingConfigurationModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function BillingConfigurationModal({ 
  isOpen, 
  onClose, 
  userId 
}: BillingConfigurationModalProps) {
  const { t } = useTranslation()

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={onClose}
      title={t('invoices.billing.configurationTitle')}
      description={t('invoices.billing.configurationDescription')}
      size="xl"
      className="max-h-[90vh]"
    >
      <div className="space-y-4">
        <BillingEntityManagement userId={userId} />
      </div>
    </UnifiedDialog>
  )
}