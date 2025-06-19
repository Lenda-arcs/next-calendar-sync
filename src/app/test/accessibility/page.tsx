import { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Keyboard, Volume2, MousePointer } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Accessibility Testing | Test Suite',
  description: 'Keyboard navigation, screen readers, and ARIA compliance testing',
}

export default function AccessibilityTestPage() {
  return (
    <div className="min-h-screen bg-background">
      <Container 
        maxWidth="4xl" 
        title="Accessibility Testing" 
        subtitle="Comprehensive testing for keyboard navigation, screen readers, and ARIA compliance"
        className="py-8"
      >
        <PageSection title="Accessibility Features" subtitle="Testing various accessibility implementations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Keyboard className="h-5 w-5 mr-2" />
                  Keyboard Navigation
                </CardTitle>
                <CardDescription>
                  Test tab order and keyboard shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Try navigating this page using only your keyboard:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Tab to move forward</li>
                    <li>• Shift+Tab to move backward</li>
                    <li>• Enter/Space to activate</li>
                    <li>• Arrow keys for navigation</li>
                  </ul>
                  <div className="flex space-x-2">
                    <Button size="sm">Focusable 1</Button>
                    <Button size="sm" variant="outline">Focusable 2</Button>
                    <Button size="sm" variant="ghost">Focusable 3</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Visual Indicators
                </CardTitle>
                <CardDescription>
                  Focus rings and visual feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    All interactive elements have visible focus indicators:
                  </p>
                  <div className="space-y-2">
                    <Badge>Focus ring visible</Badge>
                    <Badge variant="outline">High contrast</Badge>
                    <Badge variant="secondary">Clear boundaries</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Volume2 className="h-5 w-5 mr-2" />
                  Screen Reader Support
                </CardTitle>
                <CardDescription>
                  ARIA labels and semantic HTML
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Proper ARIA attributes and semantic markup:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• aria-label for context</li>
                    <li>• role attributes</li>
                    <li>• Semantic HTML elements</li>
                    <li>• Alt text for images</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MousePointer className="h-5 w-5 mr-2" />
                  Touch & Click Targets
                </CardTitle>
                <CardDescription>
                  Minimum 44px touch targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    All interactive elements meet WCAG guidelines:
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" className="min-h-[44px]">
                      44px min
                    </Button>
                    <Button size="lg" className="min-h-[44px]">
                      Large target
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </PageSection>

        <PageSection title="Color Contrast Testing" subtitle="WCAG AA and AAA compliance">
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Text Contrast</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-background text-foreground border rounded">
                      Normal text (AA: 4.5:1)
                    </div>
                    <div className="p-3 bg-muted text-muted-foreground border rounded">
                      Secondary text (AA: 3:1)
                    </div>
                    <div className="p-3 bg-primary text-primary-foreground rounded">
                      Primary contrast (AAA: 7:1)
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Interactive Elements</h3>
                  <div className="space-y-2">
                    <Button className="w-full">High contrast button</Button>
                    <Button variant="outline" className="w-full">
                      Outline button
                    </Button>
                    <Button variant="ghost" className="w-full">
                      Ghost button
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Implementation Status" subtitle="Accessibility features implemented">
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { feature: 'Focus Management', status: 'complete' },
                  { feature: 'Keyboard Navigation', status: 'complete' },
                  { feature: 'ARIA Labels', status: 'complete' },
                  { feature: 'Semantic HTML', status: 'complete' },
                  { feature: 'Color Contrast', status: 'complete' },
                  { feature: 'Touch Targets', status: 'complete' },
                  { feature: 'Screen Reader', status: 'complete' },
                  { feature: 'Skip Links', status: 'planned' },
                  { feature: 'Live Regions', status: 'planned' },
                ].map((item) => (
                  <div key={item.feature} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{item.feature}</span>
                    <Badge 
                      variant={item.status === 'complete' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </PageSection>
      </Container>
    </div>
  )
} 