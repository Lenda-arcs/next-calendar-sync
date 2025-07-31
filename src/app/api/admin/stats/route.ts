import { NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase-server'

interface AdminStats {
  totalUsers: number
  totalInvitations: number
  pendingInvitations: number
  totalStudios: number
}

/**
 * GET /api/admin/stats - Get admin dashboard statistics
 */
export async function GET() {
  try {
    const supabase = await createServerClient()
    
    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check if user is admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
    
    console.log('🔍 Fetching admin stats...')
    
    // Use admin client to get users from Supabase Auth
    const adminClient = createAdminClient()
    const [
      authUsersResult,
      { count: totalStudios }
    ] = await Promise.all([
      adminClient.auth.admin.listUsers(),
      supabase.from('studios').select('*', { count: 'exact', head: true })
    ])

    if (authUsersResult.error) {
      console.error('❌ Error fetching users from Supabase Auth:', authUsersResult.error)
      return NextResponse.json({ 
        error: `Failed to fetch users: ${authUsersResult.error.message}` 
      }, { status: 500 })
    }

    const users = authUsersResult.data.users || []
    
    // Calculate stats from Supabase Auth users
    const confirmedUsers = users.filter(user => user.email_confirmed_at)
    const pendingInvitations = users.filter(user => !user.email_confirmed_at && user.invited_at)
    
    const stats: AdminStats = {
      totalUsers: confirmedUsers.length,
      totalInvitations: users.length, // Total includes both confirmed and pending
      pendingInvitations: pendingInvitations.length,
      totalStudios: totalStudios || 0
    }
    
    console.log('✅ Admin stats:', stats)
    
    return NextResponse.json({
      success: true,
      stats
    })
    
  } catch (error) {
    console.error('❌ Error in GET /api/admin/stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}