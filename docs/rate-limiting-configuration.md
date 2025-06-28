# Rate Limiting Configuration Guide

## Overview

This document outlines the complete rate limiting implementation for Calendar Sync Next, providing enterprise-grade security through multiple layers of protection.

## Architecture Overview

Our rate limiting system uses a **layered security approach**:

```
User Request
    ↓
🛡️ Layer 1: Next.js Middleware (rate-limit.ts)
    ↓ (if allowed)
🔒 Layer 2: Supabase Built-in Rate Limits
    ↓ (if allowed)
✅ Request Processed
```

---

## Layer 1: Custom Middleware Rate Limiting

### Implementation

**File:** `src/lib/rate-limit.ts`

```typescript
// Pre-configured rate limiters
export const authRateLimiter = new RateLimiter({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 5, // 5 attempts per 15 minutes
})

export const generalRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 60, // 60 requests per minute
})
```

**File:** `middleware.ts`

```typescript
// Applied to auth routes
if (pathname.startsWith('/auth/') || pathname.startsWith('/api/auth/')) {
  const rateLimitResult = await authRateLimiter.check(clientId)
  // Returns 429 if limit exceeded
}

// Applied to API routes  
if (pathname.startsWith('/api/')) {
  const rateLimitResult = await generalRateLimiter.check(clientId)
  // Returns 429 if limit exceeded
}
```

### Configuration

| **Route Pattern** | **Limit** | **Window** | **Purpose** |
|------------------|-----------|------------|-------------|
| `/auth/*` | 5 requests | 15 minutes | Prevent auth brute force |
| `/api/auth/*` | 5 requests | 15 minutes | Protect auth API endpoints |
| `/api/*` | 60 requests | 1 minute | Prevent API abuse |

### Features

✅ **IP-based identification** with proxy support  
✅ **In-memory storage** (production: Redis recommended)  
✅ **Automatic cleanup** of expired entries  
✅ **Standard HTTP headers** (X-RateLimit-*)  
✅ **Graceful error handling** (fail-open approach)

---

## Layer 2: Supabase Rate Limiting

### Current Configuration

**Applied on:** November 2024

```json
{
  "rate_limit_anonymous_users": 10,
  "rate_limit_email_sent": 2,
  "rate_limit_sms_sent": 30,
  "rate_limit_token_refresh": 1800,
  "rate_limit_otp": 60,
  "rate_limit_verify": 360,
  "rate_limit_web3": 30
}
```

### Configuration Command

```bash
# Environment variables
export SUPABASE_ACCESS_TOKEN="your-access-token"
export PROJECT_REF="your-project-ref"

# Apply configuration
curl -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rate_limit_anonymous_users": 10,
    "rate_limit_sms_sent": 30,
    "rate_limit_verify": 360,
    "rate_limit_token_refresh": 1800,
    "rate_limit_otp": 60,
    "rate_limit_web3": 30
  }'
```

### Verification

```bash
# Check current configuration
curl -X GET "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  | jq 'to_entries | map(select(.key | startswith("rate_limit_"))) | from_entries'
```

### Endpoint Coverage

| **Endpoint** | **Path** | **Limit** | **Limited By** |
|-------------|----------|-----------|----------------|
| Email auth | `/auth/v1/signup`, `/auth/v1/recover` | 2/hour | Sum of requests |
| Anonymous signups | `/auth/v1/signup` | 10/hour | IP Address |
| OTP generation | `/auth/v1/otp` | 60/hour | Sum of requests |
| Token refresh | `/auth/v1/token` | 1800/hour | IP Address |
| Verification | `/auth/v1/verify` | 360/hour | IP Address |
| SMS/Phone | `/auth/v1/otp` (SMS) | 30/hour | Sum of requests |

---

## Security Benefits

### Protection Against Common Attacks

#### 1. Brute Force Authentication
```bash
# Attack scenario: 100 login attempts
POST /auth/sign-in (100 requests)

# Protection:
✅ Middleware: Blocks after 5 attempts in 15 minutes
✅ Supabase: Additional IP-based protection
🛡️ Result: Account remains secure
```

#### 2. Account Enumeration
```bash
# Attack scenario: Testing email addresses
POST /auth/v1/signup (50 different emails)

# Protection:
✅ Middleware: Blocks after 5 attempts in 15 minutes
✅ Supabase: Blocks after 10 anonymous signups per hour
🛡️ Result: User privacy protected
```

