import { createClient } from '@/lib/supabase';

export type SyncApproach = 'yoga_only' | 'mixed_calendar';

// Temporary interface for calendar feeds with sync_approach until migration is complete
interface CalendarFeedWithSyncApproach {
  id: string;
  name: string;
  sync_approach: SyncApproach;
  filtering_enabled: boolean;
}

export interface SyncFilterRule {
  id: string;
  user_id: string;
  calendar_feed_id: string;
  pattern_type: 'title' | 'location' | 'description';
  pattern_value: string;
  match_type: 'contains' | 'exact' | 'starts_with' | 'ends_with' | 'regex';
  is_active: boolean;
}

export interface CalendarPatternAnalysis {
  titles: string[];
  locations: string[];
  descriptions: string[];
  suggestedRules: SyncFilterRule[];
}

export interface CalendarEvent {
  title: string;
  location: string;
  description: string;
  start_time: string;
  end_time: string;
}

/**
 * Analyzes a calendar feed to extract patterns for yoga-related content
 */
export async function analyzeCalendarPatterns(
  events: CalendarEvent[]
): Promise<CalendarPatternAnalysis> {
  const titles = new Set<string>();
  const locations = new Set<string>();
  const descriptions = new Set<string>();
  
  // Extract unique values
  events.forEach(event => {
    if (event.title) titles.add(event.title.trim());
    if (event.location) locations.add(event.location.trim());
    if (event.description) descriptions.add(event.description.trim());
  });
  
  // Yoga-related keywords for pattern suggestions
  const yogaKeywords = [
    'yoga', 'vinyasa', 'hatha', 'bikram', 'hot yoga', 'yin yoga', 'restorative',
    'meditation', 'mindfulness', 'breathwork', 'pranayama', 'asana',
    'sun salutation', 'warrior', 'downward dog', 'child&apos;s pose',
    'namaste', 'om', 'chakra', 'kundalini', 'ashtanga', 'flow'
  ];
  
  const suggestedRules: SyncFilterRule[] = [];
  
  // Analyze titles for yoga patterns
  titles.forEach(title => {
    const lowerTitle = title.toLowerCase();
    const hasYogaKeyword = yogaKeywords.some(keyword => lowerTitle.includes(keyword));
    
    if (hasYogaKeyword) {
      suggestedRules.push({
        id: '', // Will be set by database
        user_id: '', // Will be set by caller
        calendar_feed_id: '', // Will be set by caller
        pattern_type: 'title',
        pattern_value: title,
        match_type: 'contains',
        is_active: true
      });
    }
  });
  
  // Analyze locations for yoga studios/spaces
  locations.forEach(location => {
    const lowerLocation = location.toLowerCase();
    const isYogaLocation = yogaKeywords.some(keyword => lowerLocation.includes(keyword)) ||
                          lowerLocation.includes('studio') ||
                          lowerLocation.includes('center') ||
                          lowerLocation.includes('retreat');
    
    if (isYogaLocation) {
      suggestedRules.push({
        id: '', // Will be set by database
        user_id: '', // Will be set by caller
        calendar_feed_id: '', // Will be set by caller
        pattern_type: 'location',
        pattern_value: location,
        match_type: 'contains',
        is_active: true
      });
    }
  });
  
  return {
    titles: Array.from(titles),
    locations: Array.from(locations),
    descriptions: Array.from(descriptions),
    suggestedRules
  };
}

/**
 * Checks if an event matches the user's sync filter rules
 */
