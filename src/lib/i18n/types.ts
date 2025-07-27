// Language types for internationalization
export type Language = 'en' | 'de' | 'es'

export interface LocaleConfig {
  label: string
  code: string
  dateFormat: string
}

export const LOCALES: Record<Language, LocaleConfig> = {
  en: {
    label: 'English',
    code: 'EN',
    dateFormat: 'MM/dd/yyyy'
  },
  de: {
    label: 'Deutsch',
    code: 'DE',
    dateFormat: 'dd.MM.yyyy'
  },
  es: {
    label: 'Español',
    code: 'ES',
    dateFormat: 'dd/MM/yyyy'
  }
}

export const DEFAULT_LANGUAGE: Language = 'en'
export const SUPPORTED_LANGUAGES: Language[] = ['en', 'de', 'es']

// Translation namespace types
export interface CommonTranslations {
  // Navigation
  nav: {
    home: string
    dashboard: string
    manageEvents: string
    manageTags: string
    invoices: string
    studios: string
    profile: string
    addCalendar: string
    signOut: string
    appName: string
  }
  
  // Common actions
  actions: {
    save: string
    cancel: string
    delete: string
    edit: string
    create: string
    update: string
    confirm: string
    close: string
    next: string
    previous: string
    loading: string
    submit: string
    search: string
    filter: string
    export: string
    import: string
    share: string
    copy: string
    select: string
    selectAll: string
    deselectAll: string
  }
  
  // Common labels
  labels: {
    name: string
    email: string
    password: string
    confirmPassword: string
    title: string
    description: string
    date: string
    time: string
    location: string
    status: string
    type: string
    tags: string
    notes: string
    optional: string
    required: string
    created: string
    updated: string
    deleted: string
  }
  
  // Common messages
  messages: {
    success: string
    error: string
    warning: string
    info: string
    confirmDelete: string
    saveChanges: string
    unsavedChanges: string
    noData: string
    noResults: string
    loading: string
    comingSoon: string
  }
  
  // Forms
  form: {
    validation: {
      required: string
      email: string
      minLength: string
      maxLength: string
      passwordMatch: string
      invalidUrl: string
      invalidDate: string
    }
    placeholders: {
      search: string
      selectOption: string
      enterText: string
      chooseFile: string
      enterUrl: string
      enterEmail: string
      enterPassword: string
    }
  }
  
  // Date/time
  datetime: {
    today: string
    yesterday: string
    tomorrow: string
    thisWeek: string
    nextWeek: string
    thisMonth: string
    nextMonth: string
    am: string
    pm: string
    days: {
      monday: string
      tuesday: string
      wednesday: string
      thursday: string
      friday: string
      saturday: string
      sunday: string
    }
    months: {
      january: string
      february: string
      march: string
      april: string
      may: string
      june: string
      july: string
      august: string
      september: string
      october: string
      november: string
      december: string
    }
  }
  
  // Error pages
  errors: {
    notFound: {
      title: string
      description: string
      goHome: string
      goBack: string
      helpfulLinks: string
      stillTrouble: string
      contactSupport: string
      supportTeam: string
      findHelp: string
    }
  }
}

export interface AuthTranslations {
  signIn: {
    title: string
    subtitle: string
    emailLabel: string
    passwordLabel: string
    signInButton: string
    forgotPassword: string
    noAccount: string
    createAccount: string
    signInWithGoogle: string
  }
  
  signUp: {
    title: string
    subtitle: string
    emailLabel: string
    passwordLabel: string
    confirmPasswordLabel: string
    signUpButton: string
    alreadyHaveAccount: string
    signInInstead: string
    termsAgreement: string
    privacyPolicy: string
    signUpWithGoogle: string
  }
  
  profile: {
    title: string
    personalInfo: string
    accountSettings: string
    updateProfile: string
    changePassword: string
    deleteAccount: string
    confirmDelete: string
    profileUpdated: string
    passwordChanged: string
  }
}

export interface EventTranslations {
  list: {
    title: string
    noEvents: string
    createFirst: string
    searchPlaceholder: string
    filterBy: string
    sortBy: string
    showAll: string
    showUpcoming: string
    showPast: string
  }
  
