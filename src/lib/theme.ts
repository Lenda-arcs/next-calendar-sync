/**
 * Centralized Theme Configuration
 * Design tokens and utilities for glassmorphism theme
 */

export const theme = {
  // Core colors
  colors: {
    primary: '#3f3f3f',
    accent: '#fadadd',
    muted: '#e2a8d1',
    surface: '#a3bfd9',
    background: '#fce5ec',
    text: '#3f3f3f',
    
    // Glass effect colors
    glass: {
      light: 'rgb(255 255 255 / 0.3)',
      medium: 'rgb(255 255 255 / 0.5)',
      heavy: 'rgb(255 255 255 / 0.7)',
      border: 'rgb(255 255 255 / 0.4)',
    },
  },

  // Typography
  fonts: {
    serif: '"DM Serif Display", serif',
    sans: '"Outfit", sans-serif',
  },

  // Spacing (4px grid system)
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

  // Border radius
  radius: {
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows for glassmorphism
  shadows: {
    glass: '0 8px 32px 0 rgb(31 38 135 / 0.37)',
    'glass-sm': '0 2px 16px 0 rgb(31 38 135 / 0.2)',
    'glass-lg': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    'glass-xl': '0 32px 64px -12px rgb(0 0 0 / 0.4)',
  },

  // Animation timings
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },

  // Backdrop blur values
  blur: {
    sm: '4px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
}

// Utility classes for common patterns
export const themeUtils = {
  // Glass morphism presets
  glass: {
    light: 'backdrop-blur-md bg-white/30 border border-white/30',
    medium: 'backdrop-blur-md bg-white/50 border border-white/40',
    heavy: 'backdrop-blur-lg bg-white/70 border border-white/60',
  },

  // Typography combinations
  typography: {
    heading: 'font-serif font-semibold tracking-tight',
    subheading: 'font-serif font-medium',
    body: 'font-sans font-normal',
    caption: 'font-sans font-light text-sm',
  },

  // Interactive states
  interactive: {
    hover: 'hover:bg-white/60 hover:shadow-2xl hover:-translate-y-1',
    focus: 'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    active: 'active:scale-95',
    disabled: 'disabled:pointer-events-none disabled:opacity-50',
  },

  // Layout helpers
  layout: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-8 md:py-12 lg:py-16',
    card: 'rounded-2xl backdrop-blur-md bg-white/50 border border-white/40 shadow-xl',
  },
}

// Export individual design tokens for easier access
export const colors = theme.colors
export const fonts = theme.fonts
export const spacing = theme.spacing
export const radius = theme.radius
export const shadows = theme.shadows
export const animation = theme.animation
export const blur = theme.blur

export default theme 