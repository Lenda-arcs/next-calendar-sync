import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from './database-generated.types'

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

  // Get authenticated user - required for Server Components  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Handle auth routes (no authentication required)
  if (req.nextUrl.pathname.startsWith('/auth/')) {
    // If user is already logged in, redirect to dashboard
    if (user) {
      return NextResponse.redirect(new URL('/app', req.url))
    }
    return supabaseResponse
  }

  // Check if user is accessing protected /app routes
  if (req.nextUrl.pathname.startsWith('/app')) {
    // For all /app routes, require authentication
    if (!user) {
      return NextResponse.redirect(new URL('/auth/sign-in', req.url))
    }
  }

        return supabaseResponse
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