import { NextRequest } from 'next/server'

/**
 * Routes that require authentication (including locale variants)
 */
export const PROTECTED_ROUTES = [
  '/app',
  '/de/app',
  '/es/app',
] as const

/**
 * Routes that should redirect authenticated users (including locale variants)
 */
export const AUTH_ROUTES = [
  '/auth/sign-in',
  '/auth/register',
  '/auth/forgot-password',
  '/de/auth/sign-in',
  '/de/auth/register', 
  '/de/auth/forgot-password',
  '/es/auth/sign-in',
  '/es/auth/register',
  '/es/auth/forgot-password',
] as const

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [
  '/',
  '/schedule',
  '/test',
] as const

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
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/.*)?$/)
  if (localeMatch && ['de', 'es'].includes(localeMatch[1])) {
    return {
      locale: localeMatch[1],
      cleanPath: localeMatch[2] || '/'
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

/**
 * Auth-related paths
 */
export const AUTH_PATHS = {
  SIGN_IN: '/auth/sign-in',
  REGISTER: '/auth/register',
  CALLBACK: '/auth/callback',
  FORGOT_PASSWORD: '/auth/forgot-password',
  DEFAULT_REDIRECT: '/app',
} as const 