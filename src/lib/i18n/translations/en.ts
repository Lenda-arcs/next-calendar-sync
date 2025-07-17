import { Translations } from '../types'

const translations: Translations = {
  common: {
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      manageEvents: 'Manage Events',
      manageTags: 'Manage Tags',
      invoices: 'Invoices',
      studios: 'Studios',
      profile: 'Profile',
      addCalendar: 'Add Calendar',
      signOut: 'Sign Out'
    },
    actions: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      update: 'Update',
      confirm: 'Confirm',
      close: 'Close',
      next: 'Next',
      previous: 'Previous',
      loading: 'Loading...',
      submit: 'Submit',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      import: 'Import',
      share: 'Share',
      copy: 'Copy',
      select: 'Select',
      selectAll: 'Select All',
      deselectAll: 'Deselect All'
    },
    labels: {
      name: 'Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      title: 'Title',
      description: 'Description',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      status: 'Status',
      type: 'Type',
      tags: 'Tags',
      notes: 'Notes',
      optional: 'Optional',
      required: 'Required',
      created: 'Created',
      updated: 'Updated',
      deleted: 'Deleted'
    },
    messages: {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info',
      confirmDelete: 'Are you sure you want to delete this item?',
      saveChanges: 'Save changes?',
      unsavedChanges: 'You have unsaved changes',
      noData: 'No data available',
      noResults: 'No results found',
      loading: 'Loading...',
      comingSoon: 'Coming Soon'
    },
    form: {
      validation: {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        minLength: 'Must be at least {min} characters',
        maxLength: 'Must be no more than {max} characters',
        passwordMatch: 'Passwords must match',
        invalidUrl: 'Please enter a valid URL',
        invalidDate: 'Please enter a valid date'
      },
      placeholders: {
        search: 'Search...',
        selectOption: 'Select an option',
        enterText: 'Enter text',
        chooseFile: 'Choose file',
        enterUrl: 'Enter URL',
        enterEmail: 'Enter email',
        enterPassword: 'Enter password'
      }
    },
    datetime: {
      today: 'Today',
      yesterday: 'Yesterday',
      tomorrow: 'Tomorrow',
      thisWeek: 'This Week',
      nextWeek: 'Next Week',
      thisMonth: 'This Month',
      nextMonth: 'Next Month',
      am: 'AM',
      pm: 'PM',
      days: {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
      },
      months: {
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December'
      }
    }
  },
  auth: {
    signIn: {
      title: 'Sign In',
      subtitle: 'Welcome back to your yoga schedule',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      signInButton: 'Sign In',
      forgotPassword: 'Forgot Password?',
      noAccount: "Don't have an account?",
      createAccount: 'Create Account',
      signInWithGoogle: 'Sign in with Google'
    },
    signUp: {
      title: 'Create Account',
      subtitle: 'Join our yoga community',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      confirmPasswordLabel: 'Confirm Password',
      signUpButton: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      signInInstead: 'Sign In',
      termsAgreement: 'By creating an account, you agree to our terms and conditions',
      privacyPolicy: 'Privacy Policy',
      signUpWithGoogle: 'Sign up with Google'
    },
    profile: {
      title: 'Profile',
      personalInfo: 'Personal Information',
      accountSettings: 'Account Settings',
      updateProfile: 'Update Profile',
      changePassword: 'Change Password',
      deleteAccount: 'Delete Account',
      confirmDelete: 'Are you sure you want to delete your account?',
      profileUpdated: 'Profile updated successfully',
      passwordChanged: 'Password changed successfully'
    }
  },
  events: {
    list: {
      title: 'Events',
      noEvents: 'No events found',
      createFirst: 'Create your first event',
      searchPlaceholder: 'Search events...',
      filterBy: 'Filter by',
      sortBy: 'Sort by',
      showAll: 'Show All',
      showUpcoming: 'Show Upcoming',
      showPast: 'Show Past'
    },
    create: {
      title: 'Create Event',
      subtitle: 'Add a new yoga class or event',
      eventName: 'Event Name',
      eventDescription: 'Event Description',
      startDate: 'Start Date',
      endDate: 'End Date',
      location: 'Location',
      isOnline: 'Online Event',
      maxParticipants: 'Max Participants',
      price: 'Price',
      tags: 'Tags',
      createEvent: 'Create Event',
      eventCreated: 'Event created successfully'
    },
    details: {
      title: 'Event Details',
      participants: 'Participants',
      duration: 'Duration',
      level: 'Level',
      instructor: 'Instructor',
      studio: 'Studio',
      price: 'Price',
      bookingRequired: 'Booking Required',
      cancelPolicy: 'Cancellation Policy',
      whatToBring: 'What to Bring',
      accessInfo: 'Access Information'
    },
    status: {
      upcoming: 'Upcoming',
      ongoing: 'Ongoing',
      completed: 'Completed',
      cancelled: 'Cancelled',
      draft: 'Draft'
    }
  },
  calendar: {
    setup: {
      title: 'Calendar Setup',
      subtitle: 'Connect your calendar to sync events',
      connectCalendar: 'Connect Calendar',
      manualEntry: 'Manual Entry',
      importEvents: 'Import Events',
      syncSettings: 'Sync Settings',
      calendarConnected: 'Calendar Connected',
      syncFrequency: 'Sync Frequency',
      autoSync: 'Auto Sync',
      manualSync: 'Manual Sync',
      lastSync: 'Last Sync',
      syncNow: 'Sync Now'
    },
    feeds: {
      title: 'Calendar Feeds',
      addFeed: 'Add Feed',
      feedUrl: 'Feed URL',
      feedName: 'Feed Name',
      feedDescription: 'Feed Description',
      feedAdded: 'Feed added successfully',
      feedUpdated: 'Feed updated successfully',
      feedDeleted: 'Feed deleted successfully',
      testConnection: 'Test Connection',
      connectionSuccess: 'Connection successful',
      connectionError: 'Connection failed'
    },
    integration: {
      title: 'Calendar Integration',
      description: 'Manage your connected calendar feeds and sync settings.',
      modalTitle: 'Calendar Feeds',
      modalDescription: 'Manage your connected calendar feeds and sync settings.',
      noFeeds: 'No calendar feeds connected yet.',
      addCalendar: 'Add Calendar Feed',
      unnamedCalendar: 'Unnamed Calendar',
      active: 'Active',
      pending: 'Pending',
      lastSynced: 'Last synced:',
      moreFeeds: '+{count} more feeds',
      manageFeeds: 'Manage Feeds',
      addMore: 'Add More'
    },
    addCalendar: {
      title: 'Add Calendar Feed',
      subtitle: 'Connect another calendar to sync more events to your schedule.',
      successTitle: 'Calendar Connected Successfully!',
      successDescription: 'Your Google Calendar has been connected. Your events will now sync automatically.',
      errorTitle: 'Connection Failed',
      errors: {
        oauth_denied: 'You denied access to your calendar.',
        invalid_callback: 'Invalid OAuth callback. Please try again.',
        invalid_state: 'Security validation failed. Please try again.',
        token_exchange_failed: 'Failed to exchange authorization code.',
        user_info_failed: 'Failed to get user information.',
        calendar_fetch_failed: 'Failed to fetch calendar list.',
        database_error: 'Failed to save connection. Please try again.',
        internal_error: 'An unexpected error occurred. Please try again.',
        generic: 'An error occurred. Please try again.'
      }
    }
  },
  studios: {
    list: {
      title: 'Studios',
      noStudios: 'No studios found',
      createFirst: 'Create your first studio',
      joinStudio: 'Join Studio',
      requestAccess: 'Request Access'
    },
    create: {
      title: 'Create Studio',
      studioName: 'Studio Name',
      studioDescription: 'Studio Description',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      website: 'Website',
      socialMedia: 'Social Media',
      amenities: 'Amenities',
      policies: 'Policies',
      createStudio: 'Create Studio',
      studioCreated: 'Studio created successfully'
    },
    manage: {
      title: 'Manage Studio',
      settings: 'Settings',
      teachers: 'Teachers',
      schedule: 'Schedule',
      rates: 'Rates',
      inviteTeacher: 'Invite Teacher',
      removeTeacher: 'Remove Teacher',
      updateRates: 'Update Rates',
      studioSettings: 'Studio Settings'
    }
  },
  invoices: {
    list: {
      title: 'Invoices',
      noInvoices: 'No invoices found',
      createFirst: 'Create your first invoice',
      pending: 'Pending',
      paid: 'Paid',
      overdue: 'Overdue',
      draft: 'Draft'
    },
    create: {
      title: 'Create Invoice',
      selectEvents: 'Select Events',
      billingPeriod: 'Billing Period',
      invoiceNumber: 'Invoice Number',
      dueDate: 'Due Date',
      notes: 'Notes',
      generatePDF: 'Generate PDF',
      invoiceCreated: 'Invoice created successfully',
      language: 'Language',
      template: 'Template'
    },
    details: {
      invoiceNumber: 'Invoice #',
      date: 'Date',
      period: 'Period',
      billTo: 'Bill To',
      event: 'Event',
      dateCol: 'Date',
      studio: 'Studio',
      students: 'Students',
      rate: 'Rate',
      total: 'Total',
      notes: 'Notes',
      vatExempt: 'VAT exempt according to German small business regulation',
      untitledEvent: 'Untitled Event'
    }
  },
  dashboard: {
    welcome: 'Welcome, {name}',
    subtitle: 'Manage your yoga class schedule and profile',
    authRequired: 'Authentication required',
    upcomingClasses: {
      title: 'Your Upcoming Classes',
      viewAll: 'View all events →',
      noCalendar: 'Connect your calendar to see your upcoming classes here.'
    },
    calendarActions: 'Calendar Actions',
    publicSchedule: {
      title: 'Public Schedule',
      description: 'See how your schedule appears to your students.',
      yourSchedule: 'Your public schedule:',
      yourScheduleCustomize: 'Your public schedule (customize in profile):',
      share: 'Share',
      viewPublic: 'View Public Page'
    },
    manageEvents: {
      title: 'View Your Events',
      description: 'Review and manage all your imported calendar events.',
      button: 'Manage Events'
    },
    tagRules: {
      title: 'Tag Rules',
      description: 'Automatically tag your events using keywords.',
      button: 'Manage Tag Rules'
    },
    invoices: {
      title: 'Invoice Management',
      description: 'Create studio profiles and generate invoices.',
      button: 'Manage Invoices'
    },
    profile: {
      title: 'Setup Profile',
      description: 'Complete your profile to enable your public schedule.',
      button: 'Complete Profile'
    },
    studioRequest: {
      title: 'Studio Connections',
      titleConnected: 'Connected Studios',
      titleJoin: 'Join Studios',
      descriptionConnected: 'Your approved studio connections for substitute teaching.',
      descriptionJoin: 'Request to join verified studios and expand your teaching opportunities.',
      approved: 'Approved',
      requestMore: 'Request More Studios',
      requestAccess: 'Request Studio Access',
      moreStudios: '+{count} more studio{plural} connected'
    },
    profilePage: {
      title: 'Profile Settings',
      subtitle: 'Manage your account settings and public profile information.',
      accountSettings: {
        title: 'Account Settings',
        description: 'Manage your account preferences and security settings.',
        viewDashboard: 'View Dashboard',
        signOut: 'Sign Out'
      }
    }
  },
  seo: {
    home: {
      title: 'SyncIt - Beautiful Yoga Schedule Management Platform',
      description: 'Connect your calendar and create beautiful shareable schedules for your yoga classes. Trusted by 500+ yoga instructors worldwide. Free to start.',
      keywords: 'yoga schedule, calendar sync, class management, instructor platform, yoga teacher, schedule sharing, calendar integration'
    },
    dashboard: {
      title: 'Dashboard - Manage Your Yoga Schedule | SyncIt',
      description: 'Manage your yoga classes, calendar feeds, and share your schedule with students. View upcoming classes, manage events, and track your teaching schedule.',
      keywords: 'yoga dashboard, class management, schedule management, instructor dashboard, calendar management'
    },
    profile: {
      title: 'Profile Settings - Customize Your Yoga Profile | SyncIt',
      description: 'Customize your public yoga instructor profile. Add your bio, specialties, contact information, and create a beautiful page for your students.',
      keywords: 'yoga profile, instructor profile, yoga teacher profile, public profile, yoga bio'
    },
    addCalendar: {
      title: 'Add Calendar - Connect Your Yoga Schedule | SyncIt',
      description: 'Connect your Google Calendar, iCloud, or any calendar feed to automatically sync your yoga classes. Easy setup in under 2 minutes.',
      keywords: 'calendar sync, Google calendar, iCloud sync, calendar integration, yoga calendar'
    },
    manageEvents: {
      title: 'Manage Events - Your Yoga Classes | SyncIt',
      description: 'View and manage all your yoga classes and events. Edit class details, add tags, and organize your teaching schedule.',
      keywords: 'yoga events, class management, event management, yoga schedule, class organization'
    },
    manageTags: {
      title: 'Manage Tags - Organize Your Yoga Classes | SyncIt',
      description: 'Create and manage tags for your yoga classes. Automatically categorize classes by type, level, and location.',
      keywords: 'yoga tags, class categories, yoga class types, event organization, class labeling'
    },
    studios: {
      title: 'Studios - Your Teaching Locations | SyncIt',
      description: 'Manage your yoga studio relationships and teaching locations. Connect with studios and track your teaching opportunities.',
      keywords: 'yoga studios, teaching locations, studio management, yoga teacher network'
    },
    invoices: {
      title: 'Invoices - Yoga Teaching Income Management | SyncIt',
      description: 'Generate professional invoices for your yoga teaching. Track income, create billing reports, and manage your teaching revenue.',
      keywords: 'yoga invoices, teaching income, yoga billing, instructor payments, teaching revenue'
    },
    teacherSchedule: {
      title: '{teacherName} - Yoga Class Schedule',
      description: 'Book yoga classes with {teacherName}. View upcoming sessions, class types, specialties, and contact information. {location}',
      keywords: 'yoga classes, {teacherName}, book yoga, yoga schedule, yoga instructor, {location}'
    },
    auth: {
      signIn: {
        title: 'Sign In - Access Your Yoga Dashboard | SyncIt',
        description: 'Sign in to your SyncIt account to manage your yoga schedule, calendar feeds, and share your classes with students.',
        keywords: 'sign in, login, yoga dashboard, instructor login, account access'
      },
      signUp: {
        title: 'Create Account - Start Your Yoga Schedule | SyncIt',
        description: 'Create your free SyncIt account and start sharing your yoga schedule with students. Connect your calendar and build your online presence.',
        keywords: 'create account, sign up, yoga instructor, free account, schedule sharing'
      }
    },
    errors: {
      notFound: {
        title: 'Page Not Found - SyncIt',
        description: 'The page you are looking for could not be found. Return to your yoga schedule dashboard or browse our yoga instructor platform.',
        keywords: 'page not found, 404, yoga schedule, instructor platform'
      },
      serverError: {
        title: 'Server Error - SyncIt',
        description: 'We are experiencing technical difficulties. Please try again later or contact support for assistance with your yoga schedule.',
        keywords: 'server error, technical support, yoga platform support'
      }
    }
  }
}

export default translations 