import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'

interface ActionButton {
  label: string
  mobileLabel?: string
  icon: LucideIcon
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  variant?: 'default' | 'outline'
  className?: string
}

interface InfoCardSectionProps {
  title: string
  count: number
  description: string
  mobileDescription?: string
  icon: LucideIcon
  colorScheme: {
    background: string
    border: string
    iconBg: string
    iconColor: string
    titleColor: string
    descriptionColor: string
    buttonBase: string
    buttonHover: string
    buttonText: string
    buttonBorder: string
  }
  actions: ActionButton[]
  additionalContent?: React.ReactNode
  layout?: 'horizontal' | 'vertical'
}

export function InfoCardSection({
  title,
  count,
  description,
  mobileDescription,
  icon: Icon,
  colorScheme,
  actions,
  additionalContent,
  layout = 'horizontal'
}: InfoCardSectionProps) {
  if (layout === 'vertical') {
    return (
      <Card className={`${colorScheme.background} ${colorScheme.border}`}>
        <CardContent className="py-4 px-4 sm:px-6">
          <div className="flex flex-col gap-4">
            {/* Top content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 ${colorScheme.iconBg} rounded-full flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${colorScheme.iconColor}`} />
                </div>
                <h4 className={`text-sm font-medium ${colorScheme.titleColor}`}>
                  {title} {count > 0 && `(${count})`}
                </h4>
              </div>
              
              <p className={`text-xs ${colorScheme.descriptionColor} mb-3 leading-relaxed`}>
                <span className="hidden sm:block">{description}</span>
                <span className="sm:hidden">{mobileDescription || description}</span>
              </p>
              
              {additionalContent}
            </div>
            
            {/* Bottom actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={action.onClick}
                  disabled={action.disabled || action.loading}
                  className={`${colorScheme.buttonBase} ${colorScheme.buttonHover} ${colorScheme.buttonText} ${colorScheme.buttonBorder} ${action.className || ''} w-full sm:w-auto whitespace-nowrap`}
                >
                  <action.icon className={`mr-2 h-4 w-4 ${action.loading ? 'animate-spin' : ''}`} />
                  <span className="sm:hidden">{action.mobileLabel || action.label}</span>
                  <span className="hidden sm:inline">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default horizontal layout
  return (
    <Card className={`${colorScheme.background} ${colorScheme.border}`}>
      <CardContent className="py-4 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Left content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 ${colorScheme.iconBg} rounded-full flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${colorScheme.iconColor}`} />
              </div>
              <h4 className={`text-sm font-medium ${colorScheme.titleColor}`}>
                {title} ({count})
              </h4>
            </div>
            
            <p className={`text-xs ${colorScheme.descriptionColor} mb-3 leading-relaxed`}>
              <span className="hidden sm:block">{description}</span>
              <span className="sm:hidden">{mobileDescription || description}</span>
            </p>
            
            {additionalContent}
          </div>
          
          {/* Right actions */}
          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'outline'}
                size="sm"
                onClick={action.onClick}
                disabled={action.disabled || action.loading}
                className={`${colorScheme.buttonBase} ${colorScheme.buttonHover} ${colorScheme.buttonText} ${colorScheme.buttonBorder} ${action.className || ''} w-full sm:w-auto whitespace-nowrap`}
              >
                <action.icon className={`mr-2 h-4 w-4 ${action.loading ? 'animate-spin' : ''}`} />
                <span className="sm:hidden">{action.mobileLabel || action.label}</span>
                <span className="hidden sm:inline">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Predefined color schemes for consistency
export const colorSchemes = {
  orange: {
    background: 'bg-orange-50/50',
    border: 'border-orange-200',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    titleColor: 'text-orange-900',
    descriptionColor: 'text-orange-700',
    buttonBase: 'bg-orange-100 hover:bg-orange-200',
    buttonHover: 'hover:bg-orange-200',
    buttonText: 'text-orange-800',
    buttonBorder: 'border-orange-300'
  },
  purple: {
    background: 'bg-gradient-to-br from-purple-50/80 to-purple-100/40',
    border: 'border-purple-200/80',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    titleColor: 'text-purple-900',
    descriptionColor: 'text-purple-700/90',
    buttonBase: 'bg-purple-100 hover:bg-purple-200',
    buttonHover: 'hover:bg-purple-200',
    buttonText: 'text-purple-800',
    buttonBorder: 'border-purple-300'
  },
  blue: {
    background: 'bg-gradient-to-br from-blue-50/80 to-blue-100/40',
    border: 'border-blue-200/80',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
    descriptionColor: 'text-blue-700/90',
    buttonBase: 'bg-blue-100 hover:bg-blue-200',
    buttonHover: 'hover:bg-blue-200',
    buttonText: 'text-blue-800',
    buttonBorder: 'border-blue-300'
  }
} 