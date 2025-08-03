const translations = {
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
      signOut: 'Sign Out',
      appName: 'avara.'
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
    },
    errors: {
      notFound: {
        title: 'Page Not Found',
        description: 'Oops! The page you\'re looking for seems to have wandered off. Don\'t worry, even the best yoga poses require some adjustments.',
        goHome: 'Go Home',
        goBack: 'Go Back',
        helpfulLinks: 'Looking for something specific? Try these popular pages:',
        stillTrouble: 'Still having trouble?',
        contactSupport: 'If you believe this is an error, please',
        supportTeam: 'contact our support team',
        findHelp: 'and we\'ll help you find what you\'re looking for.'
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
      title: 'Yoga Calendar',
      addFeed: 'Import Events',
      feedUrl: 'Calendar URL',
      feedName: 'Calendar Name',
      feedDescription: 'Calendar Description',
      feedAdded: 'Calendar connected successfully',
      feedUpdated: 'Calendar updated successfully',
      feedDeleted: 'Calendar connection removed successfully',
      testConnection: 'Test Connection',
      connectionSuccess: 'Connection successful',
      connectionError: 'Connection failed'
    },
    integration: {
      title: 'Yoga Calendar',
      description: 'Manage your dedicated yoga calendar and sync settings.',
      modalTitle: 'Your Yoga Calendar',
      modalDescription: 'Manage your dedicated yoga calendar and sync settings.',
      noFeeds: 'No yoga calendar connected yet.',
      addCalendar: 'Set Up Yoga Calendar',
      unnamedCalendar: 'Unnamed Calendar',
      active: 'Active',
      pending: 'Pending',
      lastSynced: 'Last synced:',
      moreFeeds: '+{count} more calendar{plural}',
      manageFeeds: 'Manage Calendar',
      addMore: 'Import More Events'
    },
    yogaOnboarding: {
      setup: {
        title: 'Set Up Your Yoga Calendar',
        subtitle: 'We\'ll create a dedicated calendar in your Google account for managing your yoga classes.',
        step1: {
          title: 'Connect Google Calendar',
          description: 'Connect your Google account to enable calendar sync',
          successDescription: 'Google Calendar connected successfully!',
          button: 'Connect Google Calendar',
          connecting: 'Connecting...'
        },
        step2: {
          title: 'Create Your Yoga Calendar',
          description: 'We\'ll create a new calendar specifically for your yoga classes',
          successDescription: 'Your dedicated yoga calendar has been created!',
          successMessage: 'Your yoga calendar is ready! You can now create and manage events directly in Google Calendar, and they\'ll automatically appear on your public profile.',
          button: 'Create Yoga Calendar',
          creating: 'Creating Calendar...',
          openGoogleCalendar: 'Open Google Calendar',
          goToDashboard: 'Go to Dashboard'
        },
        whatWeCreate: {
          title: 'What we\'ll create:',
          items: [
            'A new calendar called "My Yoga Schedule (synced with lenna.yoga)"',
            'Automatic two-way sync between Google Calendar and your profile',
            'Events you create will appear on your public schedule'
          ]
        },
        howItWorks: {
          title: 'How It Works',
          step1: {
            title: '1. Create events in Google Calendar',
            description: 'Use your phone, web, or any calendar app'
          },
          step2: {
            title: '2. Events sync automatically',
            description: 'Changes appear on your lenna.yoga profile within minutes'
          },
          step3: {
            title: '3. Students discover your classes',
            description: 'Your schedule is visible on your public teacher profile'
          }
        }
      },
      import: {
        title: 'Import Existing Events',
        subtitle: 'Quickly populate your yoga calendar with events from your existing calendar',
        choose: {
          googleCard: {
            title: 'Import from Google Calendar',
            description: 'Import events from your other Google Calendars (recommended)',
            button: 'Choose Google Calendar',
            loading: 'Loading calendars...'
          },
          icsCard: {
            title: 'Upload ICS File',
            description: 'Import from Apple Calendar, Outlook, or any calendar app that exports .ics files',
            fileLabel: 'Select .ics file',
            exportGuide: {
              title: 'How to export your calendar',
              apple: 'File → Export → Export...',
              outlook: 'File → Save Calendar → iCalendar Format',
              google: 'Settings → Import & Export → Export'
            }
          },
          actions: {
            skip: 'Skip for now',
            manual: 'I\'ll add events manually'
          }
        },
        selectGoogle: {
          title: 'Choose Calendar to Import From',
          description: 'Select one of your Google Calendars to import events from',
          noCalendars: 'No additional calendars found to import from',
          primaryBadge: 'Primary',
          backButton: 'Back to import options'
        },
        importing: {
          title: 'Importing Events',
          description: 'Adding selected events to your yoga calendar...'
        },
        complete: {
          success: {
            title: 'Import Complete!',
            description: 'All {count} event{plural} imported successfully'
          },
          partial: {
            title: 'Import Mostly Complete!',
            description: '{imported} event{importedPlural} imported successfully{skipped, select, 0 {} other {, {skipped} failed}}'
          },
          errors: {
            title: 'Events that couldn\'t be imported:',
            moreCount: '...and {count} more',
            commonIssues: 'Common issues: missing timezone, duplicate events, or calendar permissions.'
          },
          actions: {
            continue: 'Continue to Dashboard',
            importMore: 'Import More Events'
          }
        }
      },
      completion: {
        success: 'Calendar imported successfully!',
        skipped: 'Skipping calendar import.'
      }
    },
    addCalendar: {
      title: 'Set Up Yoga Calendar',
      subtitle: 'Set up your dedicated yoga calendar or import more events to your existing calendar.',
      successTitle: 'Yoga Calendar Connected!',
      successDescription: 'Your dedicated yoga calendar has been connected. Your events will now sync automatically.',
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
    },

    management: {
      title: 'Studio Management',
      subtitle: 'Manage studios, teachers, and billing relationships',
      createStudio: 'Create Studio',
      accessRestricted: 'Access Restricted',
      accessRestrictedDesc: 'Only administrators can manage studios.',
      loadError: 'Failed to load studios data',
      overview: {
        totalStudios: 'Total Studios',
        activeTeachers: 'Active Teachers',
        verifiedStudios: 'Verified Studios'
      },
      tabs: {
        studios: 'Studios',
        teacherRequests: 'Teacher Requests'
      },
      emptyState: {
        title: 'No Studios Yet',
        description: 'Get started by creating your first studio to manage teachers and billing.'
      },
      toast: {
        studioCreated: 'Studio created successfully',
        studioUpdated: 'Studio updated successfully',
        studioDeleted: 'Studio deleted successfully'
      }
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
    },
    
    management: {
      title: 'Manage Invoices',
      subtitle: 'Create and track invoices for your events and services.',
      tabs: {
        billing: 'Billing & Events',
        billingShort: 'Billing',
        invoices: 'Invoices',
        invoicesShort: 'Bills',
        settings: 'Settings',
        settingsShort: 'Config'
      },
      billingTab: {
        title: 'Billing & Events',
        description: 'Manage uninvoiced events grouped by studio, sync historical data, and fix matching issues. Create invoices for completed classes.',
        loading: 'Loading uninvoiced events...'
      },
      invoicesTab: {
        title: 'Your Invoices',
        description: 'View and manage your created invoices.',
        noInvoicesTitle: 'No Invoices Yet',
        noInvoicesDescription: 'Create your first invoice by selecting events from the "Uninvoiced Events" tab.',
        viewUninvoiced: 'View Uninvoiced Events'
      },
      settingsTab: {
        title: 'Invoice Settings & Billing Profiles',
        description: 'Manage your personal billing information and billing entity configurations.',
        loading: 'Loading settings...'
      }
    },
    
    creation: {
      modalTitle: '{mode} Invoice - {studioName}',
      editTitle: 'Edit',
      createTitle: 'Create',
      invoiceDetails: 'Invoice Details',
      invoiceNumber: 'Invoice Number',
      notes: 'Notes (Optional)',
      notesPlaceholder: 'Add any additional notes for this invoice...',
      events: 'Events ({count})',
      eventsDescription: 'Click the edit icon to modify the title and rate for each event.',
      total: 'Total:',
      noEvents: 'No events selected.',
      creating: 'Creating...',
      updating: 'Updating...',
      create: 'Create Invoice',
      update: 'Update Invoice',
      cancel: 'Cancel',
      close: 'Close',
      successTitle: 'Invoice Created Successfully!',
      successUpdatedTitle: 'Invoice Updated Successfully!',
      successMessage: 'Invoice {invoiceNumber} has been {mode} for €{total}',
      pdfOptions: 'PDF Options',
      generatePDF: 'Generate PDF',
      generating: 'Generating PDF...',
      viewPDF: 'View PDF',
      pdfGenerated: 'PDF Generated Successfully!',
      pdfGeneratedDesc: 'Your invoice PDF has been created and is ready to view.',
      pdfFailed: 'PDF Generation Failed',
      pdfFailedDesc: 'Unable to generate PDF. Please try again.'
    },
    
    card: {
      unknownStudio: 'Unknown Studio',
      events: 'events',
      period: 'Period:',
      created: 'Created:',
      pdf: 'PDF',
      edit: 'Edit',
      view: 'View',
      draft: 'Draft',
      sent: 'Sent',
      paid: 'Paid',
      overdue: 'Overdue',
      cancelled: 'Cancelled',
      sent_: 'Sent',
      paid_: 'Paid',
      overdue_: 'Overdue',
      statusChange: 'Status:',
      generatePDF: 'Generate PDF',
      viewPDF: 'View PDF',
      delete: 'Delete',
      confirmDelete: 'Delete Invoice?',
      confirmDeleteDesc: 'This action cannot be undone. This will permanently delete the invoice and remove all event links.',
      deleteSuccess: 'Invoice Deleted Successfully',
      deleteSuccessDesc: 'Invoice, PDF file, and all event links have been removed. Events are now available for future invoicing.',
      deleteFailed: 'Failed to Delete Invoice',
      deleteFailedDesc: 'Unable to delete the invoice. Please try again.'
    },
    
    settings: {
      invoiceInfoTitle: 'Your Invoice Information',
      invoiceInfoDesc: 'Set up your personal billing details for generating invoices',
      editSettings: 'Edit Settings',
      noSettingsTitle: 'No invoice settings configured',
      noSettingsDesc: 'Set up your billing information to generate invoices',
      setupSettings: 'Set up Invoice Settings',
      setupComplete: 'Setup Complete',
      contactInfo: 'Contact Information',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      bankingTax: 'Banking & Tax Information',
      iban: 'IBAN',
      bic: 'BIC/SWIFT',
      taxId: 'Tax ID',
      vatId: 'VAT ID',
      noBankingTaxInfo: 'No banking or tax information provided',
      billingProfilesTitle: 'Billing Profiles',
      billingProfilesDesc: 'Set up billing information for studios and teachers',
      pdfCustomizationTitle: 'PDF Template Customization',
      pdfCustomizationDesc: 'Customize the appearance of your invoice PDFs with logos, colors, and layout options',
      currentTheme: 'Current Theme:',
      customConfiguration: 'Custom template configuration active',
      defaultConfiguration: 'Using default template settings',
      openTemplateEditor: 'Open Template Editor',
      previewCurrentTemplate: 'Preview Current Template',
      generating: 'Generating...',
      pdfTemplateSettingsSaved: 'PDF template settings saved successfully',
      pdfTemplateSettingsFailed: 'Failed to save PDF template settings',
      noCustomTemplateToPreview: 'No custom template configuration to preview. Try selecting a different theme or adding custom settings.',
      pdfPreviewGenerated: 'PDF preview generated successfully!',
      pdfPreviewFailed: 'Failed to generate PDF preview'
    },
    
    settingsForm: {
      basicInfo: 'Basic Information',
      bankingInfo: 'Banking Information',
      taxInfo: 'Tax Information',
      fullName: 'Full Name',
      fullNameRequired: 'Full Name *',
      email: 'Email',
      emailRequired: 'Email *',
      phone: 'Phone',
      country: 'Country',
      selectCountry: 'Select your country...',
      germany: 'Germany',
      spain: 'Spain',
      unitedKingdom: 'United Kingdom',
      address: 'Address',
      addressRequired: 'Address *',
      iban: 'IBAN',
      ibanPlaceholder: 'DE89 3704 0044 0532 0130 00',
      bic: 'BIC/SWIFT Code',
      bicPlaceholder: 'COBADEFFXXX',
      taxId: 'Tax ID',
      vatId: 'VAT ID',
      vatIdPlaceholder: 'DE123456789',
      kleinunternehmerregelung: 'Kleinunternehmerregelung (§19 UStG)',
      kleinunternehmerregelungDesc: 'Check this if you are exempt from VAT under German small business regulation. This will add the required legal text to your invoices.',
      smallBusinessTaxExemption: 'Small Business Tax Exemption',
      smallBusinessTaxExemptionDesc: 'Check this if you qualify for small business tax exemption in your country (e.g., Kleinunternehmerregelung in Germany, Régimen Simplificado in Spain). This will add the required legal text to your invoices.',
      saving: 'Saving...',
      updateSettings: 'Update Settings',
      saveSettings: 'Save Settings',
      cancel: 'Cancel',
      editTitle: 'Edit Invoice Settings',
      setupTitle: 'Set up Invoice Settings'
    },
    
    uninvoiced: {
      billingTitle: 'Billing & Events',
      billingDesc: 'Manage uninvoiced events grouped by studio, sync historical data, and fix matching issues. Create invoices for completed classes.',
      loading: 'Loading uninvoiced events...',
      noEvents: 'No uninvoiced events found.',
      noEventsTitle: 'No Uninvoiced Events',
      noEventsDescription: 'All your completed events have been invoiced, or you don\'t have any events with assigned studios yet.',
      createInvoice: 'Create Invoice',
      selectAll: 'Select All',
      deselectAll: 'Deselect All',
      selectedCount: '{count} selected',
      selectedTotal: 'Selected',
      refresh: 'Refresh',
      refreshing: 'Refreshing...',
      syncingRefreshing: 'Syncing & Refreshing...',
      studioActions: 'Studio Actions',
      eventActions: 'Event Actions',
      substituteTeacher: 'Setup Substitute Teacher',
      editEvent: 'Edit Event Details',
      exclude: 'Mark as Free',
      rematchStudios: 'Rematch with Studios',
      rematching: 'Rematching...',
      updating: 'Updating...',
      fixStudioMatching: 'Fix Studio Matching',
      fixMatching: 'Fix Matching',
      payout: 'Payout:',
      total: 'Total',
      selected: 'Selected',
      unknownStudio: 'Unknown Studio',
      eventWithoutStudio: 'Events without studio matching',
      untitledEvent: 'Untitled Event',
      noDate: 'No date',
      teacher: 'Teacher',
      event: 'event',
      events: 'events',
      studioMatchingIssues: 'Studio matching issues',
      studioMatchingIssuesDesc: 'Re-apply studio location patterns to existing events to fix assignment problems.',
      studioMatchingIssuesMobileDesc: 'Fix studio assignment problems',
      studioMatchingUpdated: 'Studio Matching Updated!',
      studioMatchingUpdatedDesc: '{updated_count} out of {total_events_processed} events were matched with studios.',
      studioMatchingFailed: 'Failed to update studio matching',
      rateConfig: {
        noRateConfig: 'No rate config',
        flatRate: 'Flat Rate',
        perStudent: 'Per Student',
        tieredRates: 'Tiered Rates',
        variable: 'Variable',
        base: 'Base:'
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
    },

    pdfCustomization: {
      title: 'PDF Template Customization',
      description: 'Customize the appearance of your invoice PDFs with logos, colors, and layout options',
      tabs: {
        theme: 'Theme',
        branding: 'Branding',
        layout: 'Layout'
      },
      buttons: {
        cancel: 'Cancel',
        preview: 'Preview PDF',
        save: 'Save Template',
        saving: 'Saving...',
        generating: 'Generating...',
        generatingPreview: 'Generating...'
      },
      theme: {
        title: 'Template Theme',
        professional: {
          label: 'Professional',
          description: 'Dark gray headers, bordered tables, classic business layout'
        },
        modern: {
          label: 'Modern',
          description: 'Bright emerald green accents, minimal tables, spacious design'
        },
        minimal: {
          label: 'Minimal',
          description: 'Light gray tones, small fonts, compact narrow layout'
        },
        creative: {
          label: 'Creative',
          description: 'Purple headers & accents, large fonts, modern styling'
        },
        custom: {
          label: 'Custom',
          description: 'Full control over all colors, fonts, and layout options'
        },
        selected: 'Selected'
      },
      branding: {
        logoUpload: {
          title: 'Logo & Branding',
          description: 'Upload your company logo for invoice headers',
          uploadLogo: 'Upload Logo',
          currentLogo: 'Current logo:',
          logoSize: 'Logo Size',
          logoPosition: 'Logo Position',
          sizes: {
            small: 'Small',
            medium: 'Medium',
            large: 'Large'
          },
          positions: {
            topLeft: 'Top Left',
            topCenter: 'Top Center',
            topRight: 'Top Right',
            headerLeft: 'Header Left',
            headerCenter: 'Header Center',
            headerRight: 'Header Right'
          }
        },
        colors: {
          title: 'Colors',
          description: 'Customize colors for your template',
          customOnly: 'Colors',
          customOnlyDesc: 'Color customization is only available with the Custom theme. Select "Custom" theme to modify colors.',
          headerColor: 'Header Color',
          accentColor: 'Accent Color'
        },
        text: {
          letterhead: 'Letterhead Text',
          letterheadPlaceholder: 'Enter letterhead text (e.g., company name, tagline)',
          footer: 'Footer Text',
          footerPlaceholder: 'Enter footer text (e.g., contact information, legal notices)'
        }
      },
      layout: {
        typography: {
          title: 'Typography',
          fontFamily: 'Font Family',
          fontSize: 'Font Size',
          fonts: {
            helvetica: 'Helvetica',
            times: 'Times',
            courier: 'Courier',
            arial: 'Arial'
          },
          sizes: {
            small: 'Small',
            normal: 'Normal',
            large: 'Large'
          }
        },
        page: {
          title: 'Page Settings',
          orientation: 'Page Orientation',
          size: 'Page Size',
          orientations: {
            portrait: 'Portrait',
            landscape: 'Landscape'
          },
          sizes: {
            a4: 'A4',
            letter: 'Letter',
            legal: 'Legal'
          }
        },
        content: {
          title: 'Content Options',
          showCompanyInfo: 'Show Company Information',
          showCompanyAddress: 'Show Company Address',
          showLogo: 'Show Logo',
          showInvoiceNotes: 'Show Invoice Notes',
          showTaxInfo: 'Show Tax Information',
          showPaymentTerms: 'Show Payment Terms'
        }
      },
      preview: {
        success: 'PDF preview generated successfully!',
        failed: 'Failed to generate PDF preview',
        failedDesc: 'Please try again.'
      }
    },

    billingEntities: {
      title: 'Billing Entities',
      noBillingEntities: 'No billing entities configured yet',
      noBillingEntitiesDesc: 'Create your first studio or teacher profile to start managing invoices',
      createFirstProfile: 'Create Your First Profile',
      addNew: 'Add New',
      studios: 'Studios',
      teachers: 'Teachers',
      deleteTitle: 'Delete Billing Entity',
      deleteConfirmation: 'Are you sure you want to delete "{name}"? This action cannot be undone and will remove all associated billing information.',
      cancel: 'Cancel',
      delete: 'Delete'
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
    admin: {
      title: 'Admin Dashboard',
      subtitle: 'Welcome back, {userName}. Manage your platform and users.',
      subtitleFallback: 'Welcome back, Admin. Manage your platform and users.',
      accessBadge: 'Administrator Access',
      stats: {
        totalUsers: 'Total Users',
        totalInvitations: 'Total Invitations',
        pendingInvites: 'Pending Invites',
        totalStudios: 'Total Studios'
      },
      quickActions: {
        title: 'Quick Actions',
        description: 'Common administrative tasks and shortcuts',
        manageStudios: 'Manage Studios',
        manageStudiosDesc: 'Studio partnerships & settings',
        inviteTeachers: 'Invite Teachers',
        inviteTeachersDesc: 'Manage below ↓',
        analytics: 'Analytics',
        analyticsDesc: 'Coming soon'
      },
      loadError: 'Failed to load admin data',
      sections: {
        invitations: 'Teacher Invitation Management',
        users: 'User Management'
      },
      loading: {
        invitations: 'Loading invitation management...',
        users: 'Loading user management...'
      }
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
        createNewTag: 'Create New Tag',
        createNewEvent: 'Create New Event',
        newEvent: 'New Event',
        newTag: 'New Tag',
        refresh: 'Refresh',
        createAndManage: 'Create & Manage',
        systemTools: 'System Tools',
        syncCalendar: 'Sync Calendar',
        syncing: 'Syncing...',
        quickActions: 'Quick Actions (~1-3s)',
        fullCalendarSync: 'Full Calendar Sync',
        syncDescription: 'Fix event tags or download fresh calendar data (~15-30s for sync)',
        availableTags: 'Available Tags:'
      },
      toast: {
        syncSuccess: 'Sync completed: {successfulSyncs}/{totalFeeds} feeds synced, {totalEvents} total events',
        syncError: 'Failed to sync calendar feeds',
        eventCreated: 'Event created successfully! 🎉',
        eventUpdated: 'Event updated successfully!',
        eventDeleted: 'Event deleted successfully!',
        eventCreateError: 'Failed to create event',
        eventUpdateError: 'Failed to update event',
        eventDeleteError: 'Failed to delete event'
      },
      emptyState: {
        noEvents: 'No events found',
        noEventsFiltered: 'No events match your filters',
        connectCalendar: 'Set up your yoga calendar to start importing events.',
        changeFiltersPublicPrivate: 'Try changing your filters to see {visibility} events or past events.',
        changeFiltersTime: 'Try changing the time filter to see all events including past ones.',
        changeFiltersVisibility: 'Try changing the visibility filter to see all events.',
        addCalendarFeed: 'Set Up Yoga Calendar',
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
        description: 'Sync historical events from your yoga calendar to find uninvoiced classes from previous months.',
        mobileDescription: 'Sync historical events from yoga calendar',
        syncButton: 'Sync Historical Events',
        syncButtonMobile: 'Sync Historical',
        syncing: 'Syncing...',
        noFeeds: 'No Yoga Calendar Found',
        noFeedsDesc: 'Please set up your yoga calendar first before syncing historical events.',
        syncComplete: 'Historical Sync Complete!',
        syncCompleteDesc: '{count} historical event{plural} synced from your yoga calendar{feedsPlural}. {matched} event{matchedPlural} were matched with tags and studios.',
        syncCompleteNoEvents: 'No new historical events found. Your yoga calendar was checked successfully.',
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
    },
    publicSchedule: {
      navbar: {
        home: 'Home',
        closeProfile: 'Close profile'
      },
      hero: {
        yogaTeacher: 'Yoga Teacher',
        specialties: 'Specialties',
        email: 'Email',
        instagram: 'Instagram',
        website: 'Website',
        share: 'Share',
        shareSchedule: 'Share Schedule',
        export: 'Export',
        exportEvents: 'Export Events',
        exporting: 'Exporting...',
        defaultBio: 'Join {name} for yoga classes and mindful movement. Check out my upcoming sessions and book your spot.',
        defaultBioNoName: 'Welcome to my schedule',
        shareTitle: '{name}\'s Yoga Schedule',
        shareDescription: 'Check out {name}\'s upcoming yoga classes and join for a session!',
        shareDefaultTitle: 'Teacher\'s Yoga Schedule',
        shareDefaultDescription: 'Check out upcoming yoga classes and join for a session!'
      },
      schedule: {
        header: {
          title: 'Upcoming Classes',
          classesCount: '{filtered} of {total} classes in the next 3 months',
          classesCountFiltered: '{filtered} of {total} classes in the next 3 months (filtered)',
          clearFilters: 'Clear Filters'
        },
        filters: {
          when: {
            label: 'When',
            placeholder: 'Any time',
            options: {
              all: 'Any Time',
              today: 'Today',
              tomorrow: 'Tomorrow',
              weekend: 'Weekend',
              week: 'This Week',
              month: 'This Month',
              monday: 'Mondays',
              tuesday: 'Tuesdays',
              wednesday: 'Wednesdays',
              thursday: 'Thursdays',
              friday: 'Fridays',
              saturday: 'Saturdays',
              sunday: 'Sundays'
            }
          },
          studio: {
            label: 'Studio Location',
            placeholder: 'Any studio'
          },
          yogaStyle: {
            label: 'Yoga Style',
            placeholder: 'Any style'
          }
        },
        emptyState: {
          noUpcomingClasses: 'No upcoming classes',
          noMatchingClasses: 'No classes match your filters',
          noUpcomingDescription: 'This teacher doesn\'t have any classes scheduled in the next 3 months.',
          noMatchingDescription: 'Try adjusting your filters to see more classes.',
          clearAllFilters: 'Clear All Filters'
        }
      }
    }
  },
  seo: {
    home: {
      title: 'avara. - Beautiful Yoga Schedule Management Platform',
      description: 'Connect your calendar and create beautiful shareable schedules for your yoga classes. Trusted by 500+ yoga instructors worldwide. Free to start.',
      keywords: 'yoga schedule, calendar sync, class management, instructor platform, yoga teacher, schedule sharing, calendar integration'
    },
    dashboard: {
      title: 'Dashboard - Manage Your Yoga Schedule | avara.',
      description: 'Manage your yoga classes, calendar sync, and share your schedule with students. View upcoming classes, manage events, and track your teaching schedule.',
      keywords: 'yoga dashboard, class management, schedule management, instructor dashboard, calendar management'
    },
    profile: {
      title: 'Profile Settings - Customize Your Yoga Profile | avara.',
      description: 'Customize your public yoga instructor profile. Add your bio, specialties, contact information, and create a beautiful page for your students.',
      keywords: 'yoga profile, instructor profile, yoga teacher profile, public profile, yoga bio'
    },
    addCalendar: {
      title: 'Yoga Calendar Setup - Connect Your Schedule | avara.',
      description: 'Set up your dedicated yoga calendar and import events from Google Calendar, iCloud, or .ics files. Streamlined setup in under 2 minutes.',
      keywords: 'yoga calendar, calendar setup, Google calendar, iCloud sync, calendar integration'
    },
    manageEvents: {
      title: 'Manage Events - Your Yoga Classes | avara.',
      description: 'View and manage all your yoga classes and events. Edit class details, add tags, and organize your teaching schedule.',
      keywords: 'yoga events, class management, event management, yoga schedule, class organization'
    },
    manageTags: {
      title: 'Manage Tags - Organize Your Yoga Classes | avara.',
      description: 'Create and manage tags for your yoga classes. Automatically categorize classes by type, level, and location.',
      keywords: 'yoga tags, class categories, yoga class types, event organization, class labeling'
    },
    studios: {
      title: 'Studios - Your Teaching Locations | avara.',
      description: 'Manage your yoga studio relationships and teaching locations. Connect with studios and track your teaching opportunities.',
      keywords: 'yoga studios, teaching locations, studio management, yoga teacher network'
    },
    invoices: {
      title: 'Invoices - Yoga Teaching Income Management | avara.',
      description: 'Generate professional invoices for your yoga teaching. Track income, create billing reports, and manage your teaching revenue.',
      keywords: 'yoga invoices, teaching income, yoga billing, instructor payments, teaching revenue'
    },
    teacherSchedule: {
      title: '{teacherName} - Yoga Class Schedule',
      description: 'Find yoga classes with {teacherName}. View upcoming sessions, class types, specialties, and contact information. {location}',
      keywords: 'yoga classes, {teacherName}, book yoga, yoga schedule, yoga instructor, {location}'
    },
    auth: {
      signIn: {
            title: 'Sign In - Access Your Yoga Dashboard | avara.',
    description: 'Sign in to your avara. account to manage your yoga schedule, calendar sync, and share your classes with students.',
        keywords: 'sign in, login, yoga dashboard, instructor login, account access'
      },
      signUp: {
            title: 'Create Account - Start Your Yoga Schedule | avara.',
    description: 'Create your free avara. account and start sharing your yoga schedule with students. Set up your yoga calendar and build your online presence.',
        keywords: 'create account, sign up, yoga instructor, free account, schedule sharing'
      }
    },
    errors: {
      notFound: {
        title: 'Page Not Found - avara.',
        description: 'The page you are looking for could not be found. Return to your yoga schedule dashboard or browse our yoga instructor platform.',
        keywords: 'page not found, 404, yoga schedule, instructor platform'
      },
      serverError: {
        title: 'Server Error - avara.',
        description: 'We are experiencing technical difficulties. Please try again later or contact support for assistance with your yoga schedule.',
        keywords: 'server error, technical support, yoga platform support'
      }
    }
  },
  landing: {
    hero: {
      betaBadge: 'Closed Beta',
      title: 'Beautiful yoga schedules for teachers.',
      subtitle: 'Connect your calendar and create stunning, shareable pages for your yoga classes. Trusted by yoga instructors worldwide.',
      requestAccess: 'Request Beta Access',
      seeExample: 'See Example',
      hasAccess: 'Already have access?',
      signInHere: 'Sign in here'
    },
    features: {
      title: 'Everything you need to share your schedule',
      subtitle: 'Streamline your teaching workflow with powerful yet simple tools.',
      sync: {
        title: 'Calendar Sync',
        description: 'Automatically sync with Google Calendar, iCloud, and other popular calendar services. Your schedule stays up-to-date without manual work.'
      },
      pages: {
        title: 'Beautiful Pages',
        description: 'Create stunning, professional pages that showcase your classes and make it easy for students to find and book sessions.'
      },
      sharing: {
        title: 'Easy Sharing',
        description: 'Share your schedule via custom links, export to various formats, and integrate with your existing website or social media.'
      }
    },
    socialProof: {
      title: 'Trusted by yoga teachers everywhere',
      betaTesting: {
        value: 'Beta',
        description: 'Currently in testing'
      },
      realTime: {
        value: 'Real-time',
        description: 'Automatic sync'
      },
      beautiful: {
        value: 'Beautiful',
        description: 'Professional design'
      }
    },
    cta: {
      title: 'Ready to transform your teaching workflow?',
      description: 'Join hundreds of yoga teachers who have simplified their schedule management with avara.',
      requestAccess: 'Request Beta Access',
      signIn: 'Sign In'
    },
    footer: {
      tagline: 'Beautiful yoga schedules for teachers.',
      privacy: 'Privacy',
      terms: 'Terms',
      support: 'Support',
      copyright: '© 2024 avara. All rights reserved.'
    }
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.',
    lastUpdated: 'Last updated: January 1, 2024',
    sections: {
      responsible: {
        title: 'Data Controller',
        description: 'The following entity is responsible for the processing of your personal data:'
      },
      dataCollection: {
        title: 'Data Collection',
        accountData: {
          title: 'Account Data',
          email: 'Email address for login and communication',
          name: 'Name and profile information',
          url: 'Custom URL for your public schedule page',
          profile: 'Profile photo and bio',
          contact: 'Contact information (phone, website, social media)'
        },
        calendarData: {
          title: 'Calendar Data',
          classes: 'Yoga class information from connected calendars',
          events: 'Event titles, descriptions, and locations',
          times: 'Class schedules and time zones',
          participants: 'Student count (not personal student data)',
          tokens: 'Calendar access tokens (encrypted)'
        },
        automaticData: {
          title: 'Automatic Data',
          ip: 'IP address and browser information',
          sync: 'Calendar sync logs and error reports',
          usage: 'Platform usage statistics',
          logs: 'Application logs for debugging'
        },
        billingData: {
          title: 'Billing Data',
          studios: 'Studio relationships and payment information',
          classes: 'Class attendance and payment records',
          rates: 'Teaching rates and invoice data'
        }
      },
      legalBasis: {
        title: 'Legal Basis for Processing',
        contract: {
          title: 'Contract Performance',
          description: 'Processing is necessary to provide our calendar sync and schedule management services.'
        },
        consent: {
          title: 'Consent',
          description: 'For optional features like public profile pages and marketing communications.'
        },
        interest: {
          title: 'Legitimate Interest',
          description: 'For platform security, fraud prevention, and service improvements.'
        }
      }
    },
    contact: {
      title: 'Privacy Questions?',
      description: 'If you have questions about how we handle your data or want to exercise your privacy rights, please contact us.',
      button: 'Contact Us'
    }
  },
  support: {
    title: 'Support & Help',
    description: 'We\'re here to help you get the most out of the avara platform. Find answers to common questions and get in touch with our support team.',
    contact: {
      title: 'Direct Contact',
      description: 'Have a specific question or need personal assistance? We typically respond within 24 hours.',
      button: 'Contact Support'
    },
    faq: {
      title: 'Frequently Asked Questions',
      howToConnect: {
        question: 'How do I set up my yoga calendar?',
        answer: 'You can set up your yoga calendar through Google OAuth integration or by importing events from existing calendars. The easiest method is the OAuth integration that creates a dedicated yoga calendar in your Google account.'
      },
      createPublicPage: {
        question: 'How do I create my public page?',
        answer: 'After setting up your yoga calendar, you can set your public URL and complete your profile under "Profile". Your classes will automatically appear on the public page.'
      },
      supportedCalendars: {
        question: 'Which calendar services are supported for import?',
        answer: 'You can import events from Google Calendar, Outlook/Office 365, Apple iCloud Calendar, and any calendar service that provides .ics files into your dedicated yoga calendar.'
      },
      invoicing: {
        question: 'How does invoice generation work?',
        answer: 'You can add studios and have your classes automatically matched. The system then creates PDF invoices based on your hourly rates and completed classes.'
      },
      dataSecurity: {
        question: 'Is my data secure?',
        answer: 'Yes, all data is stored GDPR-compliant in the EU. Calendar access tokens are stored encrypted and you have full control over your data at all times.'
      }
    },
    categories: {
      calendar: {
        title: 'Calendar Integration',
        description: 'Help with connecting and syncing your calendars'
      },
      profile: {
        title: 'Profile & Settings',
        description: 'Support with setting up your profile and page'
      },
      invoicing: {
        title: 'Invoices & Billing',
        description: 'Help with invoice creation and studio management'
      }
    },
    beta: {
      title: 'Beta Phase Information',
      description: 'avara is currently in closed beta phase. This means:',
      features: [
        'Usage is currently free',
        'New features are added regularly',
        'Your feedback helps us improve',
        'We provide especially fast support for issues'
      ],
      feedback: 'As a beta tester, your experiences and suggestions are very important to us. Please send us your feedback!'
    },
    technical: {
      title: 'Report Technical Issues',
      description: 'If you encounter technical problems or bugs, please help us with the following information:',
      requirements: [
        'Description of the problem',
        'Steps to reproduce',
        'Browser and operating system used',
        'Screenshots or error messages (if available)'
      ],
      button: 'Report Issue'
    }
  },
  terms: {
    title: 'Terms and Conditions',
    description: 'These terms of service govern your use of the avara platform for yoga instructors.',
    lastUpdated: 'Last updated: January 1, 2024',
    sections: {
      provider: {
        title: 'Service Provider and Scope',
        provider: {
          title: 'Provider',
          description: 'The following entity provides the avara platform:'
        },
        scope: {
          title: 'Scope',
          description: 'These Terms and Conditions apply to all services of the avara platform. By registering and using our services, you accept these terms as binding.'
        }
      },
      services: {
        title: 'Service Description',
        platform: {
          title: 'Platform Services',
          description: 'avara provides a web-based platform that offers yoga instructors the following features:',
          features: [
            'Calendar synchronization with external calendar services',
            'Creation and management of public class pages',
            'Automatic categorization and tag management',
            'Invoice creation and billing functions',
            'Profile and contact management',
            'Studio integration and location management'
          ]
        },
        beta: {
          title: 'Beta Status',
          description: 'The platform is currently in closed beta stage. Features may change, and access is limited to selected users.'
        }
      },
      registration: {
        title: 'Registration and User Account',
        requirements: {
          title: 'Requirements',
          items: [
            'Minimum age: 18 years',
            'Valid email address',
            'Activity as a yoga instructor',
            'Consent to these Terms and Privacy Policy'
          ]
        },
        security: {
          title: 'Account Security',
          description: 'You are required to keep your access credentials confidential and to notify us immediately of suspicious activities or security breaches.'
        },
        termination: {
          title: 'Account Termination',
          description: 'You can delete your account at any time. We reserve the right to suspend or delete accounts for violations of these Terms.'
        }
      },
      obligations: {
        title: 'User Obligations and Prohibitions',
        permitted: {
          title: 'Permitted Use',
          items: [
            'Exclusively for your own yoga classes and courses',
            'Truthful information in profile and class descriptions',
            'Respectful use of the platform and interaction with other users',
            'Compliance with all applicable laws'
          ]
        },
        prohibited: {
          title: 'Prohibited Activities',
          items: [
            'Uploading content that violates rights, is offensive, or harmful',
            'Violation of copyrights or other third-party rights',
            'Spam, automated requests, or abuse of services',
            'Reverse engineering or security testing without permission',
            'Commercial use outside the intended purpose'
          ]
        }
      },
      content: {
        title: 'Content and Copyright',
        userContent: {
          title: 'Your Content',
          description: 'You retain all rights to content you upload (texts, images, calendar data). You grant us a non-exclusive license to display and process this content for providing our services.'
        },
        ourContent: {
          title: 'Our Content',
          description: 'All texts, graphics, software, and other content of the platform are protected by copyright and may not be copied or used without our consent.'
        },
        violations: {
          title: 'Rights Violations',
          description: 'In case of copyright violations or other legal violations, we will remove the relevant content immediately upon notification.'
        }
      },
      availability: {
        title: 'Availability and Technical Requirements',
        uptime: {
          title: 'Availability',
          description: 'We strive for high platform availability but cannot guarantee 100% uptime. Maintenance work will be announced when possible.'
        },
        requirements: {
          title: 'Technical Requirements',
          items: [
            'Modern web browser with JavaScript support',
            'Stable internet connection',
            'Supported calendar services (Google Calendar, Outlook, iCloud)'
          ]
        }
      },
      privacy: {
        title: 'Privacy and Third Parties',
        dataProcessing: {
          title: 'Privacy',
          description: 'The processing of your personal data is carried out in accordance with our Privacy Policy, which is designed to be GDPR compliant.'
        },
        thirdParty: {
          title: 'Third-Party Integration',
          description: 'When using third-party services (Google Calendar, etc.), their terms of service and privacy policies also apply.'
        }
      },
      liability: {
        title: 'Liability and Warranty',
        limitation: {
          title: 'Liability Limitation',
          description: 'Our liability is limited to intent and gross negligence. For slight negligence, we only liable for breach of essential contractual obligations and only up to the amount of foreseeable, contract-typical damage.'
        },
        excluded: {
          title: 'Excluded Liability',
          description: 'We are not liable for data loss due to external factors, problems with third-party services, or damage from improper use of the platform.'
        },
        limitation_period: {
          title: 'Limitation Period',
          description: 'Claims against us become time-barred within one year of knowledge of the damage and our person.'
        }
      },
      termination: {
        title: 'Contract Term and Termination',
        duration: {
          title: 'Duration',
          description: 'The usage contract runs for an indefinite period and can be terminated by either party at any time without notice.'
        },
        extraordinary: {
          title: 'Extraordinary Termination',
          description: 'We may terminate the contract without notice for serious violations of these Terms, abuse of the platform, or illegal activities.'
        },
        consequences: {
          title: 'Consequences of Termination',
          description: 'After contract termination, your data will be deleted according to our Privacy Policy. Public class pages will be deactivated.'
        }
      },
      pricing: {
        title: 'Prices and Payment Terms',
        current: {
          title: 'Current Pricing Structure',
          description: 'During the beta phase, use of the platform is free. Future price changes will be communicated in advance.'
        },
        changes: {
          title: 'Price Changes',
          description: 'Price changes will be announced at least 30 days in advance. You have the right to terminate extraordinarily in case of significant price increases.'
        }
      },
      final: {
        title: 'Final Provisions',
        law: {
          title: 'Applicable Law',
          description: 'The law of the Federal Republic of Germany applies, excluding the UN Convention on Contracts for the International Sale of Goods.'
        },
        jurisdiction: {
          title: 'Jurisdiction',
          description: 'The place of jurisdiction for all disputes is our business location, provided you are a merchant, legal entity under public law, or special fund under public law.'
        },
        dispute: {
          title: 'Dispute Resolution',
          description: 'For consumer disputes, you can contact the General Consumer Arbitration Board. We are not obligated to participate in dispute resolution procedures, but are willing to do so.'
        },
        severability: {
          title: 'Severability Clause',
          description: 'Should individual provisions of these Terms be invalid, the validity of the remaining provisions remains unaffected.'
        },
        changes: {
          title: 'Changes to Terms',
          description: 'Changes to these Terms will be communicated to you at least 30 days before they take effect by email. If you do not object within 30 days, the changes are deemed accepted.'
        }
      }
    },
    contact: {
      title: 'Questions about the Terms?',
      description: 'If you have questions about these terms of service or legal aspects of the platform, we are happy to help.',
      button: 'Contact Us'
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
} as const

export default translations 