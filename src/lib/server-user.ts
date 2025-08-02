import { headers } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'

/**
 * Get authenticated user ID from middleware headers.
 * Falls back to Supabase call if header is not available.
 * 
 * This utility reads the user ID that was set by middleware,
 * avoiding redundant auth calls in server components.
 */
export async function getAuthenticatedUserId(): Promise<string> {
  const headersList = await headers()
  const userIdFromMiddleware = headersList.get('x-user-id')
  
  if (userIdFromMiddleware) {
    return userIdFromMiddleware
  }
  
  // Fallback to Supabase call if header is not available
  // This ensures compatibility during rollout and error cases
  console.warn('User ID header not found, falling back to Supabase call')
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error('User not authenticated')
  }
  
  return user.id
}

/**
 * Get full authenticated user object from middleware headers.
 * Falls back to Supabase call if header is not available.
 */
export async function getAuthenticatedUser(): Promise<{ id: string; email: string }> {
  const headersList = await headers()
  const userDataFromMiddleware = headersList.get('x-user-data')
  
  if (userDataFromMiddleware) {
    try {
      return JSON.parse(userDataFromMiddleware)
    } catch (error) {
      console.warn('Failed to parse user data from header, falling back to Supabase call:', error)
    }
  }
  
  // Fallback to Supabase call if header is not available
  console.warn('User data header not found, falling back to Supabase call')
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error('User not authenticated')
  }
  
  return {
    id: user.id,
    email: user.email || ''
  }
}