// Language types for internationalization
export type Language = 'en' | 'de' | 'es'

export interface LocaleConfig {
  label: string
  flag: string
  dateFormat: string
}

export const LOCALES: Record<Language, LocaleConfig> = {
  en: {
    label: 'English',
    flag: '🇺🇸',
    dateFormat: 'MM/dd/yyyy'
  },
  de: {
    label: 'Deutsch',
    flag: '🇩🇪',
    dateFormat: 'dd.MM.yyyy'
  },
  es: {
    label: 'Español',
    flag: '🇪🇸',
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

export interface Translations {
  common: CommonTranslations
  auth: AuthTranslations
  events: EventTranslations
  calendar: CalendarTranslations
  studios: StudioTranslations
  invoices: InvoiceTranslations
  dashboard: DashboardTranslations
  seo: SeoTranslations
}

// Translation key path type for type safety
export type TranslationKey = string 