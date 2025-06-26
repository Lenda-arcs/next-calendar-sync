export const EXPORT_CONFIG = {
  MAX_EVENTS_PER_EXPORT: 4,
  RENDER_DELAY_MS: 100,
  EXPORT_ELEMENT_ID: 'instagram-story-export',
  EXPORT_MESSAGES: {
    NO_EVENTS: 'No events to export!',
    EXPORTING: 'Exporting events...',
    EXPORT_FAILED: 'Export failed'
  }
} as const

export const SHARE_CTA_CONTENT = {
  TITLE: 'Share Your Schedule',
  DESCRIPTION: 'Export your filtered events as Instagram story images to share with your community.',
  BUTTONS: {
    EXPORT: 'Export Events',
    EXPORTING: 'Exporting...',
    SHARE: 'Share'
  }
} as const

export const EXPORT_DIALOG_CONTENT = {
  TITLE: 'Export Your Schedule',
  DESCRIPTION: 'Choose how you\'d like to export your filtered events for sharing.',
  PNG_EXPORT: {
    TITLE: 'Automatic PNG Export',
    DESCRIPTION: 'Generates a clean PNG image optimized for Instagram stories.',
    BUTTON: 'Generate PNG',
    BUTTON_LOADING: 'Generating PNG...'
  },
  SCREENSHOT_MODE: {
    TITLE: 'Screenshot Mode',
    DESCRIPTION: 'Temporarily hides page elements so you can take your own screenshot with any tool.',
    BUTTON: 'Enter Screenshot Mode',
    BUTTON_ACTIVE: 'Screenshot mode active...',
    ACTIVE_MESSAGE: 'Page elements hidden for 5 seconds. Take your screenshot now!'
  }
} as const 