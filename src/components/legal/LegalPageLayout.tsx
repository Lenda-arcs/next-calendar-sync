import { ReactNode } from 'react'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'

interface LegalPageLayoutProps {
  children: ReactNode
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"
}

export function LegalPageLayout({ 
  children, 
  maxWidth = "4xl" 
}: LegalPageLayoutProps) {
  return (
    <main className="flex flex-col min-h-screen">
      <PageSection className="py-12">
        <Container maxWidth={maxWidth}>
          {children}
        </Container>
      </PageSection>
    </main>
  )
} 