import { createServerClient } from '@/lib/supabase-server'
import { PublicEvent } from '@/lib/types'

export interface FeaturedTeacherData {
  teacher: {
    id: string
    name: string
    bio: string | null
    profile_image_url: string | null
    public_url: string
    yoga_styles: string[] | null
    instagram_url: string | null
    website_url: string | null
  }
  events: PublicEvent[]
}

export async function getFeaturedTeacher(): Promise<FeaturedTeacherData | null> {
  try {
    const supabase = await createServerClient()
    
    // Get the featured teacher from public_profiles view
    const { data: featuredUser, error: userError } = await supabase
      .from('public_profiles')
      .select('id, name, bio, profile_image_url, public_url, yoga_styles, instagram_url, website_url')
      .eq('is_featured', true)
      .single()

    if (userError || !featuredUser || !featuredUser.id || !featuredUser.name || !featuredUser.public_url) {
      return null
    }

    // Get their upcoming public events
    const now = new Date().toISOString()
    const { data: events, error: eventsError } = await supabase
      .from('public_events')
      .select('*')
      .eq('user_id', featuredUser.id as string)
      .gte('start_time', now)
      .order('start_time', { ascending: true })
      .limit(10)

    if (eventsError) {
      console.error('Error fetching featured teacher events:', eventsError)
      return null
    }

    // Only return if teacher has at least 3 upcoming events
    if (!events || events.length < 3) {
      return null
    }

    return {
      teacher: {
        id: featuredUser.id as string,
        name: featuredUser.name as string, // Safe due to null check above
        bio: featuredUser.bio,
        profile_image_url: featuredUser.profile_image_url,
        public_url: featuredUser.public_url as string, // Safe due to null check above
        yoga_styles: featuredUser.yoga_styles,
        instagram_url: featuredUser.instagram_url,
        website_url: featuredUser.website_url,
      },
      events: events.slice(0, 3) // Show max 3 events on landing page
    }
  } catch (error) {
    console.error('Error in getFeaturedTeacher:', error)
    return null
  }
}

// Helper function to call the Edge Function for setting featured teacher
export async function setFeaturedTeacher(): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl) {
      return { success: false, message: 'Supabase URL not configured' }
    }

    if (!serviceKey) {
      return { success: false, message: 'Supabase Service Role Key not configured' }
    }

    const functionUrl = `${supabaseUrl}/functions/v1/set-featured-teacher`

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceKey}`,
      },
    })

    const result = await response.json()
    
    if (!response.ok) {
      return { 
        success: false, 
        message: `Edge Function error (${response.status}): ${result.error || response.statusText}` 
      }
    }

    return { success: true, message: 'Featured teacher set successfully' }
  } catch (error) {
    console.error('Error calling set-featured-teacher function:', error)
    return { success: false, message: `Failed to call featured teacher function: ${error}` }
  }
} 