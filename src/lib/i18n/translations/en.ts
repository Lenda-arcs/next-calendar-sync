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
  pages: {
    manageEvents: {
      title: 'Manage Events',
      subtitle: 'Edit tags, manage visibility, and organize your classes',
      authRequired: 'Authentication required',
      authRequiredDesc: 'Please sign in to manage your events.',
      loadError: 'Failed to load events',
      tryAgain: 'Try Again',
      noEventsForFilter: 'No events found for the current filters',
      changeFilters: 'Try changing your filters to see more events',
      pendingChanges: '{count} pending changes',
      saveChanges: 'Save Changes',
      discardChanges: 'Discard Changes',
      savingChanges: 'Saving changes...',
      syncingCalendar: 'Syncing calendar...',
      refreshEvents: 'Refresh Events',
      createTag: 'Create Tag',
      manageTag: 'Manage Tags',
      controlPanel: {
        title: 'Event Management',
        timeLabel: 'Time:',
        visibilityLabel: 'Visibility:',
        futureEvents: 'Future Events',
        allEvents: 'All Events',
        allVisibility: 'All ({count})',
        publicVisibility: 'Public ({count})',
        privateVisibility: 'Private ({count})',
        pendingChangesInfo: '{count} unsaved change{plural}',
        pendingChangesAction: 'Use the floating action buttons to save or discard',
        createNewTag: 'Create New Tag',
        refresh: 'Refresh',
        quickActions: 'Quick Actions (~1-3s)',
        syncing: 'Syncing...',
        fullCalendarSync: 'Full Calendar Sync',
        syncDescription: 'Fix event tags or download fresh calendar data (~15-30s for sync)',
        availableTags: 'Available Tags:'
      },
      emptyState: {
        noEvents: 'No events found',
        noEventsFiltered: 'No events match your filters',
        connectCalendar: 'Connect your calendar feeds to start importing events.',
        changeFiltersPublicPrivate: 'Try changing your filters to see {visibility} events or past events.',
        changeFiltersTime: 'Try changing the time filter to see all events including past ones.',
        changeFiltersVisibility: 'Try changing the visibility filter to see all events.',
        addCalendarFeed: 'Add Calendar Feed',
        showAllVisibility: 'Show All Visibility',
        showAllTime: 'Show All Time'
      },
      floatingButtons: {
        discardTooltip: 'Discard all pending changes',
        saving: 'Saving...',
        saveChanges: 'Save {count} Change{plural}'
      },
      dateHeaders: {
        today: 'Today',
        tomorrow: 'Tomorrow'
      },
      rematch: {
        updating: 'Updating...',
        selectedEvents: 'Selected Events',
        feedEvents: 'Feed Events',
        allEvents: 'All Events',
        tags: 'Tags',
        studios: 'Studios',
        fixAction: 'Fix {actions} for {scope}',
        matchingUpdated: 'Matching Updated!',
        eventsUpdated: '{updated} out of {total} events were updated.',
        failedToUpdate: 'Failed to update matching'
      },
      historicalSync: {
        title: 'Missing older events',
        description: 'Sync historical events from your connected calendar feeds to find uninvoiced classes from previous months.',
        mobileDescription: 'Sync historical events from calendar feeds',
        syncButton: 'Sync Historical Events',
        syncButtonMobile: 'Sync Historical',
        syncing: 'Syncing...',
        noFeeds: 'No Calendar Feeds Found',
        noFeedsDesc: 'Please connect your calendar feeds first before syncing historical events.',
        syncComplete: 'Historical Sync Complete!',
        syncCompleteDesc: '{count} historical event{plural} synced from {feeds} calendar feed{feedsPlural}. {matched} event{matchedPlural} were matched with tags and studios.',
        syncCompleteNoEvents: 'No new historical events found. Your calendar feeds ({feeds}) were checked successfully.',
        syncFailed: 'Historical Sync Failed',
        syncFailedDesc: 'Unable to sync historical events. Please try again.'
      },
      unmatchedEvents: {
        title: 'Unmatched Events',
        description: 'Events that could not be matched with a studio location',
        mobileDescription: 'Unmatched with studios',
        excludeButton: 'Mark as Free',
        excludeTooltip: 'Mark this event as excluded from studio matching',
        eventExcluded: 'Event Marked as Free',
        eventExcludedDesc: 'The event has been excluded from studio matching and invoicing.',
        excludeFailed: 'Failed to Mark Event as Free',
        excludeFailedDesc: 'Unable to exclude the event. Please try again.'
      },
      filterControls: {
        timeFilter: 'Time Filter',
        visibilityFilter: 'Visibility Filter',
        allTime: 'All Time',
        futureOnly: 'Future Only',
        allVisibility: 'All',
        publicOnly: 'Public Only',
        privateOnly: 'Private Only'
      },
      stats: {
        totalEvents: 'Total Events',
        publicEvents: 'Public Events',
        privateEvents: 'Private Events'
      }
    },
    manageTags: {
      title: 'Tag Management',
      subtitle: 'Organize your calendar events with smart tagging. Set up automatic rules to tag events based on keywords, and manage your tag library to keep everything organized.',
      manageRules: 'Manage Tag Rules',
      createTag: 'Create New Tag',
      tagLibrary: 'Tag Library',
      automationRules: 'Automation Rules',
      noTags: 'No tags created yet',
      createFirstTag: 'Create your first tag to start organizing your events',
      noRules: 'No automation rules set up',
      createFirstRule: 'Create your first rule to automatically tag events',
      tagRuleManager: {
        creating: 'Creating Rule',
        updating: 'Updating Rule',
        creatingDesc: 'Adding new tag rule...',
        updatingDesc: 'Updating tag rule...',
        noTagsAvailable: 'No tags available. Create some tags first to set up tag rules.',
        toasts: {
          ruleCreated: 'Tag Rule Created!',
          ruleUpdated: 'Tag Rule Updated!',
          ruleDeleted: 'Tag Rule Deleted!',
          ruleCreatedDesc: '{count} out of {total} events were re-tagged with your new rule.',
          ruleUpdatedDesc: '{count} out of {total} events were re-tagged with your updated rule.',
          ruleDeletedDesc: '{count} out of {total} events were re-tagged after removing the rule.',
          applyError: 'Failed to apply new tag rule',
          applyErrorDesc: 'The rule was created but could not be applied to existing events.',
          updateError: 'Failed to apply updated tag rule',
          updateErrorDesc: 'The rule was updated but could not be applied to existing events.',
          deleteError: 'Failed to apply tag changes',
          deleteErrorDesc: 'The rule was deleted but changes could not be applied to existing events.'
        }
      },
      tagLibraryComponent: {
        creating: 'Creating tag...',
        updating: 'Updating tag...',
        deleting: 'Deleting tag...',
        noTagsFound: 'No tags found. Create your first tag!',
        globalTags: 'Global Tags',
        customTags: 'Your Custom Tags',
        noCustomTags: 'No custom tags yet',
        createFirstCustomTag: 'Create your first custom tag to get started',
        unnamedTag: 'Unnamed Tag',
        moreItems: '+{count} more'
      },
      tagRules: {
        title: 'Tag Rules',
        createRule: 'Create Rule',
        activeRules: 'Active Rules',
        pending: ' + 1 pending',
        inTitleDescription: 'in title/description',
        inLocation: 'in location',
        inTitleDescriptionLegacy: 'in title or description (legacy)',
        applies: 'applies',
        unknownTag: 'Unknown Tag',
        noRulesConfigured: 'No tag rules configured',
        createFirstRuleDesc: 'Create your first rule to automatically tag events based on keywords'
      },
      tagRuleForm: {
        editTitle: 'Edit Tag Rule',
        createTitle: 'Create Tag Rule',
        editDescription: 'Update this rule to change how events are automatically tagged.',
        createDescription: 'Create a new rule to automatically tag events based on keywords in their title, description, or location.',
        cancel: 'Cancel',
        updating: 'Updating...',
        creating: 'Creating...',
        updateRule: 'Update Rule',
        createRule: 'Create Rule',
        keywordsLabel: 'Keywords (Title/Description)',
        keywordsPlaceholder: 'e.g., Flow, Vinyasa, Meditation',
        keywordsHelp: 'Match these keywords in event titles or descriptions (max 5)',
        locationLabel: 'Location Keywords',
        locationPlaceholder: 'e.g., Studio A, Flow Room, Main Hall',
        locationHelp: 'Match these keywords in event locations (max 5)',
        selectTag: 'Select Tag',
        selectTagPlaceholder: 'Select Tag...',
        tagHelp: 'Events matching the keywords will be tagged with this tag',
        howItWorksTitle: 'How Tag Rules Work',
        howItWorksBullets: {
          autoTag: '• Events are automatically tagged when they match any of the specified keywords',
          titleSearch: '• Title/description keywords search in event titles and descriptions',
          locationSearch: '• Location keywords search only in event locations',
          required: '• At least one keyword type is required',
          immediate: '• Changes are applied to existing events immediately'
        }
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
  },
  tags: {
    management: {
      unnamedTag: 'Unnamed Tag',
      maxReached: 'Max reached',
      showOnPublicPage: 'Show on public page',
      selectTags: 'Select Tags (max {count})',
      selectTagsPlaceholder: 'Select tags...',
      maxTagsSelected: 'Maximum {count} tags selected',
      maxTagsAllowed: 'Maximum of {count} tags allowed. Remove a tag to select another.'
    }
  }
}

export default translations 