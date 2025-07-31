import { NextRequest } from 'next/server'

// Locale support
export const SUPPORTED_LOCALES = ['en', 'de', 'es'] as const
export type Locale = typeof SUPPORTED_LOCALES[number]

// Base route paths
const BASE_AUTH_PATHS = ['/sign-in', '/register', '/forgot-password'] as const
const BASE_PUBLIC_PATHS = ['/', '/classes', '/test'] as const

export const PROTECTED_ROUTES = SUPPORTED_LOCALES.map(locale => `/${locale}/app`
)

export const AUTH_PATHS = {
  SIGN_IN: '/auth/sign-in',
  REGISTER: '/auth/register',
  CALLBACK: '/auth/callback',
  FORGOT_PASSWORD: '/auth/forgot-password',
  DEFAULT_REDIRECT: '/app',
} as const

export const AUTH_ROUTES = SUPPORTED_LOCALES.flatMap(locale =>
  BASE_AUTH_PATHS.map(path => `/${locale}/auth${path}`
  )
)

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = SUPPORTED_LOCALES.flatMap(locale =>
  BASE_PUBLIC_PATHS.map(path =>
    locale === 'en' ? path : `/${locale}${path}`
  )
)

/**
 * Check if a route requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route))
}

/**
 * Check if a route should redirect authenticated users
 */
export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname.startsWith(route))
}

/**
 * Check if a route is public (accessible without authentication)
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
}

/**
 * Extract locale from pathname
 */
export function extractLocale(pathname: string): { locale: string; cleanPath: string } {
  const match = pathname.match(/^\/([a-z]{2})(\/.*)?$/)
  const locale = match?.[1]

  if (locale && SUPPORTED_LOCALES.includes(locale as Locale)) {
    return {
      locale,
      cleanPath: match?.[2] || '/'
    }
  }

  return { locale: 'en', cleanPath: pathname }
}

/**
 * Get locale-aware auth redirect URL
 */
export function getAuthRedirectUrl(request: NextRequest): string {
  const returnTo = request.nextUrl.searchParams.get('returnTo')

  // Validate returnTo URL to prevent open redirects
  if (returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//')) {
    return returnTo
  }

  // Extract locale from current path
  const { locale } = extractLocale(request.nextUrl.pathname)
  return locale === 'en' ? '/app' : `/${locale}/app`
}

/**
 * Get locale-aware sign-in URL
 */
export function getSignInUrl(pathname: string): string {
  const { locale } = extractLocale(pathname)
  return locale === 'en' ? '/auth/sign-in' : `/${locale}/auth/sign-in`
}

