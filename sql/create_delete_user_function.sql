-- Create a SQL function for comprehensive user deletion
-- This function can be called from the API to safely delete a user and all associated data

CREATE OR REPLACE FUNCTION delete_user_cascade(target_user_id UUID)
RETURNS JSON AS $$
DECLARE
    user_email TEXT;
    user_name TEXT;
    deletion_log JSON;
    error_details TEXT;
BEGIN
    -- Get user details for logging
    SELECT email, name INTO user_email, user_name
    FROM users WHERE id = target_user_id;
    
    IF user_email IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User not found',
            'user_id', target_user_id
        );
    END IF;
    
    -- Prevent deletion of admin users
    IF EXISTS (SELECT 1 FROM users WHERE id = target_user_id AND role = 'admin') THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Cannot delete admin users for security reasons',
            'user_id', target_user_id,
            'user_email', user_email,
            'user_name', user_name
        );
    END IF;
    
    -- Start deletion process
    BEGIN
        -- 1. Delete invoices (references events, billing_entities)
        DELETE FROM invoices WHERE user_id = target_user_id;
        
        -- 2. Delete events (might be referenced by invoices)
        DELETE FROM events WHERE user_id = target_user_id;
        
        -- 3. Delete calendar feeds
        DELETE FROM calendar_feeds WHERE user_id = target_user_id;
        
        -- 4. Delete tags
        DELETE FROM tags WHERE user_id = target_user_id;
        
        -- 5. Delete billing entities
        DELETE FROM billing_entities WHERE user_id = target_user_id;
        
        -- 6. Delete user invoice settings
        DELETE FROM user_invoice_settings WHERE user_id = target_user_id;
        
        -- 7. Delete OAuth calendar integrations
        DELETE FROM oauth_calendar_integrations WHERE user_id = target_user_id;
        
        -- 8. Clean rate limit blocks (by email/identifier)
        DELETE FROM rate_limit_blocks WHERE identifier = user_email;
        
        -- 9. Update user invitations (set foreign keys to NULL instead of deleting)
        UPDATE user_invitations 
        SET invited_by = NULL 
        WHERE invited_by = target_user_id;
        
        UPDATE user_invitations 
        SET used_by = NULL 
        WHERE used_by = target_user_id;
        
        -- 10. Delete from users table (main profile)
        DELETE FROM users WHERE id = target_user_id;
        
        -- Note: auth.users deletion must be handled separately via API
        -- since it requires service role privileges
        
        -- Return success
        RETURN json_build_object(
            'success', true,
            'message', 'User and associated data deleted successfully',
            'user_id', target_user_id,
            'user_email', user_email,
            'user_name', user_name,
            'note', 'Auth user must be deleted separately via API'
        );
        
    EXCEPTION
        WHEN OTHERS THEN
            -- Get error details
            GET STACKED DIAGNOSTICS error_details = MESSAGE_TEXT;
            
            -- Return error
            RETURN json_build_object(
                'success', false,
                'error', 'Database deletion failed: ' || error_details,
                'user_id', target_user_id,
                'user_email', user_email,
                'user_name', user_name
            );
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user_cascade(UUID) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION delete_user_cascade(UUID) IS 
'Safely deletes a user and all associated data from the database. 
Returns JSON with success status and details. 
Note: auth.users deletion must be handled separately via service role API.'; 