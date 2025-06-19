import { Tables, TablesInsert, TablesUpdate, Enums } from '../../database-generated.types'

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

// Studios types
export type Studio = Tables<'studios'>
export type StudioInsert = TablesInsert<'studios'>
export type StudioUpdate = TablesUpdate<'studios'>

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