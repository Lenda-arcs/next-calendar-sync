'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export type TabValue = string

interface UseTabNavigationOptions<T extends TabValue> {
  validTabs: readonly T[]
  defaultTab: T
}

export function useTabNavigation<T extends TabValue>({
  validTabs,
  defaultTab
}: UseTabNavigationOptions<T>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tabSwitchLoading, setTabSwitchLoading] = useState<T | null>(null)

  // Get active tab from URL, default to defaultTab
  const getActiveTabFromUrl = (): T => {
    const tab = searchParams.get('tab') as T
    return validTabs.includes(tab) ? tab : defaultTab
  }

  // Use URL as source of truth for active tab
  const activeTab = getActiveTabFromUrl()

  // Update URL when tab changes with loading feedback
  const setActiveTab = (tab: T) => {
    if (tab === activeTab) return // Don't switch if already on the tab
    
    setTabSwitchLoading(tab)
    const params = new URLSearchParams(searchParams)
    params.set('tab', tab)
    router.push(`?${params.toString()}`, { scroll: false })
    
    // Clear loading state after a short delay to ensure smooth transition
    setTimeout(() => setTabSwitchLoading(null), 150)
  }

  return {
    activeTab,
    setActiveTab,
    tabSwitchLoading,
    isTabLoading: (tab: T) => tabSwitchLoading === tab
  }
}