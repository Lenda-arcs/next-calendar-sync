/**
 * Type-safe RPC function wrappers for database functions
 * 
 * This module provides type-safe wrappers for Supabase RPC functions,
 * ensuring proper argument validation and return type safety.
 */

import type {
  DeleteInvoiceCascadeArgs,
  DeleteInvoiceCascadeReturn,
  DeleteUserCascadeArgs,
  DeleteUserCascadeReturn
} from '../types'

/**
 * Type-safe wrapper for delete_invoice_cascade RPC function
 * 
 * @param supabase - Supabase client instance
 * @param args - Typed arguments for the function
 * @returns Typed result from the database function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function deleteInvoiceCascade(supabase: any, args: DeleteInvoiceCascadeArgs): Promise<DeleteInvoiceCascadeReturn> {
  const { data, error } = await supabase.rpc('delete_invoice_cascade', args)
  
  if (error) {
    console.error("Error calling delete_invoice_cascade function:", error)
    const errorMessage = typeof error === 'object' && error?.message ? error.message : 'Unknown RPC error'
    throw new Error(`Failed to delete invoice: ${errorMessage}`)
  }
  
  const result = data as DeleteInvoiceCascadeReturn
  
  if (!result?.success) {
    console.error("Invoice deletion failed:", result?.error)
    throw new Error(`Failed to delete invoice: ${result?.error || 'Unknown error'}`)
  }
  
  return result
}

/**
 * Type-safe wrapper for delete_user_cascade RPC function
 * 
 * @param supabase - Supabase client instance  
 * @param args - Typed arguments for the function
 * @returns Typed result from the database function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function deleteUserCascade(supabase: any, args: DeleteUserCascadeArgs): Promise<DeleteUserCascadeReturn> {
  const { data, error } = await supabase.rpc('delete_user_cascade', args)
  
  if (error) {
    console.error("Error calling delete_user_cascade function:", error)
    const errorMessage = typeof error === 'object' && error?.message ? error.message : 'Unknown RPC error'
    throw new Error(`Failed to delete user: ${errorMessage}`)
  }
  
  const result = data as DeleteUserCascadeReturn
  
  if (!result?.success) {
    console.error("User deletion failed:", result?.error)
    throw new Error(`Failed to delete user: ${result?.error || 'Unknown error'}`)
  }
  
  return result
}

/**
 * Convenience function for invoice deletion with type safety
 * 
 * @param supabase - Supabase client instance
 * @param invoiceId - ID of the invoice to delete
 * @returns Promise that resolves to the deletion result
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function deleteInvoiceWithCleanup(supabase: any, invoiceId: string): Promise<DeleteInvoiceCascadeReturn> {
  const args: DeleteInvoiceCascadeArgs = { target_invoice_id: invoiceId }
  return deleteInvoiceCascade(supabase, args)
}

/**
 * Convenience function for user deletion with type safety
 * 
 * @param supabase - Supabase client instance
 * @param userId - ID of the user to delete
 * @returns Promise that resolves to the deletion result
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function deleteUserWithCleanup(supabase: any, userId: string): Promise<DeleteUserCascadeReturn> {
  const args: DeleteUserCascadeArgs = { target_user_id: userId }
  return deleteUserCascade(supabase, args)
}