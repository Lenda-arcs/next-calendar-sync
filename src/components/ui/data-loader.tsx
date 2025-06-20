import React from 'react'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from './alert'

interface DataLoaderProps<T> {
  data: T | null
  loading: boolean
  error: string | null
  empty?: React.ReactNode
  children: (data: T) => React.ReactNode
}

export default function DataLoader<T>({
  data,
  loading,
  error,
  empty = <div className="text-center py-8 text-gray-500">No data found</div>,
  children,
}: DataLoaderProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <>{empty}</>
  }

  return <>{children(data)}</>
} 