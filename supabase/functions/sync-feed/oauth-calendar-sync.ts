import { createSupabaseAdminClient } from "../_shared/supabaseClient.ts";
import { matchTags, matchStudioId } from "../_shared/matching.ts";
import { extractStudentCounts } from "./enrichInstance.ts";
import { ensureUTCString } from "./helpers.ts";

interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  start?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
  status?: string;
  created?: string;
  updated?: string;
  recurrence?: string[];
  recurringEventId?: string;
}

interface GoogleCalendarListResponse {
  items: GoogleCalendarEvent[];
  nextPageToken?: string;
}

export interface OAuthCalendarSyncOptions {
  feedId: string;
  calendarId: string;
  userId: string;
  isHistorical?: boolean;
  windowDays?: number;
}

export async function syncOAuthCalendar(options: OAuthCalendarSyncOptions) {
  const { feedId, calendarId, userId, isHistorical = false, windowDays = 90 } = options;
  
  const supabase = createSupabaseAdminClient();
  
  // Get OAuth integration for this user
  const { data: oauthIntegration, error: oauthError } = await supabase
    .from('oauth_calendar_integrations')
    .select('*')
    .eq('user_id', userId)
    .eq('provider', 'google')
    .single();
    
  if (oauthError || !oauthIntegration) {
    throw new Error(`OAuth integration not found for user ${userId}`);
  }
  
  // Check if token needs refresh
  const now = new Date();
  const expiresAt = new Date(oauthIntegration.expires_at || 0);
  let accessToken = oauthIntegration.access_token;
  
  if (expiresAt <= now && oauthIntegration.refresh_token) {
    // Refresh the token
    const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: oauthIntegration.refresh_token,
        grant_type: 'refresh_token',
      }),
    });
    
    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      accessToken = refreshData.access_token;
      
      // Update the stored token
      await supabase
        .from('oauth_calendar_integrations')
        .update({
          access_token: refreshData.access_token,
          expires_at: new Date(Date.now() + refreshData.expires_in * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', oauthIntegration.id);
    }
  }
  
  // Get user's tag rules and studios for matching
  const [tagsResult, rulesResult, studiosResult] = await Promise.all([
    supabase.from("tags").select("id, slug"),
    supabase.from("tag_rules").select("keyword, keywords, location_keywords, tag_id").eq("user_id", userId),
    supabase.from("billing_entities").select("id, location_match").eq("user_id", userId).eq("entity_type", "studio")
  ]);
  
  const tagMap = Object.fromEntries((tagsResult.data || []).map((t) => [t.id, t.slug]));
  const rules = rulesResult.data || [];
  const studios = studiosResult.data || [];
  
  // Calculate date range for events
  const nowUTC = new Date();
  const daysToSync = windowDays;
  const timeMin = isHistorical ? 
    new Date(nowUTC.getTime() - daysToSync * 24 * 60 * 60 * 1000) : 
    nowUTC;
  const timeMax = isHistorical ? 
    nowUTC : 
    new Date(nowUTC.getTime() + daysToSync * 24 * 60 * 60 * 1000);
  
  // Fetch events from Google Calendar API
  const eventsUrl = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`);
  eventsUrl.searchParams.set('timeMin', timeMin.toISOString());
  eventsUrl.searchParams.set('timeMax', timeMax.toISOString());
  eventsUrl.searchParams.set('singleEvents', 'true');
  eventsUrl.searchParams.set('orderBy', 'startTime');
  eventsUrl.searchParams.set('maxResults', '2500');
  
  const eventsResponse = await fetch(eventsUrl.toString(), {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (!eventsResponse.ok) {
    const errorText = await eventsResponse.text();
    throw new Error(`Failed to fetch calendar events: ${errorText}`);
  }
  
  const eventsData: GoogleCalendarListResponse = await eventsResponse.json();
  
  // Convert Google Calendar events to our format
  const enrichedEvents: Array<{
    uid: string;
    recurrence_id: string;
    title: string;
    start_time: string;
    end_time: string;
    location: string;
    description: string;
    feed_id: string;
    user_id: string;
    updated_at: string;
    visibility: string;
    image_url: string | null;
    custom_tags: string[];
    tags: string[];
    status: string;
    studio_id: string | null;
    students_studio: number | null;
    students_online: number | null;
  }> = [];
  
  for (const event of eventsData.items || []) {
    if (!event.start?.dateTime && !event.start?.date) continue;
    if (!event.end?.dateTime && !event.end?.date) continue;
    
    const summary = event.summary || "";
    const description = event.description || "";
    const location = event.location || "";
    const content = `${summary} ${description}`.toLowerCase();
    
    // Match tags and studio based on content and location
    const eventTags = matchTags(content, location, rules, tagMap);
    const studioId = matchStudioId(location, studios);
    
    // Extract student counts from description
    const { studentsStudio, studentsOnline } = extractStudentCounts(description, isHistorical);
    
    // Convert start and end times to UTC
    const startTime = event.start.dateTime || event.start.date!;
    const endTime = event.end.dateTime || event.end.date!;
    
    // Create recurrence ID based on event ID and start time
    const recurrenceId = event.recurringEventId ? 
      `${event.recurringEventId}-${startTime}` : 
      `${event.id}-${startTime}`;
    
    enrichedEvents.push({
      uid: event.id,
      recurrence_id: recurrenceId,
      title: summary,
      start_time: ensureUTCString(startTime),
      end_time: ensureUTCString(endTime),
      location: location,
      description: description,
      feed_id: feedId,
      user_id: userId,
      updated_at: new Date().toISOString(),
      visibility: "public",
      image_url: null,
      custom_tags: [],
      tags: eventTags || [],
      status: event.status?.toUpperCase() || "CONFIRMED",
      studio_id: studioId,
      students_studio: studentsStudio,
      students_online: studentsOnline
    });
  }
  
  return enrichedEvents;
} 