#### 3. API Abuse
```bash
# Attack scenario: Overwhelming API endpoints
GET /api/events (1000 requests/minute)

# Protection:
✅ Middleware: Blocks after 60 requests per minute
✅ Infrastructure: Server remains responsive
🛡️ Result: Legitimate users unaffected
```

#### 4. Email Bombing
```bash
# Attack scenario: Spam password resets
POST /auth/v1/recover (100 requests)

# Protection:
✅ Middleware: Blocks after 5 attempts in 15 minutes
✅ Supabase: Limits to 2 emails per hour
🛡️ Result: No email spam
```

### Infrastructure Protection

✅ **Database Connection Limits** - Prevents connection pool exhaustion  
✅ **Server Resource Protection** - Prevents CPU/memory overload  
✅ **Cost Control** - Prevents unexpected hosting bills  
✅ **Third-party Service Protection** - Prevents quota overuse

---

## Monitoring and Troubleshooting

### Middleware Monitoring

**Check application logs for:**
```bash
# Rate limit violations
"Rate limit exceeded for IP: xxx.xxx.xxx.xxx"
"Auth attempt blocked: 5 attempts in 15 minutes"

# Headers in responses
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1699123456789
```

### Supabase Monitoring

**Dashboard Navigation:**
1. Go to Supabase Dashboard
2. Navigate to **Logs** section
3. Filter by **Auth** logs
4. Look for rate limit events

**Example log entry:**
```json
{
  "level": "warn",
  "msg": "rate limit exceeded",
  "endpoint": "/auth/v1/signup",
  "ip": "xxx.xxx.xxx.xxx",
  "limit": "anonymous_users",
  "count": 11
}
```

### Common Issues and Solutions

#### Issue: Legitimate Users Blocked

**Symptoms:**
- Valid users getting 429 errors
- Reports of "too many requests" messages

**Solutions:**
```typescript
// Option 1: Increase limits for specific routes
export const authRateLimiter = new RateLimiter({
  interval: 15 * 60 * 1000,
  uniqueTokenPerInterval: 10, // Increased from 5
})

// Option 2: Whitelist specific IPs
const WHITELISTED_IPS = ['your.office.ip.here']
if (WHITELISTED_IPS.includes(clientIP)) {
  return { success: true, remaining: Infinity }
}
```

#### Issue: High False Positive Rate

**Symptoms:**
- Many legitimate requests blocked
- Users behind corporate firewalls affected

**Solutions:**
```typescript
// Use more granular identification
export function getClientIdentifier(request: Request): string {
  const userAgent = request.headers.get('user-agent')
  const acceptLanguage = request.headers.get('accept-language')
  
  // Combine IP with user fingerprint
  return `${ip}:${hashString(userAgent + acceptLanguage)}`
}
```

#### Issue: Rate Limits Too Restrictive

**Symptoms:**
- Development workflow impacted
- Testing difficulties

**Solutions:**
```typescript
// Environment-based configuration
const isDevelopment = process.env.NODE_ENV === 'development'

export const authRateLimiter = new RateLimiter({
  interval: 15 * 60 * 1000,
  uniqueTokenPerInterval: isDevelopment ? 100 : 5,
})
```

---

## Environment-Specific Configuration

### Development Environment
```typescript
// Relaxed limits for development
export const devAuthRateLimiter = new RateLimiter({
  interval: 15 * 60 * 1000,
  uniqueTokenPerInterval: 100, // Very high for testing
})
```

```json
// Supabase development limits
{
  "rate_limit_anonymous_users": 100,
  "rate_limit_otp": 360,
  "rate_limit_verify": 1000
}
```

### Staging Environment
```typescript
// Production-like but slightly relaxed
export const stagingAuthRateLimiter = new RateLimiter({
  interval: 15 * 60 * 1000,
  uniqueTokenPerInterval: 15, // Higher than production
})
```

### Production Environment
```typescript
// Strict security-focused limits
export const prodAuthRateLimiter = new RateLimiter({
  interval: 15 * 60 * 1000,
  uniqueTokenPerInterval: 5, // Current setting
})
```

---

