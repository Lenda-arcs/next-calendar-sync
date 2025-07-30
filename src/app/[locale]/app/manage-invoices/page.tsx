import { Container } from '@/components/layout/container'
import { generateInvoicesMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'
import { InvoiceManagement } from '@/components/invoices/InvoiceManagement'
import { createServerClient } from '@/lib/supabase-server'
import { getValidLocale, getTranslations, createTranslator } from '@/lib/i18n/config'

interface ManageInvoicesPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ManageInvoicesPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  return generateInvoicesMetadata(locale)
}

export default async function ManageInvoicesPage({ params }: ManageInvoicesPageProps) {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Note: Auth is handled by middleware, user should exist

  // Get translations for the page
  const translations = await getTranslations(locale)
  const t = createTranslator(translations)

  return (
    <Container 
      title={t('invoices.management.title')}
      subtitle={t('invoices.management.subtitle')}
    >
      <InvoiceManagement userId={user!.id} />
    </Container>
  )
} 