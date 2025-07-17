import { Container } from '@/components/layout/container'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { ManageTagsClient } from './ManageTagsClient'
import { generateManageTagsMetadata } from '@/lib/i18n/metadata'
import { getServerTranslation, getServerLanguageSafe } from '@/lib/i18n/server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return generateManageTagsMetadata()
}

export default async function ManageTagsPage() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/sign-in')
  }

  // Get current language for server-side translations
  const language = await getServerLanguageSafe()
  
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