  create: {
    title: string
    subtitle: string
    eventName: string
    eventDescription: string
    startDate: string
    endDate: string
    location: string
    isOnline: string
    maxParticipants: string
    price: string
    tags: string
    createEvent: string
    eventCreated: string
  }
  
  details: {
    title: string
    participants: string
    duration: string
    level: string
    instructor: string
    studio: string
    price: string
    bookingRequired: string
    cancelPolicy: string
    whatToBring: string
    accessInfo: string
  }
  
  status: {
    upcoming: string
    ongoing: string
    completed: string
    cancelled: string
    draft: string
  }
}

export interface CalendarTranslations {
  setup: {
    title: string
    subtitle: string
    connectCalendar: string
    manualEntry: string
    importEvents: string
    syncSettings: string
    calendarConnected: string
    syncFrequency: string
    autoSync: string
    manualSync: string
    lastSync: string
    syncNow: string
  }
  
  feeds: {
    title: string
    addFeed: string
    feedUrl: string
    feedName: string
    feedDescription: string
    feedAdded: string
    feedUpdated: string
    feedDeleted: string
    testConnection: string
    connectionSuccess: string
    connectionError: string
  }
  
  integration: {
    title: string
    description: string
    modalTitle: string
    modalDescription: string
    noFeeds: string
    addCalendar: string
    unnamedCalendar: string
    active: string
    pending: string
    lastSynced: string
    moreFeeds: string
    manageFeeds: string
    addMore: string
  }
  
  addCalendar: {
    title: string
    subtitle: string
    successTitle: string
    successDescription: string
    errorTitle: string
    errors: {
      oauth_denied: string
      invalid_callback: string
      invalid_state: string
      token_exchange_failed: string
      user_info_failed: string
      calendar_fetch_failed: string
      database_error: string
      internal_error: string
      generic: string
    }
  }

  yogaOnboarding: {
    setup: {
      title: string
      subtitle: string
      step1: {
        title: string
        description: string
        successDescription: string
        button: string
        connecting: string
      }
      step2: {
        title: string
        description: string
        successDescription: string
        successMessage: string
        button: string
        creating: string
        openGoogleCalendar: string
        goToDashboard: string
      }
      whatWeCreate: {
        title: string
        items: string[]
      }
      howItWorks: {
        title: string
        step1: {
          title: string
          description: string
        }
        step2: {
          title: string
          description: string
        }
        step3: {
          title: string
          description: string
        }
      }
    }
    import: {
      title: string
      subtitle: string
      choose: {
        googleCard: {
          title: string
          description: string
          button: string
          loading: string
        }
        icsCard: {
          title: string
          description: string
          fileLabel: string
          exportGuide: {
            title: string
            apple: string
            outlook: string
            google: string
          }
        }
        actions: {
          skip: string
          manual: string
        }
      }
      selectGoogle: {
        title: string
        description: string
        noCalendars: string
        primaryBadge: string
        backButton: string
      }
      importing: {
        title: string
        description: string
      }
      complete: {
        success: {
          title: string
          description: string
        }
        partial: {
          title: string
          description: string
        }
        errors: {
          title: string
          moreCount: string
          commonIssues: string
        }
        actions: {
          continue: string
          importMore: string
        }
      }
    }
    completion: {
      success: string
      skipped: string
    }
  }
}

export interface StudioTranslations {
  list: {
    title: string
    noStudios: string
    createFirst: string
    joinStudio: string
    requestAccess: string
  }
  
  create: {
    title: string
    studioName: string
    studioDescription: string
    address: string
    phone: string
    email: string
    website: string
    socialMedia: string
    amenities: string
    policies: string
    createStudio: string
    studioCreated: string
  }
  
  manage: {
    title: string
    settings: string
    teachers: string
    schedule: string
    rates: string
    inviteTeacher: string
    removeTeacher: string
    updateRates: string
    studioSettings: string
  }

