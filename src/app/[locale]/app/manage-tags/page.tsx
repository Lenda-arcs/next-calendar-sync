import { Container } from '@/components/layout/container'
import { generateManageTagsMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'
import { ManageTagsClient } from '@/components/dashboard/manage-tags/ManageTagsClient'
import { createServerClient } from '@/lib/supabase-server'
import { getValidLocale, getTranslations, createTranslator } from '@/lib/i18n/config'

interface ManageTagsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ManageTagsPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  return generateManageTagsMetadata(locale)
}

export default async function ManageTagsPage({ params }: ManageTagsPageProps) {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Note: Auth is handled by middleware, user should exist

  // Get translations for the page
  const translations = await getTranslations(locale)
  const t = createTranslator(translations)
  
  const title = t('pages.manageTags.title')
  const subtitle = t('pages.manageTags.subtitle')

  return (
    <Container
      title={title}
      subtitle={subtitle}
    >
      <ManageTagsClient userId={user!.id} />
    </Container>
  )
} 