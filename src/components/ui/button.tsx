import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { styleUtils } from "@/lib/design-system"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium font-sans",
    "ring-offset-background",
    styleUtils.transition,
    styleUtils.focusRing,
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 backdrop-blur-sm shadow-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 backdrop-blur-sm shadow-lg",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground backdrop-blur-sm",
        secondary: "backdrop-blur-md bg-white/30 border border-white/40 hover:bg-white/50 shadow-lg text-foreground",
        ghost: "hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-md",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 backdrop-blur-sm shadow-lg",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800 backdrop-blur-sm shadow-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-xl px-3",
        lg: "h-11 rounded-xl px-8",
        xl: "h-12 rounded-2xl px-10 text-base",
        icon: "h-10 w-10",
      },
      loading: {
        true: "cursor-not-allowed opacity-70",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, asChild = false, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, loading, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, loading, className }))}
        ref={ref}
        disabled={loading}
        {...props}
      >
        {leftIcon && <span className="mr-1">{leftIcon}</span>}
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Loading...
          </div>
        ) : (
          children
        )}
        {rightIcon && <span className="ml-1">{rightIcon}</span>}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 