import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Scale, FileText, Users } from 'lucide-react'
import { 
  LegalPageLayout, 
  LegalPageHeader, 
  CompanyInfo, 
  ContactCard 
} from '@/components/legal'
import { getValidLocale, getTranslations, createTranslator } from '@/lib/i18n/config'
import type { Metadata } from 'next'

interface TermsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  const translations = await getTranslations(locale)
  const t = createTranslator(translations)
  
  return {
    title: t('terms.title') + ' - avara.',
    description: t('terms.description')
  }
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  // Load translations server-side
  const translations = await getTranslations(locale)
  const t = createTranslator(translations)
  
  // Create localized privacy link
  const privacyPath = locale === 'en' ? '/privacy' : `/${locale}/privacy`

  return (
    <LegalPageLayout>
      <LegalPageHeader
        icon={Scale}
        title={t('terms.title')}
        description={t('terms.description')}
        lastUpdated={t('terms.lastUpdated')}
      />

      <div className="space-y-8">
        {/* 1. Anbieter */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('terms.sections.provider.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.provider.provider.title')}</h4>
              <CompanyInfo />
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.provider.scope.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.provider.scope.description')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 2. Leistungsbeschreibung */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>{t('terms.sections.services.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.services.platform.title')}</h4>
              <p className="text-foreground/80 mb-3">
                {t('terms.sections.services.platform.description')}
              </p>
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                {translations.terms.sections.services.platform.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.services.beta.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.services.beta.description')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 3. Registrierung und Nutzerkonto */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>{t('terms.sections.registration.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.registration.requirements.title')}</h4>
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                {translations.terms.sections.registration.requirements.items.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.registration.security.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.registration.security.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.registration.termination.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.registration.termination.description')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 4. Nutzerpflichten */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>{t('terms.sections.obligations.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.obligations.permitted.title')}</h4>
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                {translations.terms.sections.obligations.permitted.items.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.obligations.prohibited.title')}</h4>
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                {translations.terms.sections.obligations.prohibited.items.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 5. Urheberrecht und Inhalte */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>{t('terms.sections.content.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.content.userContent.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.content.userContent.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.content.ourContent.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.content.ourContent.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.content.violations.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.content.violations.description')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 6. Verfügbarkeit */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>{t('terms.sections.availability.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.availability.uptime.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.availability.uptime.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.availability.requirements.title')}</h4>
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                {translations.terms.sections.availability.requirements.items.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 7. Datenschutz */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>{t('terms.sections.privacy.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.privacy.dataProcessing.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.privacy.dataProcessing.description')}
                <Link href={privacyPath} className="text-primary hover:text-primary/80 font-medium underline ml-1">
                  {t('landing.footer.privacy')}
                </Link>
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.privacy.thirdParty.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.privacy.thirdParty.description')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 8. Haftung */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>{t('terms.sections.liability.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.liability.limitation.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.liability.limitation.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.liability.excluded.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.liability.excluded.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.liability.limitation_period.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.liability.limitation_period.description')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 9. Kündigung */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>{t('terms.sections.termination.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.termination.duration.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.termination.duration.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.termination.extraordinary.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.termination.extraordinary.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.termination.consequences.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.termination.consequences.description')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 10. Preise */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>{t('terms.sections.pricing.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.pricing.current.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.pricing.current.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.pricing.changes.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.pricing.changes.description')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 11. Schlussbestimmungen */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>{t('terms.sections.final.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.final.law.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.final.law.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.final.jurisdiction.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.final.jurisdiction.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.final.dispute.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.final.dispute.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.final.severability.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.final.severability.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('terms.sections.final.changes.title')}</h4>
              <p className="text-foreground/80">
                {t('terms.sections.final.changes.description')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Kontakt */}
        <ContactCard
          title={t('terms.contact.title')}
          description={t('terms.contact.description')}
          buttonText={t('terms.contact.button')}
          icon={Users}
        />
      </div>
    </LegalPageLayout>
  )
} 