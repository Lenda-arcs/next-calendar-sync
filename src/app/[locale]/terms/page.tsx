import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Scale, FileText, Users } from 'lucide-react'
import { 
  LegalPageLayout, 
  LegalPageHeader, 
  CompanyInfo, 
  ContactCard 
} from '@/components/legal'
import { getValidLocale } from '@/lib/i18n/config'
import type { Metadata } from 'next'

interface TermsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  // You can add locale-specific SEO metadata here if needed
  return {
    title: locale === 'de' ? 'Allgemeine Geschäftsbedingungen - avara.' : 
           locale === 'es' ? 'Términos y Condiciones - avara.' : 
           'Terms and Conditions - avara.',
    description: locale === 'de' ? 'Nutzungsbedingungen der avara-Plattform für Yoga-Lehrerinnen und -Lehrer.' :
                 locale === 'es' ? 'Términos y condiciones de la plataforma avara para profesores de yoga.' :
                 'Terms and conditions for the avara platform for yoga instructors.'
  }
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  // Note: This page is currently German-only legal content
  // Translations could be added later if needed
  
  // Create localized privacy link
  const privacyPath = locale === 'en' ? '/privacy' : `/${locale}/privacy`

  return (
    <LegalPageLayout>
      <LegalPageHeader
        icon={Scale}
        title="Allgemeine Geschäftsbedingungen"
        description="Diese Nutzungsbedingungen regeln die Verwendung der avara-Plattform für Yoga-Lehrerinnen und -Lehrer."
        lastUpdated="1. Januar 2024"
      />

      <div className="space-y-8">
        {/* 1. Anbieter */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              1. Anbieter und Geltungsbereich
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1.1 Anbieter</h4>
              <CompanyInfo />
            </div>
            <div>
              <h4 className="font-semibold mb-2">1.2 Geltungsbereich</h4>
              <p className="text-foreground/80">
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Leistungen der avara-Plattform. 
                Mit der Registrierung und Nutzung unserer Dienste erkennen Sie diese AGB als verbindlich an.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 2. Leistungsbeschreibung */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>2. Leistungsbeschreibung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">2.1 Plattform-Dienste</h4>
              <p className="text-foreground/80 mb-3">
                avara stellt eine webbasierte Plattform zur Verfügung, die Yoga-Lehrenden folgende Funktionen bietet:
              </p>
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                <li>Kalender-Synchronisation mit externen Kalenderdiensten</li>
                <li>Erstellung und Verwaltung öffentlicher Klassenseiten</li>
                <li>Automatische Kategorisierung und Tag-Verwaltung</li>
                <li>Rechnungserstellung und Abrechnungsfunktionen</li>
                <li>Profil- und Kontaktverwaltung</li>
                <li>Studio-Integration und Standort-Verwaltung</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2.2 Beta-Status</h4>
              <p className="text-foreground/80">
                Die Plattform befindet sich derzeit im geschlossenen Beta-Stadium. Funktionen können sich ändern, 
                und der Zugang ist auf ausgewählte Nutzer beschränkt.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 3. Registrierung und Nutzerkonto */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>3. Registrierung und Nutzerkonto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">3.1 Voraussetzungen</h4>
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                <li>Mindestalter: 18 Jahre</li>
                <li>Gültige E-Mail-Adresse</li>
                <li>Tätigkeit als Yoga-Lehrerin oder -Lehrer</li>
                <li>Einwilligung zu diesen AGB und der Datenschutzerklärung</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3.2 Kontosicherheit</h4>
              <p className="text-foreground/80">
                Sie sind verpflichtet, Ihre Zugangsdaten vertraulich zu behandeln und uns unverzüglich über 
                verdächtige Aktivitäten oder Sicherheitsverletzungen zu informieren.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3.3 Konto-Kündigung</h4>
              <p className="text-foreground/80">
                Sie können Ihr Konto jederzeit löschen. Wir behalten uns das Recht vor, Konten bei Verstößen 
                gegen diese AGB zu sperren oder zu löschen.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 4. Nutzerpflichten */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>4. Nutzerpflichten und Verbote</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">4.1 Erlaubte Nutzung</h4>
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                <li>Ausschließlich für eigene Yoga-Klassen und -Kurse</li>
                <li>Wahrheitsgemäße Angaben in Profil und Klassenbeschreibungen</li>
                <li>Respektvoller Umgang mit der Plattform und anderen Nutzern</li>
                <li>Einhaltung aller geltenden Gesetze</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4.2 Verbotene Aktivitäten</h4>
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                <li>Hochladen rechtsverletzender, beleidigender oder schädlicher Inhalte</li>
                <li>Verletzung von Urheberrechten oder anderen Rechten Dritter</li>
                <li>Spam, automatisierte Anfragen oder Missbrauch der Dienste</li>
                <li>Reverse Engineering oder Sicherheitstests ohne Genehmigung</li>
                <li>Kommerzielle Nutzung außerhalb des vorgesehenen Zwecks</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 5. Urheberrecht und Inhalte */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>5. Inhalte und Urheberrecht</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">5.1 Ihre Inhalte</h4>
              <p className="text-foreground/80">
                Sie behalten alle Rechte an den von Ihnen hochgeladenen Inhalten (Texte, Bilder, Kalenderdaten). 
                Sie gewähren uns eine nicht-exklusive Lizenz zur Anzeige und Verarbeitung dieser Inhalte 
                für die Bereitstellung unserer Dienste.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">5.2 Unsere Inhalte</h4>
              <p className="text-foreground/80">
                Alle Texte, Grafiken, Software und sonstigen Inhalte der Plattform sind urheberrechtlich 
                geschützt und dürfen nicht ohne unsere Zustimmung kopiert oder verwendet werden.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">5.3 Rechtsverletzungen</h4>
              <p className="text-foreground/80">
                Bei Urheberrechtsverletzungen oder anderen Rechtsverstößen entfernen wir die entsprechenden 
                Inhalte unverzüglich nach Benachrichtigung.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 6. Verfügbarkeit */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>6. Verfügbarkeit und technische Anforderungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">6.1 Verfügbarkeit</h4>
              <p className="text-foreground/80">
                Wir streben eine hohe Verfügbarkeit der Plattform an, können aber keine 100%ige Verfügbarkeit 
                garantieren. Wartungsarbeiten werden nach Möglichkeit angekündigt.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">6.2 Technische Anforderungen</h4>
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                <li>Moderner Webbrowser mit JavaScript-Unterstützung</li>
                <li>Stabile Internetverbindung</li>
                <li>Unterstützte Kalenderdienste (Google Calendar, Outlook, iCloud)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 7. Datenschutz */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>7. Datenschutz und Drittanbieter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">7.1 Datenschutz</h4>
              <p className="text-foreground/80">
                Die Verarbeitung Ihrer personenbezogenen Daten erfolgt gemäß unserer 
                <Link href={privacyPath} className="text-primary hover:text-primary/80 font-medium underline ml-1">
                  Datenschutzerklärung
                </Link>
                , die DSGVO-konform gestaltet ist.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">7.2 Drittanbieter-Integration</h4>
              <p className="text-foreground/80">
                Bei der Nutzung von Drittanbieter-Diensten (Google Calendar, etc.) gelten zusätzlich 
                deren Nutzungsbedingungen und Datenschutzrichtlinien.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 8. Haftung */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>8. Haftung und Gewährleistung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">8.1 Haftungsbeschränkung</h4>
              <p className="text-foreground/80">
                Unsere Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt. Bei leichter Fahrlässigkeit 
                haften wir nur bei Verletzung wesentlicher Vertragspflichten und nur bis zur Höhe des 
                vorhersehbaren, vertragstypischen Schadens.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">8.2 Ausgeschlossene Haftung</h4>
              <p className="text-foreground/80">
                Wir haften nicht für Datenverluste durch externe Faktoren, Probleme mit Drittanbieter-Diensten 
                oder Schäden durch unsachgemäße Nutzung der Plattform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">8.3 Verjährung</h4>
              <p className="text-foreground/80">
                Ansprüche gegen uns verjähren innerhalb eines Jahres ab Kenntnis des Schadens und unserer Person.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 9. Kündigung */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>9. Vertragslaufzeit und Kündigung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">9.1 Laufzeit</h4>
              <p className="text-foreground/80">
                Der Nutzungsvertrag läuft auf unbestimmte Zeit und kann von beiden Seiten 
                jederzeit ohne Einhaltung einer Frist gekündigt werden.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">9.2 Außerordentliche Kündigung</h4>
              <p className="text-foreground/80">
                Wir können den Vertrag fristlos kündigen bei schwerwiegenden Verstößen gegen diese AGB, 
                Missbrauch der Plattform oder rechtsverletzenden Aktivitäten.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">9.3 Folgen der Kündigung</h4>
              <p className="text-foreground/80">
                Nach Vertragsende werden Ihre Daten gemäß unserer Datenschutzerklärung gelöscht. 
                Öffentliche Klassenseiten werden deaktiviert.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 10. Preise */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>10. Preise und Zahlungsbedingungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">10.1 Aktuelle Preisstruktur</h4>
              <p className="text-foreground/80">
                Während der Beta-Phase ist die Nutzung der Plattform kostenlos. 
                Zukünftige Preisänderungen werden rechtzeitig kommuniziert.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">10.2 Preisänderungen</h4>
              <p className="text-foreground/80">
                Preisänderungen werden mindestens 30 Tage im Voraus angekündigt. 
                Sie haben das Recht, bei erheblichen Preiserhöhungen außerordentlich zu kündigen.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 11. Schlussbestimmungen */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>11. Schlussbestimmungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">11.1 Anwendbares Recht</h4>
              <p className="text-foreground/80">
                Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">11.2 Gerichtsstand</h4>
              <p className="text-foreground/80">
                Gerichtsstand für alle Streitigkeiten ist unser Geschäftssitz, 
                sofern Sie Kaufmann, juristische Person des öffentlichen Rechts oder 
                öffentlich-rechtliches Sondervermögen sind.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">11.3 Streitbeilegung</h4>
              <p className="text-foreground/80">
                Bei Verbraucherstreitigkeiten können Sie sich an die Allgemeine Verbraucherschlichtungsstelle 
                wenden. Wir sind zur Teilnahme an Streitbeilegungsverfahren nicht verpflichtet, aber bereit.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">11.4 Salvatorische Klausel</h4>
              <p className="text-foreground/80">
                Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit 
                der übrigen Bestimmungen davon unberührt.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">11.5 Änderungen der AGB</h4>
              <p className="text-foreground/80">
                Änderungen dieser AGB werden Ihnen mindestens 30 Tage vor Inkrafttreten per E-Mail mitgeteilt. 
                Widersprechen Sie nicht innerhalb von 30 Tagen, gelten die Änderungen als angenommen.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Kontakt */}
        <ContactCard
          title="Fragen zu den AGB?"
          description="Bei Fragen zu diesen Geschäftsbedingungen oder rechtlichen Aspekten der Plattform stehen wir Ihnen gerne zur Verfügung."
          buttonText="Kontakt aufnehmen"
          icon={Users}
        />
      </div>
    </LegalPageLayout>
  )
} 