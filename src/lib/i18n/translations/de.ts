import { Translations } from '../types'

const translations: Translations = {
  common: {
    nav: {
      home: 'Startseite',
      dashboard: 'Dashboard',
      manageEvents: 'Veranstaltungen verwalten',
      manageTags: 'Tags verwalten',
      invoices: 'Rechnungen',
      studios: 'Studios',
      profile: 'Profil',
      addCalendar: 'Kalender hinzufügen',
      signOut: 'Abmelden'
    },
    actions: {
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      create: 'Erstellen',
      update: 'Aktualisieren',
      confirm: 'Bestätigen',
      close: 'Schließen',
      next: 'Weiter',
      previous: 'Zurück',
      loading: 'Wird geladen...',
      submit: 'Absenden',
      search: 'Suchen',
      filter: 'Filtern',
      export: 'Exportieren',
      import: 'Importieren',
      share: 'Teilen',
      copy: 'Kopieren',
      select: 'Auswählen',
      selectAll: 'Alle auswählen',
      deselectAll: 'Alle abwählen'
    },
    labels: {
      name: 'Name',
      email: 'E-Mail',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      title: 'Titel',
      description: 'Beschreibung',
      date: 'Datum',
      time: 'Zeit',
      location: 'Ort',
      status: 'Status',
      type: 'Typ',
      tags: 'Tags',
      notes: 'Notizen',
      optional: 'Optional',
      required: 'Erforderlich',
      created: 'Erstellt',
      updated: 'Aktualisiert',
      deleted: 'Gelöscht'
    },
    messages: {
      success: 'Erfolgreich',
      error: 'Fehler',
      warning: 'Warnung',
      info: 'Info',
      confirmDelete: 'Möchten Sie diesen Eintrag wirklich löschen?',
      saveChanges: 'Änderungen speichern?',
      unsavedChanges: 'Sie haben ungespeicherte Änderungen',
      noData: 'Keine Daten verfügbar',
      noResults: 'Keine Ergebnisse gefunden',
      loading: 'Wird geladen...',
      comingSoon: 'Demnächst verfügbar'
    },
    form: {
      validation: {
        required: 'Dieses Feld ist erforderlich',
        email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
        minLength: 'Mindestens {min} Zeichen erforderlich',
        maxLength: 'Höchstens {max} Zeichen erlaubt',
        passwordMatch: 'Passwörter müssen übereinstimmen',
        invalidUrl: 'Bitte geben Sie eine gültige URL ein',
        invalidDate: 'Bitte geben Sie ein gültiges Datum ein'
      },
      placeholders: {
        search: 'Suchen...',
        selectOption: 'Option auswählen',
        enterText: 'Text eingeben',
        chooseFile: 'Datei wählen',
        enterUrl: 'URL eingeben',
        enterEmail: 'E-Mail eingeben',
        enterPassword: 'Passwort eingeben'
      }
    },
    datetime: {
      today: 'Heute',
      yesterday: 'Gestern',
      tomorrow: 'Morgen',
      thisWeek: 'Diese Woche',
      nextWeek: 'Nächste Woche',
      thisMonth: 'Dieser Monat',
      nextMonth: 'Nächster Monat',
      am: 'AM',
      pm: 'PM',
      days: {
        monday: 'Montag',
        tuesday: 'Dienstag',
        wednesday: 'Mittwoch',
        thursday: 'Donnerstag',
        friday: 'Freitag',
        saturday: 'Samstag',
        sunday: 'Sonntag'
      },
      months: {
        january: 'Januar',
        february: 'Februar',
        march: 'März',
        april: 'April',
        may: 'Mai',
        june: 'Juni',
        july: 'Juli',
        august: 'August',
        september: 'September',
        october: 'Oktober',
        november: 'November',
        december: 'Dezember'
      }
    }
  },
  auth: {
    signIn: {
      title: 'Anmelden',
      subtitle: 'Willkommen zurück zu Ihrem Yoga-Stundenplan',
      emailLabel: 'E-Mail',
      passwordLabel: 'Passwort',
      signInButton: 'Anmelden',
      forgotPassword: 'Passwort vergessen?',
      noAccount: 'Noch kein Konto?',
      createAccount: 'Konto erstellen',
      signInWithGoogle: 'Mit Google anmelden'
    },
    signUp: {
      title: 'Konto erstellen',
      subtitle: 'Werden Sie Teil unserer Yoga-Community',
      emailLabel: 'E-Mail',
      passwordLabel: 'Passwort',
      confirmPasswordLabel: 'Passwort bestätigen',
      signUpButton: 'Konto erstellen',
      alreadyHaveAccount: 'Bereits ein Konto?',
      signInInstead: 'Anmelden',
      termsAgreement: 'Mit der Kontoeröffnung stimmen Sie unseren Nutzungsbedingungen zu',
      privacyPolicy: 'Datenschutzrichtlinie',
      signUpWithGoogle: 'Mit Google registrieren'
    },
    profile: {
      title: 'Profil',
      personalInfo: 'Persönliche Informationen',
      accountSettings: 'Kontoeinstellungen',
      updateProfile: 'Profil aktualisieren',
      changePassword: 'Passwort ändern',
      deleteAccount: 'Konto löschen',
      confirmDelete: 'Möchten Sie Ihr Konto wirklich löschen?',
      profileUpdated: 'Profil erfolgreich aktualisiert',
      passwordChanged: 'Passwort erfolgreich geändert'
    }
  },
  events: {
    list: {
      title: 'Veranstaltungen',
      noEvents: 'Keine Veranstaltungen gefunden',
      createFirst: 'Erstellen Sie Ihre erste Veranstaltung',
      searchPlaceholder: 'Veranstaltungen suchen...',
      filterBy: 'Filtern nach',
      sortBy: 'Sortieren nach',
      showAll: 'Alle anzeigen',
      showUpcoming: 'Kommende anzeigen',
      showPast: 'Vergangene anzeigen'
    },
    create: {
      title: 'Veranstaltung erstellen',
      subtitle: 'Neue Yoga-Stunde oder Veranstaltung hinzufügen',
      eventName: 'Veranstaltungsname',
      eventDescription: 'Veranstaltungsbeschreibung',
      startDate: 'Startdatum',
      endDate: 'Enddatum',
      location: 'Ort',
      isOnline: 'Online-Veranstaltung',
      maxParticipants: 'Max. Teilnehmer',
      price: 'Preis',
      tags: 'Tags',
      createEvent: 'Veranstaltung erstellen',
      eventCreated: 'Veranstaltung erfolgreich erstellt'
    },
    details: {
      title: 'Veranstaltungsdetails',
      participants: 'Teilnehmer',
      duration: 'Dauer',
      level: 'Level',
      instructor: 'Lehrer',
      studio: 'Studio',
      price: 'Preis',
      bookingRequired: 'Buchung erforderlich',
      cancelPolicy: 'Stornierungsrichtlinie',
      whatToBring: 'Was mitbringen',
      accessInfo: 'Zugangsinfos'
    },
    status: {
      upcoming: 'Kommend',
      ongoing: 'Laufend',
      completed: 'Abgeschlossen',
      cancelled: 'Abgesagt',
      draft: 'Entwurf'
    }
  },
  calendar: {
    setup: {
      title: 'Kalender-Setup',
      subtitle: 'Verbinden Sie Ihren Kalender zur Synchronisation',
      connectCalendar: 'Kalender verbinden',
      manualEntry: 'Manuelle Eingabe',
      importEvents: 'Ereignisse importieren',
      syncSettings: 'Sync-Einstellungen',
      calendarConnected: 'Kalender verbunden',
      syncFrequency: 'Sync-Häufigkeit',
      autoSync: 'Auto-Sync',
      manualSync: 'Manueller Sync',
      lastSync: 'Letzter Sync',
      syncNow: 'Jetzt synchronisieren'
    },
    feeds: {
      title: 'Kalender-Feeds',
      addFeed: 'Feed hinzufügen',
      feedUrl: 'Feed-URL',
      feedName: 'Feed-Name',
      feedDescription: 'Feed-Beschreibung',
      feedAdded: 'Feed erfolgreich hinzugefügt',
      feedUpdated: 'Feed erfolgreich aktualisiert',
      feedDeleted: 'Feed erfolgreich gelöscht',
      testConnection: 'Verbindung testen',
      connectionSuccess: 'Verbindung erfolgreich',
      connectionError: 'Verbindung fehlgeschlagen'
    },
    integration: {
      title: 'Kalender-Integration',
      description: 'Verwalten Sie Ihre verbundenen Kalender-Feeds und Sync-Einstellungen.',
      modalTitle: 'Kalender-Feeds',
      modalDescription: 'Verwalten Sie Ihre verbundenen Kalender-Feeds und Sync-Einstellungen.',
      noFeeds: 'Noch keine Kalender-Feeds verbunden.',
      addCalendar: 'Kalender-Feed hinzufügen',
      unnamedCalendar: 'Unbenannter Kalender',
      active: 'Aktiv',
      pending: 'Ausstehend',
      lastSynced: 'Zuletzt synchronisiert:',
      moreFeeds: '+{count} weitere Feeds',
      manageFeeds: 'Feeds verwalten',
      addMore: 'Weitere hinzufügen'
    },
    addCalendar: {
      title: 'Kalender-Feed hinzufügen',
      subtitle: 'Verbinden Sie einen weiteren Kalender, um mehr Ereignisse mit Ihrem Zeitplan zu synchronisieren.',
      successTitle: 'Kalender erfolgreich verbunden!',
      successDescription: 'Ihr Google Kalender wurde verbunden. Ihre Ereignisse werden nun automatisch synchronisiert.',
      errorTitle: 'Verbindung fehlgeschlagen',
      errors: {
        oauth_denied: 'Sie haben den Zugriff auf Ihren Kalender verweigert.',
        invalid_callback: 'Ungültiger OAuth-Rückruf. Bitte versuchen Sie es erneut.',
        invalid_state: 'Sicherheitsvalidierung fehlgeschlagen. Bitte versuchen Sie es erneut.',
        token_exchange_failed: 'Fehler beim Austausch des Autorisierungscodes.',
        user_info_failed: 'Fehler beim Abrufen der Benutzerinformationen.',
        calendar_fetch_failed: 'Fehler beim Abrufen der Kalenderliste.',
        database_error: 'Fehler beim Speichern der Verbindung. Bitte versuchen Sie es erneut.',
        internal_error: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
        generic: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
      }
    }
  },
  studios: {
    list: {
      title: 'Studios',
      noStudios: 'Keine Studios gefunden',
      createFirst: 'Erstellen Sie Ihr erstes Studio',
      joinStudio: 'Studio beitreten',
      requestAccess: 'Zugang anfordern'
    },
    create: {
      title: 'Studio erstellen',
      studioName: 'Studio-Name',
      studioDescription: 'Studio-Beschreibung',
      address: 'Adresse',
      phone: 'Telefon',
      email: 'E-Mail',
      website: 'Website',
      socialMedia: 'Social Media',
      amenities: 'Ausstattung',
      policies: 'Richtlinien',
      createStudio: 'Studio erstellen',
      studioCreated: 'Studio erfolgreich erstellt'
    },
    manage: {
      title: 'Studio verwalten',
      settings: 'Einstellungen',
      teachers: 'Lehrer',
      schedule: 'Stundenplan',
      rates: 'Preise',
      inviteTeacher: 'Lehrer einladen',
      removeTeacher: 'Lehrer entfernen',
      updateRates: 'Preise aktualisieren',
      studioSettings: 'Studio-Einstellungen'
    }
  },
  invoices: {
    list: {
      title: 'Rechnungen',
      noInvoices: 'Keine Rechnungen gefunden',
      createFirst: 'Erstellen Sie Ihre erste Rechnung',
      pending: 'Ausstehend',
      paid: 'Bezahlt',
      overdue: 'Überfällig',
      draft: 'Entwurf'
    },
    create: {
      title: 'Rechnung erstellen',
      selectEvents: 'Veranstaltungen auswählen',
      billingPeriod: 'Abrechnungszeitraum',
      invoiceNumber: 'Rechnungsnummer',
      dueDate: 'Fälligkeitsdatum',
      notes: 'Notizen',
      generatePDF: 'PDF erstellen',
      invoiceCreated: 'Rechnung erfolgreich erstellt',
      language: 'Sprache',
      template: 'Vorlage'
    },
    details: {
      invoiceNumber: 'Rechnung #',
      date: 'Datum',
      period: 'Zeitraum',
      billTo: 'Rechnung an',
      event: 'Veranstaltung',
      dateCol: 'Datum',
      studio: 'Studio',
      students: 'Teilnehmer',
      rate: 'Tarif',
      total: 'Gesamt',
      notes: 'Notizen',
      vatExempt: 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.',
      untitledEvent: 'Unbenannte Veranstaltung'
    }
  },
  dashboard: {
    welcome: 'Willkommen, {name}',
    subtitle: 'Verwalten Sie Ihren Yoga-Stundenplan und Ihr Profil',
    authRequired: 'Anmeldung erforderlich',
    upcomingClasses: {
      title: 'Ihre kommenden Stunden',
      viewAll: 'Alle Termine anzeigen →',
      noCalendar: 'Verbinden Sie Ihren Kalender, um hier Ihre kommenden Stunden zu sehen.'
    },
    calendarActions: 'Kalender-Aktionen',
    publicSchedule: {
      title: 'Öffentlicher Stundenplan',
      description: 'Sehen Sie, wie Ihr Stundenplan für Ihre Schüler aussieht.',
      yourSchedule: 'Ihr öffentlicher Stundenplan:',
      yourScheduleCustomize: 'Ihr öffentlicher Stundenplan (im Profil anpassen):',
      share: 'Teilen',
      viewPublic: 'Öffentliche Seite ansehen'
    },
    manageEvents: {
      title: 'Ihre Termine anzeigen',
      description: 'Überprüfen und verwalten Sie alle importierten Kalendertermine.',
      button: 'Termine verwalten'
    },
    tagRules: {
      title: 'Tag-Regeln',
      description: 'Markieren Sie Ihre Termine automatisch mit Stichwörtern.',
      button: 'Tag-Regeln verwalten'
    },
    invoices: {
      title: 'Rechnungsverwaltung',
      description: 'Erstellen Sie Studio-Profile und generieren Sie Rechnungen.',
      button: 'Rechnungen verwalten'
    },
    profile: {
      title: 'Profil einrichten',
      description: 'Vervollständigen Sie Ihr Profil, um Ihren öffentlichen Stundenplan zu aktivieren.',
      button: 'Profil vervollständigen'
    },
    studioRequest: {
      title: 'Studio-Verbindungen',
      titleConnected: 'Verbundene Studios',
      titleJoin: 'Studios beitreten',
      descriptionConnected: 'Ihre genehmigten Studio-Verbindungen für Vertretungsunterricht.',
      descriptionJoin: 'Beantragen Sie die Aufnahme in verifizierte Studios und erweitern Sie Ihre Unterrichtsmöglichkeiten.',
      approved: 'Genehmigt',
      requestMore: 'Weitere Studios anfordern',
      requestAccess: 'Studio-Zugang anfordern',
      moreStudios: '+{count} weitere{plural} Studio{plural} verbunden'
    },
    profilePage: {
      title: 'Profil-Einstellungen',
      subtitle: 'Verwalten Sie Ihre Kontoeinstellungen und öffentlichen Profilinformationen.',
      accountSettings: {
        title: 'Kontoeinstellungen',
        description: 'Verwalten Sie Ihre Kontopräferenzen und Sicherheitseinstellungen.',
        viewDashboard: 'Dashboard anzeigen',
        signOut: 'Abmelden'
      }
    }
  },
  seo: {
    home: {
      title: 'SyncIt - Schöne Yoga-Terminplanung Plattform',
      description: 'Verbinden Sie Ihren Kalender und erstellen Sie schöne, teilbare Terminpläne für Ihre Yoga-Kurse. Vertrauen von 500+ Yoga-Lehrern weltweit. Kostenlos starten.',
      keywords: 'Yoga-Terminplan, Kalender-Sync, Kursverwaltung, Lehrer-Plattform, Yoga-Lehrer, Terminplan-Sharing, Kalender-Integration'
    },
    dashboard: {
      title: 'Dashboard - Verwalten Sie Ihren Yoga-Terminplan | SyncIt',
      description: 'Verwalten Sie Ihre Yoga-Kurse, Kalender-Feeds und teilen Sie Ihren Terminplan mit Schülern. Sehen Sie kommende Kurse, verwalten Sie Termine und verfolgen Sie Ihren Unterrichtsplan.',
      keywords: 'Yoga-Dashboard, Kursverwaltung, Terminplanung, Lehrer-Dashboard, Kalender-Management'
    },
    profile: {
      title: 'Profil-Einstellungen - Ihr Yoga-Profil anpassen | SyncIt',
      description: 'Passen Sie Ihr öffentliches Yoga-Lehrer-Profil an. Fügen Sie Ihre Biografie, Spezialisierungen, Kontaktinformationen hinzu und erstellen Sie eine schöne Seite für Ihre Schüler.',
      keywords: 'Yoga-Profil, Lehrer-Profil, Yoga-Lehrer-Profil, öffentliches Profil, Yoga-Biografie'
    },
    addCalendar: {
      title: 'Kalender hinzufügen - Verbinden Sie Ihren Yoga-Terminplan | SyncIt',
      description: 'Verbinden Sie Ihren Google Kalender, iCloud oder einen beliebigen Kalender-Feed, um Ihre Yoga-Kurse automatisch zu synchronisieren. Einfache Einrichtung in unter 2 Minuten.',
      keywords: 'Kalender-Sync, Google Kalender, iCloud-Sync, Kalender-Integration, Yoga-Kalender'
    },
    manageEvents: {
      title: 'Termine verwalten - Ihre Yoga-Kurse | SyncIt',
      description: 'Sehen und verwalten Sie alle Ihre Yoga-Kurse und Termine. Bearbeiten Sie Kursdetails, fügen Sie Tags hinzu und organisieren Sie Ihren Unterrichtsplan.',
      keywords: 'Yoga-Termine, Kursverwaltung, Terminverwaltung, Yoga-Terminplan, Kursorganisation'
    },
    manageTags: {
      title: 'Tags verwalten - Organisieren Sie Ihre Yoga-Kurse | SyncIt',
      description: 'Erstellen und verwalten Sie Tags für Ihre Yoga-Kurse. Kategorisieren Sie Kurse automatisch nach Typ, Level und Standort.',
      keywords: 'Yoga-Tags, Kurs-Kategorien, Yoga-Kurstypen, Terminorganisation, Kurs-Kennzeichnung'
    },
    studios: {
      title: 'Studios - Ihre Unterrichtsorte | SyncIt',
      description: 'Verwalten Sie Ihre Yoga-Studio-Beziehungen und Unterrichtsorte. Verbinden Sie sich mit Studios und verfolgen Sie Ihre Unterrichtsmöglichkeiten.',
      keywords: 'Yoga-Studios, Unterrichtsorte, Studio-Management, Yoga-Lehrer-Netzwerk'
    },
    invoices: {
      title: 'Rechnungen - Yoga-Unterricht Einkommensverwaltung | SyncIt',
      description: 'Erstellen Sie professionelle Rechnungen für Ihren Yoga-Unterricht. Verfolgen Sie Einkommen, erstellen Sie Abrechnungsberichte und verwalten Sie Ihre Unterrichts-Einnahmen.',
      keywords: 'Yoga-Rechnungen, Unterrichts-Einkommen, Yoga-Abrechnung, Lehrer-Zahlungen, Unterrichts-Einnahmen'
    },
    teacherSchedule: {
      title: '{teacherName} - Yoga-Kursterminplan',
      description: 'Buchen Sie Yoga-Kurse mit {teacherName}. Sehen Sie kommende Stunden, Kurstypen, Spezialisierungen und Kontaktinformationen. {location}',
      keywords: 'Yoga-Kurse, {teacherName}, Yoga buchen, Yoga-Terminplan, Yoga-Lehrer, {location}'
    },
    auth: {
      signIn: {
        title: 'Anmelden - Zugang zu Ihrem Yoga-Dashboard | SyncIt',
        description: 'Melden Sie sich bei Ihrem SyncIt-Konto an, um Ihren Yoga-Terminplan zu verwalten, Kalender-Feeds zu verwalten und Ihre Kurse mit Schülern zu teilen.',
        keywords: 'Anmelden, Login, Yoga-Dashboard, Lehrer-Login, Konto-Zugang'
      },
      signUp: {
        title: 'Konto erstellen - Starten Sie Ihren Yoga-Terminplan | SyncIt',
        description: 'Erstellen Sie Ihr kostenloses SyncIt-Konto und beginnen Sie, Ihren Yoga-Terminplan mit Schülern zu teilen. Verbinden Sie Ihren Kalender und bauen Sie Ihre Online-Präsenz auf.',
        keywords: 'Konto erstellen, Registrierung, Yoga-Lehrer, kostenloses Konto, Terminplan-Sharing'
      }
    },
    errors: {
      notFound: {
        title: 'Seite nicht gefunden - SyncIt',
        description: 'Die Seite, die Sie suchen, konnte nicht gefunden werden. Kehren Sie zu Ihrem Yoga-Terminplan-Dashboard zurück oder durchsuchen Sie unsere Yoga-Lehrer-Plattform.',
        keywords: 'Seite nicht gefunden, 404, Yoga-Terminplan, Lehrer-Plattform'
      },
      serverError: {
        title: 'Server-Fehler - SyncIt',
        description: 'Wir haben technische Schwierigkeiten. Bitte versuchen Sie es später noch einmal oder kontaktieren Sie den Support für Hilfe mit Ihrem Yoga-Terminplan.',
        keywords: 'Server-Fehler, technischer Support, Yoga-Plattform-Support'
      }
    }
  }
}

export default translations 