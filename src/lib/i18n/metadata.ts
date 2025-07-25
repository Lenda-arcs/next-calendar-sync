import { Metadata } from 'next/types'
import { Locale, defaultLocale } from './config'
import { 
  getServerTranslation, 
  getLocaleString, 
  getServerLanguageSafe
} from './server'
import { PATHS } from '@/lib/paths'

export interface MetadataOptions {
  page: string
  language?: Locale
  variables?: Record<string, string>
  basePath?: string
  canonical?: string
  noIndex?: boolean
  images?: Array<{
    url: string
    width?: number
    height?: number
    alt?: string
  }>
}

/**
 * Get the current language from cookies, with fallback to default
 * This function is now an alias for getServerLanguageSafe for consistency
 */
const getCurrentLanguage = getServerLanguageSafe

/**
 * Generate comprehensive metadata for a page with SEO optimization
 */
export async function generateSEOMetadata(options: MetadataOptions): Promise<Metadata> {
  const {
    page,
    language = defaultLocale,
    variables = {},
    basePath = '',
    canonical,
    noIndex = false,
    images = []
  } = options

  // Get translated SEO content
  const title = await getServerTranslation(language, `seo.${page}.title`, variables)
  const description = await getServerTranslation(language, `seo.${page}.description`, variables)
  const keywords = await getServerTranslation(language, `seo.${page}.keywords`, variables)
  
  // Generate base URL from environment variable
  const baseURL = process.env.NEXT_PUBLIC_APP_URL
  
  // Handle basePath for new [locale] structure
  let fullBasePath = basePath
  if (basePath && !basePath.startsWith('/')) {
    fullBasePath = `/${basePath}`
  }
  
  // For non-default locales, prefix with locale
  if (language !== defaultLocale) {
    fullBasePath = `/${language}${fullBasePath}`
  }
  
  const fullURL = canonical || `${baseURL}${fullBasePath}`
  
  // Generate language alternates for new structure
  const languageAlternates = generateLanguageAlternatesForPage(basePath)
  
  // Convert relative alternate URLs to absolute
  const absoluteAlternates = Object.entries(languageAlternates).reduce(
    (acc, [lang, path]) => {
      acc[lang] = `${baseURL}${path}`
      return acc
    },
    {} as Record<string, string>
  )

  // Default images for OpenGraph
  const defaultImages = [
    {
      url: `${baseURL}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: title
    }
  ]

  // Merge provided images with defaults
  const ogImages = images.length > 0 ? images.map(img => ({
    ...img,
    url: img.url.startsWith('http') ? img.url : `${baseURL}${img.url}`
  })) : defaultImages

  const metadata: Metadata = {
    title,
    description,
    keywords,
    
    // Canonical URL
    alternates: {
      canonical: fullURL,
      languages: absoluteAlternates
    },
    
    // Robots
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    
    // OpenGraph
    openGraph: {
      title,
      description,
      url: fullURL,
      siteName: 'avara.',
      locale: getLocaleString(language),
      type: 'website',
      images: ogImages
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map(img => img.url)
    },
    
    // Additional metadata
    authors: [{ name: 'avara. Team' }],
    category: 'Health & Fitness',
    
    // Language and locale
    other: {
      'language': language,
      'content-language': language,
      'og:locale': getLocaleString(language),
      
      // Add alternate language tags
      ...Object.entries(absoluteAlternates).reduce(
        (acc, [lang, url]) => {
          acc[`alternate:${lang}`] = url
          return acc
        },
        {} as Record<string, string>
      )
    }
  }

  return metadata
}

/**
 * Generate language alternates for the new [locale] structure
 */
function generateLanguageAlternatesForPage(basePath: string): Record<string, string> {
  const alternates: Record<string, string> = {}
  const locales: Locale[] = ['en', 'de', 'es']
  
  // Ensure basePath starts with /
  const normalizedPath = basePath.startsWith('/') ? basePath : `/${basePath}`
  
  // Add each supported language
  for (const locale of locales) {
    if (locale === defaultLocale) {
      // Default language uses root path
      alternates[locale] = normalizedPath || '/'
    } else {
      // Other languages use /locale/path
      alternates[locale] = `/${locale}${normalizedPath}`
    }
  }
  
  // Add x-default for default language
  alternates['x-default'] = normalizedPath || '/'
  
  return alternates
}

/**
 * Generate metadata for home page
 */
export async function generateHomeMetadata(language?: Locale): Promise<Metadata> {
  const currentLanguage = language || await getCurrentLanguage()
  return generateSEOMetadata({
    page: 'home',
    language: currentLanguage,
    basePath: ''
  })
}

/**
 * Generate metadata for dashboard page
 */
export async function generateDashboardMetadata(language?: Locale): Promise<Metadata> {
  const currentLanguage = language || await getCurrentLanguage()
  return generateSEOMetadata({
    page: 'dashboard',
    language: currentLanguage,
    basePath: '/app'
  })
}

/**
 * Generate metadata for profile page
 */
export async function generateProfileMetadata(language?: Locale): Promise<Metadata> {
  const currentLanguage = language || await getCurrentLanguage()
  return generateSEOMetadata({
    page: 'profile',
    language: currentLanguage,
    basePath: '/app/profile'
  })
}

/**
 * Generate metadata for add calendar page
 */
export async function generateAddCalendarMetadata(language?: Locale): Promise<Metadata> {
  const currentLanguage = language || await getCurrentLanguage()
  return generateSEOMetadata({
    page: 'addCalendar',
    language: currentLanguage,
    basePath: '/app/add-calendar'
  })
}

/**
 * Generate metadata for manage events page
 */
export async function generateManageEventsMetadata(language: Locale = defaultLocale): Promise<Metadata> {
  return generateSEOMetadata({
    page: 'manageEvents',
    language,
    basePath: '/app/manage-events'
  })
}

/**
 * Generate metadata for manage tags page
 */
export async function generateManageTagsMetadata(language: Locale = defaultLocale): Promise<Metadata> {
  return generateSEOMetadata({
    page: 'manageTags',
    language,
    basePath: '/app/manage-tags'
  })
}

/**
 * Generate metadata for studios page
 */
export async function generateStudiosMetadata(language: Locale = defaultLocale): Promise<Metadata> {
  return generateSEOMetadata({
    page: 'studios',
    language,
    basePath: '/app/studios'
  })
}

/**
 * Generate metadata for invoices page
 */
export async function generateInvoicesMetadata(language: Locale = defaultLocale): Promise<Metadata> {
  return generateSEOMetadata({
    page: 'invoices',
    language,
    basePath: '/app/invoices'
  })
}

/**
 * Generate metadata for legal pages
 */
export async function generatePrivacyMetadata(language: Locale = defaultLocale): Promise<Metadata> {
  return generateSEOMetadata({
    page: 'privacy',
    language,
    basePath: '/privacy'
  })
}

export async function generateTermsMetadata(language: Locale = defaultLocale): Promise<Metadata> {
  return generateSEOMetadata({
    page: 'terms',
    language,
    basePath: '/terms'
  })
}

export async function generateSupportMetadata(language: Locale = defaultLocale): Promise<Metadata> {
  return generateSEOMetadata({
    page: 'support',
    language,
    basePath: '/support'
  })
}

/**
 * Generate metadata for teacher schedule page
 */
export async function generateTeacherScheduleMetadata(
  teacherName: string,
  teacherSlug: string,
  language?: Locale,
  location?: string,
  profileImageUrl?: string | null
): Promise<Metadata> {
  const currentLanguage = language || await getCurrentLanguage()
  const variables = {
    teacherName,
    location: location || `${teacherName}'s Studio`
  }
  
  // Use profile image if available, otherwise fallback to dummy logo
  const baseURL = process.env.NEXT_PUBLIC_APP_URL
  const imageUrl = profileImageUrl || `${baseURL}/dummy_logo.png`
  
  const images = [
    {
      url: imageUrl,
      width: 1200,
      height: 630,
      alt: `${teacherName} - Yoga Class Schedule`
    }
  ]
  
  return generateSEOMetadata({
    page: 'teacherSchedule',
    language: currentLanguage,
    variables,
    basePath: PATHS.DYNAMIC.TEACHER_SCHEDULE(teacherSlug),
    images
  })
}

/**
 * Generate metadata for auth pages
 */
export async function generateAuthMetadata(
  authType: 'signIn' | 'signUp',
  language?: Locale
): Promise<Metadata> {
  const currentLanguage = language || await getCurrentLanguage()
  return generateSEOMetadata({
    page: `auth.${authType}`,
    language: currentLanguage,
    basePath: `/auth/${authType === 'signIn' ? 'sign-in' : 'register'}`
  })
}

/**
 * Generate metadata for error pages
 */
export async function generateErrorMetadata(
  errorType: 'notFound' | 'serverError',
  language: Locale = defaultLocale
): Promise<Metadata> {
  return generateSEOMetadata({
    page: `errors.${errorType}`,
    language,
    basePath: '',
    noIndex: true // Don't index error pages
  })
}

/**
 * Generate structured data for yoga instructor
 */
export function generateYogaInstructorStructuredData(
  teacherName: string,
  teacherSlug: string,
  bio?: string,
  location?: string,
  specialties?: string[],
  language: Locale = defaultLocale,
  profileImageUrl?: string | null
) {
  const baseURL = process.env.NEXT_PUBLIC_APP_URL
  
  // Use profile image if available, otherwise fallback to dummy logo
  const imageUrl = profileImageUrl || `${baseURL}/dummy_logo.png`
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseURL}${PATHS.DYNAMIC.TEACHER_SCHEDULE(teacherSlug)}#person`,
    name: teacherName,
    jobTitle: language === 'de' ? 'Yoga-Lehrer' : language === 'es' ? 'Instructor de Yoga' : 'Yoga Instructor',
    description: bio,
    url: `${baseURL}${PATHS.DYNAMIC.TEACHER_SCHEDULE(teacherSlug)}`,
    image: imageUrl,
    sameAs: [],
    knowsAbout: specialties,
    worksFor: {
      '@type': 'Organization',
      name: 'avara.',
      url: baseURL
    },
    ...(location && {
      workLocation: {
        '@type': 'Place',
        name: location
      }
    })
  }
}

