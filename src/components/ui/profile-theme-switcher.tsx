'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { themeConfig } from '@/lib/design-system'
import { useAppTheme } from '@/components/providers'
import { Check } from 'lucide-react'

type ThemeVariant = keyof typeof themeConfig.variants

interface ProfileThemeSwitcherProps {
  value: ThemeVariant
  onChange: (variant: ThemeVariant) => void
}

export function ProfileThemeSwitcher({ value, onChange }: ProfileThemeSwitcherProps) {
  const { setVariantPreview } = useAppTheme()

  const availableVariants = Object.entries(themeConfig.variants).map(([key, config]) => ({
    key: key as ThemeVariant,
    name: config.name,
  }))

  const handleThemeChange = (variant: ThemeVariant) => {
    // Update the form value (triggers FAB)
    onChange(variant)
    // Update the visual theme immediately for preview
    setVariantPreview(variant)
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Theme Variant
        </label>
        <p className="text-xs text-muted-foreground">
          Choose your preferred theme. This will also change the theme on your public student-facing pages.
        </p>
      </div>
      
      {/* Responsive grid with different layouts for mobile vs desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {availableVariants.map((variant) => (
          <Button
            type="button"
            key={variant.key}
            variant={value === variant.key ? "default" : "outline"}
            className="w-full h-auto p-3 flex lg:flex-col lg:items-center lg:text-center items-start justify-between gap-2"
            onClick={() => handleThemeChange(variant.key)}
          >
            <div className="flex flex-col lg:items-center items-start gap-1">
              <span className="font-medium text-sm">{variant.name}</span>
              <span className="text-xs opacity-70">
                {variant.key === 'default' && 'Classic'}
                {variant.key === 'ocean' && 'Cool blue'}
                {variant.key === 'sunset' && 'Warm pink'}
              </span>
            </div>
            {value === variant.key && (
              <Badge variant="secondary" className="text-xs shrink-0">
                <Check className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}