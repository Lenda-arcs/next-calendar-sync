'use client'

import { Mail, Phone, Globe, Instagram } from 'lucide-react'

interface ContactInfo {
  email?: string
  phone?: string
}

interface StudioContactInfoProps {
  contactInfo: ContactInfo | null
  websiteUrl?: string
  instagramUrl?: string
  compact?: boolean
}

export function StudioContactInfo({ contactInfo, websiteUrl, instagramUrl, compact = false }: StudioContactInfoProps) {
  const hasContactInfo = contactInfo?.email || contactInfo?.phone
  const hasSocial = websiteUrl || instagramUrl

  if (!hasContactInfo && !hasSocial) return null

  if (compact) {
    return (
      <div className="flex items-center gap-3 text-sm text-gray-600">
        {contactInfo?.email && (
          <div className="flex items-center gap-1">
            <Mail className="w-3 h-3" />
            <span className="hidden sm:inline">{contactInfo.email}</span>
          </div>
        )}
        {contactInfo?.phone && (
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span className="hidden sm:inline">{contactInfo.phone}</span>
          </div>
        )}
        {websiteUrl && (
          <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
            <Globe className="w-3 h-3" />
            <span className="hidden sm:inline">Website</span>
          </a>
        )}
        {instagramUrl && (
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
            <Instagram className="w-3 h-3" />
            <span className="hidden sm:inline">Instagram</span>
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {hasContactInfo && (
        <div>
          <h4 className="text-sm font-medium mb-2">Contact</h4>
          <div className="space-y-1 text-sm text-gray-600">
            {contactInfo?.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                {contactInfo.email}
              </div>
            )}
            {contactInfo?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                {contactInfo.phone}
              </div>
            )}
          </div>
        </div>
      )}

      {hasSocial && (
        <div>
          <h4 className="text-sm font-medium mb-2">Social</h4>
          <div className="space-y-1 text-sm text-gray-600">
            {websiteUrl && (
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3" />
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Website
                </a>
              </div>
            )}
            {instagramUrl && (
              <div className="flex items-center gap-2">
                <Instagram className="w-3 h-3" />
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Instagram
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 