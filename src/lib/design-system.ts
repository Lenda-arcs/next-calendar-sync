/**
 * Design System Foundation
 * Centralized design tokens and utilities for consistent UI
 */

export const designTokens = {
  // Spacing Scale (based on 4px grid)
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    '3xl': '3rem',    // 48px
    '4xl': '4rem',    // 64px
    '5xl': '6rem',    // 96px
  },

  // Typography Scale
  typography: {
    // Font Sizes
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },
    
    // Line Heights
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },

    // Font Weights
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // Animation Durations
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
}

// Component Variants
export const componentVariants = {
  // Button variants
  button: {
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    },
    variant: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    },
  },

  // Card variants
  card: {
    variant: {
      default: 'bg-card text-card-foreground border shadow-sm',
      elevated: 'bg-card text-card-foreground border shadow-lg',
      outlined: 'bg-background text-foreground border-2',
      ghost: 'bg-transparent text-foreground',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },

  // Input variants
  input: {
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-3 text-base',
      lg: 'h-12 px-4 text-lg',
    },
    variant: {
      default: 'border border-input bg-background',
      filled: 'border-0 bg-muted',
      ghost: 'border-0 bg-transparent',
    },
  },
}

// Utility functions for consistent styling
export const styleUtils = {
  // Focus ring utility
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  
  // Transition utility
  transition: 'transition-colors duration-200 ease-in-out',
  
  // Hover utilities
  hoverScale: 'hover:scale-105 transition-transform duration-200',
  hoverLift: 'hover:shadow-lg transition-shadow duration-200',
  
  // Responsive text utilities
  responsiveText: {
    heading: 'text-2xl sm:text-3xl lg:text-4xl',
    subheading: 'text-lg sm:text-xl lg:text-2xl',
    body: 'text-sm sm:text-base',
  },
}

// Color palette helpers
export const colorPalette = {
  // Semantic colors
  semantic: {
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400',
  },
  
  // Background variants
  background: {
    subtle: 'bg-muted/50',
    emphasis: 'bg-accent',
    inverse: 'bg-foreground text-background',
  },
} 