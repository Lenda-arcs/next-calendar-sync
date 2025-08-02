'use client'

import React from 'react'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeSwitcher, CompactThemeSwitcher } from '@/components/ui/theme-switcher'
import { useThemeClasses, useAppTheme } from '@/components/providers'
import { tokens, variants, utils } from '@/lib/design-system'
import { Badge } from '@/components/ui/badge'
import { Code, Palette, Sparkles } from 'lucide-react'

/**
 * Theme System Showcase
 * Demonstrates the centralized theme system with live examples
 */
export function ThemeShowcase() {
  const { variant } = useAppTheme()
  const themeClasses = useThemeClasses()

  return (
    <Container>
      <PageSection>
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-serif font-bold">
              Centralized Theme System
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A unified approach to styling with glassmorphism, shadcn integration, 
              and dynamic theme switching.
            </p>
            <Badge variant="secondary" className="mt-4">
              Current Theme: {variant}
            </Badge>
          </div>

          {/* Theme Switcher */}
          <div className="flex justify-center">
            <ThemeSwitcher />
          </div>

          {/* Color System Demo */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Color System Integration</CardTitle>
              <CardDescription>
                Current theme colors and variants in action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: tokens.colors.glassmorphism.background }}>
                  <p className="text-xs font-mono">background</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: tokens.colors.glassmorphism.accent }}>
                  <p className="text-xs font-mono">accent</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: tokens.colors.glassmorphism.muted }}>
                  <p className="text-xs font-mono">muted</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: tokens.colors.glassmorphism.surface }}>
                  <p className="text-xs font-mono">surface</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Button Variants:</p>
                <div className="flex gap-2 flex-wrap">
                  {Object.keys(variants.button.variant).map((variantName) => (
                    <Button 
                      key={variantName} 
                      variant={variantName as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"}
                      size="sm"
                    >
                      {variantName}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Component Examples */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Live Components
                </CardTitle>
                <CardDescription>
                  Components using the theme system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="default" size="sm">
                  Primary Button
                </Button>
                <Button variant="secondary" size="sm">
                  Secondary Button
                </Button>
                <Input placeholder="Themed input..." />
                <div className="flex gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Design Tokens */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Design Tokens
                </CardTitle>
                <CardDescription>
                  Centralized tokens and utilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="font-medium text-sm">Spacing Scale:</p>
                  <div className="flex gap-1">
                    {Object.entries(tokens.spacing).slice(0, 5).map(([key, value]) => (
                      <div 
                        key={key}
                        className="bg-primary/20 rounded"
                        style={{ 
                          width: value, 
                          height: value,
                          minWidth: '8px',
                          minHeight: '8px'
                        }}
                        title={`${key}: ${value}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm">Border Radius:</p>
                  <div className="flex gap-2">
                    {Object.entries(tokens.borderRadius).slice(1, 4).map(([key, value]) => (
                      <div 
                        key={key}
                        className="w-8 h-8 bg-accent/30 border"
                        style={{ borderRadius: value }}
                        title={`${key}: ${value}`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Glass Effects & Theme Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Glass Effects & Current Theme
                </CardTitle>
                <CardDescription>
                  Glassmorphism variations and active theme classes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className={`p-3 rounded-lg ${utils.glass.light}`}>
                  <p className="text-sm">Light Glass: {utils.glass.light}</p>
                </div>
                <div className={`p-3 rounded-lg ${utils.glass.medium}`}>
                  <p className="text-sm">Medium Glass: {utils.glass.medium}</p>
                </div>
                <div className={`p-3 rounded-lg ${utils.glass.heavy}`}>
                  <p className="text-sm">Heavy Glass: {utils.glass.heavy}</p>
                </div>
                <div className={`p-3 rounded-lg ${themeClasses.glass}`}>
                  <p className="text-sm">Current Theme Glass</p>
                  <code className="text-xs opacity-80">{themeClasses.glass}</code>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Examples */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
              <CardDescription>
                Examples of using the centralized theme system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">1. Import design tokens:</h4>
                <code className="block p-3 bg-muted/50 rounded text-sm">
                  {`import { tokens, variants, utils, colors } from '@/lib/design-system'`}
                </code>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">2. Use theme provider:</h4>
                <code className="block p-3 bg-muted/50 rounded text-sm">
                  {`import { ThemeProvider, useAppTheme } from '@/components/providers'

function App() {
  return (
    <ThemeProvider defaultVariant="default">
      <YourApp />
    </ThemeProvider>
  )
}`}
                </code>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">3. Use in components:</h4>
                <code className="block p-3 bg-muted/50 rounded text-sm">
                  {`const { variant, setVariant } = useAppTheme()
const themeClasses = useThemeClasses()

// Use glassmorphism utilities
<div className={utils.glass.medium}>
  Content with glass effect
</div>`}
                </code>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">4. Compact theme switcher:</h4>
                <div className="flex items-center gap-4">
                  <CompactThemeSwitcher />
                  <span className="text-sm text-muted-foreground">
                    Add this to your navigation or settings
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </Container>
  )
}