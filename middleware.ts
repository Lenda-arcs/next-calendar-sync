import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from './database-generated.types'
import { isProtectedRoute, isAuthRoute, getAuthRedirectUrl, AUTH_PATHS } from './src/lib/auth'
import { authRateLimiter, generalRateLimiter, getClientIdentifier } from './src/lib/rate-limit'
import { getServerLanguage } from '@/lib/i18n/server'

export async function middleware(req: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: req,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request: req,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    const { pathname } = req.nextUrl
    const clientId = getClientIdentifier(req)

    // Detect and set user language preference for SEO metadata
    const detectedLanguage = getServerLanguage(req)
    const currentLanguageCookie = req.cookies.get('language')?.value
    
    // Set language cookie if not already set or if detected language is different
    if (!currentLanguageCookie || currentLanguageCookie !== detectedLanguage) {
      supabaseResponse.cookies.set('language', detectedLanguage, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: false, // Allow client-side access
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    }

    // Apply rate limiting for auth routes
    if (pathname.startsWith('/auth/') || pathname.startsWith('/api/auth/')) {
      const rateLimitResult = await authRateLimiter.check(clientId)
      
      if (!rateLimitResult.success) {
        return new NextResponse(
          JSON.stringify({
            error: 'Too many authentication attempts',
            retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': '5',
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
              'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
            }
          }
        )
      }
    }

    // Apply general rate limiting for API routes
    if (pathname.startsWith('/api/')) {
      const rateLimitResult = await generalRateLimiter.check(clientId)
      
      if (!rateLimitResult.success) {
        return new NextResponse(
          JSON.stringify({
            error: 'Rate limit exceeded',
            retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': '60',
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
            }
          }
        )
      }
    }

    // Get authenticated user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    // If there's an error getting the user, treat as unauthenticated
    if (error) {
      console.error('Auth error in middleware:', error)
    }

    // Handle auth routes (should redirect authenticated users)
    if (isAuthRoute(pathname)) {
      if (user) {
        const redirectUrl = getAuthRedirectUrl(req)
        return NextResponse.redirect(new URL(redirectUrl, req.url))
      }
      return supabaseResponse
    }

    // Allow auth callback to process without interference
    if (pathname === '/auth/callback') {
      return supabaseResponse
    }

    // Handle protected routes (require authentication)
    if (isProtectedRoute(pathname)) {
      if (!user) {
        // Get locale-aware sign-in URL
        const { getSignInUrl } = await import('./src/lib/auth')
        const signInPath = getSignInUrl(pathname)
        const signInUrl = new URL(signInPath, req.url)
        signInUrl.searchParams.set('returnTo', pathname)
        return NextResponse.redirect(signInUrl)
      }
    }

    return supabaseResponse
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, redirect to sign-in for protected routes
    if (isProtectedRoute(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL(AUTH_PATHS.SIGN_IN, req.url))
    }
    return supabaseResponse
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 