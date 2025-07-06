-- Add calendar invitation system support
-- This table stores calendar invitations sent to our system

CREATE TABLE IF NOT EXISTS calendar_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invitation_email TEXT NOT NULL, -- The unique email we generated (e.g., user123@calendarsync.yourdomain.com)
    calendar_provider TEXT, -- Detected provider (google, outlook, etc.)
    calendar_name TEXT, -- Name of the calendar from the invitation
    calendar_description TEXT, -- Description from the invitation
    calendar_metadata JSONB DEFAULT '{}', -- Additional metadata from the invitation
    invitation_data JSONB DEFAULT '{}', -- Raw invitation data for debugging
    feed_url TEXT, -- Extracted calendar feed URL (if available)
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'processed', 'expired', 'failed')),
    invited_at TIMESTAMPTZ, -- When the invitation was sent
    accepted_at TIMESTAMPTZ, -- When the invitation was accepted
    processed_at TIMESTAMPTZ, -- When we processed the invitation
    expires_at TIMESTAMPTZ NOT NULL, -- When the invitation expires
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique invitation emails per user
    UNIQUE(user_id, invitation_email)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_calendar_invitations_user_id ON calendar_invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_invitations_status ON calendar_invitations(status);
CREATE INDEX IF NOT EXISTS idx_calendar_invitations_expires_at ON calendar_invitations(expires_at);
CREATE INDEX IF NOT EXISTS idx_calendar_invitations_email ON calendar_invitations(invitation_email);

-- Add RLS (Row Level Security) policies
ALTER TABLE calendar_invitations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own invitations
CREATE POLICY "Users can view their own calendar invitations" ON calendar_invitations
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own invitations
CREATE POLICY "Users can insert their own calendar invitations" ON calendar_invitations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own invitations
CREATE POLICY "Users can update their own calendar invitations" ON calendar_invitations
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own invitations
CREATE POLICY "Users can delete their own calendar invitations" ON calendar_invitations
    FOR DELETE USING (auth.uid() = user_id);

-- Update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_calendar_invitations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_calendar_invitations_updated_at
    BEFORE UPDATE ON calendar_invitations
    FOR EACH ROW
    EXECUTE FUNCTION update_calendar_invitations_updated_at();

-- Function to generate unique invitation emails
CREATE OR REPLACE FUNCTION generate_invitation_email(p_user_id UUID, p_domain TEXT DEFAULT 'calendarsync.yourdomain.com')
RETURNS TEXT AS $$
DECLARE
    user_hash TEXT;
    timestamp_hash TEXT;
    invitation_email TEXT;
BEGIN
    -- Create a hash from user ID and current timestamp for uniqueness
    user_hash := encode(digest(p_user_id::TEXT, 'sha256'), 'hex');
    timestamp_hash := encode(digest(EXTRACT(EPOCH FROM NOW())::TEXT, 'sha256'), 'hex');
    
    -- Take first 8 characters of each hash for readability
    invitation_email := 'cal-' || substr(user_hash, 1, 8) || '-' || substr(timestamp_hash, 1, 8) || '@' || p_domain;
    
    RETURN invitation_email;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired invitations
CREATE OR REPLACE FUNCTION cleanup_expired_invitations()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM calendar_invitations 
    WHERE expires_at < NOW() 
    AND status IN ('pending', 'failed');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql; 