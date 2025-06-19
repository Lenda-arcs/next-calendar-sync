'use client'

import React from 'react'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  StatsCard,
  Input,
  Badge 
} from '@/components/ui'
import { Search, Mail, TrendingUp, Users, Calendar, DollarSign } from 'lucide-react'

/**
 * Design System Showcase Component
 * Demonstrates all components with their variants and usage patterns
 */
export default function DesignSystemShowcase() {
  return (
    <Container 
      maxWidth="4xl" 
      title="Design System Showcase" 
      subtitle="A comprehensive overview of all available components and their variants"
    >
      {/* Buttons Section */}
      <PageSection title="Buttons" subtitle="Various button styles and sizes">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle as="h4">Primary Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button size="sm">Small Button</Button>
              <Button size="default">Medium Button</Button>
              <Button size="lg">Large Button</Button>
              <Button size="xl">Extra Large</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h4">Button Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h4">Special States</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button loading>Loading</Button>
              <Button leftIcon={<Mail className="h-4 w-4" />}>With Icon</Button>
              <Button rightIcon={<TrendingUp className="h-4 w-4" />}>Trending</Button>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Cards Section */}
      <PageSection title="Cards" subtitle="Different card styles and layouts">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>
                This is a standard card with default styling and shadow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Card content goes here with proper spacing and typography.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>
                This card has enhanced shadow for emphasis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Perfect for highlighting important content.
              </p>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Outlined Card</CardTitle>
              <CardDescription>
                This card uses border emphasis instead of shadow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Great for subtle content separation.
              </p>
            </CardContent>
          </Card>

          <Card interactive>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>
                This card responds to hover and focus states.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Click or focus to see the interaction effects.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Stats Cards Section */}
      <PageSection title="Stats Cards" subtitle="Specialized cards for displaying metrics">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value="12,345"
            change={{ value: "+12%", type: "increase" }}
            icon={<Users className="h-6 w-6" />}
          />
          <StatsCard
            title="Revenue"
            value="$45,678"
            change={{ value: "+8%", type: "increase" }}
            icon={<DollarSign className="h-6 w-6" />}
          />
          <StatsCard
            title="Events"
            value="1,234"
            change={{ value: "-3%", type: "decrease" }}
            icon={<Calendar className="h-6 w-6" />}
          />
          <StatsCard
            title="Growth"
            value="23%"
            change={{ value: "0%", type: "neutral" }}
            icon={<TrendingUp className="h-6 w-6" />}
          />
        </div>
      </PageSection>

      {/* Inputs Section */}
      <PageSection title="Inputs" subtitle="Form inputs with various states and styles">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle as="h4">Input Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Default input" />
              <Input variant="filled" placeholder="Filled input" />
              <Input variant="ghost" placeholder="Ghost input" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h4">Input Sizes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input size="sm" placeholder="Small input" />
              <Input size="md" placeholder="Medium input" />
              <Input size="lg" placeholder="Large input" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h4">Input States</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Normal state" />
              <Input state="success" placeholder="Success state" />
              <Input state="warning" placeholder="Warning state" />
              <Input error="This field is required" placeholder="Error state" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h4">Input with Icons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                leftIcon={<Search className="h-4 w-4" />}
                placeholder="Search..." 
              />
              <Input 
                leftIcon={<Mail className="h-4 w-4" />}
                placeholder="Email address"
                type="email"
              />
              <Input 
                placeholder="With helper text"
                helperText="This is helpful information"
              />
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Badges Section */}
      <PageSection title="Badges" subtitle="Small status and category indicators">
        <Card>
          <CardHeader>
            <CardTitle as="h4">Badge Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Typography Section */}
      <PageSection title="Typography" subtitle="Consistent text styling throughout the application">
        <Card>
          <CardContent className="space-y-4">
            <div>
              <h1 className="text-4xl font-semibold text-foreground mb-2 tracking-tight">
                Heading 1 - Main Title
              </h1>
              <h2 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">
                Heading 2 - Section Title
              </h2>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Heading 3 - Subsection
              </h3>
              <p className="text-base text-foreground leading-relaxed mb-2">
                Body text - This is the standard paragraph text used throughout the application. 
                It maintains good readability with proper line height and spacing.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Small text - Used for captions, helper text, and secondary information.
              </p>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </Container>
  )
} 