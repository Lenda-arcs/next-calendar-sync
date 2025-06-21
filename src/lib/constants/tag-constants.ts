export const TAG_COLORS = [
  '#8B5CF6', // Violet (Primary yoga color)
  '#EC4899', // Pink (Restorative/gentle)
  '#10B981', // Emerald (All levels/balance)
  '#F59E0B', // Amber (Energy/morning)
  '#06B6D4', // Cyan (Calm/beginner)
  '#EF4444', // Red (Power/advanced)
  '#F97316', // Orange (Strength/intermediate)
  '#6B7280', // Gray (Neutral/general)
  '#84CC16', // Lime (Fresh/renewal)
  '#14B8A6', // Teal (Meditation/mindfulness)
  '#A855F7', // Purple (Spiritual/deep practice)
  '#EAB308', // Yellow (Joy/sunshine)
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