import { Database, Json } from '../../database-generated.types'
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
export type Studio = {
  id: string
  name: string
  slug: string | null
  description: string | null
  location_patterns: string[] | null
  address: string | null
  contact_info: Json | null
  default_rate_config: Json | null
  public_profile_enabled: boolean | null
  website_url: string | null
  instagram_url: string | null
  profile_images: string[] | null
  business_hours: Json | null
  amenities: string[] | null
  created_by_user_id: string
  verified: boolean | null
  featured: boolean | null
  created_at: string | null
  updated_at: string | null
}

export type StudioInsert = Omit<Studio, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string | null
  updated_at?: string | null
}

export type StudioUpdate = Partial<StudioInsert>

// Studio-Teacher relationship with nested teacher info
export interface StudioTeacherWithInfo {
  id: string
  teacher_id: string
  role: string
  available_for_substitution: boolean
  is_active: boolean
  teacher: {
    id: string
    name: string | null
    email: string | null
  }
}

export type StudioWithStats = Studio & {
  teacher_count?: number
  substitute_teacher_count?: number
  event_count?: number
  billing_entities?: BillingEntity[] // For backward compatibility
  studio_teachers?: StudioTeacherWithInfo[] // New optimized teacher relationships
}

// Studio-Teacher relationship types
export type StudioTeacherRequest = {
  id: string
  studio_id: string
  teacher_id: string
  message: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  studio?: Studio
  teacher?: {
    id: string
    name: string | null
    email: string | null
  }
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
  // If true (default), tier thresholds use (studio + online) students; if false, only in-studio students count for tier selection
  tier_count_includes_online?: boolean
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

// PDF Template Customization types
export interface PDFTemplateConfig {
  template_type: 'default' | 'modern' | 'minimal' | 'letterhead' | 'custom'
  logo_url?: string | null
  logo_size: 'small' | 'medium' | 'large'
  logo_position: 'top-left' | 'top-center' | 'top-right' | 'header-left' | 'header-center' | 'header-right'
  header_color: string // hex color code
  accent_color: string // hex color code
  font_family: 'helvetica' | 'times' | 'courier' | 'arial' | 'custom'
  font_size: 'small' | 'normal' | 'large'
  show_company_address: boolean
  show_invoice_notes: boolean
  footer_text?: string | null
  date_format: 'locale' | 'us' | 'eu' | 'iso' | 'custom'
  currency_position: 'before' | 'after' | 'symbol'
  table_style: 'default' | 'minimal' | 'bordered' | 'striped' | 'modern'
  page_margins: 'narrow' | 'normal' | 'wide' | 'custom'
  letterhead_text?: string | null
  custom_css?: string | null
  // Advanced layout options
  show_logo: boolean
  show_company_info: boolean
  show_payment_terms: boolean
  show_tax_info: boolean
  page_orientation: 'portrait' | 'landscape'
  page_size: 'a4' | 'letter' | 'legal' | 'a3'
  // Color scheme
  background_color?: string | null
  text_color?: string | null
  border_color?: string | null
  // Typography
  header_font_size?: number | null
  body_font_size?: number | null
  line_height?: number | null
}

export type PDFTemplateTheme = 'professional' | 'modern' | 'minimal' | 'creative' | 'custom'

// Enhanced UserInvoiceSettings with PDF template support
export interface UserInvoiceSettingsWithPDFTemplate extends Omit<UserInvoiceSettings, 'pdf_template_config' | 'custom_template_html' | 'template_theme'> {
  pdf_template_config: PDFTemplateConfig | null
  custom_template_html: string | null
  template_theme: PDFTemplateTheme
}

// Enhanced BillingEntity types - now supports studio references
export interface BillingEntity extends Omit<Database['public']['Tables']['billing_entities']['Row'], 'entity_type' | 'rate_config' | 'recipient_info' | 'banking_info' | 'custom_rate_override' | 'individual_billing_email' | 'studio_id' | 'substitution_billing_enabled'> {
  entity_type: 'studio' | 'teacher'
  studio_id?: string | null // NEW: Reference to Studios table
  rate_config: RateConfig | null // null for teachers who use studio rates
  custom_rate_override?: RateConfig | null // NEW: Teacher's custom rates that override studio defaults
  recipient_info: RecipientInfo | null
  banking_info: BankingInfo | null
  individual_billing_email?: string | null // NEW: Teacher's personal billing email
  substitution_billing_enabled?: boolean | null // NEW: For studio entities, controls if teacher billing entities can be created
}

export interface BillingEntityInsert extends Omit<Database['public']['Tables']['billing_entities']['Insert'], 'entity_type' | 'rate_config' | 'recipient_info' | 'banking_info' | 'custom_rate_override' | 'individual_billing_email' | 'studio_id' | 'substitution_billing_enabled'> {
  entity_type?: 'studio' | 'teacher'
  studio_id?: string | null
  rate_config?: RateConfig | null
  custom_rate_override?: RateConfig | null
  recipient_info?: RecipientInfo | null
  banking_info?: BankingInfo | null
  individual_billing_email?: string | null
  substitution_billing_enabled?: boolean | null
}

export interface BillingEntityUpdate extends Omit<Database['public']['Tables']['billing_entities']['Update'], 'entity_type' | 'rate_config' | 'recipient_info' | 'banking_info' | 'custom_rate_override' | 'individual_billing_email' | 'studio_id' | 'substitution_billing_enabled'> {
  entity_type?: 'studio' | 'teacher'
  studio_id?: string | null
  rate_config?: RateConfig | null
  custom_rate_override?: RateConfig | null
  recipient_info?: RecipientInfo | null
  banking_info?: BankingInfo | null
  individual_billing_email?: string | null
  substitution_billing_enabled?: boolean | null
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

// Calendar types
export * from './types/calendar'

// ===== RPC FUNCTION TYPES =====

// Base RPC function types from generated database types
export type RPCFunctions = Database['public']['Functions']

// Delete Invoice Cascade Function
export type DeleteInvoiceCascadeArgs = RPCFunctions['delete_invoice_cascade']['Args']
export type DeleteInvoiceCascadeReturn = {
  success: boolean
  message?: string
  error?: string
  invoice_id: string
  user_id?: string
  studio_id?: string
  events_unlinked?: number
  pdf_url?: string | null
  note?: string
}

// Delete User Cascade Function  
export type DeleteUserCascadeArgs = RPCFunctions['delete_user_cascade']['Args']
export type DeleteUserCascadeReturn = {
  success: boolean
  message?: string
  error?: string
  user_id: string
  user_email?: string
  user_name?: string
  note?: string
}

// Other RPC functions
export type GetUserImageCountArgs = RPCFunctions['get_user_image_count']['Args']

// Helper type for RPC function calls
export type RPCCall<
  FunctionName extends keyof RPCFunctions,
  Args = RPCFunctions[FunctionName]['Args'],
  Returns = RPCFunctions[FunctionName]['Returns']
> = {
  functionName: FunctionName
  args: Args
  returns: Returns
}

// Convenience types for commonly used RPC calls
export type InvoiceDeletionCall = RPCCall<'delete_invoice_cascade', DeleteInvoiceCascadeArgs, DeleteInvoiceCascadeReturn>
export type UserDeletionCall = RPCCall<'delete_user_cascade', DeleteUserCascadeArgs, DeleteUserCascadeReturn>

// Helper for creating type-safe RPC function wrappers
export type TypedRPCFunction<
  FunctionName extends keyof RPCFunctions,
  ReturnType
> = (
  supabase: { rpc: (name: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message?: string } | null }> },
  args: RPCFunctions[FunctionName]['Args']
) => Promise<ReturnType>

// Specific typed RPC function types
export type TypedDeleteInvoiceCascade = TypedRPCFunction<'delete_invoice_cascade', DeleteInvoiceCascadeReturn>
export type TypedDeleteUserCascade = TypedRPCFunction<'delete_user_cascade', DeleteUserCascadeReturn>

/* USAGE EXAMPLES:

// Using typed RPC function arguments:
const deleteArgs: DeleteInvoiceCascadeArgs = { target_invoice_id: 'invoice-123' }

// With proper return type checking:
const result = await supabase.rpc('delete_invoice_cascade', deleteArgs)
const typedResult = result.data as DeleteInvoiceCascadeReturn

if (typedResult.success) {
  console.log(`Deleted invoice, unlinked ${typedResult.events_unlinked} events`)
  if (typedResult.pdf_url) {
    // Handle PDF cleanup
  }
} else {
  console.error(`Failed to delete invoice: ${typedResult.error}`)
}

// Type-safe function wrapper example:
const deleteInvoiceSafely: TypedDeleteInvoiceCascade = async (supabase, args) => {
  const { data, error } = await supabase.rpc('delete_invoice_cascade', args)
  if (error) throw error
  return data as DeleteInvoiceCascadeReturn
}

*/ 