  management: {
    title: string
    subtitle: string
    createStudio: string
    accessRestricted: string
    accessRestrictedDesc: string
    overview: {
      totalStudios: string
      activeTeachers: string
      verifiedStudios: string
    }
    tabs: {
      studios: string
      teacherRequests: string
    }
  }
}

export interface InvoiceTranslations {
  list: {
    title: string
    noInvoices: string
    createFirst: string
    pending: string
    paid: string
    overdue: string
    draft: string
  }
  
  create: {
    title: string
    selectEvents: string
    billingPeriod: string
    invoiceNumber: string
    dueDate: string
    notes: string
    generatePDF: string
    invoiceCreated: string
    language: string
    template: string
  }
  
  details: {
    invoiceNumber: string
    date: string
    period: string
    billTo: string
    event: string
    dateCol: string
    studio: string
    students: string
    rate: string
    total: string
    notes: string
    vatExempt: string
    untitledEvent: string
  }
  
  management: {
    title: string
    subtitle: string
    tabs: {
      billing: string
      billingShort: string
      invoices: string
      invoicesShort: string
      settings: string
      settingsShort: string
    }
    billingTab: {
      title: string
      description: string
      loading: string
    }
    invoicesTab: {
      title: string
      description: string
      noInvoicesTitle: string
      noInvoicesDescription: string
      viewUninvoiced: string
    }
    settingsTab: {
      title: string
      description: string
      loading: string
    }
  }
  
  creation: {
    modalTitle: string
    editTitle: string
    createTitle: string
    invoiceDetails: string
    invoiceNumber: string
    notes: string
    notesPlaceholder: string
    events: string
    eventsDescription: string
    total: string
    noEvents: string
    creating: string
    updating: string
    create: string
    update: string
    cancel: string
    close: string
    successTitle: string
    successUpdatedTitle: string
    successMessage: string
    pdfOptions: string
    generatePDF: string
    generating: string
    viewPDF: string
    pdfGenerated: string
    pdfGeneratedDesc: string
    pdfFailed: string
    pdfFailedDesc: string
  }
  
  card: {
    unknownStudio: string
    events: string
    period: string
    created: string
    pdf: string
    edit: string
    view: string
    draft: string
    sent: string
    paid: string
    overdue: string
    cancelled: string
    sent_: string
    paid_: string
    overdue_: string
    statusChange: string
    generatePDF: string
    viewPDF: string
    delete: string
    confirmDelete: string
    confirmDeleteDesc: string
    deleteSuccess: string
    deleteSuccessDesc: string
    deleteFailed: string
    deleteFailedDesc: string
  }
  
  settings: {
    invoiceInfoTitle: string
    invoiceInfoDesc: string
    editSettings: string
    noSettingsTitle: string
    noSettingsDesc: string
    setupSettings: string
    setupComplete: string
    contactInfo: string
    email: string
    phone: string
    address: string
    bankingTax: string
    iban: string
    bic: string
    taxId: string
    vatId: string
    noBankingTaxInfo: string
    billingProfilesTitle: string
    billingProfilesDesc: string
    pdfCustomizationTitle: string
    pdfCustomizationDesc: string
    currentTheme: string
    customConfiguration: string
    defaultConfiguration: string
    openTemplateEditor: string
    previewCurrentTemplate: string
    generating: string
    pdfTemplateSettingsSaved: string
    pdfTemplateSettingsFailed: string
    noCustomTemplateToPreview: string
    pdfPreviewGenerated: string
    pdfPreviewFailed: string
  }
  
  settingsForm: {
    basicInfo: string
    bankingInfo: string
    taxInfo: string
    fullName: string
    fullNameRequired: string
    email: string
    phone: string
    address: string
    iban: string
    ibanPlaceholder: string
    bic: string
    bicPlaceholder: string
    taxId: string
    vatId: string
    vatIdPlaceholder: string
    kleinunternehmerregelung: string
    kleinunternehmerregelungDesc: string
    saving: string
    updateSettings: string
    saveSettings: string
    cancel: string
    editTitle: string
    setupTitle: string
  }
  
