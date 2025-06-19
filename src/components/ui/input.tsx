import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { styleUtils } from "@/lib/design-system"

const inputVariants = cva(
  [
    "flex w-full rounded-md bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "placeholder:text-muted-foreground",
    styleUtils.focusRing,
    "disabled:cursor-not-allowed disabled:opacity-50",
    styleUtils.transition,
  ],
  {
    variants: {
      variant: {
        default: "border border-input",
        filled: "border-0 bg-muted",
        ghost: "border-0 bg-transparent",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-3 text-base",
        lg: "h-12 px-4 text-lg",
      },
      state: {
        default: "",
        error: "border-red-500 focus:ring-red-500",
        success: "border-green-500 focus:ring-green-500",
        warning: "border-yellow-500 focus:ring-yellow-500",
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
  ({ 
    className, 
    type, 
    variant, 
    size, 
    state, 
    leftIcon, 
    rightIcon, 
    error,
    helperText,
    ...props 
  }, ref) => {
    const finalState = error ? "error" : state

    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant, size, state: finalState }),
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
          <p
            className={cn(
              "mt-1 text-sm",
              error ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants } 