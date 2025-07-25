import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LifeBuoy, MessageCircle, Book, Calendar, Settings } from 'lucide-react'
import { 
  LegalPageLayout, 
  LegalPageHeader, 
  ContactCard,
  ContactEmailLink 
} from '@/components/legal'
import { getValidLocale, getTranslations, createTranslator } from '@/lib/i18n/config'
import type { Metadata } from 'next'

interface SupportPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: SupportPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  const translations = await getTranslations(locale)
  const t = createTranslator(translations)
  
  return {
    title: t('support.title') + ' - avara.',
    description: t('support.description')
  }
}

export default async function SupportPage({ params }: SupportPageProps) {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  // Load translations server-side
  const translations = await getTranslations(locale)
  const t = createTranslator(translations)

  return (
    <LegalPageLayout>
      <LegalPageHeader
        icon={LifeBuoy}
        title={t('support.title')}
        description={t('support.description')}
      />

      <div className="space-y-8">
        {/* Kontakt */}
        <ContactCard
          title={t('support.contact.title')}
          description={t('support.contact.description')}
          buttonText={t('support.contact.button')}
          subject="Support Anfrage"
        />

        {/* Häufige Fragen */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {t('support.faq.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">{t('support.faq.howToConnect.question')}</h4>
              <p className="text-foreground/80">
                {t('support.faq.howToConnect.answer')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('support.faq.createPublicPage.question')}</h4>
              <p className="text-foreground/80">
                {t('support.faq.createPublicPage.answer')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('support.faq.supportedCalendars.question')}</h4>
              <p className="text-foreground/80">
                {t('support.faq.supportedCalendars.answer')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('support.faq.invoicing.question')}</h4>
              <p className="text-foreground/80">
                {t('support.faq.invoicing.answer')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('support.faq.dataSecurity.question')}</h4>
              <p className="text-foreground/80">
                {t('support.faq.dataSecurity.answer')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Hilfe-Kategorien */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card variant="glass" className="text-center">
            <CardContent className="p-6">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-serif mb-3">{t('support.categories.calendar.title')}</h3>
              <p className="text-sm text-foreground/70 mb-4">
                {t('support.categories.calendar.description')}
              </p>
              <Button asChild variant="ghost" size="sm">
                <ContactEmailLink subject="Kalender Hilfe">
                  {t('support.contact.button')}
                </ContactEmailLink>
              </Button>
            </CardContent>
          </Card>

          <Card variant="glass" className="text-center">
            <CardContent className="p-6">
              <Settings className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-serif mb-3">{t('support.categories.profile.title')}</h3>
              <p className="text-sm text-foreground/70 mb-4">
                {t('support.categories.profile.description')}
              </p>
              <Button asChild variant="ghost" size="sm">
                <ContactEmailLink subject="Profil Hilfe">
                  {t('support.contact.button')}
                </ContactEmailLink>
              </Button>
            </CardContent>
          </Card>

          <Card variant="glass" className="text-center">
            <CardContent className="p-6">
              <Book className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-serif mb-3">{t('support.categories.invoicing.title')}</h3>
              <p className="text-sm text-foreground/70 mb-4">
                {t('support.categories.invoicing.description')}
              </p>
              <Button asChild variant="ghost" size="sm">
                <ContactEmailLink subject="Rechnungen Hilfe">
                  {t('support.contact.button')}
                </ContactEmailLink>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Beta-Information */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>{t('support.beta.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground/80">
              {t('support.beta.description')}
            </p>
            <ul className="list-disc list-inside space-y-1 text-foreground/80">
              {translations.support.beta.features.map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm border border-white/30">
              <p className="text-sm">
                <strong>Beta-Tester:</strong> {t('support.beta.feedback')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Technische Probleme */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>{t('support.technical.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground/80">
              {t('support.technical.description')}
            </p>
            <ul className="list-disc list-inside space-y-1 text-foreground/80">
              {translations.support.technical.requirements.map((requirement: string, index: number) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
            <Button asChild variant="outline">
              <ContactEmailLink 
                subject="Technisches Problem"
                body="Bitte beschreiben Sie das Problem:

Schritte zur Reproduktion:

Browser und System:

"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                {t('support.technical.button')}
              </ContactEmailLink>
            </Button>
          </CardContent>
        </Card>
      </div>
    </LegalPageLayout>
  )
} 