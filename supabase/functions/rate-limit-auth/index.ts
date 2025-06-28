import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  blockDurationMs: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  blockDurationMs: 60 * 60 * 1000, // 1 hour
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      },
    })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { identifier, action = 'auth', config = DEFAULT_CONFIG } = await req.json()

    if (!identifier) {
      return new Response(
        JSON.stringify({ error: 'Identifier is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const now = new Date()
    const windowStart = new Date(now.getTime() - config.windowMs)

    // Clean up expired entries
    await supabaseClient
      .from('rate_limits')
      .delete()
      .lt('expires_at', now.toISOString())

    // Check if user is currently blocked
    const { data: blockData } = await supabaseClient
      .from('rate_limit_blocks')
      .select('*')
      .eq('identifier', identifier)
      .eq('action', action)
      .gt('blocked_until', now.toISOString())
      .single()

    if (blockData) {
      return new Response(
        JSON.stringify({
          success: false,
          remaining: 0,
          resetTime: blockData.blocked_until,
          blocked: true,
          message: 'User is currently blocked'
        }),
        { 
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(blockData.blocked_until).getTime().toString(),
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    // Count requests in current window
    const { data: requests, error } = await supabaseClient
      .from('rate_limits')
      .select('*')
      .eq('identifier', identifier)
      .eq('action', action)
      .gte('created_at', windowStart.toISOString())

    if (error) {
      console.error('Rate limit check error:', error)
      return new Response(
        JSON.stringify({ 
          success: true, 
          remaining: config.maxRequests - 1,
          message: 'Failed to check rate limit, allowing request'
        }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    const requestCount = requests?.length || 0

    // If limit exceeded, block the user
    if (requestCount >= config.maxRequests) {
      // Create block entry
      await supabaseClient
        .from('rate_limit_blocks')
        .upsert({
          identifier,
          action,
          blocked_until: new Date(now.getTime() + config.blockDurationMs).toISOString(),
          blocked_at: now.toISOString(),
          reason: 'Rate limit exceeded',
          metadata: { requestCount, windowStart: windowStart.toISOString() }
        })

      return new Response(
        JSON.stringify({
          success: false,
          remaining: 0,
          resetTime: new Date(now.getTime() + config.blockDurationMs).toISOString(),
          blocked: true,
          message: 'Rate limit exceeded, user blocked'
        }),
        { 
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': (now.getTime() + config.blockDurationMs).toString(),
            'Retry-After': Math.ceil(config.blockDurationMs / 1000).toString(),
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    // Record this request
    await supabaseClient
      .from('rate_limits')
      .insert({
        identifier,
        action,
        created_at: now.toISOString(),
        expires_at: new Date(now.getTime() + config.windowMs).toISOString(),
        metadata: { userAgent: req.headers.get('user-agent') }
      })

    const remaining = config.maxRequests - requestCount - 1

    return new Response(
      JSON.stringify({
        success: true,
        remaining,
        resetTime: new Date(now.getTime() + config.windowMs).toISOString(),
        blocked: false,
        message: 'Request allowed'
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': (now.getTime() + config.windowMs).toString(),
          'Access-Control-Allow-Origin': '*',
        }
      }
    )

  } catch (error) {
    console.error('Rate limiting error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        success: true, // Fail open for availability
        remaining: DEFAULT_CONFIG.maxRequests - 1,
        message: 'Rate limiting service unavailable, allowing request'
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  }
}) 