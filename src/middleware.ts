import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '../database-generated.types'
import { createServerClient } from '@supabase/ssr'
import { isAuthRoute, getAuthRedirectUrl, isProtectedRoute, AUTH_PATHS, getSignInUrl } from './lib/auth'
import { getClientIdentifier, authRateLimiter, generalRateLimiter } from './lib/rate-limit'

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

    // Apply rate limiting for auth routes (except invitation processing)
    if (pathname.startsWith('/auth/') || pathname.startsWith('/api/auth/')) {
      // Skip rate limiting for invitation flows to avoid blocking valid invitations
      const isInvitationFlow = req.nextUrl.searchParams.has('access_token') && 
                              req.nextUrl.searchParams.get('type') === 'invite'
      
      if (!isInvitationFlow) {
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
    } = await supabase.auth.getUser()

    // Handle auth routes (should redirect authenticated users)
    if (isAuthRoute(pathname)) {
      if (user) {
        // Don't redirect if this is an invitation flow (user needs to complete setup)
        const isInvitationFlow = req.nextUrl.searchParams.has('access_token') && 
                                req.nextUrl.searchParams.get('type') === 'invite'
        
        if (!isInvitationFlow) {
          const redirectUrl = getAuthRedirectUrl(req)
          return NextResponse.redirect(new URL(redirectUrl, req.url))
        }
      }
      // DO NOT return — let the rest of the logic continue
    }

    // Allow auth callback to process without interference
    if (pathname === '/auth/callback') {
      return supabaseResponse
    }

    // Handle protected routes (require authentication)
    if (isProtectedRoute(pathname)) {
      if (!user) {
        // Get locale-aware sign-in URL
        const signInPath = getSignInUrl(pathname)
        const signInUrl = new URL(signInPath, req.url)
        signInUrl.searchParams.set('returnTo', pathname)
        return NextResponse.redirect(signInUrl)
      }
      
      // ✨ For authenticated users on protected routes, add user data to headers
      // This allows server components to access user info without additional Supabase calls
      if (user) {
        supabaseResponse.headers.set('x-user-id', user.id)
        supabaseResponse.headers.set('x-user-data', JSON.stringify({
          id: user.id,
          email: user.email || ''
        }))
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
    // Localized app routes
    '/en/app/:path*',
    '/de/app/:path*', 
    '/es/app/:path*',
    // Localized auth routes
    '/en/auth/:path*',
    '/de/auth/:path*',
    '/es/auth/:path*',
    // Global auth routes
    '/auth/:path*',
    // API routes
    '/api/:path*',
  ],
}