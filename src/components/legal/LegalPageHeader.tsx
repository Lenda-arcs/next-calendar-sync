import { LucideIcon } from 'lucide-react'

interface LegalPageHeaderProps {
  icon: LucideIcon
  title: string
  description: string
  lastUpdated?: string
}

export function LegalPageHeader({ 
  icon: Icon, 
  title, 
  description, 
  lastUpdated 
}: LegalPageHeaderProps) {
  return (
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
  )
} 