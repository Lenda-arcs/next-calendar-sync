'use client'

import React from 'react'
import { PublicEvent } from '@/lib/types'
import { format, parseISO } from 'date-fns'

interface InstagramStoryExportProps {
  events: PublicEvent[]
  tags?: unknown[] // Not used but kept for interface compatibility
  teacherName?: string // Not used but kept for interface compatibility
  className?: string
}

export const InstagramStoryExport: React.FC<InstagramStoryExportProps> = ({
  events,
  className = ''
}) => {
  // Limit to first 3-4 events for Instagram story format
  const limitedEvents = events.slice(0, 4)

  return (
    <div 
      className={className}
      style={{
        // Reset all inherited styles and force explicit values
        all: 'initial',
        width: '1080px',
        height: '1920px',
        display: 'flex',
        flexDirection: 'column',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'transparent', // Transparent background
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: '#000000',
        boxSizing: 'border-box'
      }}
    >

      {/* Events - Clean and minimal design matching app style */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '32px',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
        padding: '40px 20px'
      }}>
        {limitedEvents.map((event, index) => {
          return (
            <div key={event.id || index} style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.85)', // Semi-transparent white
              backdropFilter: 'blur(8px)', // Subtle blur effect for glass-like appearance
              borderRadius: '16px',
              padding: '28px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.3)', // Semi-transparent border
              width: '100%',
              maxWidth: '640px' // Increased from 500px for more title space
            }}>
              {/* Event header with date */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ 
                    fontSize: '1.375rem', // Increased from 1.25rem
                    fontWeight: '600',
                    color: '#111827',
                    margin: '0',
                    lineHeight: '1.3',
                    flex: '1',
                    paddingRight: '12px' // Add space before date badge
                  }}>
                    {event.title || 'Yoga Class'}
                  </h3>
                  {event.start_time && (
                    <div style={{
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#374151',
                      whiteSpace: 'nowrap',
                      flexShrink: '0'
                    }}>
                      {format(parseISO(event.start_time), 'MMM d')}
                    </div>
                  )}
                </div>
              </div>

              {/* Event details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {event.start_time && (
                  <div style={{ 
                    fontSize: '1.125rem', // Increased for better visibility
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between', // Use full width
                    fontWeight: '600', // Bolder for emphasis
                    width: '100%',
                    padding: '12px 0' // More vertical padding
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.25rem' }}>🕐</span>
                      <span>{format(parseISO(event.start_time), 'H:mm')}</span>
                    </div>
                    {event.start_time && event.end_time && (
                      <span style={{ 
                        fontSize: '1rem',
                        color: '#6b7280',
                        backgroundColor: 'rgba(249, 250, 251, 0.8)',
                        padding: '6px 12px', // More padding
                        borderRadius: '8px',
                        fontWeight: '500',
                        border: '1px solid rgba(229, 231, 235, 0.5)'
                      }}>
                        {(() => {
                          const start = parseISO(event.start_time)
                          const end = parseISO(event.end_time)
                          const durationMs = end.getTime() - start.getTime()
                          const durationMinutes = Math.round(durationMs / (1000 * 60))
                          const hours = Math.floor(durationMinutes / 60)
                          const minutes = durationMinutes % 60
                          
                          if (hours > 0) {
                            return `${hours}h ${minutes}m`
                          } else {
                            return `${minutes}m`
                          }
                        })()}
                      </span>
                    )}
                  </div>
                )}
                {event.location && (
                  <div style={{ 
                    fontSize: '1.125rem', // Increased to match time
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: '500',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '1.25rem' }}>📍</span>
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 