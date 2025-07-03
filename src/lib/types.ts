import { Database } from '../../database-generated.types'
import { EventTag } from './event-types'

// Base database types
export type Event = Database['public']['Tables']['events']['Row']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type EventUpdate = Database['public']['Tables']['events']['Update']

export type Invoice = Database['public']['Tables']['invoices']['Row']
export type InvoiceInsert = Database['public']['Tables']['invoices']['Insert']
export type InvoiceUpdate = Database['public']['Tables']['invoices']['Update']

export type UserInvoiceSettings = Database['public']['Tables']['user_invoice_settings']['Row']
export type UserInvoiceSettingsInsert = Database['public']['Tables']['user_invoice_settings']['Insert']
export type UserInvoiceSettingsUpdate = Database['public']['Tables']['user_invoice_settings']['Update']

export type Tag = Database['public']['Tables']['tags']['Row']
export type TagInsert = Database['public']['Tables']['tags']['Insert']
export type TagUpdate = Database['public']['Tables']['tags']['Update']

export type TagRule = Database['public']['Tables']['tag_rules']['Row']
export type TagRuleInsert = Database['public']['Tables']['tag_rules']['Insert']
export type TagRuleUpdate = Database['public']['Tables']['tag_rules']['Update']

export type CalendarFeed = Database['public']['Tables']['calendar_feeds']['Row']
export type CalendarFeedInsert = Database['public']['Tables']['calendar_feeds']['Insert']
export type CalendarFeedUpdate = Database['public']['Tables']['calendar_feeds']['Update']

export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

// New Studios table types (once migration is run)
export interface Studio {
  id: string
  name: string
  slug: string | null
  description: string | null
  location_patterns: string[] | null
  address: string | null
  contact_info: StudioContactInfo | null
  default_rate_config: RateConfig | null
  public_profile_enabled: boolean | null
  website_url: string | null
  instagram_url: string | null
  profile_images: string[] | null
  business_hours: StudioBusinessHours | null
  amenities: string[] | null
  created_by_user_id: string
  verified: boolean | null
  featured: boolean | null
  created_at: string | null
  updated_at: string | null
}

export interface StudioInsert {
  id?: string
  name: string
  slug?: string | null
  description?: string | null
  location_patterns?: string[] | null
  address?: string | null
  contact_info?: StudioContactInfo | null
  default_rate_config?: RateConfig | null
  public_profile_enabled?: boolean | null
  website_url?: string | null
  instagram_url?: string | null
  profile_images?: string[] | null
  business_hours?: StudioBusinessHours | null
  amenities?: string[] | null
  created_by_user_id: string
  verified?: boolean | null
  featured?: boolean | null
  created_at?: string | null
  updated_at?: string | null
}

export interface StudioUpdate {
  id?: string
  name?: string
  slug?: string | null
  description?: string | null
  location_patterns?: string[] | null
  address?: string | null
  contact_info?: StudioContactInfo | null
  default_rate_config?: RateConfig | null
  public_profile_enabled?: boolean | null
  website_url?: string | null
  instagram_url?: string | null
  profile_images?: string[] | null
  business_hours?: StudioBusinessHours | null
  amenities?: string[] | null
  created_by_user_id?: string
  verified?: boolean | null
  featured?: boolean | null
  created_at?: string | null
  updated_at?: string | null
}

// Studio-specific JSON types
export interface StudioContactInfo {
  email?: string
  phone?: string
  website?: string
}

