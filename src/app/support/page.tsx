import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LifeBuoy, MessageCircle, Book, Calendar, Settings } from 'lucide-react'
import { 
  LegalPageLayout, 
  LegalPageHeader, 
  ContactCard,
  ContactEmailLink 
} from '@/components/legal'

export default function SupportPage() {
  return (
    <LegalPageLayout>
      <LegalPageHeader
        icon={LifeBuoy}
        title="Support & Hilfe"
        description="Wir helfen Ihnen gerne dabei, das Beste aus der avara-Plattform herauszuholen. Hier finden Sie Antworten auf häufige Fragen und Kontaktmöglichkeiten."
      />

      <div className="space-y-8">
        {/* Kontakt */}
        <ContactCard
          title="Direkter Kontakt"
          description="Haben Sie eine spezifische Frage oder benötigen persönliche Unterstützung? Wir antworten normalerweise innerhalb von 24 Stunden."
          buttonText="Support kontaktieren"
          subject="Support Anfrage"
        />

        {/* Häufige Fragen */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Häufig gestellte Fragen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Wie verbinde ich meinen Kalender?</h4>
              <p className="text-foreground/80">
                Sie können Ihren Kalender über drei Wege verbinden: OAuth-Integration mit Google Calendar, 
                E-Mail-Einladungssystem oder manuelle Eingabe der .ics-Feed-URL. 
                Die einfachste Methode ist die OAuth-Integration im Dashboard.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Wie erstelle ich meine öffentliche Seite?</h4>
              <p className="text-foreground/80">
                Nach der Kalenderverbindung können Sie unter &quot;Profil&quot; Ihre öffentliche URL festlegen 
                und Ihr Profil vervollständigen. Ihre Klassen werden automatisch auf der öffentlichen Seite angezeigt.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Welche Kalenderdienste werden unterstützt?</h4>
              <p className="text-foreground/80">
                Wir unterstützen Google Calendar (vollständig), Outlook/Office 365, Apple iCloud Calendar 
                und jeden Kalenderdienst, der .ics-Feeds bereitstellt.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Wie funktioniert die Rechnungserstellung?</h4>
              <p className="text-foreground/80">
                Sie können Studios hinzufügen und Ihre Klassen automatisch zuordnen lassen. 
                Das System erstellt dann PDF-Rechnungen basierend auf Ihren Stundensätzen und gehaltenen Klassen.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Sind meine Daten sicher?</h4>
              <p className="text-foreground/80">
                Ja, alle Daten werden DSGVO-konform in der EU gehostet. Kalender-Zugriffstoken werden verschlüsselt 
                gespeichert und Sie haben jederzeit volle Kontrolle über Ihre Daten.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Hilfe-Kategorien */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card variant="glass" className="text-center">
            <CardContent className="p-6">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-serif mb-3">Kalender-Integration</h3>
              <p className="text-sm text-foreground/70 mb-4">
                Hilfe beim Verbinden und Synchronisieren Ihrer Kalender
              </p>
              <Button asChild variant="ghost" size="sm">
                <ContactEmailLink subject="Kalender Hilfe">
                  Hilfe anfordern
                </ContactEmailLink>
              </Button>
            </CardContent>
          </Card>

          <Card variant="glass" className="text-center">
            <CardContent className="p-6">
              <Settings className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-serif mb-3">Profil & Einstellungen</h3>
              <p className="text-sm text-foreground/70 mb-4">
                Unterstützung bei der Einrichtung Ihres Profils und Ihrer Seite
              </p>
              <Button asChild variant="ghost" size="sm">
                <ContactEmailLink subject="Profil Hilfe">
                  Hilfe anfordern
                </ContactEmailLink>
              </Button>
            </CardContent>
          </Card>

          <Card variant="glass" className="text-center">
            <CardContent className="p-6">
              <Book className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-serif mb-3">Rechnungen & Abrechnung</h3>
              <p className="text-sm text-foreground/70 mb-4">
                Hilfe bei der Rechnungserstellung und Studio-Verwaltung
              </p>
              <Button asChild variant="ghost" size="sm">
                <ContactEmailLink subject="Rechnungen Hilfe">
                  Hilfe anfordern
                </ContactEmailLink>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Beta-Information */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Beta-Phase Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground/80">
              avara befindet sich derzeit in der geschlossenen Beta-Phase. Das bedeutet:
            </p>
            <ul className="list-disc list-inside space-y-1 text-foreground/80">
              <li>Die Nutzung ist derzeit kostenlos</li>
              <li>Neue Funktionen werden regelmäßig hinzugefügt</li>
              <li>Ihr Feedback hilft uns bei der Weiterentwicklung</li>
              <li>Bei Problemen sind wir besonders schnell beim Support</li>
            </ul>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm border border-white/30">
              <p className="text-sm">
                <strong>Beta-Tester:</strong> Ihre Erfahrungen und Verbesserungsvorschläge sind uns sehr wichtig. 
                Schreiben Sie uns gerne Ihr Feedback!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Technische Probleme */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Technische Probleme melden</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground/80">
              Falls Sie technische Probleme oder Fehler feststellen, helfen Sie uns mit folgenden Informationen:
            </p>
            <ul className="list-disc list-inside space-y-1 text-foreground/80">
              <li>Beschreibung des Problems</li>
              <li>Schritte zur Reproduktion</li>
              <li>Verwendeter Browser und Betriebssystem</li>
              <li>Screenshots oder Fehlermeldungen (falls vorhanden)</li>
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
                Problem melden
              </ContactEmailLink>
            </Button>
          </CardContent>
        </Card>
      </div>
    </LegalPageLayout>
  )
} 