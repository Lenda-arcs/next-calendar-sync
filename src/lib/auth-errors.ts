export interface AuthError {
  code: string
  message: string
  userMessage: string
}

interface ErrorWithCode {
  code?: string
  message?: string
  name?: string
}

export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'invalid_login_credentials',
  EMAIL_NOT_CONFIRMED: 'email_not_confirmed',
  TOO_MANY_REQUESTS: 'too_many_requests',
  WEAK_PASSWORD: 'weak_password',
  USER_ALREADY_REGISTERED: 'user_already_registered',
  NETWORK_ERROR: 'network_error',
} as const

function isErrorWithCode(error: unknown): error is ErrorWithCode {
  return typeof error === 'object' && error !== null
}

export function getAuthErrorMessage(error: unknown): string {
  if (!isErrorWithCode(error)) {
    return 'An unexpected error occurred. Please try again.'
  }

  const errorCode = error.code || error.message || 'unknown_error'
  
  switch (errorCode) {
    case AUTH_ERROR_CODES.INVALID_CREDENTIALS:
      return 'Invalid email or password. Please check your credentials.'
    case AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED:
      return 'Please check your email and click the confirmation link.'
    case AUTH_ERROR_CODES.TOO_MANY_REQUESTS:
      return 'Too many login attempts. Please wait a moment and try again.'
    case AUTH_ERROR_CODES.WEAK_PASSWORD:
      return 'Password is too weak. Please use at least 8 characters with letters and numbers.'
    case AUTH_ERROR_CODES.USER_ALREADY_REGISTERED:
      return 'An account with this email already exists.'
    case 'AuthApiError':
      return error.message || 'Authentication failed. Please try again.'
    default:
      return 'An unexpected error occurred. Please try again.'
  }
}

export function isAuthError(error: unknown): boolean {
  if (!isErrorWithCode(error)) return false
  
  return error.name === 'AuthApiError' || 
         (error.code?.startsWith('auth_') ?? false) ||
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         Object.values(AUTH_ERROR_CODES).includes(error.code as any)
} 