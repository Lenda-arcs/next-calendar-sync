'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAppTheme } from '@/components/providers'
import { themeConfig } from '@/lib/design-system'
import { Palette, Check } from 'lucide-react'

export function ThemeSwitcher() {
  const { variant, setVariant, availableVariants } = useAppTheme()

  return (
    <Card variant="default" className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Variants
        </CardTitle>
        <CardDescription>
          Choose your preferred glassmorphism theme variant
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {availableVariants.map((themeVariant) => (
          <Button
            key={themeVariant.key}
            variant={variant === themeVariant.key ? "default" : "secondary"}
            className="w-full justify-between"
            onClick={() => setVariant(themeVariant.key)}
          >
            <span>{themeVariant.name}</span>
            {variant === themeVariant.key && (
              <Badge variant="secondary" className="ml-2">
                <Check className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

// Compact version for navigation/settings
export function CompactThemeSwitcher() {
  const { variant, setVariant, availableVariants } = useAppTheme()

  return (
    <div className="flex items-center gap-2">
      <Palette className="h-4 w-4 text-muted-foreground" />
      <select
        value={variant}
        onChange={(e) => setVariant(e.target.value as keyof typeof themeConfig.variants)}
        className="px-2 py-1 rounded-md bg-white/50 border border-white/40 text-sm backdrop-blur-md"
      >
        {availableVariants.map((themeVariant) => (
          <option key={themeVariant.key} value={themeVariant.key}>
            {themeVariant.name}
          </option>
        ))}
      </select>
    </div>
  )
}