import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TestTube, 
  Palette, 
  Code, 
  AlertTriangle,
  ExternalLink 
} from 'lucide-react'

export default function TestIndexPage() {
  // Only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    redirect('/')
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <TestTube className="h-8 w-8 text-yellow-600" />
          <h1 className="text-4xl font-serif font-bold">Development Test Area</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Internal development tools and showcases. These pages are automatically 
          blocked in production environments.
        </p>
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
          Development Only
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Theme Showcase */}
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-600" />
              Theme System Demo
            </CardTitle>
            <CardDescription>
              Interactive showcase of the centralized theme system with glassmorphism variants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Default</Badge>
              <Badge variant="secondary">Ocean</Badge>
              <Badge variant="secondary">Sunset</Badge>
            </div>
            <Link href="/test/theme-demo">
              <Button className="w-full group-hover:scale-105 transition-transform">
                View Theme Demo
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Design System */}
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-600" />
              Design System
            </CardTitle>
            <CardDescription>
              Component library and design tokens reference
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Components</Badge>
              <Badge variant="secondary">Tokens</Badge>
              <Badge variant="secondary">Utils</Badge>
            </div>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        {/* Development Info */}
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Environment Info
            </CardTitle>
            <CardDescription>
              Current development environment details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Node ENV:</span>
                <Badge variant="outline">{process.env.NODE_ENV}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Access:</span>
                <Badge variant="outline" className="text-green-700">Development Only</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-yellow-50/50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800">Development Notice</h3>
            <p className="text-yellow-700 text-sm mt-1">
              All pages in this test area are automatically blocked in production builds. 
              They will redirect to the homepage when deployed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata() {
  return {
    title: 'Development Test Area',
    description: 'Internal development tools and showcases',
    robots: 'noindex, nofollow, noarchive, nosnippet',
  }
}