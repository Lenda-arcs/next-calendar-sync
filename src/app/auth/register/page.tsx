import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PATHS } from '@/lib/paths'
import { ArrowLeft, Lock } from 'lucide-react'
import { generateAuthMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return generateAuthMetadata('signUp')
}

export default async function RegisterPage() {
  // Check if user is already authenticated
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/app')
  }

  return (
    <>
      <div className="text-center mb-8">
        <Link href={PATHS.HOME} className="inline-flex items-center text-sm text-foreground/70 hover:text-foreground font-sans transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>
      </div>

      <Card variant="glass">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Closed Beta</CardTitle>
          <CardDescription className="text-lg">
            We&apos;re currently in closed beta and testing with select yoga instructors
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <p className="text-foreground/70">
              Thank you for your interest in avara.! We&apos;re working hard to perfect the experience
              for yoga instructors before opening to everyone.
            </p>
            <p className="text-foreground/70">
              <strong>Already have an account?</strong> You can still sign in below.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href={PATHS.AUTH.SIGN_IN}>Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="mailto:hello@avara.app?subject=Beta%20Access%20Request">
                Request Beta Access
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-foreground/60">
              Want to see how it works? Check out our{' '}
              <Link href="/schedule/demo" className="text-primary hover:text-primary/80 font-medium">
                example schedule page
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  )
} 