  uninvoiced: {
    billingTitle: string
    billingDesc: string
    loading: string
    noEvents: string
    noEventsTitle: string
    noEventsDescription: string
    createInvoice: string
    selectAll: string
    deselectAll: string
    selectedCount: string
    selectedTotal: string
    refresh: string
    refreshing: string
    syncingRefreshing: string
    studioActions: string
    eventActions: string
    substituteTeacher: string
    editEvent: string
    exclude: string
    rematchStudios: string
    rematching: string
    updating: string
    fixStudioMatching: string
    fixMatching: string
    payout: string
    total: string
    selected: string
    unknownStudio: string
    eventWithoutStudio: string
    untitledEvent: string
    noDate: string
    teacher: string
    event: string
    events: string
    studioMatchingIssues: string
    studioMatchingIssuesDesc: string
    studioMatchingIssuesMobileDesc: string
    studioMatchingUpdated: string
    studioMatchingUpdatedDesc: string
    studioMatchingFailed: string
    rateConfig: {
      noRateConfig: string
      flatRate: string
      perStudent: string
      tieredRates: string
      variable: string
      base: string
    }
    months: {
      january: string
      february: string
      march: string
      april: string
      may: string
      june: string
      july: string
      august: string
      september: string
      october: string
      november: string
      december: string
    }
  }

  pdfCustomization: {
    title: string
    description: string
    tabs: {
      theme: string
      branding: string
      layout: string
    }
    buttons: {
      cancel: string
      preview: string
      save: string
      saving: string
      generating: string
      generatingPreview: string
    }
    theme: {
      title: string
      professional: {
        label: string
        description: string
      }
      modern: {
        label: string
        description: string
      }
      minimal: {
        label: string
        description: string
      }
      creative: {
        label: string
        description: string
      }
      custom: {
        label: string
        description: string
      }
      selected: string
    }
    branding: {
      logoUpload: {
        title: string
        description: string
        uploadLogo: string
        currentLogo: string
        logoSize: string
        logoPosition: string
        sizes: {
          small: string
          medium: string
          large: string
        }
        positions: {
          topLeft: string
          topCenter: string
          topRight: string
          headerLeft: string
          headerCenter: string
          headerRight: string
        }
      }
      colors: {
        title: string
        description: string
        customOnly: string
        customOnlyDesc: string
        headerColor: string
        accentColor: string
      }
      text: {
        letterhead: string
        letterheadPlaceholder: string
        footer: string
        footerPlaceholder: string
      }
    }
    layout: {
      typography: {
        title: string
        fontFamily: string
        fontSize: string
        fonts: {
          helvetica: string
          times: string
          courier: string
          arial: string
        }
        sizes: {
          small: string
          normal: string
          large: string
        }
      }
      page: {
        title: string
        orientation: string
        size: string
        orientations: {
          portrait: string
          landscape: string
        }
        sizes: {
          a4: string
          letter: string
          legal: string
        }
      }
      content: {
        title: string
        showCompanyInfo: string
        showCompanyAddress: string
        showLogo: string
        showInvoiceNotes: string
        showTaxInfo: string
        showPaymentTerms: string
      }
    },
    preview: {
      success: string
      failed: string
      failedDesc: string
    }
  }

  billingEntities: {
    title: string
    noBillingEntities: string
    noBillingEntitiesDesc: string
    createFirstProfile: string
    addNew: string
    studios: string
    teachers: string
    deleteTitle: string
    deleteConfirmation: string
    cancel: string
    delete: string
  }
}

export interface DashboardTranslations {
  welcome: string
  subtitle: string
  authRequired: string
  upcomingClasses: {
    title: string
    viewAll: string
    noCalendar: string
  }
  calendarActions: string
  publicSchedule: {
    title: string
    description: string
    yourSchedule: string
    yourScheduleCustomize: string
    share: string
    viewPublic: string
  }
  manageEvents: {
    title: string
    description: string
    button: string
  }
  tagRules: {
    title: string
    description: string
    button: string
  }
  invoices: {
    title: string
    description: string
    button: string
  }
  profile: {
    title: string
    description: string
    button: string
  }
  profilePage: {
    title: string
    subtitle: string
    accountSettings: {
      title: string
      description: string
      viewDashboard: string
      signOut: string
    }
  }
  studioRequest: {
    title: string
    titleConnected: string
    titleJoin: string
    descriptionConnected: string
    descriptionJoin: string
    approved: string
    requestMore: string
    requestAccess: string
    moreStudios: string
  }
}

