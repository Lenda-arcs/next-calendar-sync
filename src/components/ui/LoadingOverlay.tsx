import React from 'react'

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
}

export function LoadingOverlay({ 
  isVisible, 
  message = 'Loading...' 
}: LoadingOverlayProps) {
  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  )
} 