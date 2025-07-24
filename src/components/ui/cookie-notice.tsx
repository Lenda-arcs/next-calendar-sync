'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Cookie, X } from 'lucide-react'

export function CookieNotice() {
  const [showNotice, setShowNotice] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('cookie-consent')
    if (!cookieConsent) {
      // Show notice after a short delay for better UX
      const timer = setTimeout(() => setShowNotice(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowNotice(false)
  }

  const dismissNotice = () => {
    localStorage.setItem('cookie-consent', 'dismissed')
    setShowNotice(false)
  }

  if (!showNotice) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:max-w-md">
      <Card variant="elevated" className="bg-white/95 backdrop-blur-md border border-white/60 shadow-2xl">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <Cookie className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-2">
                Cookies & Datenschutz
              </h4>
              <p className="text-sm text-foreground/80 mb-4">
                Wir verwenden nur notwendige Cookies für Authentifizierung und Ihre Spracheinstellungen. 
                Keine Tracking- oder Werbe-Cookies. 
                <Link 
                  href="/privacy" 
                  className="text-primary hover:text-primary/80 font-medium underline ml-1"
                >
                  Mehr erfahren
                </Link>
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={acceptCookies}
                  size="sm"
                  className="text-sm"
                >
                  Verstanden
                </Button>
                <Button 
                  onClick={dismissNotice}
                  variant="ghost"
                  size="sm"
                  className="text-sm"
                >
                  <X className="h-3 w-3 mr-1" />
                  Schließen
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 