// Main translations interface
export interface SeoTranslations {
  home: {
    title: string
    description: string
    keywords: string
  }
  dashboard: {
    title: string
    description: string
    keywords: string
  }
  profile: {
    title: string
    description: string
    keywords: string
  }
  addCalendar: {
    title: string
    description: string
    keywords: string
  }
  manageEvents: {
    title: string
    description: string
    keywords: string
  }
  manageTags: {
    title: string
    description: string
    keywords: string
  }
  studios: {
    title: string
    description: string
    keywords: string
  }
  invoices: {
    title: string
    description: string
    keywords: string
  }
  teacherSchedule: {
    title: string
    description: string
    keywords: string
  }
  auth: {
    signIn: {
      title: string
      description: string
      keywords: string
    }
    signUp: {
      title: string
      description: string
      keywords: string
    }
  }
  errors: {
    notFound: {
      title: string
      description: string
      keywords: string
    }
    serverError: {
      title: string
      description: string
      keywords: string
    }
  }
}

export interface PagesTranslations {
  manageEvents: {
    title: string
    subtitle: string
    authRequired: string
    authRequiredDesc: string
    loadError: string
    tryAgain: string
    noEventsForFilter: string
    changeFilters: string
    pendingChanges: string
    saveChanges: string
    discardChanges: string
    savingChanges: string
    syncingCalendar: string
    refreshEvents: string
    createTag: string
    manageTag: string
    controlPanel: {
      title: string
      timeLabel: string
      visibilityLabel: string
      futureEvents: string
      allEvents: string
      allVisibility: string
      publicVisibility: string
      privateVisibility: string
      pendingChangesInfo: string
      pendingChangesAction: string
      createNewTag: string
      refresh: string
      quickActions: string
      syncing: string
      fullCalendarSync: string
      syncDescription: string
      availableTags: string
    }
    emptyState: {
      noEvents: string
      noEventsFiltered: string
      connectCalendar: string
      changeFiltersPublicPrivate: string
      changeFiltersTime: string
      changeFiltersVisibility: string
      addCalendarFeed: string
      showAllVisibility: string
      showAllTime: string
    }
    floatingButtons: {
      discardTooltip: string
      saving: string
      saveChanges: string
    }
    dateHeaders: {
      today: string
      tomorrow: string
    }
    rematch: {
      updating: string
      selectedEvents: string
      feedEvents: string
      allEvents: string
      tags: string
      studios: string
      fixAction: string
      matchingUpdated: string
      eventsUpdated: string
      failedToUpdate: string
    }
    historicalSync: {
      title: string
      description: string
      mobileDescription: string
      syncButton: string
      syncButtonMobile: string
      syncing: string
      noFeeds: string
      noFeedsDesc: string
      syncComplete: string
      syncCompleteDesc: string
      syncCompleteNoEvents: string
      syncFailed: string
      syncFailedDesc: string
    }
    unmatchedEvents: {
      title: string
      description: string
      mobileDescription: string
      excludeButton: string
      excludeTooltip: string
      eventExcluded: string
      eventExcludedDesc: string
      excludeFailed: string
      excludeFailedDesc: string
    }
    filterControls: {
      timeFilter: string
      visibilityFilter: string
      allTime: string
      futureOnly: string
      allVisibility: string
      publicOnly: string
      privateOnly: string
    }
    stats: {
      totalEvents: string
      publicEvents: string
      privateEvents: string
    }
  }
  manageTags: {
    title: string
    subtitle: string
    manageRules: string
    createTag: string
    tagLibrary: string
    automationRules: string
    noTags: string
    createFirstTag: string
    noRules: string
    createFirstRule: string
    tagRuleManager: {
      creating: string
      updating: string
      creatingDesc: string
      updatingDesc: string
      noTagsAvailable: string
      toasts: {
        ruleCreated: string
        ruleUpdated: string
        ruleDeleted: string
        ruleCreatedDesc: string
        ruleUpdatedDesc: string
        ruleDeletedDesc: string
        applyError: string
        applyErrorDesc: string
        updateError: string
        updateErrorDesc: string
        deleteError: string
        deleteErrorDesc: string
      }
    }
    tagLibraryComponent: {
      creating: string
      updating: string
      deleting: string
      noTagsFound: string
      globalTags: string
      customTags: string
      noCustomTags: string
      createFirstCustomTag: string
      unnamedTag: string
      moreItems: string
    }
    tagRules: {
      title: string
      createRule: string
      activeRules: string
      pending: string
      inTitleDescription: string
      inLocation: string
      inTitleDescriptionLegacy: string
      applies: string
      unknownTag: string
      noRulesConfigured: string
      createFirstRuleDesc: string
    }
    tagRuleForm: {
      editTitle: string
      createTitle: string
      editDescription: string
      createDescription: string
      cancel: string
      updating: string
      creating: string
      updateRule: string
      createRule: string
      keywordsLabel: string
      keywordsPlaceholder: string
      keywordsHelp: string
      locationLabel: string
      locationPlaceholder: string
      locationHelp: string
      selectTag: string
      selectTagPlaceholder: string
      tagHelp: string
      howItWorksTitle: string
      howItWorksBullets: {
        autoTag: string
        titleSearch: string
        locationSearch: string
        required: string
        immediate: string
      }
    }
  }
  publicSchedule: {
    navbar: {
      home: string
      closeProfile: string
    }
    hero: {
      yogaTeacher: string
      specialties: string
      email: string
      instagram: string
      website: string
      share: string
      shareSchedule: string
      export: string
      exportEvents: string
      exporting: string
      defaultBio: string
      defaultBioNoName: string
      shareTitle: string
      shareDescription: string
      shareDefaultTitle: string
      shareDefaultDescription: string
    }
    schedule: {
      header: {
        title: string
        classesCount: string
        classesCountFiltered: string
        clearFilters: string
      }
      filters: {
        when: {
          label: string
          placeholder: string
          options: {
            all: string
            today: string
            tomorrow: string
            weekend: string
            week: string
            month: string
            monday: string
            tuesday: string
            wednesday: string
            thursday: string
            friday: string
            saturday: string
            sunday: string
          }
        }
        studio: {
          label: string
          placeholder: string
        }
        yogaStyle: {
          label: string
          placeholder: string
        }
      }
      emptyState: {
        noUpcomingClasses: string
        noMatchingClasses: string
        noUpcomingDescription: string
        noMatchingDescription: string
        clearAllFilters: string
      }
    }
  }
}

