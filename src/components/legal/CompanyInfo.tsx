import Link from 'next/link'

// Extract domain from APP URL for display purposes
function getWebsiteDomain() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!appUrl) return 'avara.studio' // fallback for build-time
  try {
    return new URL(appUrl).hostname
  } catch {
    return 'avara.studio' // fallback for invalid URLs
  }
}

// Centralized company information
export const COMPANY_INFO = {
  name: 'avara',
  email: 'hello@avara.studio',
  website: getWebsiteDomain(),
  supportEmail: 'hello@avara.studio',
  dataProtectionOfficer: 'hello@avara.studio',
} as const

interface CompanyInfoProps {
  variant?: 'basic' | 'extended' | 'privacy'
  className?: string
}

export function CompanyInfo({ variant = 'basic', className }: CompanyInfoProps) {
  const baseClass = "bg-white/20 rounded-xl p-4 backdrop-blur-sm border border-white/30"
  
  if (variant === 'basic') {
    return (
      <div className={`${baseClass} ${className || ''}`}>
        <p className="font-medium">{COMPANY_INFO.name}</p>
        <p>E-Mail: {COMPANY_INFO.email}</p>
        <p>Website: {COMPANY_INFO.website}</p>
      </div>
    )
  }

  if (variant === 'privacy') {
    return (
      <div className={`${baseClass} ${className || ''}`}>
        <p className="font-medium">{COMPANY_INFO.name}</p>
        <p>E-Mail: {COMPANY_INFO.email}</p>
        <p>Datenschutzbeauftragte: {COMPANY_INFO.dataProtectionOfficer}</p>
      </div>
    )
  }

  // Extended variant
  return (
    <div className={`${baseClass} ${className || ''}`}>
      <p className="font-medium">{COMPANY_INFO.name}</p>
      <p>E-Mail: {COMPANY_INFO.email}</p>
      <p>Website: {COMPANY_INFO.website}</p>
      <p>Support: {COMPANY_INFO.supportEmail}</p>
    </div>
  )
}

// Helper components for common use cases
export function ContactEmailLink({ 
  subject, 
  body, 
  children, 
  className 
}: {
  subject?: string
  body?: string
  children: React.ReactNode
  className?: string
}) {
  const href = `mailto:${COMPANY_INFO.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}${body ? `&body=${encodeURIComponent(body)}` : ''}`
  
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

export function SupportEmailLink({ 
  subject = "Support Anfrage",
  children,
  className
}: {
  subject?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <ContactEmailLink subject={subject} className={className}>
      {children}
    </ContactEmailLink>
  )
} 