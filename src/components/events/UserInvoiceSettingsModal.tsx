'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingSettings ? "Edit Invoice Settings" : "Set up Invoice Settings"}
          </DialogTitle>
        </DialogHeader>

        <UserInvoiceSettingsForm
          userId={userId}
          existingSettings={existingSettings}
          onSettingsUpdated={handleSettingsUpdated}
          isModal={true}
        />
      </DialogContent>
    </Dialog>
  )
} 