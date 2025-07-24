import { Metadata } from 'next/types'
import { 
  Language, 
  DEFAULT_LANGUAGE
} from './types'
import { 
  getServerTranslation, 
  getLocaleString, 
  generateLanguageAlternates,
  getServerLanguageSafe
} from './server'

export interface MetadataOptions {
  page: string
  language?: Language
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
    language = DEFAULT_LANGUAGE,
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
  
  // Generate base URL (you might want to get this from environment)
  const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'https://yoga-sync.com'
  const fullURL = canonical || `${baseURL}${basePath}`
  
  // Generate language alternates
  const languageAlternates = generateLanguageAlternates(basePath)
  
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
 * Generate metadata for home page
 */
export async function generateHomeMetadata(language?: Language): Promise<Metadata> {
  const currentLanguage = language || await getCurrentLanguage()
  return generateSEOMetadata({
    page: 'home',
    language: currentLanguage,
    basePath: currentLanguage === DEFAULT_LANGUAGE ? '/' : `/${currentLanguage}/`
  })
}

/**
 * Generate metadata for dashboard page
 */
export async function generateDashboardMetadata(language?: Language): Promise<Metadata> {
  const currentLanguage = language || await getCurrentLanguage()
  return generateSEOMetadata({
    page: 'dashboard',
    language: currentLanguage,
    basePath: currentLanguage === DEFAULT_LANGUAGE ? '/app' : `/${currentLanguage}/app`
  })
}

/**
 * Generate metadata for profile page
 */
export async function generateProfileMetadata(language?: Language): Promise<Metadata> {
  const currentLanguage = language || await getCurrentLanguage()
  return generateSEOMetadata({
    page: 'profile',
    language: currentLanguage,
    basePath: currentLanguage === DEFAULT_LANGUAGE ? '/app/profile' : `/${currentLanguage}/app/profile`
  })
}

/**
 * Generate metadata for add calendar page
 */
export async function generateAddCalendarMetadata(language?: Language): Promise<Metadata> {
  const currentLanguage = language || await getCurrentLanguage()
  return generateSEOMetadata({
    page: 'addCalendar',
    language: currentLanguage,
    basePath: currentLanguage === DEFAULT_LANGUAGE ? '/app/add-calendar' : `/${currentLanguage}/app/add-calendar`
  })
}

/**
 * Generate metadata for manage events page
 */
export async function generateManageEventsMetadata(language: Language = DEFAULT_LANGUAGE): Promise<Metadata> {
  return generateSEOMetadata({
    page: 'manageEvents',
    language,
    basePath: language === DEFAULT_LANGUAGE ? '/app/manage-events' : `/${language}/app/manage-events`
  })
}

/**
 * Generate metadata for manage tags page
 */
export async function generateManageTagsMetadata(language: Language = DEFAULT_LANGUAGE): Promise<Metadata> {
  return generateSEOMetadata({
    page: 'manageTags',
    language,
    basePath: language === DEFAULT_LANGUAGE ? '/app/manage-tags' : `/${language}/app/manage-tags`
  })
}

/**
 * Generate metadata for studios page
 */
export async function generateStudiosMetadata(language: Language = DEFAULT_LANGUAGE): Promise<Metadata> {
  return generateSEOMetadata({
    page: 'studios',
    language,
    basePath: language === DEFAULT_LANGUAGE ? '/app/studios' : `/${language}/app/studios`
  })
}

/**
 * Generate metadata for invoices page
 */
export async function generateInvoicesMetadata(language: Language = DEFAULT_LANGUAGE): Promise<Metadata> {
  return generateSEOMetadata({
    page: 'invoices',
    language,
    basePath: language === DEFAULT_LANGUAGE ? '/app/invoices' : `/${language}/app/invoices`
  })
}

/**
 * Generate metadata for teacher schedule page
 */
export async function generateTeacherScheduleMetadata(
  teacherName: string,
  teacherSlug: string,
  language?: Language,
  location?: string
): Promise<Metadata> {
  const currentLanguage = language || await getCurrentLanguage()
  const variables = {
    teacherName,
    location: location || `${teacherName}'s Studio`
  }
  
  const images = [
    {
      url: `/api/og/teacher/${teacherSlug}`,
      width: 1200,
      height: 630,
      alt: `${teacherName} - Yoga Class Schedule`
    }
  ]
  
  return generateSEOMetadata({
    page: 'teacherSchedule',
    language: currentLanguage,
    variables,
    basePath: `/schedule/${teacherSlug}`,
    images
  })
}

/**
 * Generate metadata for auth pages
 */
export async function generateAuthMetadata(
  authType: 'signIn' | 'signUp',
  language?: Language
): Promise<Metadata> {
  const currentLanguage = language || await getCurrentLanguage()
  return generateSEOMetadata({
    page: `auth.${authType}`,
    language: currentLanguage,
    basePath: currentLanguage === DEFAULT_LANGUAGE ? `/auth/${authType === 'signIn' ? 'sign-in' : 'register'}` : `/${currentLanguage}/auth/${authType === 'signIn' ? 'sign-in' : 'register'}`
  })
}

/**
 * Generate metadata for error pages
 */
export async function generateErrorMetadata(
  errorType: 'notFound' | 'serverError',
  language: Language = DEFAULT_LANGUAGE
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
  language: Language = DEFAULT_LANGUAGE
) {
  const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'https://yoga-sync.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseURL}/schedule/${teacherSlug}#person`,
    name: teacherName,
    jobTitle: language === 'de' ? 'Yoga-Lehrer' : language === 'es' ? 'Instructor de Yoga' : 'Yoga Instructor',
    description: bio,
    url: `${baseURL}/schedule/${teacherSlug}`,
    image: `${baseURL}/api/og/teacher/${teacherSlug}`,
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
  const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'https://yoga-sync.com'
  
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
      url: `${baseURL}/schedule/${teacherSlug}`
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'USD',
      url: `${baseURL}/schedule/${teacherSlug}`
    }
  }
}

/**
 * Generate structured data for the avara. organization
 */
export function generateOrganizationStructuredData(language: Language = DEFAULT_LANGUAGE) {
  const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'https://yoga-sync.com'
  
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
      email: 'support@avara.app'
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