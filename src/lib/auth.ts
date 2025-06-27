import { NextRequest } from 'next/server'

/**
 * Routes that require authentication
 */
export const PROTECTED_ROUTES = [
  '/app',
] as const

/**
 * Routes that should redirect authenticated users
 */
export const AUTH_ROUTES = [
  '/auth/sign-in',
  '/auth/register',
  '/auth/forgot-password',
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
 * Get the redirect URL after successful authentication
 */
export function getAuthRedirectUrl(request: NextRequest): string {
  const returnTo = request.nextUrl.searchParams.get('returnTo')
  
  // Validate returnTo URL to prevent open redirects
  if (returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//')) {
    return returnTo
  }
  
  return '/app'
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