export interface StudioBusinessHours {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

// JSON structure types for billing entities
export interface RateConfigFlat {
  type: 'flat'
  base_rate: number
  minimum_threshold?: number
  bonus_threshold?: number
  bonus_per_student?: number
  online_bonus_per_student?: number
  online_bonus_ceiling?: number
  max_discount?: number
}

export interface RateConfigPerStudent {
  type: 'per_student'
  rate_per_student: number
  online_bonus_per_student?: number
  online_bonus_ceiling?: number
}

export interface RateConfigTiered {
  type: 'tiered'
  tiers: Array<{
    min: number
    max: number | null
    rate: number
  }>
  online_bonus_per_student?: number
  online_bonus_ceiling?: number
}

export type RateConfig = RateConfigFlat | RateConfigPerStudent | RateConfigTiered

export interface RecipientInfo {
  type: 'studio' | 'internal_teacher' | 'external_teacher'
  name: string
  email?: string
  phone?: string
  address?: string
  internal_user_id?: string // for internal teachers
}

export interface BankingInfo {
  iban?: string
  bic?: string
  tax_id?: string
  vat_id?: string
}

// Enhanced BillingEntity types - now supports studio references
export interface BillingEntity extends Omit<Database['public']['Tables']['billing_entities']['Row'], 'entity_type' | 'rate_config' | 'recipient_info' | 'banking_info'> {
  entity_type: 'studio' | 'teacher'
  studio_id?: string | null // NEW: Reference to Studios table
  rate_config: RateConfig | null // null for teachers who use studio rates
  custom_rate_override?: RateConfig | null // NEW: Teacher's custom rates that override studio defaults
  recipient_info: RecipientInfo | null
  banking_info: BankingInfo | null
  individual_billing_email?: string | null // NEW: Teacher's personal billing email
}

export interface BillingEntityInsert extends Omit<Database['public']['Tables']['billing_entities']['Insert'], 'entity_type' | 'rate_config' | 'recipient_info' | 'banking_info'> {
  entity_type?: 'studio' | 'teacher'
  studio_id?: string | null
  rate_config?: RateConfig | null
  custom_rate_override?: RateConfig | null
  recipient_info?: RecipientInfo | null
  banking_info?: BankingInfo | null
  individual_billing_email?: string | null
}

export interface BillingEntityUpdate extends Omit<Database['public']['Tables']['billing_entities']['Update'], 'entity_type' | 'rate_config' | 'recipient_info' | 'banking_info'> {
  entity_type?: 'studio' | 'teacher'
  studio_id?: string | null
  rate_config?: RateConfig | null
  custom_rate_override?: RateConfig | null
  recipient_info?: RecipientInfo | null
  banking_info?: BankingInfo | null
  individual_billing_email?: string | null
}

// Enhanced types with studio relationships
export interface BillingEntityWithStudio extends BillingEntity {
  studio: Studio | null
}

export interface StudioWithTeachers extends Studio {
  teachers: BillingEntity[]
  total_teachers: number
}

export interface StudioWithUpcomingEvents extends Studio {
  upcoming_events: Event[]
  total_upcoming_events: number
}

// Event-related types
export interface EnhancedEvent extends Event {
  tag_library_tags?: Tag[]
  tag_rules_tags?: Tag[]
  matched_tag_rules?: TagRule[]
}

export interface EventWithStudio extends Event {
  studio: BillingEntity | null
}

export interface EventWithSubstituteTeacher extends Event {
  studio: BillingEntity | null
  substitute_teacher: BillingEntity | null
}

export interface InvoiceWithDetails extends Invoice {
  studio: BillingEntity
  substitute_teacher?: BillingEntity | null
  events: Event[]
  event_count: number
}

// Studio management types
export interface StudioDashboard {
  studio: Studio
  teachers: BillingEntity[]
  upcoming_events: Event[]
  revenue_summary: {
    current_month: number
    previous_month: number
    total_classes: number
  }
  substitute_requests: Array<{
    event: Event
    original_teacher: BillingEntity
    requested_substitutes: BillingEntity[]
  }>
}

// Teacher onboarding flow types
export interface TeacherOnboardingFlow {
  step: 'choose_setup' | 'select_studio' | 'create_studio' | 'configure_rates' | 'billing_info' | 'complete'
  setup_type: 'join_studio' | 'create_studio' | 'independent' | null
  selected_studio?: Studio | null
  custom_rates?: RateConfig | null
  billing_info?: {
    recipient_info: RecipientInfo
    banking_info: BankingInfo
    individual_billing_email: string
  }
}

// Export status types
export interface ExportPreferences {
  includeLocation: boolean
  includeDescription: boolean
  includeBookingUrl: boolean
  includeStudentCounts: boolean
  format: 'minimal' | 'detailed'
}

export interface ExportResult {
  success: boolean
  downloadUrl?: string
  fileName?: string
  error?: string
}

// Public profiles types (for public teacher pages)
export type PublicProfile = Database['public']['Views']['public_profiles']['Row']

// Public events types (for public schedule pages)
export type PublicEvent = Database['public']['Views']['public_events']['Row']

// Enums
export type UserRole = Database['public']['Enums']['user_role']
export type EventDisplayVariant = Database['public']['Enums']['event_display_variant']

// Example events for landing page - formatted for EventCard component
export const exampleEvents: Array<{
  id: string
  title: string
  dateTime: string
  location: string
  imageQuery: string
  tags: EventTag[]
  variant: EventDisplayVariant
}> = [
  {
    id: 'example-1',
    title: 'Vinyasa Flow',
    dateTime: '2024-12-20T09:00:00Z',
    location: 'Studio A',
    imageQuery: 'vinyasa flow yoga studio',
    tags: [
      { 
        id: 'tag-1', 
        slug: 'vinyasa',
        name: 'Vinyasa', 
        color: '#8B5CF6',
        classType: ['Vinyasa'],
        audience: ['All Levels'],
        chip: { color: '#8B5CF6' },
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'
      },
      { 
        id: 'tag-2', 
        slug: 'all-levels',
        name: 'All Levels', 
        color: '#10B981',
        audience: ['All Levels'],
        chip: { color: '#10B981' }
      },
      { 
        id: 'tag-3', 
        slug: 'morning',
        name: 'Morning', 
        color: '#F59E0B',
        chip: { color: '#F59E0B' },
        cta: {
          label: 'Book Now',
          url: 'https://example.com/book/vinyasa-flow'
        }
      }
    ],
    variant: 'compact' as EventDisplayVariant
  },
  {
    id: 'example-2',
    title: 'Restorative Yoga',
    dateTime: '2024-12-20T18:00:00Z',
    location: 'Studio B',
    imageQuery: 'restorative yoga relaxation',
    tags: [
      { 
        id: 'tag-4', 
        slug: 'restorative',
        name: 'Restorative', 
        color: '#EC4899',
        classType: ['Restorative'],
        audience: ['Beginner Friendly'],
        chip: { color: '#EC4899' },
        imageUrl: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop'
      },
      { 
        id: 'tag-5', 
        slug: 'beginner-friendly',
        name: 'Beginner Friendly', 
        color: '#06B6D4',
        audience: ['Beginner Friendly'],
        chip: { color: '#06B6D4' }
      },
      { 
        id: 'tag-6', 
        slug: 'evening',
        name: 'Evening', 
        color: '#8B5CF6',
        chip: { color: '#8B5CF6' },
        cta: {
          label: 'Join Class',
          url: 'https://example.com/book/restorative-yoga'
        }
      }
    ],
    variant: 'compact' as EventDisplayVariant
  },
  {
    id: 'example-3',
    title: 'Power Yoga Bootcamp',
    dateTime: '2024-12-21T07:00:00Z',
    location: 'Main Studio',
    imageQuery: 'power yoga bootcamp fitness',
    tags: [
      { 
        id: 'tag-7', 
        slug: 'power-yoga',
        name: 'Power Yoga', 
        color: '#EF4444',
        classType: ['Power Yoga'],
        audience: ['Advanced'],
        chip: { color: '#EF4444' },
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
      },
      { 
        id: 'tag-8', 
        slug: 'advanced',
        name: 'Advanced', 
        color: '#F97316',
        audience: ['Advanced'],
        chip: { color: '#F97316' }
      },
      { 
        id: 'tag-9', 
        slug: 'full',
        name: 'Full', 
        color: '#6B7280',
        chip: { color: '#6B7280' }
      }
    ],
    variant: 'compact' as EventDisplayVariant
  }
] 