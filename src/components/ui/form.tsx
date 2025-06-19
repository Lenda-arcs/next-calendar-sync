import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>
  loading?: boolean
  className?: string
  children: React.ReactNode
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ onSubmit, loading, className, children, ...props }, ref) => {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (onSubmit && !loading) {
        await onSubmit(event)
      }
    }

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn("space-y-4", className)}
        {...props}
      >
        <fieldset disabled={loading} className="space-y-4">
          {children}
        </fieldset>
      </form>
    )
  }
)
Form.displayName = "Form"

// Form validation utilities
export interface ValidationRule {
  required?: boolean | string
  minLength?: number | { value: number; message: string }
  maxLength?: number | { value: number; message: string }
  pattern?: RegExp | { value: RegExp; message: string }
  custom?: (value: unknown) => string | undefined
}

export interface FormErrors {
  [key: string]: string | undefined
}

export const validateField = (value: unknown, rules: ValidationRule): string | undefined => {
  // Required validation
  if (rules.required) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return typeof rules.required === 'string' ? rules.required : 'This field is required'
    }
  }

  // Skip other validations if value is empty and not required
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return undefined
  }

  // MinLength validation
  if (rules.minLength && typeof value === 'string') {
    const minLength = typeof rules.minLength === 'number' ? rules.minLength : rules.minLength.value
    const message = typeof rules.minLength === 'object' ? rules.minLength.message : `Must be at least ${minLength} characters`
    
    if (value.length < minLength) {
      return message
    }
  }

  // MaxLength validation
  if (rules.maxLength && typeof value === 'string') {
    const maxLength = typeof rules.maxLength === 'number' ? rules.maxLength : rules.maxLength.value
    const message = typeof rules.maxLength === 'object' ? rules.maxLength.message : `Must be no more than ${maxLength} characters`
    
    if (value.length > maxLength) {
      return message
    }
  }

  // Pattern validation
  if (rules.pattern && typeof value === 'string') {
    const pattern = rules.pattern instanceof RegExp ? rules.pattern : rules.pattern.value
    const message = rules.pattern instanceof RegExp ? 'Invalid format' : rules.pattern.message
    
    if (!pattern.test(value)) {
      return message
    }
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(value)
  }

  return undefined
}

export const validateForm = (data: Record<string, unknown>, rules: Record<string, ValidationRule>): FormErrors => {
  const errors: FormErrors = {}
  
  Object.keys(rules).forEach(field => {
    const error = validateField(data[field], rules[field])
    if (error) {
      errors[field] = error
    }
  })
  
  return errors
}

// Custom hook for form state management
export interface UseFormOptions {
  initialValues?: Record<string, unknown>
  validationRules?: Record<string, ValidationRule>
  onSubmit?: (values: Record<string, unknown>) => void | Promise<void>
}

export const useForm = ({ initialValues = {}, validationRules = {}, onSubmit }: UseFormOptions = {}) => {
  const [values, setValues] = React.useState(initialValues)
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})
  const [loading, setLoading] = React.useState(false)

  const setValue = (field: string, value: unknown) => {
    setValues(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const setFieldTouched = (field: string, isTouched = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }))
  }

  const validateFieldOnBlur = (field: string) => {
    if (validationRules[field]) {
      const error = validateField(values[field], validationRules[field])
      setErrors(prev => ({ ...prev, [field]: error }))
    }
    setFieldTouched(field)
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      // Validate all fields
      const formErrors = validateForm(values, validationRules)
      setErrors(formErrors)
      
      // Mark all fields as touched
      const touchedFields = Object.keys(validationRules).reduce((acc, field) => {
        acc[field] = true
        return acc
      }, {} as Record<string, boolean>)
      setTouched(touchedFields)
      
      // If no errors, submit the form
      if (Object.keys(formErrors).length === 0) {
        if (onSubmit) {
          await onSubmit(values)
        }
      }
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setLoading(false)
  }

  return {
    values,
    errors,
    touched,
    loading,
    setValue,
    setFieldTouched,
    validateFieldOnBlur,
    handleSubmit,
    reset,
    isValid: Object.keys(errors).length === 0
  }
}

export { Form } 