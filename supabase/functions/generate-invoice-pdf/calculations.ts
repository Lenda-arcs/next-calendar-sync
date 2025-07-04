import { InvoiceData } from './types.ts'

// Rate configuration types for proper TypeScript typing
type RateConfigFlat = {
  type: 'flat'
  base_rate: number
  minimum_threshold?: number
  bonus_threshold?: number
  bonus_per_student?: number
  online_bonus_per_student?: number
  online_bonus_ceiling?: number
  max_discount?: number
}

type RateConfigPerStudent = {
  type: 'per_student'
  rate_per_student: number
  online_bonus_per_student?: number
  online_bonus_ceiling?: number
}

type RateConfigTiered = {
  type: 'tiered'
  tiers: Array<{
    min: number
    max: number | null
    rate: number
  }>
  online_bonus_per_student?: number
  online_bonus_ceiling?: number
}

type RateConfig = RateConfigFlat | RateConfigPerStudent | RateConfigTiered

/**
 * Calculate the rate for a single event based on billing entity configuration
 * and student counts. Uses the new rate_config system with tiered, per-student, and flat rates.
 */
export function calculateEventRate(event: InvoiceData['events'][0]): number {
  if (!event.studio) {
    console.warn('No studio configuration found for event:', event.id)
    return 0
  }
  
  const rateConfig = event.studio.rate_config as RateConfig | null
  if (!rateConfig) {
    console.warn('No rate configuration found for event:', event.id)
    return 0
  }
  
  const studioStudents = event.students_studio || 0
  const onlineStudents = event.students_online || 0
  
  switch (rateConfig.type) {
    case 'tiered':
      return calculateTieredRatePayout(studioStudents, onlineStudents, rateConfig)
    case 'per_student':
      return calculatePerStudentRatePayout(studioStudents, onlineStudents, rateConfig)
    case 'flat':
    default:
      return calculateFlatRatePayout(studioStudents, onlineStudents, rateConfig)
  }
}

/**
 * Calculate payout using tiered rate system
 */
function calculateTieredRatePayout(studioStudents: number, onlineStudents: number, rateConfig: RateConfigTiered): number {
  const totalStudents = studioStudents + onlineStudents
  
  // Find the appropriate tier for the student count
  const tier = rateConfig.tiers?.find((tier) => {
    return totalStudents >= tier.min && 
           (tier.max === null || totalStudents <= tier.max)
  })
  
  if (!tier) {
    // No matching tier found, return 0
    return 0
  }
  
  let payout = tier.rate
  
  // Apply online bonus with ceiling if configured
  if (rateConfig.online_bonus_per_student && onlineStudents > 0) {
    const eligibleOnlineStudents = rateConfig.online_bonus_ceiling 
      ? Math.min(onlineStudents, rateConfig.online_bonus_ceiling)
      : onlineStudents
    
    payout += eligibleOnlineStudents * rateConfig.online_bonus_per_student
  }
  
  return Math.max(payout, 0)
}

/**
 * Calculate payout using per-student rate system
 */
function calculatePerStudentRatePayout(studioStudents: number, onlineStudents: number, rateConfig: RateConfigPerStudent): number {
  const totalStudents = studioStudents + onlineStudents
  let payout = totalStudents * (rateConfig.rate_per_student || 0)
  
  // Apply online bonus with ceiling if configured
  if (rateConfig.online_bonus_per_student && onlineStudents > 0) {
    const eligibleOnlineStudents = rateConfig.online_bonus_ceiling 
      ? Math.min(onlineStudents, rateConfig.online_bonus_ceiling)
      : onlineStudents
    
    payout += eligibleOnlineStudents * rateConfig.online_bonus_per_student
  }
  
  return Math.max(payout, 0)
  }
  
/**
 * Calculate payout using flat rate system with thresholds
 */
function calculateFlatRatePayout(studioStudents: number, onlineStudents: number, rateConfig: RateConfigFlat): number {
  const totalStudents = studioStudents + onlineStudents
  let payout = rateConfig.base_rate || 0
  
  // Check minimum student threshold
  if (rateConfig.minimum_threshold && totalStudents < rateConfig.minimum_threshold) {
    // Below minimum threshold - in the new system we don't apply penalties, just use base rate
    // Could add penalty logic here if needed in the future
  }

  // Check bonus student threshold and add bonus payments
  if (rateConfig.bonus_threshold && rateConfig.bonus_per_student && 
      totalStudents > rateConfig.bonus_threshold) {
    const bonusStudents = totalStudents - rateConfig.bonus_threshold
    payout += bonusStudents * rateConfig.bonus_per_student
  }

  // Apply online bonus with ceiling
  if (rateConfig.online_bonus_per_student && onlineStudents > 0) {
    const eligibleOnlineStudents = rateConfig.online_bonus_ceiling 
      ? Math.min(onlineStudents, rateConfig.online_bonus_ceiling)
      : onlineStudents
    
    payout += eligibleOnlineStudents * rateConfig.online_bonus_per_student
  }

  // Apply maximum discount limit to prevent excessive penalties
  if (rateConfig.max_discount) {
    const minimumPayout = rateConfig.base_rate - rateConfig.max_discount
    payout = Math.max(payout, minimumPayout)
  }

  return Math.max(payout, 0)
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