'use client'

import React from 'react'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { UserInvoiceSettingsForm } from './UserInvoiceSettingsForm'
import { UserInvoiceSettings } from '@/lib/types'

interface UserInvoiceSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  existingSettings?: UserInvoiceSettings | null
  onSettingsUpdated?: () => void
}

export function UserInvoiceSettingsModal({
  isOpen,
  onClose,
  userId,
  existingSettings,
  onSettingsUpdated
}: UserInvoiceSettingsModalProps) {
  const handleSettingsUpdated = () => {
    if (onSettingsUpdated) {
      onSettingsUpdated()
    }
    onClose()
  }

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={onClose}
      title={existingSettings ? "Edit Invoice Settings" : "Set up Invoice Settings"}
      size="xl"
    >
      <UserInvoiceSettingsForm
        userId={userId}
        existingSettings={existingSettings}
        onSettingsUpdated={handleSettingsUpdated}
        isModal={true}
      />
    </UnifiedDialog>
  )
} 