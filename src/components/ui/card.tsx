import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { styleUtils } from "@/lib/design-system"

const cardVariants = cva(
  [
    "rounded-2xl text-card-foreground",
    styleUtils.transition,
  ],
  {
    variants: {
      variant: {
        default: "backdrop-blur-md bg-white/50 border border-white/40 shadow-xl",
        elevated: "backdrop-blur-md bg-white/60 border border-white/50 shadow-2xl",
        outlined: "backdrop-blur-md bg-white/30 border-2 border-white/30 rounded-xl shadow-lg",
        ghost: "bg-transparent backdrop-blur-none",
        filled: "bg-white/70 backdrop-blur-lg border border-white/60 shadow-lg",
        glass: "backdrop-blur-md bg-white/30 border border-white/30 rounded-xl shadow-xl",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      interactive: {
        true: [
          "cursor-pointer",
          styleUtils.hoverLift,
          styleUtils.focusRing,
          "focus:outline-none",
          "hover:bg-white/60",
          "hover:shadow-2xl",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  interactive?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, interactive }), className)}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    centered?: boolean
  }
>(({ className, centered, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6",
      centered && "text-center items-center",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  }
>(({ className, as: Component = "h3", ...props }, ref) => (
  <Component
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight font-serif",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    noPadding?: boolean
  }
>(({ className, noPadding, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      !noPadding && "p-6 pt-0", 
      className
    )} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    justify?: "start" | "center" | "end" | "between"
  }
>(({ className, justify = "start", ...props }, ref) => {
  const justifyClasses = {
    start: "justify-start",
    center: "justify-center", 
    end: "justify-end",
    between: "justify-between",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center p-6 pt-0",
        justifyClasses[justify],
        className
      )}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

// Specialized Card Components
const StatsCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    title: string
    value: string | number
    change?: {
      value: string | number
      type: "increase" | "decrease" | "neutral"
    }
    icon?: React.ReactNode
  }
>(({ title, value, change, icon, className, variant = "default", ...props }, ref) => (
  <Card ref={ref} variant={variant} className={cn("p-6", className)} {...props}>
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold font-serif">{value}</p>
        {change && (
          <div className="flex items-center space-x-1 text-sm">
            <span
              className={cn(
                "font-medium",
                change.type === "increase" && "text-green-600 dark:text-green-400",
                change.type === "decrease" && "text-red-600 dark:text-red-400",
                change.type === "neutral" && "text-muted-foreground"
              )}
            >
              {change.type === "increase" && "↗"}
              {change.type === "decrease" && "↘"}
              {change.value}
            </span>
          </div>
        )}
      </div>
      {icon && (
        <div className="h-12 w-12 rounded-lg bg-primary/10 backdrop-blur-sm flex items-center justify-center text-primary">
          {icon}
        </div>
      )}
    </div>
  </Card>
))
StatsCard.displayName = "StatsCard"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  StatsCard 
} 