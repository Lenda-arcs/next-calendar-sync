import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LucideIcon, Mail } from 'lucide-react'
import { ContactEmailLink } from './CompanyInfo'

interface ContactCardProps {
  title: string
  description: string
  buttonText: string
  subject?: string
  body?: string
  icon?: LucideIcon
  variant?: 'elevated' | 'glass' | 'default'
}

export function ContactCard({ 
  title,
  description,
  buttonText,
  subject,
  body,
  icon: Icon = Mail,
  variant = 'elevated'
}: ContactCardProps) {
  return (
    <Card variant={variant} className="bg-gradient-to-r from-primary/5 to-accent/5">
      <CardContent className="text-center py-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Icon className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-serif">{title}</h3>
        </div>
        <p className="text-foreground/70 mb-6">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <ContactEmailLink subject={subject} body={body}>
              <Mail className="mr-2 h-4 w-4" />
              {buttonText}
            </ContactEmailLink>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 