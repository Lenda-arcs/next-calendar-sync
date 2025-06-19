import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { LoginForm } from '@/components/auth'
import { ArrowLeft } from 'lucide-react'

export default function SignInPage() {
  return (
    <>
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-foreground/70 hover:text-foreground font-sans transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>
      </div>
      
      <Card variant="glass">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your Calendar Sync account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </>
  )
} 