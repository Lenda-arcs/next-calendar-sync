import SignInContent from './SignInContent'
import { generateAuthMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return generateAuthMetadata('signIn')
}

export default function SignInPage() {
  return <SignInContent />
} 