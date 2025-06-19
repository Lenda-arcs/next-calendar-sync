import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Mail, ArrowLeft } from 'lucide-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Container className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
        </div>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your Calendar Sync account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Auth Implementation Needed
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  This is a placeholder for the authentication form. 
                  Implement Supabase Auth UI components here.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Recommended implementation:</p>
                  <ul className="text-sm text-gray-500 text-left space-y-1">
                    <li>• Email/password form</li>
                    <li>• Social login (Google, GitHub)</li>
                    <li>• Magic link authentication</li>
                    <li>• Password reset functionality</li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don&apos;t have an account?{' '}
                  <Link href="/app/register" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
} 