// validation.ts
// Request validation and webhook detection utilities

export function isValidWebhookRequest(req: Request): boolean {
  const userAgent = req.headers.get('user-agent') || ''
  
  // Check for known webhook user agents
  const webhookIndicators = [
    'Sendlib',
    'SendGrid',
    'Mailgun',
    'Postmark'
  ]
  
  return webhookIndicators.some(indicator => userAgent.includes(indicator))
}

export function requiresAuthentication(req: Request): boolean {
  return !isValidWebhookRequest(req)
}

export function validateInvitationEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }
  
  const lowerEmail = email.toLowerCase()
  
  // Must contain 'user-' prefix to be a valid invitation email
  if (!lowerEmail.includes('user-')) {
    return false
  }
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(lowerEmail)) {
    return false
  }
  
  return true
}

export function validatePayload(payload: unknown): { isValid: boolean; error?: string } {
  if (!payload || typeof payload !== 'object') {
    return { isValid: false, error: 'No payload provided' }
  }
  
  const p = payload as Record<string, unknown>
  
  if (!p.to || typeof p.to !== 'string') {
    return { isValid: false, error: 'Missing "to" field' }
  }
  
  if (!p.from || typeof p.from !== 'string') {
    return { isValid: false, error: 'Missing "from" field' }
  }
  
  if (!p.subject || typeof p.subject !== 'string') {
    return { isValid: false, error: 'Missing "subject" field' }
  }
  
  if (!validateInvitationEmail(p.to)) {
    return { isValid: false, error: 'Invalid invitation email format' }
  }
  
  return { isValid: true }
} 