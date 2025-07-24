import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Shield, FileText } from 'lucide-react'
import { 
  LegalPageLayout, 
  LegalPageHeader, 
  CompanyInfo, 
  ContactCard 
} from '@/components/legal'

export default function PrivacyPage() {
  return (
    <LegalPageLayout>
      <LegalPageHeader
        icon={Shield}
        title="Datenschutzerklärung"
        description="Ihre Privatsphäre ist uns wichtig. Diese Erklärung beschreibt, wie wir Ihre personenbezogenen Daten sammeln, verwenden und schützen."
        lastUpdated="1. Januar 2024"
      />

      <div className="space-y-8">
        {/* 1. Verantwortlicher */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              1. Verantwortlicher für die Datenverarbeitung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Verantwortlicher im Sinne der EU-Datenschutz-Grundverordnung (DSGVO) ist:
            </p>
            <CompanyInfo variant="privacy" />
          </CardContent>
        </Card>

        {/* 2. Datenerfassung */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>2. Welche Daten wir sammeln</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">2.1 Kontodaten</h4>
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                <li>E-Mail-Adresse (Pflichtfeld für Registrierung)</li>
                <li>Name und Profilinformationen</li>
                <li>Öffentliche URL für Ihre Yoga-Seite</li>
                <li>Profilbild und Biografietext (optional)</li>
                <li>Kontaktinformationen und Social Media Links (optional)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">2.2 Kalenderdaten</h4>
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                <li>Yoga-Klassen und Kurstermine aus Ihrem Kalender</li>
                <li>Veranstaltungstitel, Beschreibungen und Orte</li>
                <li>Start- und Endzeiten Ihrer Klassen</li>
                <li>Teilnehmerzahlen (falls angegeben)</li>
                <li>OAuth-Zugriffstoken für Google Calendar (verschlüsselt gespeichert)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">2.3 Automatische Datenerfassung</h4>
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                <li>IP-Adresse und Browser-Informationen</li>
                <li>Synchronisationszeitstempel</li>
                <li>Nutzungsstatistiken und Leistungsmetriken</li>
                <li>Fehlerlogs für technische Diagnose</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">2.4 Abrechnungsdaten (optional)</h4>
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                <li>Studio-Informationen und Standorte</li>
                <li>Rechnungsrelevante Klassendaten</li>
                <li>Stundensätze und Abrechnungsregeln</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 3. Rechtsgrundlagen */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>3. Rechtsgrundlagen der Datenverarbeitung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</h4>
              <p className="text-foreground/80">
                Verarbeitung Ihrer Konto- und Kalenderdaten zur Bereitstellung unserer Plattform-Dienste.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</h4>
              <p className="text-foreground/80">
                Verarbeitung optionaler Daten wie Profilbilder, erweiterte Kontaktinformationen und OAuth-Integrationen.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse)</h4>
              <p className="text-foreground/80">
                Technische Logs zur Sicherheit, Leistungsoptimierung und Missbrauchsprävention.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 4. Datenverwendung */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>4. Wie wir Ihre Daten verwenden</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>Bereitstellung Ihrer öffentlichen Yoga-Klassenseite</li>
              <li>Synchronisation und Anzeige Ihrer Kurstermine</li>
              <li>Automatische Kategorisierung von Klassen mittels Tags</li>
              <li>Generierung von Rechnungen und Abrechnungsberichten</li>
              <li>Technischer Support und Fehlerbehebung</li>
              <li>Benachrichtigungen über wichtige Kontoänderungen</li>
              <li>Verbesserung unserer Dienste durch anonymisierte Nutzungsanalysen</li>
            </ul>
          </CardContent>
        </Card>

        {/* 5. Drittanbieter */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>5. Drittanbieter und Datenübertragung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">5.1 Supabase (Hosting und Datenbank)</h4>
              <p className="text-foreground/80">
                Ihre Daten werden auf Servern von Supabase in der EU gehostet. 
                Supabase ist ISO 27001 zertifiziert und DSGVO-konform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">5.2 Google Calendar API</h4>
              <p className="text-foreground/80">
                Bei OAuth-Integration mit Google Calendar übertragen wir verschlüsselte Zugriffstoken. 
                Die Verarbeitung erfolgt gemäß Googles Datenschutzrichtlinien.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">5.3 E-Mail-Verarbeitung</h4>
              <p className="text-foreground/80">
                Kalender-Einladungen werden über sichere E-Mail-Dienste verarbeitet. 
                E-Mail-Inhalte werden nur zur Kalender-Extraktion verwendet und nicht dauerhaft gespeichert.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 6. Datenspeicherung */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>6. Datenspeicherung und -löschung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Kontodaten</h4>
              <p className="text-foreground/80">
                Werden gespeichert, solange Ihr Konto aktiv ist. Nach Kontolöschung werden alle personenbezogenen Daten innerhalb von 30 Tagen gelöscht.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Kalenderdaten</h4>
              <p className="text-foreground/80">
                Vergangene Klassentermine werden für Abrechnungszwecke 3 Jahre aufbewahrt, dann automatisch gelöscht.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Technische Logs</h4>
              <p className="text-foreground/80">
                IP-Adressen und Logs werden nach 90 Tagen automatisch anonymisiert oder gelöscht.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 7. Ihre Rechte */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>7. Ihre Rechte nach der DSGVO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">Recht auf Auskunft (Art. 15)</h4>
                  <p className="text-sm text-foreground/80">Informationen über Ihre gespeicherten Daten</p>
                </div>
                <div>
                  <h4 className="font-semibold">Recht auf Berichtigung (Art. 16)</h4>
                  <p className="text-sm text-foreground/80">Korrektur unrichtiger Daten</p>
                </div>
                <div>
                  <h4 className="font-semibold">Recht auf Löschung (Art. 17)</h4>
                  <p className="text-sm text-foreground/80">Löschung Ihrer personenbezogenen Daten</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">Recht auf Datenübertragbarkeit (Art. 20)</h4>
                  <p className="text-sm text-foreground/80">Export Ihrer Daten in maschinenlesbarem Format</p>
                </div>
                <div>
                  <h4 className="font-semibold">Recht auf Widerspruch (Art. 21)</h4>
                  <p className="text-sm text-foreground/80">Widerspruch gegen bestimmte Verarbeitungen</p>
                </div>
                <div>
                  <h4 className="font-semibold">Recht auf Einschränkung (Art. 18)</h4>
                  <p className="text-sm text-foreground/80">Einschränkung der Verarbeitung</p>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-white/20 rounded-xl p-4 backdrop-blur-sm border border-white/30">
              <p className="text-sm">
                <strong>Zur Ausübung Ihrer Rechte</strong> wenden Sie sich an: 
                <Link href="mailto:hello@avara.studio" className="text-primary hover:text-primary/80 ml-1">
                  hello@avara.studio
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 8. Sicherheit */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>8. Datensicherheit</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>Verschlüsselung aller Datenübertragungen (TLS 1.3)</li>
              <li>Verschlüsselte Speicherung sensibler Daten (OAuth-Token)</li>
              <li>Regelmäßige Sicherheitsaudits und Updates</li>
              <li>Zugriffskontrolle und Authentifizierung</li>
              <li>Automatische Backups mit Verschlüsselung</li>
              <li>Monitoring und Incident Response Verfahren</li>
            </ul>
          </CardContent>
        </Card>

        {/* 9. Cookies */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>9. Cookies und Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Notwendige Cookies</h4>
              <p className="text-foreground/80">
                Session-Cookies für Authentifizierung und Sicherheit. Diese können nicht deaktiviert werden.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Funktionale Cookies</h4>
              <p className="text-foreground/80">
                Speicherung Ihrer Einstellungen und Präferenzen für eine bessere Nutzererfahrung.
              </p>
            </div>
            <p className="text-sm text-foreground/60">
              Wir verwenden keine Tracking-Cookies von Drittanbietern oder Analysedienste ohne Ihre ausdrückliche Einwilligung.
            </p>
          </CardContent>
        </Card>

        {/* 10. Änderungen */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>10. Änderungen dieser Datenschutzerklärung</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80">
              Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren, um Änderungen unserer 
              Praktiken oder aus rechtlichen Gründen zu berücksichtigen. Wesentliche Änderungen werden wir 
              Ihnen per E-Mail oder durch Benachrichtigung in der Anwendung mitteilen.
            </p>
          </CardContent>
        </Card>

        {/* Kontakt */}
        <ContactCard
          title="Fragen zum Datenschutz?"
          description="Bei Fragen zu dieser Datenschutzerklärung oder zur Verarbeitung Ihrer Daten kontaktieren Sie uns gerne."
          buttonText="E-Mail senden"
        />
      </div>
    </LegalPageLayout>
  )
} 