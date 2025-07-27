import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { getAllUsers } from '@/lib/server/user-management-service'

/**
 * GET /api/admin/users - Get all users (admin only)
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
    
    const result = await getAllUsers()
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      users: result.users
    })
    
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 