'use client'

import React, { useState } from 'react'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  EventCardSkeleton,
  InteractiveEventCardSkeleton,
  ManageEventsSkeleton,
  TagRulesSkeleton,
  TagLibraryGridSkeleton,
  PublicEventListSkeleton,
  DashboardUpcomingClassesSkeleton,
  DashboardActionsSkeleton,
  DashboardSkeleton,
  ProfileSkeleton,
  ListItemSkeleton,
  TableRowSkeleton
} from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EnhancedDataLoaderPage() {
  const [loadingVariant, setLoadingVariant] = useState<'compact' | 'full' | 'minimal'>('compact')

  const skeletonComponents = [
    {
      name: 'EventCardSkeleton',
      description: 'Skeleton for basic event cards',
      component: <EventCardSkeleton variant={loadingVariant} />,
      hasVariants: true
    },
    {
      name: 'InteractiveEventCardSkeleton',
      description: 'Skeleton for interactive event cards with tags and controls',
      component: <InteractiveEventCardSkeleton variant={loadingVariant} />,
      hasVariants: true
    },
    {
      name: 'PublicEventListSkeleton',
      description: 'Skeleton for public event list with mobile/desktop layouts and date badges',
      component: <PublicEventListSkeleton variant={loadingVariant} />,
      hasVariants: true
    },
    {
      name: 'ManageEventsSkeleton',
      description: 'Complete skeleton for manage events page',
      component: <ManageEventsSkeleton />,
      hasVariants: false
    },
    {
      name: 'TagRulesSkeleton',
      description: 'Skeleton for tag rules management',
      component: <TagRulesSkeleton />,
      hasVariants: false
    },
    {
      name: 'TagLibraryGridSkeleton',
      description: 'Skeleton for tag library grid',
      component: <TagLibraryGridSkeleton />,
      hasVariants: false
    },
    {
      name: 'DashboardUpcomingClassesSkeleton',
      description: 'Skeleton for dashboard upcoming classes',
      component: <DashboardUpcomingClassesSkeleton />,
      hasVariants: false
    },
    {
      name: 'DashboardActionsSkeleton',
      description: 'Skeleton for dashboard action cards',
      component: <DashboardActionsSkeleton />,
      hasVariants: false
    },
    {
      name: 'DashboardSkeleton',
      description: 'Complete dashboard skeleton',
      component: <DashboardSkeleton />,
      hasVariants: false
    },
    {
      name: 'ProfileSkeleton',
      description: 'Skeleton for profile displays',
      component: <ProfileSkeleton />,
      hasVariants: false
    },
    {
      name: 'ListItemSkeleton',
      description: 'Skeleton for list items',
      component: <ListItemSkeleton />,
      hasVariants: false
    },
    {
      name: 'TableRowSkeleton',
      description: 'Skeleton for table rows',
      component: <TableRowSkeleton />,
      hasVariants: false
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <PageSection className="py-8">
        <Container>
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Link href="/test">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Test Menu
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Enhanced DataLoader Showcase</h1>
                <p className="text-muted-foreground mt-2">
                  Demonstrating all available skeleton loading components
                </p>
              </div>
            </div>

            {/* Variant Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Variant Controls</CardTitle>
                <CardDescription>
                  Some skeletons support different variants. Change the variant to see different layouts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {(['compact', 'full', 'minimal'] as const).map((variant) => (
                    <Button
                      key={variant}
                      variant={loadingVariant === variant ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLoadingVariant(variant)}
                    >
                      {variant.charAt(0).toUpperCase() + variant.slice(1)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skeleton Components */}
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="manage">Management</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="utility">Utility</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                {skeletonComponents
                  .filter(skeleton => ['EventCardSkeleton', 'InteractiveEventCardSkeleton', 'PublicEventListSkeleton'].includes(skeleton.name))
                  .map((skeleton) => (
                    <Card key={skeleton.name}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <CardTitle>{skeleton.name}</CardTitle>
                          {skeleton.hasVariants && (
                            <Badge variant="secondary">Variant: {loadingVariant}</Badge>
                          )}
                        </div>
                        <CardDescription>{skeleton.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-lg p-4 bg-muted/10">
                          {skeleton.component}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="manage" className="space-y-6">
                {skeletonComponents
                  .filter(skeleton => ['ManageEventsSkeleton', 'TagRulesSkeleton', 'TagLibraryGridSkeleton'].includes(skeleton.name))
                  .map((skeleton) => (
                    <Card key={skeleton.name}>
                      <CardHeader>
                        <CardTitle>{skeleton.name}</CardTitle>
                        <CardDescription>{skeleton.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-lg p-4 bg-muted/10">
                          {skeleton.component}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="dashboard" className="space-y-6">
                {skeletonComponents
                  .filter(skeleton => ['DashboardUpcomingClassesSkeleton', 'DashboardActionsSkeleton', 'DashboardSkeleton'].includes(skeleton.name))
                  .map((skeleton) => (
                    <Card key={skeleton.name}>
                      <CardHeader>
                        <CardTitle>{skeleton.name}</CardTitle>
                        <CardDescription>{skeleton.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-lg p-4 bg-muted/10">
                          {skeleton.component}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="utility" className="space-y-6">
                {skeletonComponents
                  .filter(skeleton => ['ProfileSkeleton', 'ListItemSkeleton', 'TableRowSkeleton'].includes(skeleton.name))
                  .map((skeleton) => (
                    <Card key={skeleton.name}>
                      <CardHeader>
                        <CardTitle>{skeleton.name}</CardTitle>
                        <CardDescription>{skeleton.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-lg p-4 bg-muted/10">
                          {skeleton.component}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>
            </Tabs>
          </div>
        </Container>
      </PageSection>
    </div>
  )
} 