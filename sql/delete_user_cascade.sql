-- Comprehensive user deletion script that removes all user data and references
-- This script safely deletes a user and all their associated data while respecting foreign key constraints
-- 
-- Usage: Replace $USER_ID with the actual user ID to delete
-- 
-- WARNING: This is irreversible! Make sure to backup data if needed.

DO $$
DECLARE
    target_user_id UUID := '$USER_ID'; -- Replace with actual user ID
    user_email TEXT;
    user_name TEXT;
BEGIN
    -- Get user details for logging
    SELECT email, name INTO user_email, user_name
    FROM users WHERE id = target_user_id;
    
    IF user_email IS NULL THEN
        RAISE NOTICE 'User with ID % not found', target_user_id;
        RETURN;
    END IF;
    
    RAISE NOTICE 'Starting deletion of user: % (%) - ID: %', user_name, user_email, target_user_id;
    
    -- Delete in order to respect foreign key constraints
    
    -- 1. Delete invoices (references events, billing_entities)
    DELETE FROM invoices WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted invoices for user %', target_user_id;
    
    -- 2. Delete events (might be referenced by invoices)
    DELETE FROM events WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted events for user %', target_user_id;
    
    -- 3. Delete calendar feeds
    DELETE FROM calendar_feeds WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted calendar feeds for user %', target_user_id;
    
    -- 4. Delete tags
    DELETE FROM tags WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted tags for user %', target_user_id;
    
    -- 5. Delete billing entities
    DELETE FROM billing_entities WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted billing entities for user %', target_user_id;
    
    -- 6. Delete user invoice settings
    DELETE FROM user_invoice_settings WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted user invoice settings for user %', target_user_id;
    
    -- 7. Delete OAuth calendar integrations
    DELETE FROM oauth_calendar_integrations WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted OAuth integrations for user %', target_user_id;
    
    -- 8. Clean rate limit blocks (by email/identifier - this table doesn't use user_id)
    DELETE FROM rate_limit_blocks WHERE identifier = user_email;
    RAISE NOTICE 'Deleted rate limit blocks for identifier %', user_email;
    
    -- 9. Update user invitations (set foreign keys to NULL instead of deleting)
    -- invited_by and used_by reference this user
    UPDATE user_invitations 
    SET invited_by = NULL 
    WHERE invited_by = target_user_id;
    
    UPDATE user_invitations 
    SET used_by = NULL 
    WHERE used_by = target_user_id;
    
    RAISE NOTICE 'Updated invitation references for user %', target_user_id;
    
    -- 10. Handle studios (if user is associated)
    -- Note: We don't delete studios, just remove the user association if any
    -- This depends on your studio schema - adjust as needed
    
    -- 11. Delete from users table (main profile)
    DELETE FROM users WHERE id = target_user_id;
    RAISE NOTICE 'Deleted user profile for user %', target_user_id;
    
    -- 12. Delete from auth.users (Supabase auth)
    -- Note: This requires service role privileges and may need to be done via API
    -- If this fails, use the Supabase dashboard or API with service role key
    BEGIN
        DELETE FROM auth.users WHERE id = target_user_id;
        RAISE NOTICE 'Deleted auth record for user %', target_user_id;
    EXCEPTION
        WHEN insufficient_privilege THEN
            RAISE NOTICE 'Could not delete auth user % - insufficient privileges. Use Supabase dashboard or API with service role key', target_user_id;
        WHEN OTHERS THEN
            RAISE NOTICE 'Error deleting auth user %: %', target_user_id, SQLERRM;
    END;
    
    RAISE NOTICE 'Successfully deleted user: % (%) - ID: %', user_name, user_email, target_user_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error deleting user %: %', target_user_id, SQLERRM;
        RAISE;
END $$; 