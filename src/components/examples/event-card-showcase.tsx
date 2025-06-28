'use client'

import React from 'react'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { EventCard } from '@/components/events'
import { EventTag, EventDisplayVariant } from '@/lib/event-types'

// Mock data for demonstration
const mockTags: EventTag[] = [
  {
    id: '1',
    slug: 'vinyasa',
    name: 'Vinyasa',
    color: '#8B5CF6',
    classType: ['Vinyasa', 'Flow'],
    audience: ['Beginner', 'Intermediate'],
    chip: { color: '#8B5CF6' },
    priority: 1,
  },
  {
    id: '2',
    slug: 'hot-yoga',
    name: 'Hot Yoga',
    color: '#EF4444',
    classType: ['Hot Yoga'],
    audience: ['Intermediate', 'Advanced'],
    chip: { color: '#EF4444' },
    priority: 2,
  },
  {
    id: '3',
    slug: 'book-now',
    name: 'Book Now',
    color: '#10B981',
    cta: {
      label: 'Register',
      url: 'https://example.com/book',
    },
    chip: { color: '#10B981' },
    priority: 3,
  },
]

const mockEvents = [
  {
    id: '1',
    title: 'Morning Vinyasa Flow',
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    location: 'Studio A',
    imageQuery: 'yoga vinyasa morning flow',
    tags: [mockTags[0], mockTags[2]],
  },
  {
    id: '2',
    title: 'Hot Yoga Power Hour',
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
    location: 'Studio B - Heated Room',
    imageQuery: 'hot yoga power class',
    tags: [mockTags[1], mockTags[2]],
  },
  {
    id: '3',
    title: 'Gentle Restorative Practice',
    dateTime: new Date().toISOString(), // Today
    location: null,
    imageQuery: 'restorative yoga gentle',
    tags: [mockTags[0]],
  },
  {
    id: '4',
    title: 'Advanced Ashtanga Workshop',
    dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
    location: 'Main Studio',
    imageQuery: 'ashtanga yoga workshop',
    tags: mockTags,
  },
]

/**
 * EventCard Showcase Component
 * Demonstrates the EventCard component with different variants and configurations
 */
export default function EventCardShowcase() {
  const [expandedCards, setExpandedCards] = React.useState<Record<string, EventDisplayVariant>>({})
  
  const handleEventClick = (eventId: string, title: string) => {
    console.log(`Clicked event: ${eventId} - ${title}`)
    // In a real app, this would navigate to event details or open a modal
  }

  const handleVariantChange = (eventId: string, newVariant: EventDisplayVariant) => {
    console.log(`Expanding card ${eventId} to ${newVariant}`)
    setExpandedCards(prev => ({
      ...prev,
      [eventId]: newVariant
    }))
  }

  return (
    <Container 
      maxWidth="4xl" 
      title="EventCard Showcase" 
      subtitle="Comprehensive examples of the EventCard component with different variants and configurations"
    >
      {/* Compact Variant */}
      <PageSection title="Compact Variant" subtitle="Standard event cards with balanced information display">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              dateTime={event.dateTime}
              location={event.location}
              imageQuery={event.imageQuery}
              tags={event.tags}
              variant="compact"
              onClick={() => handleEventClick(event.id, event.title)}
            />
          ))}
        </div>
      </PageSection>

      {/* Full Variant */}
      <PageSection title="Full Variant" subtitle="Detailed event cards with maximum information display">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mockEvents.slice(0, 2).map((event) => (
            <EventCard
              key={`full-${event.id}`}
              id={event.id}
              title={event.title}
              dateTime={event.dateTime}
              location={event.location}
              imageQuery={event.imageQuery}
              tags={event.tags}
              variant="full"
              onClick={() => handleEventClick(event.id, event.title)}
            />
          ))}
        </div>
      </PageSection>

      {/* Minimal Variant with Expansion */}
      <PageSection title="Minimal Variant (Interactive)" subtitle="Click minimal cards to expand them to compact view">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockEvents.map((event) => {
            const currentVariant = expandedCards[`minimal-${event.id}`] || 'minimal'
            return (
              <EventCard
                key={`minimal-${event.id}`}
                id={event.id}
                title={event.title}
                dateTime={event.dateTime}
                location={event.location}
                imageQuery={event.imageQuery}
                tags={event.tags}
                variant={currentVariant}
                onVariantChange={(newVariant) => handleVariantChange(`minimal-${event.id}`, newVariant)}
                onClick={currentVariant !== 'minimal' ? () => handleEventClick(event.id, event.title) : undefined}
              />
            )
          })}
        </div>
      </PageSection>

      {/* Mobile Forced */}
      <PageSection title="Mobile Layout" subtitle="How cards appear on mobile devices">
        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
          {mockEvents.slice(0, 2).map((event) => (
            <EventCard
              key={`mobile-${event.id}`}
              id={event.id}
              title={event.title}
              dateTime={event.dateTime}
              location={event.location}
              imageQuery={event.imageQuery}
              tags={event.tags}
              variant="compact"
              onClick={() => handleEventClick(event.id, event.title)}
            />
          ))}
        </div>
      </PageSection>

      {/* Non-Interactive Cards */}
      <PageSection title="Non-Interactive Cards" subtitle="Cards without click handlers for display-only purposes">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.slice(0, 3).map((event) => (
            <EventCard
              key={`static-${event.id}`}
              id={event.id}
              title={event.title}
              dateTime={event.dateTime}
              location={event.location}
              imageQuery={event.imageQuery}
              tags={event.tags}
              variant="compact"
              // No onClick handler - card won't be interactive
            />
          ))}
        </div>
      </PageSection>

      {/* Variant Comparison */}
      <PageSection title="Variant Comparison" subtitle="Same event displayed in different variants">
        <div className="space-y-8">
          {(['minimal', 'compact', 'full'] as EventDisplayVariant[]).map((variant) => (
            <div key={variant} className="space-y-4">
              <h3 className="text-lg font-semibold capitalize text-foreground">
                {variant} Variant
              </h3>
              <div className={`grid gap-6 ${
                variant === 'full' ? 'grid-cols-1 lg:grid-cols-2' : 
                variant === 'minimal' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                <EventCard
                  id={mockEvents[0].id}
                  title={mockEvents[0].title}
                  dateTime={mockEvents[0].dateTime}
                  location={mockEvents[0].location}
                  imageQuery={mockEvents[0].imageQuery}
                  tags={mockEvents[0].tags}
                  variant={variant}
                  onClick={() => handleEventClick(mockEvents[0].id, mockEvents[0].title)}
                />
              </div>
            </div>
          ))}
        </div>
      </PageSection>
    </Container>
  )
} 