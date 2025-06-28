import type { Metadata } from "next";
import { DM_Serif_Display, Outfit } from "next/font/google";
import "./globals.css";
import SupabaseProvider from '@/components/providers/supabase-provider'
import { Toaster } from "@/components/ui/sonner"

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
  title: "SyncIt",
  description: "Sync and manage your calendar events with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SupabaseProvider>
        {children}
        </SupabaseProvider>
        <Toaster />
      </body>
    </html>
  );
}
