import { createServerClient } from './supabase-server'

export interface YogaStudio {
  id: string
  name: string
  address: string | null
  location_patterns: string[] | null
}

/**
 * Get public yoga studios for location matching
 */
export async function getPublicYogaStudios(): Promise<YogaStudio[]> {
  const supabase = await createServerClient()
  
  const { data: studios, error } = await supabase
    .from('studios')
    .select('id, name, address, location_patterns')
    .eq('public_profile_enabled', true)
    .eq('verified', true)

  if (error) {
    console.error('Error fetching public yoga studios:', error)
    return []
  }

  return studios || []
}

/**
 * Check if an event location matches any known yoga studios
 */
export function isLocationYogaRelated(eventLocation: string | undefined, studios: YogaStudio[]): boolean {
  if (!eventLocation) return false

  const location = eventLocation.toLowerCase().trim()
  
  for (const studio of studios) {
    // Check studio name match
    if (studio.name && location.includes(studio.name.toLowerCase())) {
      return true
    }
    
    // Check address match
    if (studio.address && location.includes(studio.address.toLowerCase())) {
      return true
    }
    
    // Check location patterns
    if (studio.location_patterns) {
      for (const pattern of studio.location_patterns) {
        if (location.includes(pattern.toLowerCase())) {
          return true
        }
      }
    }
  }

  // Check for common yoga studio keywords in location
  const yogaLocationKeywords = [
    'yoga', 'pilates', 'meditation', 'wellness', 'studio', 'center', 'centre',
    'shala', 'ashram', 'dojo', 'sanctuary', 'retreat', 'loft', 'space',
    'roots yoga', 'urban yoga', 'power yoga', 'hot yoga', 'bikram',
    'jivamukti', 'iyengar', 'ashtanga', 'vinyasa', 'hatha', 'yin'
  ]
  
  return yogaLocationKeywords.some(keyword => location.includes(keyword))
}

/**
 * Enhanced yoga detection that combines keyword and location matching
 */
export function isEventYogaRelated(
  title: string | undefined,
  description: string | undefined, 
  location: string | undefined,
  studios: YogaStudio[]
): boolean {
  // First check with enhanced keywords
  const content = `${title || ''} ${description || ''}`.toLowerCase()
  
  const yogaKeywords = [
    'yoga', 'pilates', 'meditation', 'wellness', 'fitness', 'class', 'workshop', 'retreat',
    'flow', 'vinyasa', 'hatha', 'ashtanga', 'yin', 'restorative', 'kundalini', 'bikram',
    'jivamukti', 'iyengar', 'power yoga', 'hot yoga', 'asana', 'pranayama', 'sadhana',
    'namaste', 'om', 'chakra', 'mantra', 'mudra', 'bandha', 'breathwork', 'mindfulness',
    'open60', 'open75', 'open90', 'open 60', 'open 75', 'open 90'
  ]
  
  const hasYogaKeywords = yogaKeywords.some(keyword => content.includes(keyword))
  
  // Then check location
  const hasYogaLocation = isLocationYogaRelated(location, studios)
  
  return hasYogaKeywords || hasYogaLocation
} 