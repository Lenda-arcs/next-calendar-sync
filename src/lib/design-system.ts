/**
 * Design System Foundation
 * Centralized design tokens and utilities for consistent UI with glassmorphism theme
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
    // Font Families
    fontFamily: {
      serif: '"DM Serif Display", serif',
      sans: '"Outfit", sans-serif',
    },

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
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },

    // Letter Spacing
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.025em',
    },
  },

  // Border Radius (Updated for glassmorphism)
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Glassmorphism Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    glass: '0 8px 32px 0 rgb(31 38 135 / 0.37)',
    'glass-lg': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Glassmorphism Backdrop Blur
  backdropBlur: {
    none: 'backdrop-blur-none',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  },

  // Background Opacity for Glass Effect
  backgroundOpacity: {
    glass: 'bg-white/50',
    'glass-light': 'bg-white/30',
    'glass-heavy': 'bg-white/70',
    'glass-dark': 'bg-black/20',
  },

  // Animation Durations
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
}

// Component Variants (Updated for glassmorphism)
export const componentVariants = {
  // Button variants
  button: {
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    },
    variant: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 backdrop-blur-sm',
      secondary: 'backdrop-blur-md bg-white/30 border border-white/40 hover:bg-white/50 shadow-lg',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground backdrop-blur-sm',
      ghost: 'hover:bg-white/20 hover:backdrop-blur-sm',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 backdrop-blur-sm',
      glass: 'backdrop-blur-md bg-white/20 border border-white/30 hover:bg-white/30 shadow-xl',
    },
  },

  // Card variants (Enhanced for glassmorphism)
  card: {
    variant: {
      default: 'backdrop-blur-md bg-white/50 border border-white/40 shadow-xl',
      elevated: 'backdrop-blur-md bg-white/60 border border-white/50 shadow-2xl',
      outlined: 'backdrop-blur-md bg-white/30 border-2 border-white/30 shadow-lg',
      ghost: 'bg-transparent backdrop-blur-none',
      glass: 'backdrop-blur-md bg-white/30 border border-white/30 shadow-xl',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },

  // Input variants (Updated for glass theme)
  input: {
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-3 text-base',
      lg: 'h-12 px-4 text-lg',
    },
    variant: {
      default: 'backdrop-blur-sm bg-white/50 border border-white/40',
      filled: 'backdrop-blur-md bg-white/30 border border-white/30',
      ghost: 'border-0 bg-transparent backdrop-blur-none',
      glass: 'backdrop-blur-md bg-white/20 border border-white/30',
    },
  },
}

// Utility functions for consistent styling (Enhanced)
export const styleUtils = {
  // Focus ring utility
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  
  // Transition utility
  transition: 'transition-all duration-300 ease-in-out',
  
  // Hover utilities
  hoverScale: 'hover:scale-105 transition-transform duration-200',
  hoverLift: 'hover:shadow-2xl hover:-translate-y-1 transition-all duration-300',
  
  // Glass utilities
  glass: {
    light: 'backdrop-blur-md bg-white/30 border border-white/30',
    medium: 'backdrop-blur-md bg-white/50 border border-white/40',
    heavy: 'backdrop-blur-lg bg-white/70 border border-white/60',
    interactive: 'hover:bg-white/60 hover:shadow-2xl transition-all duration-300',
  },
  
  // Responsive text utilities
  responsiveText: {
    heading: 'text-2xl sm:text-3xl lg:text-4xl font-serif',
    subheading: 'text-lg sm:text-xl lg:text-2xl font-serif',
    body: 'text-sm sm:text-base font-sans',
  },
}

// Color palette helpers (Enhanced)
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
    subtle: 'bg-white/20 backdrop-blur-sm',
    emphasis: 'bg-white/40 backdrop-blur-md',
    inverse: 'bg-foreground text-background backdrop-blur-lg',
    glass: 'bg-white/30 backdrop-blur-md',
  },

  // Glass-specific color variants
  glass: {
    primary: 'bg-primary/20 backdrop-blur-md border border-primary/30',
    secondary: 'bg-secondary/20 backdrop-blur-md border border-secondary/30',
    accent: 'bg-accent/20 backdrop-blur-md border border-accent/30',
    muted: 'bg-muted/20 backdrop-blur-md border border-muted/30',
  },
} 