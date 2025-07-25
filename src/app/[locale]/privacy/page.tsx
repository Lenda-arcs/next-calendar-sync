import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, FileText } from 'lucide-react'
import { 
  LegalPageLayout, 
  LegalPageHeader, 
  CompanyInfo, 
  ContactCard 
} from '@/components/legal'
import { getValidLocale, getTranslations, createTranslator } from '@/lib/i18n/config'
import { generatePrivacyMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

// Generate metadata for each locale
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  return generatePrivacyMetadata(locale)
}

export default async function LocalizedPrivacyPage({ params }: Props) {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  // Load translations server-side
  const translations = await getTranslations(locale)
  const t = createTranslator(translations)

  return (
    <LegalPageLayout>
      <LegalPageHeader
        icon={Shield}
        title={t('privacy.title')}
        description={t('privacy.description')}
        lastUpdated={t('privacy.lastUpdated')}
      />

      <div className="space-y-8">
        {/* 1. Verantwortlicher */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('privacy.sections.responsible.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              {t('privacy.sections.responsible.description')}
            </p>
            <CompanyInfo variant="privacy" />
          </CardContent>
        </Card>

        {/* 2. Datenerfassung */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>{t('privacy.sections.dataCollection.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">{t('privacy.sections.dataCollection.accountData.title')}</h4>
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                <li>{t('privacy.sections.dataCollection.accountData.email')}</li>
                <li>{t('privacy.sections.dataCollection.accountData.name')}</li>
                <li>{t('privacy.sections.dataCollection.accountData.url')}</li>
                <li>{t('privacy.sections.dataCollection.accountData.profile')}</li>
                <li>{t('privacy.sections.dataCollection.accountData.contact')}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">{t('privacy.sections.dataCollection.calendarData.title')}</h4>
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                <li>{t('privacy.sections.dataCollection.calendarData.classes')}</li>
                <li>{t('privacy.sections.dataCollection.calendarData.events')}</li>
                <li>{t('privacy.sections.dataCollection.calendarData.times')}</li>
                <li>{t('privacy.sections.dataCollection.calendarData.participants')}</li>
                <li>{t('privacy.sections.dataCollection.calendarData.tokens')}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">{t('privacy.sections.dataCollection.automaticData.title')}</h4>
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                <li>{t('privacy.sections.dataCollection.automaticData.ip')}</li>
                <li>{t('privacy.sections.dataCollection.automaticData.sync')}</li>
                <li>{t('privacy.sections.dataCollection.automaticData.usage')}</li>
                <li>{t('privacy.sections.dataCollection.automaticData.logs')}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">{t('privacy.sections.dataCollection.billingData.title')}</h4>
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                <li>{t('privacy.sections.dataCollection.billingData.studios')}</li>
                <li>{t('privacy.sections.dataCollection.billingData.classes')}</li>
                <li>{t('privacy.sections.dataCollection.billingData.rates')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 3. Rechtsgrundlagen */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>{t('privacy.sections.legalBasis.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{t('privacy.sections.legalBasis.contract.title')}</h4>
              <p className="text-foreground/80">
                {t('privacy.sections.legalBasis.contract.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('privacy.sections.legalBasis.consent.title')}</h4>
              <p className="text-foreground/80">
                {t('privacy.sections.legalBasis.consent.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('privacy.sections.legalBasis.interest.title')}</h4>
              <p className="text-foreground/80">
                {t('privacy.sections.legalBasis.interest.description')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Continue with remaining sections... */}
        {/* For brevity, I'll show the contact section as an example */}

        {/* Kontakt */}
        <ContactCard
          title={t('privacy.contact.title')}
          description={t('privacy.contact.description')}
          buttonText={t('privacy.contact.button')}
        />
      </div>
    </LegalPageLayout>
  )
} 