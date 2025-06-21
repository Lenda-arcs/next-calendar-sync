import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { styleUtils } from "@/lib/design-system"

const inputVariants = cva(
  [
    "flex w-full rounded-lg bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium font-sans",
    "placeholder:text-muted-foreground",
    styleUtils.focusRing,
    "disabled:cursor-not-allowed disabled:opacity-50",
    styleUtils.transition,
  ],
  {
    variants: {
      variant: {
        default: "backdrop-blur-sm bg-white/50 border border-white/40 shadow-md",
        filled: "backdrop-blur-md bg-white/30 border border-white/30 shadow-lg",
        ghost: "border-0 bg-transparent backdrop-blur-none",
        glass: "backdrop-blur-md bg-white/20 border border-white/30 shadow-xl",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-3 text-base",
        lg: "h-12 px-4 text-lg",
      },
      state: {
        default: "",
        error: "border-destructive focus:ring-destructive bg-red-50/30",
        success: "border-green-500 focus:ring-green-500 bg-green-50/30",
        warning: "border-yellow-500 focus:ring-yellow-500 bg-yellow-50/30",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, state, leftIcon, rightIcon, error, helperText, ...props }, ref) => {
    const hasError = error || state === "error"
    
    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            className={cn(
              inputVariants({ variant, size, state: hasError ? "error" : state }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn(
            "mt-1 text-xs",
            hasError ? "text-destructive" : "text-muted-foreground"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants } 