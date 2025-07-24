import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { PATHS } from '@/lib/paths'
import { Home, ArrowLeft, Calendar, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex flex-col min-h-screen">
      <PageSection className="flex-1 flex items-center justify-center py-20">
        <Container maxWidth="2xl" className="text-center">
          <Card variant="glass" className="p-8 md:p-12">
            <CardContent className="space-y-8" noPadding>
              {/* Error Icon/Illustration */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <Search className="h-12 w-12 md:h-16 md:w-16 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-red-300/30">
                  <span className="text-red-600 text-sm font-bold">?</span>
                </div>
              </div>

              {/* Error Message */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-serif text-[#3F3F3F] mb-4">
                  Page Not Found
                </h1>
                <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
                  Oops! The page you&apos;re looking for seems to have wandered off. 
                  Don&apos;t worry, even the best yoga poses require some adjustments.
                </p>
              </div>

              {/* Navigation Options */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button asChild size="lg" className="text-lg px-8 py-4">
                    <Link href={PATHS.HOME}>
                      <Home className="mr-2 h-5 w-5" />
                      Go Home
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
                    <Link href="javascript:history.back()">
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Go Back
                    </Link>
                  </Button>
                </div>

                {/* Helpful Links */}
                <div className="border-t border-white/20 pt-6">
                  <p className="text-sm text-foreground/60 mb-4">
                    Looking for something specific? Try these popular pages:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={PATHS.AUTH.SIGN_IN}>Sign In</Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={PATHS.APP.DASHBOARD}>Dashboard</Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={PATHS.APP.ADD_CALENDAR}>
                        <Calendar className="mr-1 h-3 w-3" />
                        Add Calendar
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={PATHS.APP.PROFILE}>Profile</Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Additional Help */}
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm border border-white/30">
                <p className="text-sm text-foreground/70">
                  <strong>Still having trouble?</strong> If you believe this is an error, 
                                     please <Link href="mailto:hello@avara.studio" className="text-primary hover:text-primary/80 font-medium underline">contact our support team</Link> and 
                   we&apos;ll help you find what you&apos;re looking for.
                </p>
              </div>
            </CardContent>
          </Card>
        </Container>
      </PageSection>

      {/* Error Code Display */}
      <div className="pb-8">
        <Container className="text-center">
          <div className="text-9xl font-serif text-foreground/10 select-none">
            404
          </div>
        </Container>
      </div>
    </main>
  )
} 