export interface TagTranslations {
  management: {
    unnamedTag: string
    maxReached: string
    showOnPublicPage: string
    selectTags: string
    selectTagsPlaceholder: string
    maxTagsSelected: string
    maxTagsAllowed: string
  }
}

export interface LandingTranslations {
  hero: {
    betaBadge: string
    title: string
    subtitle: string
    requestAccess: string
    seeExample: string
    hasAccess: string
    signInHere: string
  }
  features: {
    title: string
    subtitle: string
    sync: {
      title: string
      description: string
    }
    pages: {
      title: string
      description: string
    }
    sharing: {
      title: string
      description: string
    }
  }
  socialProof: {
    title: string
    betaTesting: {
      value: string
      description: string
    }
    realTime: {
      value: string
      description: string
    }
    beautiful: {
      value: string
      description: string
    }
  }
  cta: {
    title: string
    description: string
    requestAccess: string
    signIn: string
  }
  footer: {
    tagline: string
    privacy: string
    terms: string
    support: string
    copyright: string
  }
}

export interface PrivacyTranslations {
  title: string
  description: string
  lastUpdated: string
  sections: {
    responsible: {
      title: string
      description: string
    }
    dataCollection: {
      title: string
      accountData: {
        title: string
        email: string
        name: string
        url: string
        profile: string
        contact: string
      }
      calendarData: {
        title: string
        classes: string
        events: string
        times: string
        participants: string
        tokens: string
      }
      automaticData: {
        title: string
        ip: string
        sync: string
        usage: string
        logs: string
      }
      billingData: {
        title: string
        studios: string
        classes: string
        rates: string
      }
    }
    legalBasis: {
      title: string
      contract: {
        title: string
        description: string
      }
      consent: {
        title: string
        description: string
      }
      interest: {
        title: string
        description: string
      }
    }
  }
  contact: {
    title: string
    description: string
    button: string
  }
}

