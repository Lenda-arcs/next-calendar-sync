import {Container} from '@/components/layout/container'
import {generateManageTagsMetadata} from '@/lib/i18n/metadata'
import type {Metadata} from 'next'
import {ManageTagsClient} from '@/components/dashboard/manage-tags/ManageTagsClient'
import {getAuthenticatedUserId} from '@/lib/server-user'
import {createTranslator, getTranslations, getValidLocale} from '@/lib/i18n/config'

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

  // ✨ Get user ID from middleware headers - no Supabase call needed!
  const userId = await getAuthenticatedUserId()

  // Get translations for the page
  const translations = await getTranslations(locale)
  const t = createTranslator(translations)

  return (
    <Container
      title={ t('pages.manageTags.title')}
      subtitle={ t('pages.manageTags.subtitle')}
    >
      <ManageTagsClient userId={userId} />
    </Container>
  )
} 