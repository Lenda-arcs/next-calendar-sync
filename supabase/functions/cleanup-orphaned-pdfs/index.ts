import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting orphaned PDF cleanup...')

    // Get all PDF files from storage
    const { data: allFolders, error: listError } = await supabase.storage
      .from('invoice-pdfs')
      .list('invoices')

    if (listError) {
      console.error('Error listing storage folders:', listError)
      throw listError
    }

    if (!allFolders || allFolders.length === 0) {
      console.log('No folders found in storage')
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No folders found in storage',
          deleted: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let totalDeleted = 0
    const deletionResults: Array<{
      path: string
      success: boolean
      error?: string
      filesDeleted?: number
    }> = []

    // Process each user folder
    for (const userFolder of allFolders) {
      if (!userFolder.name) continue

      const userId = userFolder.name
      console.log(`Processing user folder: ${userId}`)

      // List all invoice folders for this user
      const { data: invoiceFolders, error: invoiceListError } = await supabase.storage
        .from('invoice-pdfs')
        .list(`invoices/${userId}`)

      if (invoiceListError) {
        console.error(`Error listing invoice folders for user ${userId}:`, invoiceListError)
        continue
      }

      if (!invoiceFolders || invoiceFolders.length === 0) {
        console.log(`No invoice folders found for user ${userId}`)
        continue
      }

      // Check each invoice folder
      for (const invoiceFolder of invoiceFolders) {
        if (!invoiceFolder.name) continue

        const invoiceId = invoiceFolder.name
        const folderPath = `invoices/${userId}/${invoiceId}`

        // Check if invoice exists in database
        const { data: invoice, error: dbError } = await supabase
          .from('invoices')
          .select('id, created_at')
          .eq('id', invoiceId)
          .eq('user_id', userId)
          .single()

        if (dbError && dbError.code !== 'PGRST116') {
          console.error(`Database error checking invoice ${invoiceId}:`, dbError)
          continue
        }

        // If invoice doesn't exist, it's orphaned
        if (!invoice) {
          console.log(`Found orphaned PDF folder: ${folderPath} (no corresponding invoice)`)
          
          // List files in the folder
          const { data: files, error: filesError } = await supabase.storage
            .from('invoice-pdfs')
            .list(folderPath)

          if (filesError) {
            console.error(`Error listing files in ${folderPath}:`, filesError)
            continue
          }

          if (files && files.length > 0) {
            // Delete all files in the folder
            const filesToDelete = files.map(file => `${folderPath}/${file.name}`)
            
            const { error: deleteError } = await supabase.storage
              .from('invoice-pdfs')
              .remove(filesToDelete)

            if (deleteError) {
              console.error(`Error deleting files in ${folderPath}:`, deleteError)
              deletionResults.push({
                path: folderPath,
                success: false,
                error: deleteError.message
              })
            } else {
              console.log(`Successfully deleted ${files.length} files from ${folderPath}`)
              totalDeleted += files.length
              deletionResults.push({
                path: folderPath,
                success: true,
                filesDeleted: files.length
              })
            }
          }
        }
      }
    }

    console.log(`Cleanup complete. Total files deleted: ${totalDeleted}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Cleanup completed successfully`,
        totalDeleted,
        details: deletionResults
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Cleanup function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}) 