'use client'

import React from 'react'
import { InvoiceManagement } from '@/components/invoices/InvoiceManagement'

interface ManageInvoicesClientProps {
  userId: string
}

//TODO This can be merged .. as this only renders InvoiceManagement
export function ManageInvoicesClient({ userId }: ManageInvoicesClientProps) {
  // Just render the InvoiceManagement component directly
  // The global caching in useSupabaseQuery should handle duplicate requests automatically
  return <InvoiceManagement userId={userId} />
} 