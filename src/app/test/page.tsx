import React from 'react'
import { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  Palette, 
  Calendar, 
  Smartphone,
  Monitor,
  Tablet,
  Eye,
  Code,
  Zap
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Component Test Page | Calendar Sync',
  description: 'Test and showcase page for all design system components and examples',
}

// Test page data
const testSections = [
  {
    id: 'design-system',
    title: 'Design System Showcase',
    description: 'Complete overview of all UI components, variants, and design tokens',
    icon: Palette,
    href: '/test/design-system',
    features: [
      'Button variants and states',
      'Card components and layouts',
      'Input fields with validation',
      'Typography hierarchy',
      'Badge and tag systems',
      'Color palette and themes'
    ]
  },
  {
    id: 'event-cards',
    title: 'EventCard Components',
    description: 'Interactive event cards with different variants and configurations',
    icon: Calendar,
    href: '/test/event-cards',
    features: [
      'Minimal, compact, and full variants',
      'Image galleries with navigation',
      'Tag overlays and CTAs',
      'Mobile-responsive layouts',
      'Interactive and static modes',
      'Real-time date formatting'
    ]
  },
  {
    id: 'responsive',
    title: 'Responsive Design',
    description: 'Test responsive behavior across different screen sizes',
    icon: Monitor,
    href: '/test/responsive',
    features: [
      'Mobile-first breakpoints',
      'Adaptive layouts',
      'Touch-friendly interfaces',
      'Screen size detection',
      'Responsive typography',
      'Flexible grid systems'
    ]
  },
  {
    id: 'accessibility',
    title: 'Accessibility Testing',
    description: 'Keyboard navigation, screen readers, and ARIA compliance',
    icon: Eye,
    href: '/test/accessibility',
    features: [
      'Keyboard navigation',
      'Focus management',
      'ARIA labels and roles',
      'Color contrast compliance',
      'Screen reader support',
      'Semantic HTML structure'
    ]
  },
  {
    id: 'performance',
    title: 'Performance Testing',
    description: 'Component rendering performance and optimization demos',
    icon: Zap,
    href: '/test/performance',
    features: [
      'React.memo optimization',
      'Lazy loading demos',
      'Image optimization',
      'Bundle size analysis',
      'Render performance',
      'Memory usage patterns'
    ]
  },
  {
    id: 'integration',
    title: 'Supabase Integration',
    description: 'Database hooks, queries, and mutations in action',
    icon: Code,
    href: '/test/integration',
    features: [
      'useSupabaseQuery examples',
      'useSupabaseMutation demos',
      'Real-time subscriptions',
      'Error handling patterns',
      'Loading states',
      'Data transformation'
    ]
  }
]

export default function TestPage() {
  return (
    <div className="min-h-screen">
      <Container 
        maxWidth="4xl" 
        title="Component Test Suite" 
        subtitle="Comprehensive testing and showcase environment for all design system components and patterns"
        className="py-8"
      >
        {/* Quick Navigation */}
        <PageSection title="Quick Navigation" subtitle="Jump to specific test sections">
          <div className="flex flex-wrap gap-2 mb-8">
            {testSections.map((section) => (
              <Button
                key={section.id}
                variant="outline"
                size="sm"
                asChild
              >
                <Link href={section.href}>
                  <section.icon className="h-4 w-4 mr-2" />
                  {section.title}
                </Link>
              </Button>
            ))}
          </div>
        </PageSection>

        {/* Test Sections Grid */}
        <PageSection title="Test Sections" subtitle="Detailed component testing and examples">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testSections.map((section) => {
              const IconComponent = section.icon
              return (
                <Card 
                  key={section.id} 
                  variant="default"
                  interactive
                  className="group"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Test Suite
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-foreground">Features:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {section.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2">
                        <Button asChild className="w-full">
                          <Link href={section.href}>
                            View Tests
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </PageSection>

        {/* Development Tools */}
        <PageSection title="Development Tools" subtitle="Utilities for component development and testing">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Component Inspector
                </CardTitle>
                <CardDescription>
                  Inspect component props, state, and render performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <code className="text-sm">
                      React DevTools integration ready
                    </code>
                  </div>
                  <Button variant="outline" className="w-full" disabled>
                    Inspector (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="h-5 w-5 mr-2" />
                  Device Testing
                </CardTitle>
                <CardDescription>
                  Test components across different device sizes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Smartphone className="h-4 w-4 mr-1" />
                      Mobile
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Tablet className="h-4 w-4 mr-1" />
                      Tablet
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Monitor className="h-4 w-4 mr-1" />
                      Desktop
                    </Button>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/test/responsive">
                      Test Responsive Design
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </PageSection>

        {/* Component Status */}
        <PageSection title="Component Status" subtitle="Current implementation status of all components">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Progress</CardTitle>
              <CardDescription>
                Track the completion status of all design system components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Button', status: 'complete', tests: 15 },
                  { name: 'Card', status: 'complete', tests: 12 },
                  { name: 'Input', status: 'complete', tests: 10 },
                  { name: 'EventCard', status: 'complete', tests: 8 },
                  { name: 'ImageGallery', status: 'complete', tests: 6 },
                  { name: 'TagList', status: 'complete', tests: 5 },
                  { name: 'Container', status: 'complete', tests: 4 },
                  { name: 'PageSection', status: 'complete', tests: 3 },
                  { name: 'Badge', status: 'complete', tests: 7 },
                ].map((component) => (
                  <div key={component.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={component.status === 'complete' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {component.status}
                      </Badge>
                      <span className="font-medium">{component.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {component.tests} tests
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </PageSection>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Design System Test Suite • Built with Next.js 15, React 19, and Tailwind CSS
            </p>
            <p className="mt-1">
              <Link href="/" className="hover:text-foreground transition-colors">
                ← Back to Home
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
} 