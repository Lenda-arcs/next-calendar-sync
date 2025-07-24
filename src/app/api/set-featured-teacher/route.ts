import { NextResponse } from 'next/server'
import { setFeaturedTeacher } from '@/lib/server/featured-teacher-service'
import { createServerClient } from '@/lib/supabase-server'

// Direct database method as fallback
async function setFeaturedTeacherDirect(): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createServerClient()
    
    // Clear all existing featured flags
    const { error: clearError } = await supabase
      .from('users')
      .update({ is_featured: false })
      .not('id', 'is', null)

    if (clearError) {
      console.error('Error clearing featured flags:', clearError)
      return { success: false, message: `Failed to clear featured flags: ${clearError.message}` }
    }

    // Get users with public profiles
    const { data: candidateUsers, error: usersError } = await supabase
      .from('users')
      .select('id, name, public_url, email')
      .not('public_url', 'is', null)
      .not('name', 'is', null)

    if (usersError) {
      console.error('Error fetching candidate users:', usersError)
      return { success: false, message: `Failed to fetch users: ${usersError.message}` }
    }

    if (!candidateUsers || candidateUsers.length === 0) {
      return { success: false, message: 'No candidate users found with public profiles' }
    }

    // Check each user for sufficient upcoming public events
    const eligibleUsers = []
    const now = new Date().toISOString()
    
    for (const user of candidateUsers) {
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id')
        .eq('user_id', user.id)
        .eq('visibility', 'public')
        .gte('start_time', now)

      if (eventsError) {
        console.error(`Error fetching events for user ${user.id}:`, eventsError)
        continue
      }

      if (events && events.length >= 3) {
        eligibleUsers.push(user)
      }
    }

    if (eligibleUsers.length === 0) {
      return { success: false, message: 'No eligible users found with sufficient upcoming events' }
    }

    // Randomly select one eligible user
    const randomIndex = Math.floor(Math.random() * eligibleUsers.length)
    const featuredUser = eligibleUsers[randomIndex]

    // Set them as featured
    const { error: updateError } = await supabase
      .from('users')
      .update({ is_featured: true })
      .eq('id', featuredUser.id)

    if (updateError) {
      console.error('Error setting featured user:', updateError)
      return { success: false, message: `Failed to set featured user: ${updateError.message}` }
    }

    return { 
      success: true, 
      message: `Successfully set ${featuredUser.name} as featured teacher (${eligibleUsers.length} eligible users)`
    }
  } catch (error) {
    console.error('Error in setFeaturedTeacherDirect:', error)
    return { success: false, message: `Unexpected error: ${error}` }
  }
}

export async function POST() {
  try {
    // Try Edge Function first
    const edgeFunctionResult = await setFeaturedTeacher()
    
    if (edgeFunctionResult.success) {
      return NextResponse.json(
        { 
          success: true, 
          message: edgeFunctionResult.message,
          method: 'edge_function',
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      )
    }

    // Fall back to direct database method
    const directResult = await setFeaturedTeacherDirect()
    
    if (directResult.success) {
      return NextResponse.json(
        { 
          success: true, 
          message: directResult.message,
          method: 'direct_database',
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      )
    }

    // Both methods failed
    return NextResponse.json(
      { 
        success: false,
        error: 'Both Edge Function and direct database methods failed',
        edge_function_error: edgeFunctionResult.message,
        direct_method_error: directResult.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error in set-featured-teacher API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return POST()
} 