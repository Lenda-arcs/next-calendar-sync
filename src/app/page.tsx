import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { Calendar, Users, Clock, BarChart3 } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <PageSection className="pt-16 pb-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Sync Your Calendar,
              <span className="text-blue-600 dark:text-blue-400"> Simplify Your Life</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Manage your events, track your schedule, and share your availability with the world. 
              Perfect for teachers, instructors, and busy professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/app/register">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/app/sign-in">Sign In</Link>
              </Button>
            </div>
          </div>
        </Container>
      </PageSection>

      {/* Features Section */}
      <PageSection>
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to manage your schedule
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From calendar sync to public profiles, we&apos;ve got you covered.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Calendar className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Calendar Sync</CardTitle>
                <CardDescription>
                  Sync multiple calendar feeds and keep everything in one place.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Public Profiles</CardTitle>
                <CardDescription>
                  Share your schedule with students and clients through beautiful public pages.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-orange-600 mb-2" />
                <CardTitle>Event Management</CardTitle>
                <CardDescription>
                  Organize events with tags, descriptions, and booking links.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Analytics & Invoicing</CardTitle>
                <CardDescription>
                  Track attendance, generate invoices, and analyze your business.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Container>
      </PageSection>

      {/* CTA Section */}
      <PageSection className="bg-gray-50 dark:bg-slate-800">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of instructors and professionals who trust Calendar Sync.
            </p>
            <Button asChild size="lg">
              <Link href="/app/register">Create Your Account</Link>
            </Button>
          </div>
        </Container>
      </PageSection>
    </main>
  )
}
