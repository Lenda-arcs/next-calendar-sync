'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { themeConfig } from '@/lib/design-system'
import { useAppTheme } from '@/components/providers'
import { Palette, Check } from 'lucide-react'

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

  const handleThemeChange
      = (variant: ThemeVariant) => {
    // Update the form value (triggers FAB)
    onChange(variant)
    // Update the visual theme immediately for preview
    setVariantPreview(variant)
  }

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Palette className="h-5 w-5" />
          Theme Preferences
        </CardTitle>
        <CardDescription>
          Choose your preferred glassmorphism theme variant. Changes preview immediately - click &quot;Save&quot; to save to your profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Responsive grid: column on mobile, row on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
          {availableVariants.map((variant) => (
            <Button
                type="button"

              key={variant.key}
              variant={value === variant.key ? "default" : "secondary"}
              className="w-full justify-between h-auto p-4"
              onClick={() => handleThemeChange(variant.key)}
            >
              <div className="flex flex-col items-start text-left">
                <span className="font-medium">{variant.name}</span>
                <span className="text-xs opacity-80 mt-1">
                  {variant.key === 'default' && 'Classic glassmorphism'}
                  {variant.key === 'ocean' && 'Cool blue tones'}
                  {variant.key === 'sunset' && 'Warm pink hues'}
                </span>
              </div>
              {value === variant.key && (
                <Badge variant="secondary" className="ml-2 shrink-0">
                  <Check className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}