/**
 * Generate structured data for yoga class/event
 */
export function generateYogaClassStructuredData(
  className: string,
  teacherName: string,
  teacherSlug: string,
  startTime: string,
  endTime: string,
  location: string,
  description?: string
) {
  const baseURL = process.env.NEXT_PUBLIC_APP_URL
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: className,
    description,
    startDate: startTime,
    endDate: endTime,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: location
    },
    organizer: {
      '@type': 'Person',
      name: teacherName,
      url: `${baseURL}${PATHS.DYNAMIC.TEACHER_SCHEDULE(teacherSlug)}`
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'USD',
      url: `${baseURL}${PATHS.DYNAMIC.TEACHER_SCHEDULE(teacherSlug)}`
    }
  }
}

/**
 * Generate structured data for the avara. organization
 */
export function generateOrganizationStructuredData(language: Locale = defaultLocale) {
  const baseURL = process.env.NEXT_PUBLIC_APP_URL
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseURL}#organization`,
    name: 'avara.',
    url: baseURL,
    logo: `${baseURL}/logo.png`,
    description: language === 'de' 
      ? 'Schöne Yoga-Terminplanung Plattform für Yoga-Lehrer. Verbinden Sie Ihren Kalender und erstellen Sie teilbare Terminpläne.'
      : language === 'es' 
      ? 'Plataforma hermosa de gestión de horarios de yoga para instructores. Conecta tu calendario y crea horarios compartibles.'
      : 'Beautiful yoga schedule management platform for yoga instructors. Connect your calendar and create shareable schedules.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@avara.studio'
    },
    sameAs: [
      'https://twitter.com/avarayoga',
      'https://facebook.com/avarayoga',
      'https://instagram.com/avarayoga'
    ],
    foundingDate: '2024',
    numberOfEmployees: '1-10',
    industry: 'Health & Fitness Technology',
    serviceArea: {
      '@type': 'Place',
      name: 'Worldwide'
    }
  }
} 