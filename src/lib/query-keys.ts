/**
 * Query Key Factory for consistent cache invalidation
 * 
 * This factory creates hierarchical query keys that enable:
 * - Targeted cache invalidation (e.g., invalidate all user data)
 * - Granular cache invalidation (e.g., invalidate specific tag)
 * - Type-safe query keys
 * 
 * Key structure: ['domain', 'resource', ...params]
 * Examples:
 * - ['users', 'profile', userId] 
 * - ['tags', 'all', userId]
 * - ['events', 'list', userId, filters]
 */

export const queryKeys = {
  // Users domain
  users: {
    all: ['users'] as const,
    profile: (userId: string) => ['users', 'profile', userId] as const,
    role: (userId: string) => ['users', 'role', userId] as const,
    settings: (userId: string) => ['users', 'settings', userId] as const,
  },

  // Tags domain
  tags: {
    all: ['tags'] as const,
    allForUser: (userId: string) => ['tags', 'all', userId] as const,
    userTags: (userId: string) => ['tags', 'user', userId] as const,
    globalTags: () => ['tags', 'global'] as const,
    tagRules: (userId: string) => ['tags', 'rules', userId] as const,
    detail: (tagId: string) => ['tags', 'detail', tagId] as const,
  },

  // Events domain
  events: {
    all: ['events'] as const,
    list: (userId: string, filters?: Record<string, unknown>) => 
      ['events', 'list', userId, ...(filters ? [filters] : [])] as const,
    detail: (eventId: string) => ['events', 'detail', eventId] as const,
    unmatched: (userId: string) => ['events', 'unmatched', userId] as const,
    excluded: (userId: string) => ['events', 'excluded', userId] as const,
    public: (userId: string, variant?: string) => 
      ['events', 'public', userId, ...(variant ? [variant] : [])] as const,
    byDateRange: (userId: string, start: string, end: string) => 
      ['events', 'range', userId, start, end] as const,
    byStudio: (userId: string, studioId: string) => 
      ['events', 'studio', userId, studioId] as const,
    recentActivity: (userId: string) => ['events', 'activity', userId] as const,
    // Event management operations
    create: () => ['events', 'create'] as const,
    update: (eventId: string) => ['events', 'update', eventId] as const,
    delete: (eventId: string) => ['events', 'delete', eventId] as const,
  },

  // Calendar Feeds domain
  calendarFeeds: {
    all: ['calendar-feeds'] as const,
    userFeeds: (userId: string) => ['calendar-feeds', 'user', userId] as const,
    feedDetail: (feedId: string) => ['calendar-feeds', 'detail', feedId] as const,
    feedEvents: (feedId: string) => ['calendar-feeds', 'events', feedId] as const,
    availableCalendars: (userId: string) => ['calendar-feeds', 'available', userId] as const,
  },

  // Invoices domain
  invoices: {
    all: ['invoices'] as const,
    userInvoices: (userId: string) => ['invoices', 'user', userId] as const,
    detail: (invoiceId: string) => ['invoices', 'detail', invoiceId] as const,
    uninvoicedEvents: (userId: string, studioId?: string) => 
      ['invoices', 'uninvoiced', userId, ...(studioId ? [studioId] : [])] as const,
    settings: (userId: string) => ['invoices', 'settings', userId] as const,
  },

  // Studios domain
  studios: {
    all: ['studios'] as const,
    userStudios: (userId: string) => ['studios', 'user', userId] as const,
    detail: (studioId: string) => ['studios', 'detail', studioId] as const,
    requests: (userId: string) => ['studios', 'requests', userId] as const,
    relationships: (userId: string) => ['studios', 'relationships', userId] as const,
  },

  // Admin domain
  admin: {
    all: ['admin'] as const,
    users: () => ['admin', 'users'] as const,
    userDetail: (userId: string) => ['admin', 'users', userId] as const,
    invitations: () => ['admin', 'invitations'] as const,
    analytics: (timeRange?: string) => 
      ['admin', 'analytics', ...(timeRange ? [timeRange] : [])] as const,
  },

  // OAuth & External integrations
  oauth: {
    all: ['oauth'] as const,
    googleCalendars: (userId: string) => ['oauth', 'google', 'calendars', userId] as const,
    integration: (userId: string, provider: string) => 
      ['oauth', 'integration', provider, userId] as const,
    availableCalendars: (userId: string) => ['oauth', 'calendars', userId] as const,
    calendarSelection: (userId: string) => ['oauth', 'selection', userId] as const,
  },
} as const

/**
 * Utility functions for cache invalidation patterns
 */
export const queryInvalidation = {
  // Invalidate all data for a specific user
  invalidateUserData: (userId: string) => [
    queryKeys.users.profile(userId),
    queryKeys.tags.allForUser(userId),
    queryKeys.events.list(userId),
    queryKeys.calendarFeeds.userFeeds(userId),
    queryKeys.invoices.userInvoices(userId),
    queryKeys.studios.userStudios(userId),
  ],

  // Invalidate all tag-related data
  invalidateTagData: (userId: string) => [
    queryKeys.tags.allForUser(userId),
    queryKeys.tags.userTags(userId),
    queryKeys.tags.tagRules(userId),
    queryKeys.events.list(userId), // Events might have tag associations
  ],

  // Invalidate all event-related data
  invalidateEventData: (userId: string) => [
    queryKeys.events.list(userId),
    queryKeys.events.unmatched(userId),
    queryKeys.events.excluded(userId),
    queryKeys.events.public(userId),
    queryKeys.invoices.uninvoicedEvents(userId),
  ],

  // Invalidate studio-related data
  invalidateStudioData: (userId: string, studioId?: string) => [
    queryKeys.studios.userStudios(userId),
    queryKeys.studios.relationships(userId),
    ...(studioId ? [queryKeys.studios.detail(studioId)] : []),
    queryKeys.events.list(userId), // Events are associated with studios
  ],
} 