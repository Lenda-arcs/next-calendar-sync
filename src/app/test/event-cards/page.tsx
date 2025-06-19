import { Metadata } from 'next'
import EventCardShowcase from '@/components/examples/event-card-showcase'

export const metadata: Metadata = {
  title: 'EventCard Showcase | Test Suite',
  description: 'Interactive event cards with different variants and configurations',
}

export default function EventCardTestPage() {
  return <EventCardShowcase />
} 