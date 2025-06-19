import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { EventCard } from '@/components/events'
import { exampleEvents } from '@/lib/types'

export default function LandingPage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <PageSection className="pt-16 pb-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <Container maxWidth="2xl" className="text-center py-20">
          <h1 className="text-4xl md:text-5xl text-[#3F3F3F] dark:text-white mb-4">
            Share Your Yoga Classes Effortlessly
          </h1>
          <h2 className="text-xl md:text-2xl text-[#666] dark:text-gray-300 mb-8">
            Connect your calendar, customize your page, and share your schedule.
          </h2>
          <Button asChild size="lg">
            <Link href="/auth/sign-in">Create My Schedule Page</Link>
          </Button>
        </Container>
      </PageSection>

      {/* Example Classes Section */}
      <PageSection className="py-16">
        <Container maxWidth="4xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Example Classes</CardTitle>
              <CardDescription className="text-lg">
                See how your classes will look on your personalized schedule page. 
                Customize the style, add tags, and make it your own.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {exampleEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            </CardContent>
          </Card>
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
              Join thousands of yoga instructors who trust Calendar Sync to share their schedules.
            </p>
            <Button asChild size="lg">
              <Link href="/auth/register">Create Your Account</Link>
            </Button>
          </div>
        </Container>
      </PageSection>
    </main>
  )
}
