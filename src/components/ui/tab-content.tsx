import React from 'react'
import { cn } from '@/lib/utils'

interface TabContentProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

export const TabContent: React.FC<TabContentProps> = ({
  children,
  title,
  description,
  className
}) => {
  return (
    <div className={cn(
      "pt-8 px-1 space-y-6",
      className
    )}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h2 className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-gray-600 text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      <div>
        {children}
      </div>
    </div>
  )
} 