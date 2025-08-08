export type PreloadFn = (() => void) | undefined

import { useSmartPreload } from './useSmartPreload'

export function useNavPreloadMap(userId?: string) {
  const {
    preloadUserEvents,
    preloadInvoices,
    preloadUserTags,
    preloadDashboard,
    preloadProfile
  } = useSmartPreload()

  const getPreloadFunction = (href: string): PreloadFn => {
    if (!userId) return undefined
    if (href.includes('manage-events')) return () => preloadUserEvents(userId)
    if (href.includes('manage-tags')) return () => preloadUserTags(userId)
    if (href.includes('manage-invoices')) return () => preloadInvoices(userId)
    if (href.includes('/app') &&
        !href.includes('manage-') &&
        !href.includes('admin') &&
        !href.includes('profile') &&
        !href.includes('studios')) {
      return () => preloadDashboard(userId)
    }
    if (href.includes('profile')) return () => preloadProfile(userId)
    return undefined
  }

  return { getPreloadFunction }
}


