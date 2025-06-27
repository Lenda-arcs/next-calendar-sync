interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export class RateLimiter {
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  async check(identifier: string): Promise<RateLimitResult> {
    const now = Date.now()
    const key = `rate_limit:${identifier}`
    
    // Clean up expired entries
    this.cleanup()
    
    const existing = rateLimitStore.get(key)
    
    if (!existing || now > existing.resetTime) {
      // Create new entry
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + this.config.interval
      })
      
      return {
        success: true,
        remaining: this.config.uniqueTokenPerInterval - 1,
        resetTime: now + this.config.interval
      }
    }
    
    if (existing.count >= this.config.uniqueTokenPerInterval) {
      return {
        success: false,
        remaining: 0,
        resetTime: existing.resetTime
      }
    }
    
    // Increment count
    existing.count++
    rateLimitStore.set(key, existing)
    
    return {
      success: true,
      remaining: this.config.uniqueTokenPerInterval - existing.count,
      resetTime: existing.resetTime
    }
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }
}

// Pre-configured rate limiters
export const authRateLimiter = new RateLimiter({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 5, // 5 attempts per 15 minutes
})

export const generalRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 60, // 60 requests per minute
})

export const strictRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 10, // 10 requests per minute
})

// Utility to get client identifier
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (for production behind proxy)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  const ip = forwardedFor?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
  
  return ip.trim()
} 