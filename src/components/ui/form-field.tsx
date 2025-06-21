import * as React from "react"
import { cn } from "@/lib/utils"
import { Input, InputProps } from "./input"

export interface FormFieldProps extends Omit<InputProps, 'id'> {
  label?: string
  id?: string
  required?: boolean
  error?: string
  helperText?: string
  className?: string
  labelClassName?: string
  inputClassName?: string
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ 
    label,
    id,
    required,
    error,
    helperText,
    className,
    labelClassName,
    inputClassName,
    ...inputProps
  }, ref) => {
    const reactId = React.useId()
    const fieldId = id || `field-${reactId}`
    
    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label 
            htmlFor={fieldId}
            className={cn(
              "block text-sm font-medium mb-2 text-foreground",
              error && "text-destructive",
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="px-1">
          <Input
            id={fieldId}
            ref={ref}
            error={error}
            helperText={!error ? helperText : undefined}
            className={inputClassName}
            {...inputProps}
          />
        </div>
      </div>
    )
  }
)
FormField.displayName = "FormField"

export { FormField } 