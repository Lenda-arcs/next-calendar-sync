import { getServerTranslation } from '@/lib/i18n/server'
import { cookies } from 'next/headers'
import { Language, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/i18n/types'
import { HomeLinkClient } from './HomeLinkClient'

// Helper function to get current language from cookies
async function getCurrentLanguage(): Promise<Language> {
  try {
    const cookieStore = await cookies()
    const languageCookie = cookieStore.get('language')?.value
    
    if (languageCookie && SUPPORTED_LANGUAGES.includes(languageCookie as Language)) {
      return languageCookie as Language
    }
  } catch (error) {
    console.log('Could not access cookies for language detection:', error)
  }
  
  return DEFAULT_LANGUAGE
}

export async function ActiveHomeLink() {
  const language = await getCurrentLanguage()
  const appName = await getServerTranslation(language, 'common.nav.appName')

  return <HomeLinkClient appName={appName} />
} 