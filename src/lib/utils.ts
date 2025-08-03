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
  },

  /**
   * Validates Spotify URL against database constraint
   * Constraint: ^https?:\/\/(www\.)?(open\.spotify\.com|spotify\.com)\/.*
   */
  validateSpotifyUrl(url: string | null | undefined): { isValid: boolean; error?: string; normalizedUrl?: string | null } {
    const normalized = this.normalizeUrl(url)
    
    if (!normalized) {
      return { isValid: true, normalizedUrl: null }
    }

    const spotifyRegex = /^https?:\/\/(www\.)?(open\.spotify\.com|spotify\.com)\/.*$/
    
    if (!spotifyRegex.test(normalized)) {
      return {
        isValid: false,
        error: 'Please enter a valid Spotify URL (e.g., open.spotify.com/user/username)',
        normalizedUrl: normalized
      }
    }

    return { isValid: true, normalizedUrl: normalized }
  },

  /**
   * Validates email address format
   * Uses basic email regex pattern matching database constraint
   */
  validateEmail(email: string | null | undefined): { isValid: boolean; error?: string; normalizedEmail?: string | null } {
    if (!email || !email.trim()) {
      return { isValid: true, normalizedEmail: null }
    }
    
    const trimmed = email.trim().toLowerCase()
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    
    if (!emailRegex.test(trimmed)) {
      return {
        isValid: false,
        error: 'Please enter a valid email address',
        normalizedEmail: trimmed
      }
    }

    return { isValid: true, normalizedEmail: trimmed }
  }
}
