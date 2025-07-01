import { InvoiceData } from './types.ts'

/**
 * Calculate the rate for a single event based on billing entity configuration
 * and student counts
 */
export function calculateEventRate(event: InvoiceData['events'][0]): number {
  if (!event.studio) {
    console.warn('No studio configuration found for event:', event.id)
    return 0
  }
  
  const baseRate = event.studio.base_rate || 0
  const studioStudents = event.students_studio || 0
  const onlineStudents = event.students_online || 0
  
  // Start with base rate
  let rate = baseRate
  
  // Add studio student bonuses
  if (event.studio.bonus_per_student && studioStudents > 0) {
    rate += (event.studio.bonus_per_student * studioStudents)
  }
  
  // Add online student bonuses
  if (event.studio.online_bonus_per_student && onlineStudents > 0) {
    rate += (event.studio.online_bonus_per_student * onlineStudents)
  }
  
  // Apply studio penalties if configured (subtract from rate)
  if (event.studio.studio_penalty_per_student && studioStudents > 0) {
    rate -= (event.studio.studio_penalty_per_student * studioStudents)
  }
  
  // Ensure rate doesn't go below 0
  return Math.max(0, rate)
}

/**
 * Calculate the total amount for all events in an invoice
 */
export function calculateInvoiceTotal(events: InvoiceData['events']): number {
  return events.reduce((total, event) => {
    return total + calculateEventRate(event)
  }, 0)
}

/**
 * Format currency amount with proper decimal places
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return `${currency} ${amount.toFixed(2)}`
}

/**
 * Format student count display
 */
export function formatStudentCount(studioStudents: number = 0, onlineStudents: number = 0): string {
  if (studioStudents === 0 && onlineStudents === 0) {
    return 'N/A'
  }
  return `${studioStudents}/${onlineStudents}`
} 