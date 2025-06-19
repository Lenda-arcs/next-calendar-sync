import { Metadata } from 'next'
import DesignSystemShowcase from '@/components/examples/design-system-showcase'

export const metadata: Metadata = {
  title: 'Design System Showcase | Test Suite',
  description: 'Complete overview of all UI components, variants, and design tokens',
}

export default function DesignSystemTestPage() {
  return <DesignSystemShowcase />
} 