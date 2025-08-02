import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

interface TestLayoutProps {
  children: ReactNode
}

export default function TestLayout({ children }: TestLayoutProps) {
  // Block all test routes in production
  if (process.env.NODE_ENV === 'production') {
    redirect('/')
  }

  return (
    <>
      {children}
    </>
  )
}

export function generateMetadata() {
  return {
    title: 'Test Area - Development Only',
    robots: 'noindex, nofollow, noarchive, nosnippet',
  }
}