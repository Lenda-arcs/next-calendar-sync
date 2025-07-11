import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// URL validation utilities that match database constraints
export const urlValidation = {
  /**
   * Normalizes a URL by adding protocol if missing and trimming whitespace
   */
  normalizeUrl(url: string | null | undefined): string | null {
    if (!url || !url.trim()) return null
    
    const trimmed = url.trim()
    
    // Add https:// if no protocol is present
    if (!trimmed.match(/^https?:\/\//)) {
      return `https://${trimmed}`
    }
    
    return trimmed
  },

  /**
   * Validates Instagram URL against database constraint
   * Constraint: ^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/.*
   */
  validateInstagramUrl(url: string | null | undefined): { isValid: boolean; error?: string; normalizedUrl?: string | null } {
    const normalized = this.normalizeUrl(url)
    
    if (!normalized) {
      return { isValid: true, normalizedUrl: null }
    }

    const instagramRegex = /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/.*$/
    
    if (!instagramRegex.test(normalized)) {
      return {
        isValid: false,
        error: 'Please enter a valid Instagram URL (e.g., instagram.com/username)',
        normalizedUrl: normalized
      }
    }

    return { isValid: true, normalizedUrl: normalized }
  },

  /**
   * Validates website URL against database constraint
   * Constraint: ^https?:\/\/.*
   */
  validateWebsiteUrl(url: string | null | undefined): { isValid: boolean; error?: string; normalizedUrl?: string | null } {
    const normalized = this.normalizeUrl(url)
    
    if (!normalized) {
      return { isValid: true, normalizedUrl: null }
    }

    const websiteRegex = /^https?:\/\/.*$/
    
    if (!websiteRegex.test(normalized)) {
      return {
        isValid: false,
        error: 'Please enter a valid website URL',
        normalizedUrl: normalized
      }
    }

    // Additional validation using URL constructor for better error detection
    try {
      new URL(normalized)
      return { isValid: true, normalizedUrl: normalized }
    } catch {
      return {
        isValid: false,
        error: 'Please enter a valid website URL',
        normalizedUrl: normalized
      }
    }
  }
}
