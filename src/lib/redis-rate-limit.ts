// Redis-based rate limiting using Upstash
// Install: npm install @upstash/redis

// Uncomment when you want to use Redis rate limiting
/*
import { Redis } from '@upstash/redis'

interface RedisRateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  blocked: boolean
}

export class RedisRateLimiter {
  private redis: Redis
  private windowMs: number
  private maxRequests: number
  private keyPrefix: string

  constructor(
    redisUrl: string,
    redisToken: string,
    windowMs: number = 15 * 60 * 1000, // 15 minutes
    maxRequests: number = 5,
    keyPrefix: string = 'rl'
  ) {
    this.redis = new Redis({
      url: redisUrl,
      token: redisToken,
    })
    this.windowMs = windowMs
    this.maxRequests = maxRequests
    this.keyPrefix = keyPrefix
  }

  async checkRateLimit(identifier: string, action: string = 'auth'): Promise<RedisRateLimitResult> {
    const key = `${this.keyPrefix}:${action}:${identifier}`
    const now = Date.now()
    const window = Math.floor(now / this.windowMs)
    const windowKey = `${key}:${window}`

    try {
      // Use Redis pipeline for atomic operations
      const pipeline = this.redis.pipeline()
      pipeline.incr(windowKey)
      pipeline.expire(windowKey, Math.ceil(this.windowMs / 1000))
      
      const results = await pipeline.exec()
      const count = results[0] as number

      if (count > this.maxRequests) {
        // Check if user should be blocked
        const blockKey = `${this.keyPrefix}:block:${action}:${identifier}`
        const isBlocked = await this.redis.get(blockKey)
        
        if (!isBlocked) {
          // Block the user for longer period
          const blockDuration = 60 * 60; // 1 hour in seconds
          await this.redis.setex(blockKey, blockDuration, 'blocked')
        }

        return {
          success: false,
          remaining: 0,
          resetTime: (window + 1) * this.windowMs,
          blocked: true
        }
      }

      return {
        success: true,
        remaining: this.maxRequests - count,
        resetTime: (window + 1) * this.windowMs,
        blocked: false
      }

    } catch (error) {
      console.error('Redis rate limit error:', error)
      // Fail open - allow the request when Redis is unavailable
      return {
        success: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs,
        blocked: false
      }
    }
  }

  async removeBlock(identifier: string, action: string = 'auth'): Promise<void> {
    const blockKey = `${this.keyPrefix}:block:${action}:${identifier}`
    await this.redis.del(blockKey)
  }

  async getBlockStatus(identifier: string, action: string = 'auth'): Promise<number | null> {
    const blockKey = `${this.keyPrefix}:block:${action}:${identifier}`
    const ttl = await this.redis.ttl(blockKey)
    return ttl > 0 ? ttl : null
  }
}

// Usage example:
// const redisLimiter = new RedisRateLimiter(
//   process.env.UPSTASH_REDIS_REST_URL!,
//   process.env.UPSTASH_REDIS_REST_TOKEN!,
//   15 * 60 * 1000, // 15 minutes
//   5 // 5 attempts
// )
*/

// Placeholder exports to avoid import errors
export const RedisRateLimiter = null
export const redisLimiter = null 