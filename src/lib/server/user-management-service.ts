import { createServerClient } from '@/lib/supabase-server'

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
 * Get all users for admin management
 */
export async function getAllUsers(): Promise<GetUsersResult> {
  try {
    const supabase = await createServerClient()
    
    // Get users from main users table
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        name,
        role,
        created_at,
        calendar_feed_count,
        is_featured,
        public_url
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching users:', error)
      return {
        success: false,
        error: 'Failed to fetch users'
      }
    }
    
    // Get additional auth data if needed
    const usersWithAuthData = users?.map(user => ({
      ...user,
      role: user.role || 'user'
    })) || []
    
    return {
      success: true,
      users: usersWithAuthData as UserData[]
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
      // Call the custom SQL function (type assertion needed since it's not in generated types)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: sqlResult, error: sqlError } = await (supabase as any)
        .rpc('delete_user_cascade', { target_user_id: userId })
      
      if (sqlError) {
        console.error('Error calling delete_user_cascade function:', sqlError)
        return {
          success: false,
          error: `Database function error: ${sqlError.message}`
        }
      }
      
      // Type the result properly
      const result = sqlResult as {
        success: boolean
        error?: string
        message?: string
        user_id: string
        user_email: string
        user_name: string
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