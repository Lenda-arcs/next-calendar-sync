'use client'

import React, { useState } from 'react'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EventCard } from '@/components/events'
import { useResponsive, useIsMobile, useBreakpoint } from '@/lib/hooks'
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Laptop,
  Info,
  Eye
} from 'lucide-react'

// Mock event data
const mockEvent = {
  id: '1',
  title: 'Responsive Design Test Event',
  dateTime: new Date().toISOString(),
  location: 'Test Studio',
  imageQuery: 'responsive design test',
  tags: []
}

export default function ResponsiveTestPage() {
  const [forcedBreakpoint, setForcedBreakpoint] = useState<string | null>(null)
  const responsive = useResponsive()
  const isMobile = useIsMobile()
  const currentBreakpoint = useBreakpoint()

  const breakpoints = [
    { name: 'Mobile', icon: Smartphone, key: 'sm', width: '< 768px' },
    { name: 'Tablet', icon: Tablet, key: 'md', width: '768px - 1023px' },
    { name: 'Laptop', icon: Laptop, key: 'lg', width: '1024px - 1279px' },
    { name: 'Desktop', icon: Monitor, key: 'xl', width: '1280px+' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Container 
        maxWidth="4xl" 
        title="Responsive Design Testing" 
        subtitle="Test how components adapt to different screen sizes and breakpoints"
        className="py-8"
      >
        {/* Current Screen Info */}
        <PageSection title="Current Screen Information" subtitle="Real-time screen size detection">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Screen Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Dimensions</div>
                  <div className="text-lg font-mono">
                    {responsive.width} × {responsive.height}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Breakpoint</div>
                  <Badge variant="outline" className="text-sm">
                    {currentBreakpoint.toUpperCase()}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Device Type</div>
                  <div className="text-sm">
                    {responsive.isMobile && 'Mobile'}
                    {responsive.isTablet && 'Tablet'}
                    {responsive.isDesktop && 'Desktop'}
                    {responsive.isLarge && 'Large Desktop'}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Is Mobile</div>
                  <Badge variant={isMobile ? 'default' : 'outline'}>
                    {isMobile ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </PageSection>

        {/* Breakpoint Controls */}
        <PageSection title="Breakpoint Testing" subtitle="Force different breakpoint behaviors">
          <Card>
            <CardHeader>
              <CardTitle>Breakpoint Simulator</CardTitle>
              <CardDescription>
                Test how components look at different screen sizes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={forcedBreakpoint === null ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setForcedBreakpoint(null)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Auto Detect
                  </Button>
                  {breakpoints.map((bp) => {
                    const IconComponent = bp.icon
                    return (
                      <Button
                        key={bp.key}
                        variant={forcedBreakpoint === bp.key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setForcedBreakpoint(bp.key)}
                      >
                        <IconComponent className="h-4 w-4 mr-2" />
                        {bp.name}
                      </Button>
                    )
                  })}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  {breakpoints.map((bp) => (
                    <div key={bp.key} className="p-3 border rounded-lg">
                      <div className="font-medium">{bp.name}</div>
                      <div className="text-muted-foreground">{bp.width}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </PageSection>

        {/* Responsive Grid Examples */}
        <PageSection title="Responsive Grids" subtitle="How grids adapt to different screen sizes">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Standard Grid (1/2/3/4 columns)</CardTitle>
                <CardDescription>
                  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="p-4 bg-muted rounded-lg text-center">
                      Item {i + 1}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>EventCard Grid</CardTitle>
                <CardDescription>
                  How EventCards adapt to different screen sizes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <EventCard
                    {...mockEvent}
                    variant="minimal"
                    forceMobile={forcedBreakpoint === 'sm'}
                  />
                  <EventCard
                    {...mockEvent}
                    variant="compact"
                    forceMobile={forcedBreakpoint === 'sm'}
                  />
                  <EventCard
                    {...mockEvent}
                    variant="full"
                    forceMobile={forcedBreakpoint === 'sm'}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </PageSection>

        {/* Typography Scaling */}
        <PageSection title="Responsive Typography" subtitle="How text scales across breakpoints">
          <Card>
            <CardContent className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  Responsive Heading (text-2xl sm:text-3xl lg:text-4xl)
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                  Responsive body text (text-sm sm:text-base lg:text-lg)
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Mobile First</h3>
                  <div className="space-y-2 text-sm">
                    <div>text-sm (14px)</div>
                    <div>sm:text-base (16px)</div>
                    <div>lg:text-lg (18px)</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Current Size</h3>
                  <div className="space-y-2">
                    <Badge variant="outline">
                      {responsive.width < 640 ? '14px' : 
                       responsive.width < 1024 ? '16px' : '18px'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </PageSection>

        {/* Component Behavior */}
        <PageSection title="Component Behavior" subtitle="How components change at different breakpoints">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Button Responsive Behavior</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button className="w-full sm:w-auto">
                      Full width on mobile
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Auto width on desktop
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Buttons stack vertically on mobile (flex-col sm:flex-row)
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Navigation Responsive Behavior</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="hidden md:flex space-x-2">
                    <Badge>Visible on desktop</Badge>
                    <Badge variant="outline">md:flex</Badge>
                  </div>
                  <div className="md:hidden">
                    <Badge>Visible on mobile</Badge>
                    <Badge variant="outline">md:hidden</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Different content shown based on screen size
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </PageSection>

        {/* Performance Impact */}
        <PageSection title="Performance Considerations" subtitle="How responsive design affects performance">
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Best Practices</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Use CSS classes for responsive behavior
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Minimize JavaScript-based responsive logic
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Use mobile-first approach
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Test on real devices
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Performance Tips</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">💡</span>
                      Use CSS Grid and Flexbox
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">💡</span>
                      Avoid layout thrashing
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">💡</span>
                      Optimize images for different sizes
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">💡</span>
                      Use proper viewport meta tag
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </PageSection>
      </Container>
    </div>
  )
} 