export interface SupportTranslations {
  title: string
  description: string
  contact: {
    title: string
    description: string
    button: string
  }
  faq: {
    title: string
    howToConnect: {
      question: string
      answer: string
    }
    createPublicPage: {
      question: string
      answer: string
    }
    supportedCalendars: {
      question: string
      answer: string
    }
    invoicing: {
      question: string
      answer: string
    }
    dataSecurity: {
      question: string
      answer: string
    }
  }
  categories: {
    calendar: {
      title: string
      description: string
    }
    profile: {
      title: string
      description: string
    }
    invoicing: {
      title: string
      description: string
    }
  }
  beta: {
    title: string
    description: string
    features: string[]
    feedback: string
  }
  technical: {
    title: string
    description: string
    requirements: string[]
    button: string
  }
}

export interface TermsTranslations {
  title: string
  description: string
  lastUpdated: string
  sections: {
    provider: {
      title: string
      provider: {
        title: string
        description: string
      }
      scope: {
        title: string
        description: string
      }
    }
    services: {
      title: string
      platform: {
        title: string
        description: string
        features: string[]
      }
      beta: {
        title: string
        description: string
      }
    }
    registration: {
      title: string
      requirements: {
        title: string
        items: string[]
      }
      security: {
        title: string
        description: string
      }
      termination: {
        title: string
        description: string
      }
    }
    obligations: {
      title: string
      permitted: {
        title: string
        items: string[]
      }
      prohibited: {
        title: string
        items: string[]
      }
    }
    content: {
      title: string
      userContent: {
        title: string
        description: string
      }
      ourContent: {
        title: string
        description: string
      }
      violations: {
        title: string
        description: string
      }
    }
    availability: {
      title: string
      uptime: {
        title: string
        description: string
      }
      requirements: {
        title: string
        items: string[]
      }
    }
    privacy: {
      title: string
      dataProcessing: {
        title: string
        description: string
      }
      thirdParty: {
        title: string
        description: string
      }
    }
    liability: {
      title: string
      limitation: {
        title: string
        description: string
      }
      excluded: {
        title: string
        description: string
      }
      limitation_period: {
        title: string
        description: string
      }
    }
    termination: {
      title: string
      duration: {
        title: string
        description: string
      }
      extraordinary: {
        title: string
        description: string
      }
      consequences: {
        title: string
        description: string
      }
    }
    pricing: {
      title: string
      current: {
        title: string
        description: string
      }
      changes: {
        title: string
        description: string
      }
    }
    final: {
      title: string
      law: {
        title: string
        description: string
      }
      jurisdiction: {
        title: string
        description: string
      }
      dispute: {
        title: string
        description: string
      }
      severability: {
        title: string
        description: string
      }
      changes: {
        title: string
        description: string
      }
    }
  }
  contact: {
    title: string
    description: string
    button: string
  }
}

export interface Translations {
  common: CommonTranslations
  auth: AuthTranslations
  events: EventTranslations
  calendar: CalendarTranslations
  studios: StudioTranslations
  invoices: InvoiceTranslations
  dashboard: DashboardTranslations
  pages: PagesTranslations
  seo: SeoTranslations
  landing: LandingTranslations
  privacy: PrivacyTranslations
  support: SupportTranslations
  terms: TermsTranslations
  tags: TagTranslations
}

// Translation key path type for type safety
export type TranslationKey = string 