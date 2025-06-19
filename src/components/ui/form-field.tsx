import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"
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
    const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label 
            htmlFor={fieldId}
            required={required}
            variant={error ? "error" : "default"}
            className={labelClassName}
          >
            {label}
          </Label>
        )}
        <Input
          id={fieldId}
          ref={ref}
          error={error}
          helperText={!error ? helperText : undefined}
          className={inputClassName}
          {...inputProps}
        />
      </div>
    )
  }
)
FormField.displayName = "FormField"

export { FormField } 