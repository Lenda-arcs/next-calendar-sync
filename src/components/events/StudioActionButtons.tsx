'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

interface StudioActionButtonsProps {
  isTeacher: boolean
  selectedCount: number
  hasSelected: boolean
  onCreateInvoice: () => void
  onBatchSubstitute?: () => void
  onRevertToStudio?: () => void
  isReverting?: boolean
  variant?: 'desktop' | 'mobile'
  className?: string
}

export function StudioActionButtons({
  isTeacher,
  selectedCount,
  hasSelected,
  onCreateInvoice,
  onBatchSubstitute,
  onRevertToStudio,
  isReverting = false,
  variant = 'desktop',
  className
}: StudioActionButtonsProps) {
  const isMobile = variant === 'mobile'
  const isDisabled = !hasSelected
  const opacity = isDisabled ? 'opacity-50' : ''

  if (isTeacher) {
    return (
      <div className={`flex ${isMobile ? 'flex-col' : 'sm:flex-row'} gap-2 ${className}`}>
        <Button
          onClick={onCreateInvoice}
          disabled={isDisabled}
          className={`bg-purple-600 hover:bg-purple-700 ${isMobile ? 'w-full' : 'w-full sm:w-auto'} ${opacity}`}
        >
          {isMobile ? (
            `Teacher Invoice (${selectedCount})`
          ) : (
            <>
              <span className="sm:hidden">Teacher Invoice</span>
              <span className="hidden sm:inline">Teacher Invoice ({selectedCount})</span>
            </>
          )}
        </Button>
        
        {onRevertToStudio && (
          <Button
            onClick={onRevertToStudio}
            disabled={isDisabled || isReverting}
            variant="outline"
            className={`${isMobile ? 'w-full' : 'w-full sm:w-auto'} ${opacity}`}
          >
            {isReverting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                {isMobile ? (
                  'Reverting...'
                ) : (
                  <>
                    <span className="sm:hidden">Reverting...</span>
                    <span className="hidden sm:inline">Reverting to Studio...</span>
                  </>
                )}
              </>
            ) : (
              isMobile ? (
                `Revert to Studio (${selectedCount})`
              ) : (
                <>
                  <span className="sm:hidden">Revert to Studio</span>
                  <span className="hidden sm:inline">Revert to Studio ({selectedCount})</span>
                </>
              )
            )}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'sm:flex-row'} gap-2 ${className}`}>
      <Button
        onClick={onCreateInvoice}
        disabled={isDisabled}
        className={`bg-blue-600 hover:bg-blue-700 ${isMobile ? 'w-full' : 'w-full sm:w-auto'} ${opacity}`}
      >
        {isMobile ? (
          `Studio Invoice (${selectedCount})`
        ) : (
          <>
            <span className="sm:hidden">Studio Invoice</span>
            <span className="hidden sm:inline">Studio Invoice ({selectedCount})</span>
          </>
        )}
      </Button>
      
      {onBatchSubstitute && (
        <Button
          onClick={onBatchSubstitute}
          disabled={isDisabled}
          variant="outline"
          className={`${isMobile ? 'w-full' : 'w-full sm:w-auto'} ${opacity}`}
        >
          {isMobile ? (
            `Change to Teacher (${selectedCount})`
          ) : (
            <>
              <span className="sm:hidden">Change to Teacher</span>
              <span className="hidden sm:inline">Change to Teacher ({selectedCount})</span>
            </>
          )}
        </Button>
      )}
    </div>
  )
} 