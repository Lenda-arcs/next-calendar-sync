import type { Metadata } from "next";
import { DM_Serif_Display, Outfit } from "next/font/google";
import { LanguageProvider } from '@/lib/i18n/context'
import { LocaleScript } from '@/components/locale-script'
import "./globals.css";

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

export const metadata: Metadata = {
  title: "avara. - Yoga Schedule Management",
  description: "Manage your yoga schedule and share it with your students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // For locale routes (/[locale]/*), the locale layout handles <html> and <body>
  // This root layout only provides fallback for non-locale routes (like /not-found)
  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <LocaleScript />
        <LanguageProvider initialLanguage="en">
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
} 