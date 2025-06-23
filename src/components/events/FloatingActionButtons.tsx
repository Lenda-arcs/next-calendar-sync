'use client'

import { Button } from '@/components/ui/button'
import { Save, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingActionButtonsProps {
  pendingChangesCount: number
  isSaving: boolean
  onSave: () => void
  onDiscard: () => void
}

export default function FloatingActionButtons({
  pendingChangesCount,
  isSaving,
  onSave,
  onDiscard
}: FloatingActionButtonsProps) {
  if (pendingChangesCount === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col gap-2">
        {/* Discard button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onDiscard}
          className="bg-background shadow-lg border-2"
          disabled={isSaving}
          title="Discard all pending changes"
        >
          <X className="h-4 w-4" />
        </Button>
        
        {/* Save button */}
        <Button
          onClick={onSave}
          disabled={isSaving}
          className={cn(
            "shadow-lg min-w-[120px] transition-all duration-200",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            isSaving && "bg-primary/50"
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save {pendingChangesCount} Change{pendingChangesCount !== 1 ? 's' : ''}
            </>
          )}
        </Button>
      </div>
    </div>
  )
} 