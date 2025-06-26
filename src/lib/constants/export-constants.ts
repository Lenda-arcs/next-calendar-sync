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