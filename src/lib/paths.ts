/**
 * Centralized path collection for the application
 * Use these constants instead of hardcoded strings throughout the app
 */

export const PATHS = {
  // Public routes
  HOME: '/',
  SCHEDULE: '/schedule',
  
  // Auth routes
  AUTH: {
    SIGN_IN: '/auth/sign-in',
    REGISTER: '/auth/register',
    SIGNOUT: '/auth/signout',
    CALLBACK: '/auth/callback',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },

  // App routes (authenticated)
  APP: {
    DASHBOARD: '/app',
    PROFILE: '/app/profile',
    ADD_CALENDAR: '/app/add-calendar',
    MANAGE_EVENTS: '/app/manage-events',
    MANAGE_TAGS: '/app/manage-tags',
    MANAGE_INVOICES: '/app/manage-invoices',
    STUDIOS: '/app/studios',
    ADMIN: '/app/admin',
  },

  // Dynamic routes
  DYNAMIC: {
    TEACHER_SCHEDULE: (slug: string, locale?: string) => 
      locale && locale !== 'en' ? `/${locale}/classes/${slug}` : `/classes/${slug}`,
  },

  // Test routes (development)
  TEST: {
    INDEX: '/test',
    RESPONSIVE: '/test/responsive',
    ACCESSIBILITY: '/test/accessibility',
    DESIGN_SYSTEM: '/test/design-system',
    EVENT_CARDS: '/test/event-cards',
    INTEGRATION: '/test/integration',
    PERFORMANCE: '/test/performance',
  },

  // API routes
  API: {
    AUTH_SIGNOUT: '/api/auth/signout',
    AUTH_CALLBACK: '/api/auth/callback',
  },
} as const

// Type for all available paths
export type AppPath = typeof PATHS[keyof typeof PATHS]

/**
 * Generate a locale-aware path
 * @param path - The base path (e.g., '/app/profile')
 * @param locale - The locale (e.g., 'de', 'es', 'en')
 * @returns Localized path (e.g., '/de/app/profile' or '/en/app/profile')
 */
export const getLocalizedPath = (path: string, locale?: string): string => {
  // Remove leading slash for consistency
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // Default to 'en' if no locale provided
  const actualLocale = locale || 'en'
  
  // Always prepend the locale (including for English)
  return `/${actualLocale}/${cleanPath}`
}

/**
 * Extract locale from current pathname
 * @param pathname - Current pathname from usePathname()
 * @returns The locale ('de', 'es', 'en') or 'en' as fallback
 */
export const extractLocaleFromPath = (pathname: string): string => {
  const match = pathname.match(/^\/([a-z]{2})(\/.*)?$/)
  if (match && ['de', 'es'].includes(match[1])) {
    return match[1]
  }
  return 'en'
}

// Helper function to get all static paths as an array
export const getAllPaths = (): string[] => {
  const paths: string[] = []
  
  const extractPaths = (obj: Record<string, unknown>, prefix = ''): void => {
    Object.values(obj).forEach(value => {
      if (typeof value === 'string') {
        paths.push(value)
      } else if (typeof value === 'object' && value !== null) {
        extractPaths(value as Record<string, unknown>, prefix)
      }
    })
  }
  
  extractPaths(PATHS)
  return paths
}

// Helper function to check if a path exists
export const isValidPath = (path: string): boolean => {
  return getAllPaths().includes(path)
} 