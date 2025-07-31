import { createServerClient, createAdminClient } from '@/lib/supabase-server'

export interface UserData {
  id: string
  email: string | null
  name: string | null
  role: string
  created_at: string | null
  calendar_feed_count: number
  is_featured: boolean | null
  public_url: string | null
  last_sign_in_at?: string | null
  // New fields from Supabase Auth
  invited_at?: string | null
  email_confirmed_at?: string | null
  user_metadata?: Record<string, unknown>
}

export interface DeleteUserResult {
  success: boolean
  message?: string
  error?: string
}

export interface GetUsersResult {
  success: boolean
  users?: UserData[]
  error?: string
}

/**
 * Get all users for admin management - from Supabase Auth + app data
 */
export async function getAllUsers(): Promise<GetUsersResult> {
  try {
    console.log('🔍 Getting all users from Supabase Auth + app data...')
    
    // Use admin client to get users from Supabase Auth
    const adminClient = createAdminClient()
    const { data: authUsers, error: authError } = await adminClient.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Error fetching users from Supabase Auth:', authError)
      return {
        success: false,
        error: `Failed to fetch users from Supabase Auth: ${authError.message}`
      }
    }
    
    console.log(`✅ Found ${authUsers.users?.length || 0} users from Supabase Auth`)
    
    // Get app data for users (if they have confirmed their email and created a profile)
    const supabase = await createServerClient()
    const { data: appUsers, error: appError } = await supabase
      .from('users')
      .select(`
        id,
        name,
        role,
        calendar_feed_count,
        is_featured,
        public_url
      `)
    
    if (appError) {
      console.warn('⚠️ Error fetching app user data:', appError)
    }
    
    // Create a map of app user data by ID
    const appUserMap = new Map(appUsers?.map(user => [user.id, user]) || [])
    
    // Combine Supabase Auth data with app data
    const users: UserData[] = (authUsers.users || []).map(authUser => {
      const appUser = appUserMap.get(authUser.id)
      
      return {
        id: authUser.id,
        email: authUser.email || null,
        name: appUser?.name || authUser.user_metadata?.full_name as string || null,
        role: appUser?.role || authUser.user_metadata?.role as string || 'teacher',
        created_at: authUser.created_at,
        calendar_feed_count: appUser?.calendar_feed_count || 0,
        is_featured: appUser?.is_featured || false,
        public_url: appUser?.public_url || null,
        last_sign_in_at: authUser.last_sign_in_at,
        // Supabase Auth specific fields
        invited_at: authUser.invited_at,
        email_confirmed_at: authUser.email_confirmed_at,
        user_metadata: authUser.user_metadata || {}
      }
    }).sort((a, b) => {
      // Sort by created_at descending
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    })
    
    console.log(`✅ Successfully combined ${users.length} users with app data`)
    
    return {
      success: true,
      users: users
    }
  } catch (error) {
    console.error('Error in getAllUsers:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}

/**
 * Delete a user and all their associated data
 */
export async function deleteUser(userId: string): Promise<DeleteUserResult> {
  try {
    const supabase = await createServerClient()
    
    // First, get user details for logging
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, name, role')
      .eq('id', userId)
      .single()
    
    if (userError || !userData) {
      return {
        success: false,
        error: 'User not found'
      }
    }
    
    // Prevent deletion of other admins (safety check)
    if (userData.role === 'admin') {
      return {
        success: false,
        error: 'Cannot delete admin users for security reasons'
      }
    }
    
    console.log(`Starting deletion of user: ${userData.name} (${userData.email}) - ID: ${userId}`)
    
    // Use the SQL function for reliable database deletion
    try {
      // Call the delete_user_cascade function (properly typed)
      const { data: sqlResult, error: sqlError } = await supabase
        .rpc('delete_user_cascade', { target_user_id: userId })
      
      if (sqlError) {
        console.error('Error calling delete_user_cascade function:', sqlError)
        return {
          success: false,
          error: `Database function error: ${sqlError.message}`
        }
      }
      
      // Type the result based on the actual SQL function return type
      const result = sqlResult as {
        success: boolean
        error?: string
        message?: string
        user_id: string
        user_email?: string
        user_name?: string
        note?: string
      }
      
      if (!result || !result.success) {
        console.error('SQL function returned error:', result)
        return {
          success: false,
          error: result?.error || 'Unknown database deletion error'
        }
      }
      
      console.log('Database deletion successful:', result.message)
      
      // 10. Delete from auth.users using the admin API with service role key
      // Note: This requires service role key, not the regular client
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        
        if (!serviceRoleKey || !supabaseUrl) {
          console.error('Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL for auth deletion')
          console.warn('Auth user deletion skipped due to missing credentials')
        } else {
          // Create admin client with service role key
          const adminClient = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          })
          
          const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(userId)
          
          if (authDeleteError) {
            console.error('Error deleting auth user:', authDeleteError)
            console.warn('Auth user deletion failed, but profile was deleted successfully')
          } else {
            console.log('Successfully deleted auth user')
          }
        }
      } catch (authError) {
        console.error('Error during auth user deletion:', authError)
        console.warn('Auth user deletion failed, but profile was deleted successfully')
      }
      
      console.log(`Successfully deleted user: ${userData.name} (${userData.email})`)
      
      return {
        success: true,
        message: `User ${userData.name || userData.email} has been completely removed`
      }
      
    } catch (deleteError) {
      console.error('Error during user deletion:', deleteError)
      
      return {
        success: false,
        error: `Failed to delete user data. Error: ${String(deleteError)}`
      }
    }
    
  } catch (error) {
    console.error('Error in deleteUser:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}

// Note: Alternative SQL-based deletion is available via the delete_user_cascade.sql script
// This can be run manually for complex cases or if the API deletion fails 