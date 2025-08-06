import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface TagBadgeProps {
  children: React.ReactNode
  color?: string | null
  variant?: 'purple' | 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'dynamic' | 'safe'
  layout?: 'inline' | 'overlay' | 'stacked'
  className?: string
  role?: string
}

// Predefined color mappings with good contrast
const COLOR_MAPPINGS = {
  // Light colors - use dark text
  '#FFEB3B': { bg: '#FFF59D', text: '#33691E', border: '#C0CA33' }, // Yellow
  '#FFFF00': { bg: '#FFF59D', text: '#33691E', border: '#C0CA33' }, // Bright Yellow
  '#00FFFF': { bg: '#B2DFDB', text: '#00695C', border: '#26A69A' }, // Cyan
  '#E0E0E0': { bg: '#F5F5F5', text: '#424242', border: '#9E9E9E' }, // Light Gray
  '#FFFFFF': { bg: '#F5F5F5', text: '#424242', border: '#9E9E9E' }, // White
  '#FFE082': { bg: '#FFF3C4', text: '#E65100', border: '#FFB300' }, // Light Orange
  
  // Medium colors - use white text with darker bg
  '#FF5722': { bg: '#FF5722', text: '#FFFFFF', border: '#D84315' }, // Red-Orange
  '#2196F3': { bg: '#2196F3', text: '#FFFFFF', border: '#1976D2' }, // Blue
  '#4CAF50': { bg: '#4CAF50', text: '#FFFFFF', border: '#388E3C' }, // Green
  '#FF9800': { bg: '#FF9800', text: '#FFFFFF', border: '#F57C00' }, // Orange
  '#9C27B0': { bg: '#9C27B0', text: '#FFFFFF', border: '#7B1FA2' }, // Purple
  '#607D8B': { bg: '#607D8B', text: '#FFFFFF', border: '#455A64' }, // Blue Gray
  
  // Dark colors - use white text
  '#000000': { bg: '#424242', text: '#FFFFFF', border: '#616161' }, // Black
  '#212121': { bg: '#424242', text: '#FFFFFF', border: '#616161' }, // Dark Gray
  '#3F51B5': { bg: '#3F51B5', text: '#FFFFFF', border: '#303F9F' }, // Indigo
  '#1A237E': { bg: '#3F51B5', text: '#FFFFFF', border: '#303F9F' }, // Dark Blue
}

// Fallback color logic for colors not in the mapping
const getContrastColor = (hexColor: string) => {
  // Remove # if present
  const hex = hexColor.replace('#', '')
  if (hex.length !== 6) return { bg: '#E0E0E0', text: '#424242', border: '#9E9E9E' }
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate brightness using the standard formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  
  if (brightness > 200) {
    // Light color - use dark text with lighter bg
    return {
      bg: `${hexColor}33`, // 20% opacity
      text: '#424242',
      border: `${hexColor}66` // 40% opacity
    }
  } else if (brightness > 120) {
    // Medium color - use white text with original color
    return {
      bg: hexColor,
      text: '#FFFFFF',
      border: hexColor
    }
  } else {
    // Dark color - use white text
    return {
      bg: hexColor,
      text: '#FFFFFF',
      border: hexColor
    }
  }
}

export function TagBadge({ 
  children, 
  color, 
  variant = 'gray', 
  layout = 'inline',
  className,
  role
}: TagBadgeProps) {
  // Get variant-specific styles
  const getVariantClasses = () => {
    // If variant is 'dynamic' or 'safe' and color is provided, use dynamic styling
    if ((variant === 'dynamic' || variant === 'safe') && color) {
      return ''
    }

    switch (variant) {
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800'
      case 'gray':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
    }
  }

  // Get layout-specific tag styles
  const getTagClasses = () => {
    const baseClasses = cn(
      'text-xs font-medium px-2 py-1 rounded-full border',
      getVariantClasses()
    )

    switch (layout) {
      case 'overlay':
        return cn(baseClasses, 'bg-black/60 text-white border-white/20 backdrop-blur-sm')
      case 'stacked':
      case 'inline':
      default:
        return baseClasses
    }
  }

  // Get dynamic styles for color prop with improved contrast
  const getDynamicStyles = () => {
    if (variant === 'safe' && color) {
      // Safe mode: use neutral background with color dot
      return {
        backgroundColor: '#F3F4F6',
        color: '#374151',
        borderColor: '#D1D5DB',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        position: 'relative' as const,
      }
    }
    
    if (variant === 'dynamic' && color) {
      // Try predefined mapping first
      const predefinedMapping = COLOR_MAPPINGS[color.toUpperCase() as keyof typeof COLOR_MAPPINGS]
      if (predefinedMapping) {
        return {
          backgroundColor: predefinedMapping.bg,
          color: predefinedMapping.text,
          borderColor: predefinedMapping.border,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        }
      }
      
      // Fallback to contrast calculation
      const colorScheme = getContrastColor(color)
      return {
        backgroundColor: colorScheme.bg,
        color: colorScheme.text,
        borderColor: colorScheme.border,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      }
    }
    return {}
  }

  return (
    <Badge
      variant={layout === 'overlay' ? 'secondary' : 'outline'}
      className={cn(getTagClasses(), className)}
      style={getDynamicStyles()}
      role={role}
    >
      {variant === 'safe' && color && (
        <span 
          className="inline-block w-2 h-2 rounded-full mr-1.5 flex-shrink-0"
          style={{ backgroundColor: color }}
        />
      )}
      {children}
    </Badge>
  )
} 