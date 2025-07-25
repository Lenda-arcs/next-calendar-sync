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
      signOut: 'Abmelden',
      appName: 'avara.'
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
    },
    errors: {
      notFound: {
        title: 'Seite nicht gefunden',
        description: 'Hoppla! Die Seite, die Sie suchen, scheint sich verirrt zu haben. Keine Sorge, auch die besten Yoga-Haltungen erfordern manchmal Anpassungen.',
        goHome: 'Zur Startseite',
        goBack: 'Zurück',
        helpfulLinks: 'Suchen Sie etwas Bestimmtes? Probieren Sie diese beliebten Seiten:',
        stillTrouble: 'Haben Sie immer noch Probleme?',
        contactSupport: 'Wenn Sie glauben, dass dies ein Fehler ist, wenden Sie sich bitte an',
        supportTeam: 'unser Support-Team',
        findHelp: 'und wir helfen Ihnen, das zu finden, was Sie suchen.'
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
    },

    management: {
      title: 'Studio-Verwaltung',
      subtitle: 'Studios, Lehrer und Abrechnungsbeziehungen verwalten',
      createStudio: 'Studio erstellen',
      accessRestricted: 'Zugriff eingeschränkt',
      accessRestrictedDesc: 'Nur Administratoren können Studios verwalten.',
      overview: {
        totalStudios: 'Studios gesamt',
        activeTeachers: 'Aktive Lehrer',
        verifiedStudios: 'Verifizierte Studios'
      },
      tabs: {
        studios: 'Studios',
        teacherRequests: 'Lehrer-Anfragen'
      }
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
    },
    
    management: {
      title: 'Rechnungen verwalten',
      subtitle: 'Erstellen und verfolgen Sie Rechnungen für Ihre Veranstaltungen und Dienstleistungen.',
      tabs: {
        billing: 'Abrechnung & Veranstaltungen',
        billingShort: 'Abrechnung',
        invoices: 'Rechnungen',
        invoicesShort: 'Rechnungen',
        settings: 'Einstellungen',
        settingsShort: 'Config'
      },
      billingTab: {
        title: 'Abrechnung & Veranstaltungen',
        description: 'Verwalten Sie nicht abgerechnete Veranstaltungen nach Studios gruppiert, synchronisieren Sie historische Daten und beheben Sie Zuordnungsprobleme. Erstellen Sie Rechnungen für abgeschlossene Kurse.',
        loading: 'Lade nicht abgerechnete Veranstaltungen...'
      },
      invoicesTab: {
        title: 'Ihre Rechnungen',
        description: 'Betrachten und verwalten Sie Ihre erstellten Rechnungen.',
        noInvoicesTitle: 'Noch keine Rechnungen',
        noInvoicesDescription: 'Erstellen Sie Ihre erste Rechnung, indem Sie Veranstaltungen aus dem Tab "Nicht abgerechnete Veranstaltungen" auswählen.',
        viewUninvoiced: 'Nicht abgerechnete Veranstaltungen anzeigen'
      },
      settingsTab: {
        title: 'Rechnungseinstellungen & Abrechnungsprofile',
        description: 'Verwalten Sie Ihre persönlichen Abrechnungsinformationen und Abrechnungseinstellungen.',
        loading: 'Lade Einstellungen...'
      }
    },
    
    creation: {
      modalTitle: 'Rechnung {mode} - {studioName}',
      editTitle: 'Bearbeiten',
      createTitle: 'Erstellen',
      invoiceDetails: 'Rechnungsdetails',
      invoiceNumber: 'Rechnungsnummer',
      notes: 'Notizen (Optional)',
      notesPlaceholder: 'Fügen Sie zusätzliche Notizen für diese Rechnung hinzu...',
      events: 'Veranstaltungen ({count})',
      eventsDescription: 'Klicken Sie auf das Bearbeiten-Symbol, um Titel und Tarif für jede Veranstaltung zu ändern.',
      total: 'Gesamt:',
      noEvents: 'Keine Veranstaltungen ausgewählt.',
      creating: 'Erstelle...',
      updating: 'Aktualisiere...',
      create: 'Rechnung erstellen',
      update: 'Rechnung aktualisieren',
      cancel: 'Abbrechen',
      close: 'Schließen',
      successTitle: 'Rechnung erfolgreich erstellt!',
      successUpdatedTitle: 'Rechnung erfolgreich aktualisiert!',
      successMessage: 'Rechnung {invoiceNumber} wurde {mode} für €{total}',
      pdfOptions: 'PDF-Optionen',
      generatePDF: 'PDF generieren',
      generating: 'Generiere PDF...',
      viewPDF: 'PDF anzeigen',
      pdfGenerated: 'PDF erfolgreich generiert!',
      pdfGeneratedDesc: 'Ihre Rechnungs-PDF wurde erstellt und ist bereit zur Ansicht.',
      pdfFailed: 'PDF-Generierung fehlgeschlagen',
      pdfFailedDesc: 'PDF konnte nicht generiert werden. Bitte versuchen Sie es erneut.'
    },
    
    card: {
      unknownStudio: 'Unbekanntes Studio',
      events: 'Veranstaltungen',
      period: 'Zeitraum:',
      created: 'Erstellt:',
      pdf: 'PDF',
      edit: 'Bearbeiten',
      view: 'Anzeigen',
      draft: 'Entwurf',
      sent: 'Gesendet',
      paid: 'Bezahlt',
      overdue: 'Überfällig',
      cancelled: 'Storniert',
      sent_: 'Gesendet',
      paid_: 'Bezahlt',
      overdue_: 'Überfällig',
      statusChange: 'Status:',
      generatePDF: 'PDF generieren',
      viewPDF: 'PDF anzeigen',
      delete: 'Löschen',
      confirmDelete: 'Rechnung löschen?',
      confirmDeleteDesc: 'Diese Aktion kann nicht rückgängig gemacht werden. Die Rechnung wird dauerhaft gelöscht und alle Event-Verknüpfungen entfernt.',
      deleteSuccess: 'Rechnung erfolgreich gelöscht',
      deleteSuccessDesc: 'Rechnung, PDF-Datei und alle Event-Verknüpfungen wurden entfernt. Events sind jetzt wieder für zukünftige Rechnungen verfügbar.',
      deleteFailed: 'Rechnung konnte nicht gelöscht werden',
      deleteFailedDesc: 'Rechnung konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.'
    },
    
    settings: {
      invoiceInfoTitle: 'Ihre Rechnungsinformationen',
      invoiceInfoDesc: 'Richten Sie Ihre persönlichen Abrechnungsdetails für die Rechnungserstellung ein',
      editSettings: 'Einstellungen bearbeiten',
      noSettingsTitle: 'Keine Rechnungseinstellungen konfiguriert',
      noSettingsDesc: 'Richten Sie Ihre Abrechnungsinformationen ein, um Rechnungen zu generieren',
      setupSettings: 'Rechnungseinstellungen einrichten',
      setupComplete: 'Setup abgeschlossen',
      contactInfo: 'Kontaktinformationen',
      email: 'E-Mail',
      phone: 'Telefon',
      address: 'Adresse',
      bankingTax: 'Bank- & Steuerinformationen',
      iban: 'IBAN',
      bic: 'BIC/SWIFT',
      taxId: 'Steuer-ID',
      vatId: 'USt-IdNr.',
      noBankingTaxInfo: 'Keine Bank- oder Steuerinformationen angegeben',
      billingProfilesTitle: 'Abrechnungsprofile',
      billingProfilesDesc: 'Abrechnungsinformationen für Studios und Lehrer einrichten',
      pdfCustomizationTitle: 'PDF-Vorlagenanpassung',
      pdfCustomizationDesc: 'Passen Sie das Erscheinungsbild Ihrer Rechnungs-PDFs mit Logos, Farben und Layout-Optionen an',
      currentTheme: 'Aktuelles Theme:',
      customConfiguration: 'Benutzerdefinierte Vorlagenkonfiguration aktiv',
      defaultConfiguration: 'Standard-Vorlageneinstellungen verwenden',
      openTemplateEditor: 'Vorlagen-Editor öffnen',
      previewCurrentTemplate: 'Aktuelle Vorlage vorschauen',
      generating: 'Erstelle...',
      pdfTemplateSettingsSaved: 'PDF-Vorlageneinstellungen erfolgreich gespeichert',
      pdfTemplateSettingsFailed: 'Fehler beim Speichern der PDF-Vorlageneinstellungen',
      noCustomTemplateToPreview: 'Keine benutzerdefinierte Vorlagenkonfiguration zur Vorschau verfügbar. Versuchen Sie, ein anderes Theme auszuwählen oder benutzerdefinierte Einstellungen hinzuzufügen.',
      pdfPreviewGenerated: 'PDF-Vorschau erfolgreich erstellt!',
      pdfPreviewFailed: 'Fehler beim Erstellen der PDF-Vorschau'
    },
    
    settingsForm: {
      basicInfo: 'Grundlegende Informationen',
      bankingInfo: 'Bankdaten',
      taxInfo: 'Steuerinformationen',
      fullName: 'Vollständiger Name',
      fullNameRequired: 'Vollständiger Name *',
      email: 'E-Mail',
      phone: 'Telefon',
      address: 'Adresse',
      iban: 'IBAN',
      ibanPlaceholder: 'DE89 3704 0044 0532 0130 00',
      bic: 'BIC/SWIFT-Code',
      bicPlaceholder: 'COBADEFFXXX',
      taxId: 'Steuer-ID',
      vatId: 'USt-IdNr.',
      vatIdPlaceholder: 'DE123456789',
      kleinunternehmerregelung: 'Kleinunternehmerregelung (§19 UStG)',
      kleinunternehmerregelungDesc: 'Wählen Sie dies, wenn Sie von der Umsatzsteuer nach der deutschen Kleinunternehmerregelung befreit sind. Dies fügt den erforderlichen gesetzlichen Text zu Ihren Rechnungen hinzu.',
      saving: 'Speichere...',
      updateSettings: 'Einstellungen aktualisieren',
      saveSettings: 'Einstellungen speichern',
      cancel: 'Abbrechen',
      editTitle: 'Rechnungseinstellungen bearbeiten',
      setupTitle: 'Rechnungseinstellungen einrichten'
    },
    
    uninvoiced: {
      billingTitle: 'Abrechnung & Veranstaltungen',
      billingDesc: 'Verwalten Sie nicht abgerechnete Veranstaltungen nach Studios gruppiert, synchronisieren Sie historische Daten und beheben Sie Zuordnungsprobleme. Erstellen Sie Rechnungen für abgeschlossene Kurse.',
      loading: 'Lade nicht abgerechnete Veranstaltungen...',
      noEvents: 'Keine nicht abgerechneten Veranstaltungen gefunden.',
      noEventsTitle: 'Keine nicht abgerechneten Veranstaltungen',
      noEventsDescription: 'Alle Ihre abgeschlossenen Veranstaltungen wurden bereits abgerechnet oder Sie haben noch keine Veranstaltungen mit zugewiesenen Studios.',
      createInvoice: 'Rechnung erstellen',
      selectAll: 'Alle auswählen',
      deselectAll: 'Alle abwählen',
      selectedCount: '{count} ausgewählt',
      selectedTotal: 'Ausgewählt',
      refresh: 'Aktualisieren',
      refreshing: 'Aktualisiere...',
      syncingRefreshing: 'Synchronisiere & Aktualisiere...',
      studioActions: 'Studio-Aktionen',
      eventActions: 'Event-Aktionen',
      substituteTeacher: 'Vertretungslehrer einrichten',
      editEvent: 'Event-Details bearbeiten',
      exclude: 'Als kostenlos markieren',
      rematchStudios: 'Mit Studios neu zuordnen',
      rematching: 'Ordne neu zu...',
      updating: 'Aktualisiere...',
      fixStudioMatching: 'Studio-Zuordnung reparieren',
      fixMatching: 'Zuordnung reparieren',
      payout: 'Auszahlung:',
      total: 'Gesamt',
      selected: 'Ausgewählt',
      unknownStudio: 'Unbekanntes Studio',
      eventWithoutStudio: 'Veranstaltungen ohne Studio-Zuordnung',
      untitledEvent: 'Unbenannte Veranstaltung',
      noDate: 'Kein Datum',
      teacher: 'Lehrer',
      event: 'Veranstaltung',
      events: 'Veranstaltungen',
      studioMatchingIssues: 'Studio-Zuordnungsprobleme',
      studioMatchingIssuesDesc: 'Wenden Sie Studio-Standortmuster erneut auf bestehende Veranstaltungen an, um Zuordnungsprobleme zu beheben.',
      studioMatchingIssuesMobileDesc: 'Studio-Zuordnungsprobleme beheben',
      studioMatchingUpdated: 'Studio-Zuordnung aktualisiert!',
      studioMatchingUpdatedDesc: '{updated_count} von {total_events_processed} Veranstaltungen wurden mit Studios verknüpft.',
      studioMatchingFailed: 'Fehler beim Aktualisieren der Studio-Zuordnung',
      rateConfig: {
        noRateConfig: 'Keine Tarifkonfiguration',
        flatRate: 'Pauschaltarif',
        perStudent: 'Pro Schüler',
        tieredRates: 'Gestaffelte Tarife',
        variable: 'Variabel',
        base: 'Basis:'
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
    },

    pdfCustomization: {
      title: 'PDF-Vorlagenanpassung',
      description: 'Passen Sie das Erscheinungsbild Ihrer Rechnungs-PDFs mit Logos, Farben und Layout-Optionen an',
      tabs: {
        theme: 'Theme',
        branding: 'Branding',
        layout: 'Layout'
      },
      buttons: {
        cancel: 'Abbrechen',
        preview: 'PDF-Vorschau',
        save: 'Vorlage speichern',
        saving: 'Speichere...',
        generating: 'Erstelle...',
        generatingPreview: 'Erstelle...'
      },
      theme: {
        title: 'Vorlagen-Theme',
        professional: {
          label: 'Professionell',
          description: 'Dunkelgraue Kopfzeilen, umrandete Tabellen, klassisches Business-Layout'
        },
        modern: {
          label: 'Modern',
          description: 'Leuchtend grüne Akzente, minimale Tabellen, großzügiges Design'
        },
        minimal: {
          label: 'Minimal',
          description: 'Hellgraue Töne, kleine Schriftarten, kompaktes schmales Layout'
        },
        creative: {
          label: 'Kreativ',
          description: 'Lila Kopfzeilen & Akzente, große Schriftarten, modernes Styling'
        },
        custom: {
          label: 'Benutzerdefiniert',
          description: 'Vollständige Kontrolle über alle Farben, Schriftarten und Layout-Optionen'
        },
        selected: 'Ausgewählt'
      },
      branding: {
        logoUpload: {
          title: 'Logo & Branding',
          description: 'Laden Sie Ihr Firmenlogo für Rechnungskopfzeilen hoch',
          uploadLogo: 'Logo hochladen',
          currentLogo: 'Aktuelles Logo:',
          logoSize: 'Logo-Größe',
          logoPosition: 'Logo-Position',
          sizes: {
            small: 'Klein',
            medium: 'Mittel',
            large: 'Groß'
          },
          positions: {
            topLeft: 'Oben links',
            topCenter: 'Oben mittig',
            topRight: 'Oben rechts',
            headerLeft: 'Kopfzeile links',
            headerCenter: 'Kopfzeile mittig',
            headerRight: 'Kopfzeile rechts'
          }
        },
        colors: {
          title: 'Farben',
          description: 'Passen Sie Farben für Ihre Vorlage an',
          customOnly: 'Farben',
          customOnlyDesc: 'Farbanpassung ist nur mit dem benutzerdefinierten Theme verfügbar. Wählen Sie "Benutzerdefiniert" um Farben zu ändern.',
          headerColor: 'Kopfzeilen-Farbe',
          accentColor: 'Akzent-Farbe'
        },
        text: {
          letterhead: 'Briefkopf-Text',
          letterheadPlaceholder: 'Briefkopf-Text eingeben (z.B. Firmenname, Slogan)',
          footer: 'Fußzeilen-Text',
          footerPlaceholder: 'Fußzeilen-Text eingeben (z.B. Kontaktinformationen, rechtliche Hinweise)'
        }
      },
      layout: {
        typography: {
          title: 'Typografie',
          fontFamily: 'Schriftart',
          fontSize: 'Schriftgröße',
          fonts: {
            helvetica: 'Helvetica',
            times: 'Times',
            courier: 'Courier',
            arial: 'Arial'
          },
          sizes: {
            small: 'Klein',
            normal: 'Normal',
            large: 'Groß'
          }
        },
        page: {
          title: 'Seiteneinstellungen',
          orientation: 'Seitenausrichtung',
          size: 'Seitengröße',
          orientations: {
            portrait: 'Hochformat',
            landscape: 'Querformat'
          },
          sizes: {
            a4: 'A4',
            letter: 'Letter',
            legal: 'Legal'
          }
        },
        content: {
          title: 'Inhaltsoptionen',
          showCompanyInfo: 'Firmeninformationen anzeigen',
          showCompanyAddress: 'Firmenadresse anzeigen',
          showLogo: 'Logo anzeigen',
          showInvoiceNotes: 'Rechnungsnotizen anzeigen',
          showTaxInfo: 'Steuerinformationen anzeigen',
          showPaymentTerms: 'Zahlungsbedingungen anzeigen'
        }
      },
      preview: {
        success: 'PDF-Vorschau erfolgreich erstellt!',
        failed: 'Fehler beim Erstellen der PDF-Vorschau',
        failedDesc: 'Bitte versuchen Sie es erneut.'
      }
    },

    billingEntities: {
      title: 'Abrechnungseinheiten',
      noBillingEntities: 'Noch keine Abrechnungseinheiten konfiguriert',
      noBillingEntitiesDesc: 'Erstellen Sie Ihr erstes Studio- oder Lehrerprofil, um mit der Rechnungsverwaltung zu beginnen',
      createFirstProfile: 'Erstes Profil erstellen',
      addNew: 'Neu hinzufügen',
      studios: 'Studios',
      teachers: 'Lehrer',
      deleteTitle: 'Abrechnungseinheit löschen',
      deleteConfirmation: 'Sind Sie sicher, dass Sie "{name}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden und entfernt alle zugehörigen Abrechnungsinformationen.',
      cancel: 'Abbrechen',
      delete: 'Löschen'
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
  pages: {
    manageEvents: {
      title: 'Veranstaltungen verwalten',
      subtitle: 'Tags bearbeiten, Sichtbarkeit verwalten und Ihre Kurse organisieren',
      authRequired: 'Anmeldung erforderlich',
      authRequiredDesc: 'Bitte melden Sie sich an, um Ihre Veranstaltungen zu verwalten.',
      loadError: 'Fehler beim Laden der Veranstaltungen',
      tryAgain: 'Erneut versuchen',
      noEventsForFilter: 'Keine Veranstaltungen für die aktuellen Filter gefunden',
      changeFilters: 'Versuchen Sie, Ihre Filter zu ändern, um mehr Veranstaltungen zu sehen',
      pendingChanges: '{count} ausstehende Änderungen',
      saveChanges: 'Änderungen speichern',
      discardChanges: 'Änderungen verwerfen',
      savingChanges: 'Änderungen werden gespeichert...',
      syncingCalendar: 'Kalender wird synchronisiert...',
      refreshEvents: 'Veranstaltungen aktualisieren',
      createTag: 'Tag erstellen',
      manageTag: 'Tags verwalten',
      controlPanel: {
        title: 'Veranstaltungsverwaltung',
        timeLabel: 'Zeit:',
        visibilityLabel: 'Sichtbarkeit:',
        futureEvents: 'Zukünftige Veranstaltungen',
        allEvents: 'Alle Veranstaltungen',
        allVisibility: 'Alle ({count})',
        publicVisibility: 'Öffentlich ({count})',
        privateVisibility: 'Privat ({count})',
        pendingChangesInfo: '{count} ungespeicherte Änderung{plural}',
        pendingChangesAction: 'Verwenden Sie die schwebenden Aktionsschaltflächen zum Speichern oder Verwerfen',
        createNewTag: 'Neues Tag erstellen',
        refresh: 'Aktualisieren',
        quickActions: 'Schnellaktionen (~1-3s)',
        syncing: 'Synchronisiere...',
        fullCalendarSync: 'Vollständige Kalendersynchronisation',
        syncDescription: 'Event-Tags reparieren oder frische Kalenderdaten herunterladen (~15-30s für Sync)',
        availableTags: 'Verfügbare Tags:'
      },
      emptyState: {
        noEvents: 'Keine Veranstaltungen gefunden',
        noEventsFiltered: 'Keine Veranstaltungen entsprechen Ihren Filtern',
        connectCalendar: 'Verbinden Sie Ihre Kalender-Feeds, um Events zu importieren.',
        changeFiltersPublicPrivate: 'Versuchen Sie, Ihre Filter zu ändern, um {visibility} Events oder vergangene Events zu sehen.',
        changeFiltersTime: 'Versuchen Sie, den Zeitfilter zu ändern, um alle Events einschließlich vergangener zu sehen.',
        changeFiltersVisibility: 'Versuchen Sie, den Sichtbarkeitsfilter zu ändern, um alle Events zu sehen.',
        addCalendarFeed: 'Kalender-Feed hinzufügen',
        showAllVisibility: 'Alle Sichtbarkeiten anzeigen',
        showAllTime: 'Alle Zeiten anzeigen'
      },
      floatingButtons: {
        discardTooltip: 'Alle ausstehenden Änderungen verwerfen',
        saving: 'Speichere...',
        saveChanges: '{count} Änderung{plural} speichern'
      },
      dateHeaders: {
        today: 'Heute',
        tomorrow: 'Morgen'
      },
      rematch: {
        updating: 'Aktualisiere...',
        selectedEvents: 'Ausgewählte Events',
        feedEvents: 'Feed-Events',
        allEvents: 'Alle Events',
        tags: 'Tags',
        studios: 'Studios',
        fixAction: '{actions} für {scope} reparieren',
        matchingUpdated: 'Zuordnung aktualisiert!',
        eventsUpdated: '{updated} von {total} Events wurden aktualisiert.',
        failedToUpdate: 'Zuordnung konnte nicht aktualisiert werden'
      },
      historicalSync: {
        title: 'Ältere Events fehlen',
        description: 'Synchronisieren Sie historische Events aus Ihren verbundenen Kalender-Feeds, um unbezahlte Kurse aus vorherigen Monaten zu finden.',
        mobileDescription: 'Historische Events aus Kalender-Feeds synchronisieren',
        syncButton: 'Historische Events synchronisieren',
        syncButtonMobile: 'Historisch synchronisieren',
        syncing: 'Synchronisiere...',
        noFeeds: 'Keine Kalender-Feeds gefunden',
        noFeedsDesc: 'Bitte verbinden Sie zuerst Ihre Kalender-Feeds, bevor Sie historische Events synchronisieren.',
        syncComplete: 'Historische Synchronisation abgeschlossen!',
        syncCompleteDesc: '{count} historische{plural} Event{plural} von {feeds} Kalender-Feed{feedsPlural} synchronisiert. {matched} Event{matchedPlural} wurden mit Tags und Studios zugeordnet.',
        syncCompleteNoEvents: 'Keine neuen historischen Events gefunden. Ihre Kalender-Feeds ({feeds}) wurden erfolgreich überprüft.',
        syncFailed: 'Historische Synchronisation fehlgeschlagen',
        syncFailedDesc: 'Historische Events konnten nicht synchronisiert werden. Bitte versuchen Sie es erneut.'
      },
      unmatchedEvents: {
        title: 'Nicht zugeordnete Events',
        description: 'Events, die keinem Studio-Standort zugeordnet werden konnten',
        mobileDescription: 'Nicht mit Studios zugeordnet',
        excludeButton: 'Als kostenlos markieren',
        excludeTooltip: 'Dieses Event von der Studio-Zuordnung ausschließen',
        eventExcluded: 'Event als kostenlos markiert',
        eventExcludedDesc: 'Das Event wurde von der Studio-Zuordnung und Abrechnung ausgeschlossen.',
        excludeFailed: 'Event konnte nicht als kostenlos markiert werden',
        excludeFailedDesc: 'Das Event konnte nicht ausgeschlossen werden. Bitte versuchen Sie es erneut.'
      },
      filterControls: {
        timeFilter: 'Zeitfilter',
        visibilityFilter: 'Sichtbarkeitsfilter',
        allTime: 'Alle Zeit',
        futureOnly: 'Nur zukünftige',
        allVisibility: 'Alle',
        publicOnly: 'Nur öffentliche',
        privateOnly: 'Nur private'
      },
      stats: {
        totalEvents: 'Gesamt Veranstaltungen',
        publicEvents: 'Öffentliche Veranstaltungen',
        privateEvents: 'Private Veranstaltungen'
      }
    },
    manageTags: {
      title: 'Tag-Verwaltung',
      subtitle: 'Organisieren Sie Ihre Kalendertermine mit intelligenter Kennzeichnung. Richten Sie automatische Regeln ein, um Termine basierend auf Stichwörtern zu kennzeichnen, und verwalten Sie Ihre Tag-Bibliothek übersichtlich.',
      manageRules: 'Tag-Regeln verwalten',
      createTag: 'Neuen Tag erstellen',
      tagLibrary: 'Tag-Bibliothek',
      automationRules: 'Automatisierungsregeln',
      noTags: 'Noch keine Tags erstellt',
      createFirstTag: 'Erstellen Sie Ihren ersten Tag, um Ihre Veranstaltungen zu organisieren',
      noRules: 'Keine Automatisierungsregeln eingerichtet',
      createFirstRule: 'Erstellen Sie Ihre erste Regel, um Veranstaltungen automatisch zu kennzeichnen',
      tagRuleManager: {
        creating: 'Regel erstellen',
        updating: 'Regel aktualisieren',
        creatingDesc: 'Neue Tag-Regel wird hinzugefügt...',
        updatingDesc: 'Tag-Regel wird aktualisiert...',
        noTagsAvailable: 'Keine Tags verfügbar. Erstellen Sie zuerst einige Tags, um Tag-Regeln einzurichten.',
        toasts: {
          ruleCreated: 'Tag-Regel erstellt!',
          ruleUpdated: 'Tag-Regel aktualisiert!',
          ruleDeleted: 'Tag-Regel gelöscht!',
          ruleCreatedDesc: '{count} von {total} Veranstaltungen wurden mit Ihrer neuen Regel neu getaggt.',
          ruleUpdatedDesc: '{count} von {total} Veranstaltungen wurden mit Ihrer aktualisierten Regel neu getaggt.',
          ruleDeletedDesc: '{count} von {total} Veranstaltungen wurden nach dem Entfernen der Regel neu getaggt.',
          applyError: 'Fehler beim Anwenden der neuen Tag-Regel',
          applyErrorDesc: 'Die Regel wurde erstellt, konnte aber nicht auf bestehende Veranstaltungen angewendet werden.',
          updateError: 'Fehler beim Anwenden der aktualisierten Tag-Regel',
          updateErrorDesc: 'Die Regel wurde aktualisiert, konnte aber nicht auf bestehende Veranstaltungen angewendet werden.',
          deleteError: 'Fehler beim Anwenden der Tag-Änderungen',
          deleteErrorDesc: 'Die Regel wurde gelöscht, aber Änderungen konnten nicht auf bestehende Veranstaltungen angewendet werden.'
        }
      },
      tagLibraryComponent: {
        creating: 'Tag wird erstellt...',
        updating: 'Tag wird aktualisiert...',
        deleting: 'Tag wird gelöscht...',
        noTagsFound: 'Keine Tags gefunden. Erstellen Sie Ihren ersten Tag!',
        globalTags: 'Globale Tags',
        customTags: 'Ihre benutzerdefinierten Tags',
        noCustomTags: 'Noch keine benutzerdefinierten Tags',
        createFirstCustomTag: 'Erstellen Sie Ihren ersten benutzerdefinierten Tag, um loszulegen',
        unnamedTag: 'Unbenannter Tag',
        moreItems: '+{count} weitere'
      },
      tagRules: {
        title: 'Tag-Regeln',
        createRule: 'Regel erstellen',
        activeRules: 'Aktive Regeln',
        pending: ' + 1 ausstehend',
        inTitleDescription: 'in Titel/Beschreibung',
        inLocation: 'in Standort',
        inTitleDescriptionLegacy: 'in Titel oder Beschreibung (Legacy)',
        applies: 'gilt',
        unknownTag: 'Unbekannter Tag',
        noRulesConfigured: 'Keine Tag-Regeln konfiguriert',
        createFirstRuleDesc: 'Erstellen Sie Ihre erste Regel, um Veranstaltungen automatisch basierend auf Stichwörtern zu taggen'
      },
      tagRuleForm: {
        editTitle: 'Tag-Regel bearbeiten',
        createTitle: 'Tag-Regel erstellen',
        editDescription: 'Aktualisieren Sie diese Regel, um zu ändern, wie Veranstaltungen automatisch getaggt werden.',
        createDescription: 'Erstellen Sie eine neue Regel, um Veranstaltungen automatisch basierend auf Stichwörtern in ihrem Titel, ihrer Beschreibung oder ihrem Standort zu taggen.',
        cancel: 'Abbrechen',
        updating: 'Wird aktualisiert...',
        creating: 'Wird erstellt...',
        updateRule: 'Regel aktualisieren',
        createRule: 'Regel erstellen',
        keywordsLabel: 'Stichwörter (Titel/Beschreibung)',
        keywordsPlaceholder: 'z.B. Flow, Vinyasa, Meditation',
        keywordsHelp: 'Diese Stichwörter in Veranstaltungstiteln oder -beschreibungen abgleichen (max. 5)',
        locationLabel: 'Standort-Stichwörter',
        locationPlaceholder: 'z.B. Studio A, Flow-Raum, Haupthalle',
        locationHelp: 'Diese Stichwörter in Veranstaltungsstandorten abgleichen (max. 5)',
        selectTag: 'Tag auswählen',
        selectTagPlaceholder: 'Tag auswählen...',
        tagHelp: 'Veranstaltungen, die den Stichwörtern entsprechen, werden mit diesem Tag versehen',
        howItWorksTitle: 'Wie Tag-Regeln funktionieren',
        howItWorksBullets: {
          autoTag: '• Veranstaltungen werden automatisch getaggt, wenn sie einem der angegebenen Stichwörter entsprechen',
          titleSearch: '• Titel/Beschreibung-Stichwörter suchen in Veranstaltungstiteln und -beschreibungen',
          locationSearch: '• Standort-Stichwörter suchen nur in Veranstaltungsstandorten',
          required: '• Mindestens ein Stichwort-Typ ist erforderlich',
          immediate: '• Änderungen werden sofort auf bestehende Veranstaltungen angewendet'
        }
      }
    },
    publicSchedule: {
      navbar: {
        home: 'Startseite',
        closeProfile: 'Profil schließen'
      },
      hero: {
        yogaTeacher: 'Yoga-Lehrer',
        specialties: 'Spezialisierungen',
        email: 'E-Mail',
        instagram: 'Instagram',
        website: 'Website',
        share: 'Teilen',
        shareSchedule: 'Stundenplan teilen',
        export: 'Exportieren',
        exportEvents: 'Events exportieren',
        exporting: 'Exportiere...',
        defaultBio: 'Schließen Sie sich {name} für Yoga-Kurse und achtsame Bewegung an. Schauen Sie sich meine kommenden Stunden an und sichern Sie sich Ihren Platz.',
        defaultBioNoName: 'Willkommen zu meinem Stundenplan',
        shareTitle: '{name}s Yoga-Stundenplan',
        shareDescription: 'Schauen Sie sich {name}s kommende Yoga-Kurse an und machen Sie mit!',
        shareDefaultTitle: 'Lehrer Yoga-Stundenplan',
        shareDefaultDescription: 'Schauen Sie sich kommende Yoga-Kurse an und machen Sie mit!'
      },
      schedule: {
        header: {
          title: 'Kommende Stunden',
          classesCount: '{filtered} von {total} Stunden in den nächsten 3 Monaten',
          classesCountFiltered: '{filtered} von {total} Stunden in den nächsten 3 Monaten (gefiltert)',
          clearFilters: 'Filter löschen'
        },
        filters: {
          when: {
            label: 'Wann',
            placeholder: 'Jederzeit',
            options: {
              all: 'Jederzeit',
              today: 'Heute',
              tomorrow: 'Morgen',
              weekend: 'Wochenende',
              week: 'Diese Woche',
              month: 'Dieser Monat',
              monday: 'Montags',
              tuesday: 'Dienstags',
              wednesday: 'Mittwochs',
              thursday: 'Donnerstags',
              friday: 'Freitags',
              saturday: 'Samstags',
              sunday: 'Sonntags'
            }
          },
          studio: {
            label: 'Studio-Standort',
            placeholder: 'Jedes Studio'
          },
          yogaStyle: {
            label: 'Yoga-Stil',
            placeholder: 'Jeder Stil'
          }
        },
        emptyState: {
          noUpcomingClasses: 'Keine kommenden Stunden',
          noMatchingClasses: 'Keine Stunden entsprechen Ihren Filtern',
          noUpcomingDescription: 'Diese Lehrerin hat keine Stunden in den nächsten 3 Monaten geplant.',
          noMatchingDescription: 'Versuchen Sie, Ihre Filter anzupassen, um mehr Stunden zu sehen.',
          clearAllFilters: 'Alle Filter löschen'
        }
      }
    }
  },
  seo: {
    home: {
      title: 'avara. - Schöne Yoga-Termine Plattform',
      description: 'Verbinden Sie Ihren Kalender und erstellen Sie schöne, teilbare Terminpläne für Ihre Yoga-Kurse. Vertrauen von 500+ Yoga-Lehrern weltweit. Kostenlos starten.',
      keywords: 'Yoga-Terminplan, Kalender-Sync, Kursverwaltung, Lehrer-Plattform, Yoga-Lehrer, Terminplan-Sharing, Kalender-Integration'
    },
    dashboard: {
      title: 'Dashboard - Verwalten Sie Ihren Yoga-Terminplan | avara.',
      description: 'Verwalten Sie Ihre Yoga-Kurse, Kalender-Feeds und teilen Sie Ihren Terminplan mit Schülern. Sehen Sie kommende Kurse, verwalten Sie Termine und verfolgen Sie Ihren Unterrichtsplan.',
      keywords: 'Yoga-Dashboard, Kursverwaltung, Terminplanung, Lehrer-Dashboard, Kalender-Management'
    },
    profile: {
      title: 'Profil-Einstellungen - Ihr Yoga-Profil anpassen | avara.',
      description: 'Passen Sie Ihr öffentliches Yoga-Lehrer-Profil an. Fügen Sie Ihre Biografie, Spezialisierungen, Kontaktinformationen hinzu und erstellen Sie eine schöne Seite für Ihre Schüler.',
      keywords: 'Yoga-Profil, Lehrer-Profil, Yoga-Lehrer-Profil, öffentliches Profil, Yoga-Biografie'
    },
    addCalendar: {
      title: 'Kalender hinzufügen - Verbinden Sie Ihren Yoga-Terminplan | avara.',
      description: 'Verbinden Sie Ihren Google Kalender, iCloud oder einen beliebigen Kalender-Feed, um Ihre Yoga-Kurse automatisch zu synchronisieren. Einfache Einrichtung in unter 2 Minuten.',
      keywords: 'Kalender-Sync, Google Kalender, iCloud-Sync, Kalender-Integration, Yoga-Kalender'
    },
    manageEvents: {
      title: 'Termine verwalten - Ihre Yoga-Kurse | avara.',
      description: 'Sehen und verwalten Sie alle Ihre Yoga-Kurse und Termine. Bearbeiten Sie Kursdetails, fügen Sie Tags hinzu und organisieren Sie Ihren Unterrichtsplan.',
      keywords: 'Yoga-Termine, Kursverwaltung, Terminverwaltung, Yoga-Terminplan, Kursorganisation'
    },
    manageTags: {
      title: 'Tags verwalten - Organisieren Sie Ihre Yoga-Kurse | avara.',
      description: 'Erstellen und verwalten Sie Tags für Ihre Yoga-Kurse. Kategorisieren Sie Kurse automatisch nach Typ, Level und Standort.',
      keywords: 'Yoga-Tags, Kurs-Kategorien, Yoga-Kurstypen, Terminorganisation, Kurs-Kennzeichnung'
    },
    studios: {
      title: 'Studios - Ihre Unterrichtsorte | avara.',
      description: 'Verwalten Sie Ihre Yoga-Studio-Beziehungen und Unterrichtsorte. Verbinden Sie sich mit Studios und verfolgen Sie Ihre Unterrichtsmöglichkeiten.',
      keywords: 'Yoga-Studios, Unterrichtsorte, Studio-Management, Yoga-Lehrer-Netzwerk'
    },
    invoices: {
      title: 'Rechnungen - Yoga-Unterricht Einkommensverwaltung | avara.',
      description: 'Erstellen Sie professionelle Rechnungen für Ihren Yoga-Unterricht. Verfolgen Sie Einkommen, erstellen Sie Abrechnungsberichte und verwalten Sie Ihre Unterrichts-Einnahmen.',
      keywords: 'Yoga-Rechnungen, Unterrichts-Einkommen, Yoga-Abrechnung, Lehrer-Zahlungen, Unterrichts-Einnahmen'
    },
    teacherSchedule: {
      title: '{teacherName} - Yoga-Kursterminplan',
      description: 'Finde Yoga-Kurse mit {teacherName}. Sehen Sie kommende Stunden, Kurstypen, Spezialisierungen und Kontaktinformationen. {location}',
      keywords: 'Yoga-Kurse, {teacherName}, Yoga buchen, Yoga-Terminplan, Yoga-Lehrer, {location}'
    },
    auth: {
      signIn: {
            title: 'Anmelden - Zugang zu Ihrem Yoga-Dashboard | avara.',
    description: 'Melden Sie sich bei Ihrem avara.-Konto an, um Ihren Yoga-Terminplan zu verwalten, Kalender-Feeds zu verwalten und Ihre Kurse mit Schülern zu teilen.',
        keywords: 'Anmelden, Login, Yoga-Dashboard, Lehrer-Login, Konto-Zugang'
      },
      signUp: {
            title: 'Konto erstellen - Starten Sie Ihren Yoga-Terminplan | avara.',
    description: 'Erstellen Sie Ihr kostenloses avara.-Konto und beginnen Sie, Ihren Yoga-Terminplan mit Schülern zu teilen. Verbinden Sie Ihren Kalender und bauen Sie Ihre Online-Präsenz auf.',
        keywords: 'Konto erstellen, Registrierung, Yoga-Lehrer, kostenloses Konto, Terminplan-Sharing'
      }
    },
    errors: {
      notFound: {
        title: 'Seite nicht gefunden - avara.',
        description: 'Die Seite, die Sie suchen, konnte nicht gefunden werden. Kehren Sie zu Ihrem Yoga-Terminplan-Dashboard zurück oder durchsuchen Sie unsere Yoga-Lehrer-Plattform.',
        keywords: 'Seite nicht gefunden, 404, Yoga-Terminplan, Lehrer-Plattform'
      },
      serverError: {
        title: 'Server-Fehler - avara.',
        description: 'Wir haben technische Schwierigkeiten. Bitte versuchen Sie es später noch einmal oder kontaktieren Sie den Support für Hilfe mit Ihrem Yoga-Terminplan.',
        keywords: 'Server-Fehler, technischer Support, Yoga-Plattform-Support'
      }
    }
  },
  landing: {
    hero: {
      betaBadge: 'Geschlossene Beta',
      title: 'Schöne Yoga-Stundenpläne für Lehrer.',
      subtitle: 'Verbinden Sie Ihren Kalender und erstellen Sie beeindruckende, teilbare Seiten für Ihre Yoga-Kurse. Vertraut von Yoga-Lehrern weltweit.',
      requestAccess: 'Beta-Zugang anfordern',
      seeExample: 'Beispiel ansehen',
      hasAccess: 'Bereits Zugang?',
      signInHere: 'Hier anmelden'
    },
    features: {
      title: 'Alles was Sie brauchen, um Ihren Stundenplan zu teilen',
      subtitle: 'Optimieren Sie Ihren Unterrichtsworkflow mit leistungsstarken und dennoch einfachen Tools.',
      sync: {
        title: 'Kalender-Sync',
        description: 'Automatische Synchronisation mit Google Calendar, iCloud und anderen beliebten Kalenderdiensten. Ihr Stundenplan bleibt ohne manuelle Arbeit aktuell.'
      },
      pages: {
        title: 'Schöne Seiten',
        description: 'Erstellen Sie beeindruckende, professionelle Seiten, die Ihre Kurse präsentieren und es Schülern leicht machen, Stunden zu finden und zu buchen.'
      },
      sharing: {
        title: 'Einfaches Teilen',
        description: 'Teilen Sie Ihren Stundenplan über individuelle Links, exportieren Sie in verschiedene Formate und integrieren Sie in Ihre bestehende Website oder Social Media.'
      }
    },
    socialProof: {
      title: 'Vertraut von Yoga-Lehrern überall',
      betaTesting: {
        value: 'Beta',
        description: 'Derzeit im Test'
      },
      realTime: {
        value: 'Echtzeit',
        description: 'Automatische Sync'
      },
      beautiful: {
        value: 'Schön',
        description: 'Professionelles Design'
      }
    },
    cta: {
      title: 'Bereit, Ihren Unterrichtsworkflow zu transformieren?',
      description: 'Schließen Sie sich Hunderten von Yoga-Lehrern an, die ihre Stundenplan-Verwaltung mit avara vereinfacht haben.',
      requestAccess: 'Beta-Zugang anfordern',
      signIn: 'Anmelden'
    },
    footer: {
      tagline: 'Schöne Yoga-Stundenpläne für Lehrer.',
      privacy: 'Datenschutz',
      terms: 'AGB',
      support: 'Support',
      copyright: '© 2024 avara. Alle Rechte vorbehalten.'
    }
  },
  privacy: {
    title: 'Datenschutzerklärung',
    description: 'Ihr Datenschutz ist uns wichtig. Diese Richtlinie erklärt, wie wir Ihre persönlichen Daten sammeln, verwenden und schützen.',
    lastUpdated: 'Zuletzt aktualisiert: 1. Januar 2024',
    sections: {
      responsible: {
        title: 'Verantwortlicher',
        description: 'Die folgende Stelle ist für die Verarbeitung Ihrer personenbezogenen Daten verantwortlich:'
      },
      dataCollection: {
        title: 'Datenerhebung',
        accountData: {
          title: 'Kontodaten',
          email: 'E-Mail-Adresse für Anmeldung und Kommunikation',
          name: 'Name und Profilinformationen',
          url: 'Individuelle URL für Ihre öffentliche Stundenplanseite',
          profile: 'Profilbild und Biografie',
          contact: 'Kontaktinformationen (Telefon, Website, Social Media)'
        },
        calendarData: {
          title: 'Kalenderdaten',
          classes: 'Yoga-Kurs-Informationen aus verbundenen Kalendern',
          events: 'Event-Titel, Beschreibungen und Orte',
          times: 'Kursstundenpläne und Zeitzonen',
          participants: 'Teilnehmerzahl (keine persönlichen Schülerdaten)',
          tokens: 'Kalender-Zugriffstoken (verschlüsselt)'
        },
        automaticData: {
          title: 'Automatische Daten',
          ip: 'IP-Adresse und Browser-Informationen',
          sync: 'Kalender-Sync-Logs und Fehlerberichte',
          usage: 'Plattform-Nutzungsstatistiken',
          logs: 'Anwendungslogs für Debugging'
        },
        billingData: {
          title: 'Abrechnungsdaten',
          studios: 'Studio-Beziehungen und Zahlungsinformationen',
          classes: 'Kurs-Anwesenheit und Zahlungsaufzeichnungen',
          rates: 'Unterrichtstarife und Rechnungsdaten'
        }
      },
      legalBasis: {
        title: 'Rechtsgrundlagen für die Verarbeitung',
        contract: {
          title: 'Vertragserfüllung',
          description: 'Die Verarbeitung ist notwendig, um unsere Kalender-Sync- und Stundenplanverwaltungsdienste bereitzustellen.'
        },
        consent: {
          title: 'Einwilligung',
          description: 'Für optionale Funktionen wie öffentliche Profilseiten und Marketing-Kommunikation.'
        },
        interest: {
          title: 'Berechtigtes Interesse',
          description: 'Für Plattformsicherheit, Betrugsprävention und Serviceverbesserungen.'
        }
      }
    },
    contact: {
      title: 'Datenschutz-Fragen?',
      description: 'Wenn Sie Fragen zum Umgang mit Ihren Daten haben oder Ihre Datenschutzrechte ausüben möchten, kontaktieren Sie uns bitte.',
      button: 'Kontakt'
    }
  },
  support: {
    title: 'Support & Hilfe',
    description: 'Wir helfen Ihnen gerne dabei, das Beste aus der avara-Plattform herauszuholen. Hier finden Sie Antworten auf häufige Fragen und Kontaktmöglichkeiten.',
    contact: {
      title: 'Direkter Kontakt',
      description: 'Haben Sie eine spezifische Frage oder benötigen persönliche Unterstützung? Wir antworten normalerweise innerhalb von 24 Stunden.',
      button: 'Support kontaktieren'
    },
    faq: {
      title: 'Häufig gestellte Fragen',
      howToConnect: {
        question: 'Wie verbinde ich meinen Kalender?',
        answer: 'Sie können Ihren Kalender über drei Wege verbinden: OAuth-Integration mit Google Calendar, E-Mail-Einladungssystem oder manuelle Eingabe der .ics-Feed-URL. Die einfachste Methode ist die OAuth-Integration im Dashboard.'
      },
      createPublicPage: {
        question: 'Wie erstelle ich meine öffentliche Seite?',
        answer: 'Nach der Kalenderverbindung können Sie unter "Profil" Ihre öffentliche URL festlegen und Ihr Profil vervollständigen. Ihre Klassen werden automatisch auf der öffentlichen Seite angezeigt.'
      },
      supportedCalendars: {
        question: 'Welche Kalenderdienste werden unterstützt?',
        answer: 'Wir unterstützen Google Calendar (vollständig), Outlook/Office 365, Apple iCloud Calendar und jeden Kalenderdienst, der .ics-Feeds bereitstellt.'
      },
      invoicing: {
        question: 'Wie funktioniert die Rechnungserstellung?',
        answer: 'Sie können Studios hinzufügen und Ihre Klassen automatisch zuordnen lassen. Das System erstellt dann PDF-Rechnungen basierend auf Ihren Stundensätzen und gehaltenen Klassen.'
      },
      dataSecurity: {
        question: 'Sind meine Daten sicher?',
        answer: 'Ja, alle Daten werden DSGVO-konform in der EU gehostet. Kalender-Zugriffstoken werden verschlüsselt gespeichert und Sie haben jederzeit volle Kontrolle über Ihre Daten.'
      }
    },
    categories: {
      calendar: {
        title: 'Kalender-Integration',
        description: 'Hilfe beim Verbinden und Synchronisieren Ihrer Kalender'
      },
      profile: {
        title: 'Profil & Einstellungen',
        description: 'Unterstützung bei der Einrichtung Ihres Profils und Ihrer Seite'
      },
      invoicing: {
        title: 'Rechnungen & Abrechnung',
        description: 'Hilfe bei der Rechnungserstellung und Studio-Verwaltung'
      }
    },
    beta: {
      title: 'Beta-Phase Information',
      description: 'avara befindet sich derzeit in der geschlossenen Beta-Phase. Das bedeutet:',
      features: [
        'Die Nutzung ist derzeit kostenlos',
        'Neue Funktionen werden regelmäßig hinzugefügt',
        'Ihr Feedback hilft uns bei der Weiterentwicklung',
        'Bei Problemen sind wir besonders schnell beim Support'
      ],
      feedback: 'Beta-Tester: Ihre Erfahrungen und Verbesserungsvorschläge sind uns sehr wichtig. Schreiben Sie uns gerne Ihr Feedback!'
    },
    technical: {
      title: 'Technische Probleme melden',
      description: 'Falls Sie technische Probleme oder Fehler feststellen, helfen Sie uns mit folgenden Informationen:',
      requirements: [
        'Beschreibung des Problems',
        'Schritte zur Reproduktion',
        'Verwendeter Browser und Betriebssystem',
        'Screenshots oder Fehlermeldungen (falls vorhanden)'
      ],
      button: 'Problem melden'
    }
  },
  terms: {
    title: 'Allgemeine Geschäftsbedingungen',
    description: 'Diese Nutzungsbedingungen regeln die Verwendung der avara-Plattform für Yoga-Lehrerinnen und -Lehrer.',
    lastUpdated: 'Zuletzt aktualisiert: 1. Januar 2024',
    sections: {
      provider: {
        title: 'Anbieter und Geltungsbereich',
        provider: {
          title: 'Anbieter',
          description: 'Die folgende Stelle stellt die avara-Plattform bereit:'
        },
        scope: {
          title: 'Geltungsbereich',
          description: 'Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Leistungen der avara-Plattform. Mit der Registrierung und Nutzung unserer Dienste erkennen Sie diese AGB als verbindlich an.'
        }
      },
      services: {
        title: 'Leistungsbeschreibung',
        platform: {
          title: 'Plattform-Dienste',
          description: 'avara stellt eine webbasierte Plattform zur Verfügung, die Yoga-Lehrenden folgende Funktionen bietet:',
          features: [
            'Kalender-Synchronisation mit externen Kalenderdiensten',
            'Erstellung und Verwaltung öffentlicher Klassenseiten',
            'Automatische Kategorisierung und Tag-Verwaltung',
            'Rechnungserstellung und Abrechnungsfunktionen',
            'Profil- und Kontaktverwaltung',
            'Studio-Integration und Standort-Verwaltung'
          ]
        },
        beta: {
          title: 'Beta-Status',
          description: 'Die Plattform befindet sich derzeit im geschlossenen Beta-Stadium. Funktionen können sich ändern, und der Zugang ist auf ausgewählte Nutzer beschränkt.'
        }
      },
      registration: {
        title: 'Registrierung und Nutzerkonto',
        requirements: {
          title: 'Voraussetzungen',
          items: [
            'Mindestalter: 18 Jahre',
            'Gültige E-Mail-Adresse',
            'Tätigkeit als Yoga-Lehrerin oder -Lehrer',
            'Einwilligung zu diesen AGB und der Datenschutzerklärung'
          ]
        },
        security: {
          title: 'Kontosicherheit',
          description: 'Sie sind verpflichtet, Ihre Zugangsdaten vertraulich zu behandeln und uns unverzüglich über verdächtige Aktivitäten oder Sicherheitsverletzungen zu informieren.'
        },
        termination: {
          title: 'Konto-Kündigung',
          description: 'Sie können Ihr Konto jederzeit löschen. Wir behalten uns das Recht vor, Konten bei Verstößen gegen diese AGB zu sperren oder zu löschen.'
        }
      },
      obligations: {
        title: 'Nutzerpflichten und Verbote',
        permitted: {
          title: 'Erlaubte Nutzung',
          items: [
            'Ausschließlich für eigene Yoga-Klassen und -Kurse',
            'Wahrheitsgemäße Angaben in Profil und Klassenbeschreibungen',
            'Respektvoller Umgang mit der Plattform und anderen Nutzern',
            'Einhaltung aller geltenden Gesetze'
          ]
        },
        prohibited: {
          title: 'Verbotene Aktivitäten',
          items: [
            'Hochladen rechtsverletzender, beleidigender oder schädlicher Inhalte',
            'Verletzung von Urheberrechten oder anderen Rechten Dritter',
            'Spam, automatisierte Anfragen oder Missbrauch der Dienste',
            'Reverse Engineering oder Sicherheitstests ohne Genehmigung',
            'Kommerzielle Nutzung außerhalb des vorgesehenen Zwecks'
          ]
        }
      },
      content: {
        title: 'Inhalte und Urheberrecht',
        userContent: {
          title: 'Ihre Inhalte',
          description: 'Sie behalten alle Rechte an den von Ihnen hochgeladenen Inhalten (Texte, Bilder, Kalenderdaten). Sie gewähren uns eine nicht-exklusive Lizenz zur Anzeige und Verarbeitung dieser Inhalte für die Bereitstellung unserer Dienste.'
        },
        ourContent: {
          title: 'Unsere Inhalte',
          description: 'Alle Texte, Grafiken, Software und sonstigen Inhalte der Plattform sind urheberrechtlich geschützt und dürfen nicht ohne unsere Zustimmung kopiert oder verwendet werden.'
        },
        violations: {
          title: 'Rechtsverletzungen',
          description: 'Bei Urheberrechtsverletzungen oder anderen Rechtsverstößen entfernen wir die entsprechenden Inhalte unverzüglich nach Benachrichtigung.'
        }
      },
      availability: {
        title: 'Verfügbarkeit und technische Anforderungen',
        uptime: {
          title: 'Verfügbarkeit',
          description: 'Wir streben eine hohe Verfügbarkeit der Plattform an, können aber keine 100%ige Verfügbarkeit garantieren. Wartungsarbeiten werden nach Möglichkeit angekündigt.'
        },
        requirements: {
          title: 'Technische Anforderungen',
          items: [
            'Moderner Webbrowser mit JavaScript-Unterstützung',
            'Stabile Internetverbindung',
            'Unterstützte Kalenderdienste (Google Calendar, Outlook, iCloud)'
          ]
        }
      },
      privacy: {
        title: 'Datenschutz und Drittanbieter',
        dataProcessing: {
          title: 'Datenschutz',
          description: 'Die Verarbeitung Ihrer personenbezogenen Daten erfolgt gemäß unserer Datenschutzerklärung, die DSGVO-konform gestaltet ist.'
        },
        thirdParty: {
          title: 'Drittanbieter-Integration',
          description: 'Bei der Nutzung von Drittanbieter-Diensten (Google Calendar, etc.) gelten zusätzlich deren Nutzungsbedingungen und Datenschutzrichtlinien.'
        }
      },
      liability: {
        title: 'Haftung und Gewährleistung',
        limitation: {
          title: 'Haftungsbeschränkung',
          description: 'Unsere Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt. Bei leichter Fahrlässigkeit haften wir nur bei Verletzung wesentlicher Vertragspflichten und nur bis zur Höhe des vorhersehbaren, vertragstypischen Schadens.'
        },
        excluded: {
          title: 'Ausgeschlossene Haftung',
          description: 'Wir haften nicht für Datenverluste durch externe Faktoren, Probleme mit Drittanbieter-Diensten oder Schäden durch unsachgemäße Nutzung der Plattform.'
        },
        limitation_period: {
          title: 'Verjährung',
          description: 'Ansprüche gegen uns verjähren innerhalb eines Jahres ab Kenntnis des Schadens und unserer Person.'
        }
      },
      termination: {
        title: 'Vertragslaufzeit und Kündigung',
        duration: {
          title: 'Laufzeit',
          description: 'Der Nutzungsvertrag läuft auf unbestimmte Zeit und kann von beiden Seiten jederzeit ohne Einhaltung einer Frist gekündigt werden.'
        },
        extraordinary: {
          title: 'Außerordentliche Kündigung',
          description: 'Wir können den Vertrag fristlos kündigen bei schwerwiegenden Verstößen gegen diese AGB, Missbrauch der Plattform oder rechtsverletzenden Aktivitäten.'
        },
        consequences: {
          title: 'Folgen der Kündigung',
          description: 'Nach Vertragsende werden Ihre Daten gemäß unserer Datenschutzerklärung gelöscht. Öffentliche Klassenseiten werden deaktiviert.'
        }
      },
      pricing: {
        title: 'Preise und Zahlungsbedingungen',
        current: {
          title: 'Aktuelle Preisstruktur',
          description: 'Während der Beta-Phase ist die Nutzung der Plattform kostenlos. Zukünftige Preisänderungen werden rechtzeitig kommuniziert.'
        },
        changes: {
          title: 'Preisänderungen',
          description: 'Preisänderungen werden mindestens 30 Tage im Voraus angekündigt. Sie haben das Recht, bei erheblichen Preiserhöhungen außerordentlich zu kündigen.'
        }
      },
      final: {
        title: 'Schlussbestimmungen',
        law: {
          title: 'Anwendbares Recht',
          description: 'Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.'
        },
        jurisdiction: {
          title: 'Gerichtsstand',
          description: 'Gerichtsstand für alle Streitigkeiten ist unser Geschäftssitz, sofern Sie Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen sind.'
        },
        dispute: {
          title: 'Streitbeilegung',
          description: 'Bei Verbraucherstreitigkeiten können Sie sich an die Allgemeine Verbraucherschlichtungsstelle wenden. Wir sind zur Teilnahme an Streitbeilegungsverfahren nicht verpflichtet, aber bereit.'
        },
        severability: {
          title: 'Salvatorische Klausel',
          description: 'Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen davon unberührt.'
        },
        changes: {
          title: 'Änderungen der AGB',
          description: 'Änderungen dieser AGB werden Ihnen mindestens 30 Tage vor Inkrafttreten per E-Mail mitgeteilt. Widersprechen Sie nicht innerhalb von 30 Tagen, gelten die Änderungen als angenommen.'
        }
      }
    },
    contact: {
      title: 'Fragen zu den AGB?',
      description: 'Bei Fragen zu diesen Geschäftsbedingungen oder rechtlichen Aspekten der Plattform stehen wir Ihnen gerne zur Verfügung.',
      button: 'Kontakt aufnehmen'
    }
  },
  tags: {
    management: {
      unnamedTag: 'Unbenanntes Tag',
      maxReached: 'Maximum erreicht',
      showOnPublicPage: 'Auf öffentlicher Seite anzeigen',
      selectTags: 'Tags auswählen (max {count})',
      selectTagsPlaceholder: 'Tags auswählen...',
      maxTagsSelected: 'Maximum {count} Tags ausgewählt',
      maxTagsAllowed: 'Maximal {count} Tags erlaubt. Entfernen Sie ein Tag, um ein anderes auszuwählen.'
    }
  }
}

export default translations 