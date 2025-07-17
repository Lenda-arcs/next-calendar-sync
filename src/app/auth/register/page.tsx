import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth'
import { PATHS } from '@/lib/paths'
import { ArrowLeft } from 'lucide-react'
import { generateAuthMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return generateAuthMetadata('signUp')
}

export default function RegisterPage() {
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
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Get started with Calendar Sync today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </>
  )
} 