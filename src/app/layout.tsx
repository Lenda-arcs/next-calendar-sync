import type { Metadata } from "next";
import { DM_Serif_Display, Outfit } from "next/font/google";
import "./globals.css";
import SupabaseProvider from '@/components/providers/supabase-provider'
import { LanguageProvider } from '@/lib/i18n/context'
import { Toaster } from "@/components/ui/sonner"
import { CookieNotice } from "@/components/ui/cookie-notice"
import { generateHomeMetadata } from '@/lib/i18n/metadata'

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Generate metadata for the root layout
export async function generateMetadata(): Promise<Metadata> {
  return generateHomeMetadata()
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <LanguageProvider>
        <SupabaseProvider>
        {children}
        </SupabaseProvider>
        <Toaster />
        <CookieNotice />
        </LanguageProvider>
      </body>
    </html>
  );
}