## Advanced Configuration

### Custom SMTP for Email Rate Limits

**When needed:**
- User testing phases (lots of signups)
- Marketing campaigns with email verification
- Apps with frequent password resets

**Setup with SendGrid:**
```bash
# 1. Sign up at https://sendgrid.com/
# 2. Get API key
# 3. Configure in Supabase Dashboard:

SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: [your-sendgrid-api-key]
```

**After SMTP setup, you can modify email limits:**
```bash
curl -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rate_limit_email_sent": 30
  }'
```

### Redis Integration for Scale

**When needed:**
- Multiple server instances
- High-traffic applications
- Persistent rate limiting across deployments

**Setup with Upstash Redis:**
```bash
# Install Redis client
npm install @upstash/redis

# Environment variables
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

**Implementation:**
```typescript
// Uncomment and configure src/lib/redis-rate-limit.ts
export const redisAuthLimiter = new RedisRateLimiter(
  process.env.UPSTASH_REDIS_REST_URL!,
  process.env.UPSTASH_REDIS_REST_TOKEN!,
  15 * 60 * 1000, // 15 minutes
  5 // 5 attempts
)
```

### CAPTCHA Integration

**Enable CAPTCHA protection:**
```bash
# Install CAPTCHA package
npm install @hcaptcha/react-hcaptcha
```

**In login form (already prepared):**
```typescript
// Uncomment CAPTCHA code in src/components/auth/login-form.tsx
// Configure hCaptcha sitekey in environment variables
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_site_key
```

---

## Performance Considerations

### Memory Usage
```typescript
// Current in-memory storage is suitable for:
- Small to medium applications (< 10k users)
- Single server instances
- Development and staging environments

// For larger scale, consider:
- Redis-based storage
- Database-based rate limiting
- CDN-level rate limiting
```

### Cleanup Strategy
```typescript
// Automatic cleanup runs on every rate limit check
// For high-traffic sites, consider:
setInterval(() => {
  rateLimiter.cleanup()
}, 5 * 60 * 1000) // Every 5 minutes
```

---

## Security Checklist

### ✅ Implementation Checklist

- [x] **Middleware rate limiting implemented**
- [x] **Supabase rate limits configured**
- [x] **IP-based identification working**
- [x] **Proper HTTP error responses (429)**
- [x] **Rate limit headers included**
- [x] **Graceful error handling**
- [x] **Documentation created**

### ✅ Testing Checklist

- [ ] **Test auth rate limiting (5 attempts in 15 min)**
- [ ] **Test API rate limiting (60 requests per min)**
- [ ] **Verify 429 error responses**
- [ ] **Check rate limit headers**
- [ ] **Test from different IPs**
- [ ] **Verify Supabase limits work**
- [ ] **Test legitimate user experience**

### ✅ Production Checklist

- [ ] **Monitor rate limit violations**
- [ ] **Set up alerting for suspicious activity**
- [ ] **Review limits after traffic analysis**
- [ ] **Consider CAPTCHA implementation**
- [ ] **Plan Redis migration if needed**
- [ ] **Document incident response procedures**

---

## Maintenance

### Regular Tasks

**Monthly:**
- Review rate limit violation logs
- Analyze blocked IP patterns
- Adjust limits based on legitimate usage

**Quarterly:**
- Security review of rate limiting effectiveness
- Performance analysis of middleware impact
- Consider scaling improvements

**Annually:**
- Full security audit including rate limiting
- Update to latest best practices
- Review and update documentation

### Version History

| **Date** | **Version** | **Changes** |
|----------|-------------|-------------|
| Nov 2024 | 1.0 | Initial implementation |
| Nov 2024 | 1.1 | Supabase configuration added |
| Nov 2024 | 1.2 | Documentation created |

---

## Additional Resources

### External Links
- [Supabase Rate Limiting Documentation](https://supabase.com/docs/guides/auth/rate-limits)
- [OWASP Rate Limiting Guide](https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)

### Internal Files
- `src/lib/rate-limit.ts` - Core rate limiting implementation
- `middleware.ts` - Route-based rate limiting logic
- `src/lib/auth.ts` - Authentication utilities and route helpers
- `src/components/auth/login-form.tsx` - Frontend auth component with CAPTCHA support

---

*Last updated: November 2024* 