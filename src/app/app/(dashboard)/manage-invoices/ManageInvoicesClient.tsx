'use client'

import React from 'react'
import { InvoiceManagement } from '@/components/events/InvoiceManagement'

interface ManageInvoicesClientProps {
  userId: string
}

export function ManageInvoicesClient({ userId }: ManageInvoicesClientProps) {
  // Just render the InvoiceManagement component directly
  // The global caching in useSupabaseQuery should handle duplicate requests automatically
  return <InvoiceManagement userId={userId} />
} 