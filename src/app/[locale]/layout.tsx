import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner"
import { CookieNotice } from "@/components/ui/cookie-notice"
import SupabaseProvider from '@/components/providers/supabase-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { LanguageProvider } from '@/lib/i18n/context'
import { getValidLocale, getTranslations } from '@/lib/i18n/config'
import { generateSEOMetadata } from '@/lib/i18n/metadata'
import React from 'react'
import "../globals.css";

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

// Generate metadata for each locale
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  return generateSEOMetadata({
    page: 'home',
    language: locale,
    basePath: locale === 'en' ? '' : `/${locale}`,
  })
}

// Generate static params for all locales
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'de' },
    { locale: 'es' },
  ]
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  // Load translations server-side
  const translations = await getTranslations(locale)

  const baseURL = process.env.NEXT_PUBLIC_APP_URL

  return (
    <>
      {/* SEO hreflang tags - these will be injected into <head> */}
      <link rel="alternate" hrefLang="en" href={`${baseURL}/`} />
      <link rel="alternate" hrefLang="de" href={`${baseURL}/de`} />
      <link rel="alternate" hrefLang="es" href={`${baseURL}/es`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseURL}/`} />
      
      <LanguageProvider initialLanguage={locale} serverTranslations={translations}>
        <SupabaseProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </SupabaseProvider>
        <Toaster />
        <CookieNotice />
      </LanguageProvider>
    </>
  );
}

 