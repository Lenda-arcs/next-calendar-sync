import { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Clock, BarChart, Cpu } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Performance Testing | Test Suite',
  description: 'Component rendering performance and optimization testing',
}

export default function PerformanceTestPage() {
  return (
    <div className="min-h-screen">
      <Container 
        maxWidth="4xl" 
        title="Performance Testing" 
        subtitle="Component rendering performance and optimization demonstrations"
        className="py-8"
      >
        <PageSection title="Performance Metrics" subtitle="Current optimization status">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  React.memo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="default">Implemented</Badge>
                  <p className="text-sm text-muted-foreground">
                    EventCard and other components use React.memo for optimization
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  Lazy Loading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">Planned</Badge>
                  <p className="text-sm text-muted-foreground">
                    Image lazy loading and component code splitting
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BarChart className="h-5 w-5 mr-2 text-green-500" />
                  Bundle Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="default">Optimized</Badge>
                  <p className="text-sm text-muted-foreground">
                    Tree-shaking and module optimization
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Cpu className="h-5 w-5 mr-2 text-purple-500" />
                  Rendering
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="default">Optimized</Badge>
                  <p className="text-sm text-muted-foreground">
                    Efficient re-rendering with proper dependencies
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </PageSection>

        <PageSection title="Optimization Strategies" subtitle="Performance techniques implemented">
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">React Optimizations</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      React.memo for component memoization
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      useCallback for stable function references
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Proper dependency arrays in useEffect
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Minimal state updates and re-renders
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Bundle Optimizations</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Tree-shaking for unused code elimination
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Dynamic imports for code splitting
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Optimized icon imports from lucide-react
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">○</span>
                      Image optimization (Next.js Image component)
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Performance Monitoring" subtitle="Tools and metrics for ongoing optimization">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Tools</CardTitle>
              <CardDescription>
                Tools for monitoring and improving performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { tool: 'React DevTools Profiler', purpose: 'Component render analysis' },
                  { tool: 'Chrome DevTools', purpose: 'Performance auditing' },
                  { tool: 'Lighthouse', purpose: 'Web vitals measurement' },
                  { tool: 'Bundle Analyzer', purpose: 'Bundle size analysis' },
                  { tool: 'Web Vitals Extension', purpose: 'Real-time metrics' },
                  { tool: 'Next.js Analytics', purpose: 'Production monitoring' },
                ].map((item) => (
                  <div key={item.tool} className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">{item.tool}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.purpose}</div>
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