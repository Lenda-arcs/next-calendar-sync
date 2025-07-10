import { createSupabaseAdminClient } from "../_shared/supabaseClient.ts";

interface CalendarEvent {
  title: string;
  location: string;
  description: string;
  start_time: string;
  end_time: string;
}

interface SyncFilterRule {
  pattern_type: 'title' | 'location' | 'description';
  pattern_value: string;
  match_type: 'contains' | 'exact' | 'starts_with' | 'ends_with' | 'regex';
  is_active: boolean;
}

/**
 * Checks if an event matches the sync filter rules
 */
function eventMatchesFilterRules(
  event: CalendarEvent,
  filterRules: SyncFilterRule[]
): boolean {
  if (!filterRules.length) return true; // No rules = sync all
  
  // Event must match at least one rule
  return filterRules.some(rule => {
    if (!rule.is_active) return false;
    
    let content = '';
    switch (rule.pattern_type) {
      case 'title':
        content = event.title || '';
        break;
      case 'location':
        content = event.location || '';
        break;
      case 'description':
        content = event.description || '';
        break;
    }
    
    const lowerContent = content.toLowerCase();
    const lowerPattern = rule.pattern_value.toLowerCase();
    
    switch (rule.match_type) {
      case 'contains':
        return lowerContent.includes(lowerPattern);
      case 'exact':
        return lowerContent === lowerPattern;
      case 'starts_with':
        return lowerContent.startsWith(lowerPattern);
      case 'ends_with':
        return lowerContent.endsWith(lowerPattern);
      case 'regex':
        try {
          const regex = new RegExp(rule.pattern_value, 'i');
          return regex.test(content);
        } catch {
          console.warn('Invalid regex pattern:', rule.pattern_value);
          return false;
        }
      default:
        return false;
    }
  });
}

/**
 * Applies filter rules to events based on calendar feed's sync approach and filtering settings
 */
export async function applyFilterRules(
  userId: string,
  feedId: string,
  events: Record<string, unknown>[]
): Promise<Record<string, unknown>[]> {
  const supabase = createSupabaseAdminClient();
  
  // Get calendar feed's sync approach and filtering settings
  const { data: feed } = await supabase
    .from('calendar_feeds')
    .select('sync_approach, filtering_enabled')
    .eq('id', feedId)
    .single();
  
  const syncApproach = feed?.sync_approach || 'yoga_only';
  const filteringEnabled = feed?.filtering_enabled || false;
  
  // If yoga_only approach, always sync all events (no filtering)
  if (syncApproach === 'yoga_only') {
    return events;
  }
  
  // If mixed_calendar approach, check if filtering is enabled
  if (syncApproach === 'mixed_calendar') {
    // If filtering is explicitly disabled for this mixed calendar, sync all events
    if (!filteringEnabled) {
      console.log(`Mixed calendar feed ${feedId} has filtering disabled, syncing all events`);
      return events;
    }
    
    // Apply filtering rules
    const { data: filterRules } = await supabase
      .from('sync_filter_rules')
      .select('pattern_type, pattern_value, match_type, is_active')
      .eq('user_id', userId)
      .eq('calendar_feed_id', feedId)
      .eq('is_active', true);
    
    if (!filterRules || filterRules.length === 0) {
      // No filter rules defined, sync nothing to be safe
      console.log(`No filter rules found for mixed calendar feed ${feedId}, syncing no events`);
      return [];
    }
    
    // Apply filter rules to each event
    const filteredEvents = events.filter(event => {
      const calendarEvent: CalendarEvent = {
        title: String(event.title || ''),
        location: String(event.location || ''),
        description: String(event.description || ''),
        start_time: String(event.start_time || ''),
        end_time: String(event.end_time || '')
      };
      
      return eventMatchesFilterRules(calendarEvent, filterRules as SyncFilterRule[]);
    });
    
    console.log(`Filtered ${events.length} events to ${filteredEvents.length} events for feed ${feedId}`);
    return filteredEvents;
  }
  
  // Default: sync all events
  return events;
} 