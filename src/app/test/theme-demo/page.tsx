import { redirect } from 'next/navigation'
import { ThemeShowcase } from '@/components/examples/theme-showcase'
import { ThemeProvider } from '@/components/providers'

export default function ThemeDemoPage() {
  // Only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    redirect('/')
  }

  return (
    <ThemeProvider defaultVariant="default">
      {/* Subtle development indicator - doesn't interfere with theme */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white/80 border border-white/20">
          DEV
        </div>
      </div>
      
      <ThemeShowcase />
    </ThemeProvider>
  )
}

export function generateMetadata() {
  return {
    title: 'Theme System Demo - Development Only',
    description: 'Interactive demo of the centralized theme system (Development Only)',
    robots: 'noindex, nofollow', // Prevent search engine indexing
  }
}