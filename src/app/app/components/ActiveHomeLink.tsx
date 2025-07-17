import { getServerTranslation, getServerLanguageSafe } from '@/lib/i18n/server'
import { HomeLinkClient } from './HomeLinkClient'

export async function ActiveHomeLink() {
  const language = await getServerLanguageSafe()
  const appName = await getServerTranslation(language, 'common.nav.appName')

  return <HomeLinkClient appName={appName} />
} 