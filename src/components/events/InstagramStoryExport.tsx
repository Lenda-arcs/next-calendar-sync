'use client'

import React from 'react'
import { PublicEvent } from '@/lib/types'
import { format, parseISO } from 'date-fns'
import { Clock, MapPin } from 'lucide-react'

interface InstagramStoryExportProps {
  events: PublicEvent[]
  tags?: unknown[] // Not used but kept for interface compatibility
  teacherName?: string // Not used but kept for interface compatibility
  className?: string
  limitEvents?: boolean // New prop to control event limiting
}

export const InstagramStoryExport: React.FC<InstagramStoryExportProps> = ({
  events,
  className = '',
  limitEvents = true // Default to true for backward compatibility
}) => {
  // Only limit events if limitEvents is true (for Instagram story format)
  const displayEvents = limitEvents ? events.slice(0, 4) : events

  return (
    <div 
      className={className}
      style={{
        width: '1080px',
        height: 'auto',
        minHeight: '1920px',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        margin: '0',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: '#000000',
        boxSizing: 'border-box',
        border: '0',
        borderWidth: '0',
        borderStyle: 'none',
        borderColor: 'transparent',
        outline: '0',
        outlineWidth: '0',
        outlineStyle: 'none',
        boxShadow: 'none',
        WebkitBoxShadow: 'none',
        MozBoxShadow: 'none'
      }}
    >

      {/* Events - Clean and minimal design matching app style */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px', // Reduced from 32px to 20px
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
        padding: '32px 16px', // Reduced from 48px 20px to 32px 16px
        border: 'none', // Explicitly remove all borders
        outline: 'none', // Remove any outline
        margin: '0', // Remove any margins
        boxShadow: 'none' // Remove any box shadows
      }}>
        {displayEvents.map((event, index) => {
          return (
            <div key={event.id || index} style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.85)', // Semi-transparent white for glassy effect
              backdropFilter: 'blur(8px)', // Glassy blur effect
              borderRadius: '12px', // Reduced from 16px to 12px
              padding: '20px', // Reduced from 28px to 20px
              boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.12), 0 3px 5px -2px rgba(0, 0, 0, 0.06)',
              border: 'none', // Explicitly remove all borders
              outline: 'none', // Remove any outline
              width: '100%',
              maxWidth: '580px' // Reduced from 640px to 580px
            }}>
              {/* Event header with date */}
              <div style={{ marginBottom: '12px', border: 'none', outline: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', border: 'none', outline: 'none' }}>
                  <h3 style={{ 
                    fontSize: '1.25rem', // Reduced from 1.375rem to 1.25rem
                    fontWeight: '600',
                    color: '#111827',
                    margin: '0',
                    lineHeight: '1.3',
                    flex: '1',
                    paddingRight: '10px', // Reduced from 12px to 10px
                    border: 'none', // Remove all borders
                    outline: 'none' // Remove any outline
                  }}>
                    {event.title || 'Yoga Class'}
                  </h3>
                  {event.start_time && (
                    <div style={{
                      backgroundColor: '#1f2937',
                      borderRadius: '10px', // Reduced from 12px to 10px
                      padding: '6px 12px', // Reduced from 8px 14px to 6px 12px
                      fontSize: '0.8125rem', // Slightly reduced from 0.875rem
                      fontWeight: '700',
                      color: '#ffffff',
                      whiteSpace: 'nowrap',
                      flexShrink: '0',
                      border: 'none', // Remove any potential border
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      {format(parseISO(event.start_time), 'MMM d')}
                    </div>
                  )}
                </div>
              </div>

              {/* Event details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: 'none', outline: 'none' }}>
                {event.start_time && (
                                      <div style={{ 
                    fontSize: '1rem', // Reduced from 1.125rem to 1rem
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between', // Use full width
                    fontWeight: '600', // Bolder for emphasis
                    width: '100%',
                    padding: '8px 0', // Reduced from 12px to 8px
                    border: 'none', // Remove all borders
                    outline: 'none' // Remove any outline
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', outline: 'none' }}>
                      <Clock style={{ 
                        width: '18px', 
                        height: '18px', 
                        color: '#374151', 
                        flexShrink: 0,
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none',
                        backgroundColor: 'transparent'
                      }} />
                      <span style={{ border: 'none', outline: 'none' }}>{format(parseISO(event.start_time), 'H:mm')}</span>
                    </div>
                    {event.start_time && event.end_time && (
                      <span style={{ 
                        fontSize: '1rem',
                        color: '#6b7280',
                        backgroundColor: 'rgba(249, 250, 251, 0.8)',
                        padding: '6px 12px', // More padding
                        borderRadius: '8px',
                        fontWeight: '500',
                        border: 'none' // Explicitly remove border
                      }}>
                        {(() => {
                          const start = parseISO(event.start_time)
                          const end = parseISO(event.end_time)
                          const durationMs = end.getTime() - start.getTime()
                          const durationMinutes = Math.round(durationMs / (1000 * 60))
                          const hours = Math.floor(durationMinutes / 60)
                          const minutes = durationMinutes % 60
                          
                          if (hours > 0 && minutes > 0) {
                            return `${hours}h ${minutes}m`
                          } else if (hours > 0) {
                            return `${hours}h`
                          } else if (minutes > 0) {
                            return `${minutes}m`
                          } else {
                            return 'Duration not available'
                          }
                        })()}
                      </span>
                    )}
                  </div>
                )}
                {event.location && (
                  <div style={{ 
                    fontSize: '1rem', // Reduced from 1.125rem to match time
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: '500',
                    gap: '8px',
                    border: 'none', // Remove all borders
                    outline: 'none' // Remove any outline
                  }}>
                    <MapPin style={{ 
                      width: '18px', 
                      height: '18px', 
                      color: '#374151', 
                      flexShrink: 0,
                      border: 'none',
                      outline: 'none',
                      boxShadow: 'none',
                      backgroundColor: 'transparent'
                    }} />
                    <span style={{ border: 'none', outline: 'none' }}>{event.location}</span>
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