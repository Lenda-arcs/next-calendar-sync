import React from 'react'
import { Button, ButtonProps } from './button'
import { cn } from '@/lib/utils'

interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactNode
  'aria-label': string
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = 'icon', variant = 'ghost', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size={size}
        variant={variant}
        className={cn('flex-shrink-0', className)}
        {...props}
      >
        {icon}
      </Button>
    )
  }
)
IconButton.displayName = 'IconButton'

export default IconButton 