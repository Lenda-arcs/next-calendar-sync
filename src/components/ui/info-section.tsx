import React from 'react'

interface InfoSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

interface InfoItemProps {
  label: string
  value: string | React.ReactNode
  className?: string
  valueClassName?: string
}

export function InfoSection({ title, children, className }: InfoSectionProps) {
  return (
    <div className={`space-y-3 sm:space-y-4 ${className || ''}`}>
      <h4 className="font-medium text-gray-900 text-xs sm:text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
        {title}
      </h4>
      <div className="space-y-3 sm:space-y-4">
        {children}
      </div>
    </div>
  )
}

export function InfoItem({ label, value, className, valueClassName }: InfoItemProps) {
  return (
    <div className={`space-y-1 ${className || ''}`}>
      <span className="text-xs text-gray-600 uppercase tracking-wide block">
        {label}
      </span>
      <div className={`text-sm sm:text-base text-gray-900 ${valueClassName || ''}`}>
        {value}
      </div>
    </div>
  )
}

// Grid container for responsive layout
interface InfoGridProps {
  children: React.ReactNode
  className?: string
}

export function InfoGrid({ children, className }: InfoGridProps) {
  return (
    <div className={`space-y-6 sm:grid sm:grid-cols-1 md:grid-cols-2 sm:gap-6 sm:space-y-0 ${className || ''}`}>
      {children}
    </div>
  )
} 