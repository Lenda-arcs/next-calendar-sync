import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LegalPageHeaderProps {
  icon: LucideIcon
  title: string
  description: string
  lastUpdated?: string
  showBackButton?: boolean
  locale?: string
}

export function LegalPageHeader({ 
  icon: Icon, 
  title, 
  description, 
  lastUpdated,
  showBackButton = true,
  locale = 'en'
}: LegalPageHeaderProps) {
  // Create locale-aware home path
  const homePath = locale === 'en' ? '/' : `/${locale}`

  return (
    <div className="relative">
      {/* Back to Home Button */}
      {showBackButton && (
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground">
            <Link href={homePath} className="inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
          </Button>
        </div>
      )}

      {/* Header Content */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-[#3F3F3F] mb-4">
          {title}
        </h1>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          {description}
        </p>
        {lastUpdated && (
          <p className="text-sm text-foreground/60 mt-4">
            Zuletzt aktualisiert: {lastUpdated}
          </p>
        )}
      </div>
    </div>
  )
} 