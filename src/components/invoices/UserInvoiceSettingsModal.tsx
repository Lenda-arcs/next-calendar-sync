'use client'

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { UserInvoiceSettingsForm } from './UserInvoiceSettingsForm'
import { UserInvoiceSettings } from '@/lib/types'
import { Loader2 } from 'lucide-react'

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
  const formRef = useRef<HTMLFormElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSettingsUpdated = () => {
    if (onSettingsUpdated) {
      onSettingsUpdated()
    }
    onClose()
  }

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit()
    }
  }

  const footer = (
    <div className="flex justify-end space-x-3">
      <Button
        variant="outline"
        onClick={onClose}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          existingSettings ? 'Update Settings' : 'Save Settings'
        )}
      </Button>
    </div>
  )

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={onClose}
      title={existingSettings ? "Edit Invoice Settings" : "Set up Invoice Settings"}
      size="xl"
      footer={footer}
    >
      <UserInvoiceSettingsForm
        userId={userId}
        existingSettings={existingSettings}
        onSettingsUpdated={handleSettingsUpdated}
        isModal={true}
        onLoadingChange={setIsLoading}
        formRef={formRef}
      />
    </UnifiedDialog>
  )
} 