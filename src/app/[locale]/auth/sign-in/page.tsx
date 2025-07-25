import SignInContent from '../../../auth/sign-in/SignInContent'
import { generateAuthMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'
import { getValidLocale } from '@/lib/i18n/config'

interface SignInPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: SignInPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  return generateAuthMetadata('signIn', locale)
}

export default async function SignInPage({ params }: SignInPageProps) {
  const { locale: localeParam } = await params
  getValidLocale(localeParam) // Validate locale
  
  return <SignInContent />
} 