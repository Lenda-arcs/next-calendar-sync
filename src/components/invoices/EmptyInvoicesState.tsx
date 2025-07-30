'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n/context'

interface EmptyInvoicesStateProps {
  onCreateNewInvoice: () => void
}

export function EmptyInvoicesState({ onCreateNewInvoice }: EmptyInvoicesStateProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardContent className="py-12 text-center">
        <div className="w-12 h-12 mx-auto mb-4 text-gray-300">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('invoices.management.invoicesTab.noInvoicesTitle')}</h3>
        <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
          {t('invoices.management.invoicesTab.noInvoicesDescription')}
        </p>
        <Button 
          onClick={onCreateNewInvoice}
          variant="outline"
        >
          {t('invoices.management.invoicesTab.viewUninvoiced')}
        </Button>
      </CardContent>
    </Card>
  )
}