export function eventMatchesFilterRules(
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
 * Gets the sync approach for a specific calendar feed
 */
export async function getCalendarFeedSyncApproach(calendarFeedId: string): Promise<SyncApproach> {
  const supabase = createClient();
  
  const { data: feed } = await supabase
    .from('calendar_feeds')
    .select('sync_approach')
    .eq('id', calendarFeedId)
    .single();
  
  return ((feed as { sync_approach?: SyncApproach })?.sync_approach as SyncApproach) || 'yoga_only';
}

/**
 * Updates the sync approach for a specific calendar feed
 * This automatically adjusts filtering_enabled based on the sync approach:
 * - yoga_only: filtering_enabled = false
 * - mixed_calendar: filtering_enabled = true (unless explicitly disabled)
 */
export async function updateCalendarFeedSyncApproach(
  calendarFeedId: string, 
  syncApproach: SyncApproach
): Promise<void> {
  const supabase = createClient();
  
  // Use any to handle the transition period until migration is complete
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('calendar_feeds')
    .update({ 
      sync_approach: syncApproach,
      // Automatically set filtering_enabled based on sync_approach
      // Database trigger will handle this, but we set it here for immediate consistency
      filtering_enabled: syncApproach === 'mixed_calendar'
    })
    .eq('id', calendarFeedId);
}

/**
 * Gets all calendar feeds for a user with their sync approaches
 */
export async function getUserCalendarFeeds(userId: string): Promise<CalendarFeedWithSyncApproach[]> {
  const supabase = createClient();
  
  // Use any to handle the transition period until migration is complete
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: feeds } = await (supabase as any)
    .from('calendar_feeds')
    .select('id, calendar_name as name, sync_approach, filtering_enabled')
    .eq('user_id', userId);
  
  return (feeds || []) as CalendarFeedWithSyncApproach[];
}

/**
 * @deprecated Use getCalendarFeedSyncApproach instead
 * Gets the user's sync approach setting (legacy function for backwards compatibility)
 */
export async function getUserSyncApproach(userId: string): Promise<SyncApproach> {
  console.warn('getUserSyncApproach is deprecated. Use getCalendarFeedSyncApproach instead.');
  
  // For backwards compatibility, return the sync approach of the first calendar feed
  const feeds = await getUserCalendarFeeds(userId);
  return feeds.length > 0 ? feeds[0].sync_approach : 'yoga_only';
}

/**
 * @deprecated Use updateCalendarFeedSyncApproach instead
 * Updates the user's sync approach setting (legacy function for backwards compatibility)
 */
export async function updateUserSyncApproach(
  userId: string, 
  syncApproach: SyncApproach
): Promise<void> {
  console.warn('updateUserSyncApproach is deprecated. Use updateCalendarFeedSyncApproach instead.');
  
  // For backwards compatibility, update all calendar feeds for the user
  const feeds = await getUserCalendarFeeds(userId);
  
  for (const feed of feeds) {
    await updateCalendarFeedSyncApproach(feed.id, syncApproach);
  }
}

/**
 * Gets sync filter rules for a specific calendar feed
 */
export async function getSyncFilterRules(
  userId: string, 
  calendarFeedId: string
): Promise<SyncFilterRule[]> {
  const supabase = createClient();
  
  const { data: rules } = await supabase
    .from('sync_filter_rules')
    .select('*')
    .eq('user_id', userId)
    .eq('calendar_feed_id', calendarFeedId)
    .eq('is_active', true);
  
  return (rules || []) as SyncFilterRule[];
}

/**
 * Saves sync filter rules for a calendar feed and automatically sets sync approach to mixed_calendar
 */
export async function saveSyncFilterRules(
  userId: string,
  calendarFeedId: string,
  rules: Omit<SyncFilterRule, 'id' | 'user_id' | 'calendar_feed_id'>[]
): Promise<void> {
  const supabase = createClient();
  
  // First, deactivate all existing rules for this calendar feed
  await supabase
    .from('sync_filter_rules')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('calendar_feed_id', calendarFeedId);
  
  // Then insert new rules
  if (rules.length > 0) {
    const rulesToInsert = rules.map(rule => ({
      ...rule,
      user_id: userId,
      calendar_feed_id: calendarFeedId
    }));
    
    await supabase
      .from('sync_filter_rules')
      .insert(rulesToInsert);
  }
  
  // Automatically set the calendar feed to mixed_calendar approach since we're adding filter rules
  await updateCalendarFeedSyncApproach(calendarFeedId, 'mixed_calendar');
}

/**
 * Updates calendar feed filtering settings
 * Note: For mixed_calendar feeds, you can temporarily disable filtering while keeping the sync approach
 */
export async function updateCalendarFeedFiltering(
  feedId: string,
  enabled: boolean,
  patterns?: { titles: string[], locations: string[], descriptions: string[] }
): Promise<void> {
  const supabase = createClient();
  
  const updateData: {
    filtering_enabled: boolean;
    filtering_patterns?: { titles: string[], locations: string[], descriptions: string[] };
  } = {
    filtering_enabled: enabled
  };
  
  if (patterns) {
    updateData.filtering_patterns = patterns;
  }
  
  await supabase
    .from('calendar_feeds')
    .update(updateData)
    .eq('id', feedId);
} 