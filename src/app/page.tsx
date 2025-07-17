import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { EventCard } from '@/components/events'
import { exampleEvents } from '@/lib/types'
import { PATHS } from '@/lib/paths'
import { StructuredData } from '@/components/seo/StructuredData'
import { generateOrganizationStructuredData } from '@/lib/i18n/metadata'

export default function LandingPage() {
  // Generate organization structured data for SEO
  const organizationData = generateOrganizationStructuredData()
  
  return (
    <main className="flex flex-col">
      {/* Add structured data for SEO */}
      <StructuredData data={organizationData} />
      {/* Hero Section */}
      <PageSection className="pt-16 pb-20">
        <Container maxWidth="2xl" className="text-center py-20">
          <Badge variant="secondary" className="mb-6 text-sm">
            Join 500+ yoga instructors sharing their schedules
          </Badge>
          <h1 className="text-4xl md:text-6xl text-[#3F3F3F] mb-6 font-serif">
            Share Your Yoga Classes Effortlessly
          </h1>
          <h2 className="text-xl md:text-2xl text-foreground/70 mb-8 font-sans max-w-3xl mx-auto">
            Connect your calendar, customize your page, and share your schedule with students. 
            No more manual updates or booking confusion.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8 py-4">
              <Link href={PATHS.AUTH.REGISTER}>Create My Schedule Page</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
              <Link href="#demo">See Example</Link>
            </Button>
          </div>
        </Container>
      </PageSection>

      {/* Features Section */}
      <PageSection className="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-[#3F3F3F] mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Simple tools that work together to help you share your classes beautifully
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="glass" className="text-center">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔗</span>
                </div>
                <h3 className="text-xl font-serif mb-3">Calendar Sync</h3>
                <p className="text-foreground/70">
                  Connect your existing calendar. We handle the rest automatically.
                </p>
              </CardContent>
            </Card>

            <Card variant="glass" className="text-center">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-serif mb-3">Beautiful Pages</h3>
                <p className="text-foreground/70">
                  Customizable, professional pages that match your style.
                </p>
              </CardContent>
            </Card>

            <Card variant="glass" className="text-center">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-serif mb-3">Easy Sharing</h3>
                <p className="text-foreground/70">
                  One link for all your classes. Share anywhere, anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </PageSection>

      {/* Example Classes Section */}
      <PageSection className="py-16">
        <Container>
          <div id="demo">
            <Card variant="elevated">
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
          </div>
        </Container>
      </PageSection>

      {/* Social Proof Section */}
      <PageSection className="py-16">
        <Container>
          <Card variant="ghost" className="text-center">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif mb-8 text-[#3F3F3F]">
                Trusted by yoga instructors everywhere
              </h3>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-serif text-primary mb-2">500+</div>
                  <p className="text-foreground/70">Active teachers</p>
                </div>
                <div>
                  <div className="text-3xl font-serif text-primary mb-2">50K+</div>
                  <p className="text-foreground/70">Classes shared</p>
                </div>
                <div>
                  <div className="text-3xl font-serif text-primary mb-2">24/7</div>
                  <p className="text-foreground/70">Automatic sync</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </PageSection>

      {/* CTA Section */}
      <PageSection className="py-20">
        <Container>
          <Card variant="glass" className="text-center">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-4">
                Ready to get started?
              </h2>
              <p className="text-lg text-foreground/70 mb-8 font-sans max-w-2xl mx-auto">
                Join hundreds of yoga instructors who trust Calendar Sync to share their schedules beautifully and effortlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="text-lg px-8 py-4">
                  <Link href={PATHS.AUTH.REGISTER}>Create Your Account</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
                  <Link href={PATHS.AUTH.SIGN_IN}>Sign In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </PageSection>

      {/* Footer */}
      <footer className="py-12 border-t border-white/20">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-serif text-[#3F3F3F] mb-2">SyncIt</h3>
              <p className="text-sm text-foreground/60">
                Sync and manage your calendar events with ease
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/privacy" className="text-foreground/70 hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-foreground/70 hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/support" className="text-foreground/70 hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/20 text-center">
            <p className="text-sm text-foreground/60">
              © 2024 SyncIt. Made with ❤️ for yoga instructors everywhere.
            </p>
          </div>
        </Container>
      </footer>
    </main>
  )
}
