// Subtle app-aligned color set for CTA emphasis
export const TAG_COLORS = [
  '#6366F1', // Indigo (primary)
  '#8B5CF6', // Violet
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#F59E0B', // Amber
  '#6B7280', // Neutral Gray
] as const

export const AUDIENCE_OPTIONS = [
  'All Levels',
  'Beginner Friendly',
  'Intermediate',
  'Advanced',
] as const

export const PRIORITY_OPTIONS = [
  { value: 1, label: 'High' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'Low' },
] as const

export const PRIORITY_LABELS = {
  1: 'High',
  2: 'Medium',
  3: 'Low',
} as const

export const MAX_TAGS_PER_EVENT = 3
export const DEFAULT_TAG_COLOR = TAG_COLORS[0]

// Type helpers
export type TagColor = typeof TAG_COLORS[number]
export type AudienceOption = typeof AUDIENCE_OPTIONS[number]
export type PriorityValue = typeof PRIORITY_OPTIONS[number]['value'] 