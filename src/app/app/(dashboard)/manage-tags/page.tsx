import { Container } from '@/components/layout/container'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { ManageTagsClient } from './ManageTagsClient'
import { generateManageTagsMetadata } from '@/lib/i18n/metadata'
import { getServerTranslation } from '@/lib/i18n/server'
import { cookies } from 'next/headers'
import { Language, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/i18n/types'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return generateManageTagsMetadata()
}

async function getLanguage(): Promise<Language> {
  try {
    const cookieStore = await cookies()
    const languageCookie = cookieStore.get('language')?.value
    
    if (languageCookie && SUPPORTED_LANGUAGES.includes(languageCookie as Language)) {
      return languageCookie as Language
    }
  } catch (error) {
    // Cookies might not be available in some contexts
    console.log('Could not access cookies for language detection:', error)
  }
  
  return DEFAULT_LANGUAGE
}

export default async function ManageTagsPage() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/sign-in')
  }

  // Get current language for server-side translations
  const language = await getLanguage()
  
  // Get translations for the page
  const title = await getServerTranslation(language, 'pages.manageTags.title')
  const subtitle = await getServerTranslation(language, 'pages.manageTags.subtitle')

  return (
    <Container
      title={title}
      subtitle={subtitle}
    >
      <ManageTagsClient userId={user.id} />
    </Container>
  )
} 