import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // First, clear all existing featured flags
    const { error: clearError } = await supabase
      .from('users')
      .update({ is_featured: false })
      .neq('is_featured', null)

    if (clearError) {
      console.error('Error clearing featured flags:', clearError)
      throw clearError
    }

    // Get all users with public profiles and at least 3 upcoming public events
    const now = new Date().toISOString()
    
    // First get users with public URLs (indicating they have set up their profile)
    const { data: candidateUsers, error: usersError } = await supabase
      .from('users')
      .select('id, name, public_url, email')
      .not('public_url', 'is', null)
      .not('name', 'is', null)

    if (usersError) {
      console.error('Error fetching candidate users:', usersError)
      throw usersError
    }

    if (!candidateUsers || candidateUsers.length === 0) {
      console.log('No candidate users found with public profiles')
      return new Response(
        JSON.stringify({ message: 'No candidate users found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // For each candidate user, check if they have at least 3 upcoming public events
    const eligibleUsers = []
    
    for (const user of candidateUsers) {
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id')
        .eq('user_id', user.id)
        .eq('visibility', 'public')
        .gte('start_time', now)
        .order('start_time', { ascending: true })

      if (eventsError) {
        console.error(`Error fetching events for user ${user.id}:`, eventsError)
        continue
      }

      if (events && events.length >= 3) {
        eligibleUsers.push(user)
      }
    }

    if (eligibleUsers.length === 0) {
      console.log('No eligible users found with 3+ upcoming events')
      return new Response(
        JSON.stringify({ message: 'No eligible users found with sufficient upcoming events' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
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
      throw updateError
    }

    console.log(`Successfully set user ${featuredUser.name} (${featuredUser.email}) as featured`)

    return new Response(
      JSON.stringify({ 
        success: true,
        featured_user: {
          id: featuredUser.id,
          name: featuredUser.name,
          public_url: featuredUser.public_url
        },
        eligible_count: eligibleUsers.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in set-featured-teacher:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
}) 