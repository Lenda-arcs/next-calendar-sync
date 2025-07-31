import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '../database-generated.types'
import { createServerClient } from '@supabase/ssr'
import { isAuthRoute, getAuthRedirectUrl, isProtectedRoute, AUTH_PATHS, getSignInUrl, SUPPORTED_LOCALES } from './lib/auth'
import { getClientIdentifier, authRateLimiter, generalRateLimiter } from './lib/rate-limit'

export async function middleware(req: NextRequest) {
  console.debug('🔥 Middleware triggered at:', req.nextUrl.pathname)
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

    // Handle auth routes (should redirect authenticated users)
    if (isAuthRoute(pathname)) {
      if (user) {
        console.debug('👤 Authenticated user on auth route — redirecting to app')
        const redirectUrl = getAuthRedirectUrl(req)
        return NextResponse.redirect(new URL(redirectUrl, req.url))
      }
      console.debug('👤 Unauthenticated user on auth route — allowing through')
      // DO NOT return — let the rest of the debugic continue
    }

    // Allow auth callback to process without interference
    if (pathname === '/auth/callback') {
      return supabaseResponse
    }

    console.debug('👤 User authentication status:', user ? 'Authenticated' : 'Unauthenticated')
    // Handle protected routes (require authentication)
    if (isProtectedRoute(pathname)) {
      console.debug('🔒 Protected route accessed:', pathname)
      if (!user) {
        console.debug('🚫 No authenticated user, redirecting to sign-in')
        // Get locale-aware sign-in URL
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
    ...SUPPORTED_LOCALES.map(locale => `/${locale}/app/:path*`),
    ...SUPPORTED_LOCALES.map(locale => `/${locale}/auth/:path*`),
    '/auth/:path*',
    '/api/:path*',
  ],
}