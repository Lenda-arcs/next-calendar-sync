import { Tables, TablesInsert, TablesUpdate, Enums } from '../../database-generated.types'
import { EventTag } from './event-types'

// User types
export type User = Tables<'users'>
export type UserInsert = TablesInsert<'users'>
export type UserUpdate = TablesUpdate<'users'>

// Public profiles types (for public teacher pages)
export type PublicProfile = Tables<'public_profiles'>

// Events types
export type Event = Tables<'events'>
export type EventInsert = TablesInsert<'events'>
export type EventUpdate = TablesUpdate<'events'>

// Public events types (for public schedule pages)
export type PublicEvent = Tables<'public_events'>

// Calendar feeds types
export type CalendarFeed = Tables<'calendar_feeds'>
export type CalendarFeedInsert = TablesInsert<'calendar_feeds'>
export type CalendarFeedUpdate = TablesUpdate<'calendar_feeds'>

// Tags types
export type Tag = Tables<'tags'>
export type TagInsert = TablesInsert<'tags'>
export type TagUpdate = TablesUpdate<'tags'>

// Tag rules types
export type TagRule = Tables<'tag_rules'>
export type TagRuleInsert = TablesInsert<'tag_rules'>
export type TagRuleUpdate = TablesUpdate<'tag_rules'>

// BillingEntity types
export type BillingEntity = Tables<'billing_entities'>
export type BillingEntityInsert = TablesInsert<'billing_entities'>
export type BillingEntityUpdate = TablesUpdate<'billing_entities'>

// Invoices types
export type Invoice = Tables<'invoices'>
export type InvoiceInsert = TablesInsert<'invoices'>
export type InvoiceUpdate = TablesUpdate<'invoices'>

// User invoice settings types
export type UserInvoiceSettings = Tables<'user_invoice_settings'>
export type UserInvoiceSettingsInsert = TablesInsert<'user_invoice_settings'>
export type UserInvoiceSettingsUpdate = TablesUpdate<'user_invoice_settings'>

// Enums
export type UserRole = Enums<'user_role'>
export type EventDisplayVariant = Enums<'event_display_variant'>

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