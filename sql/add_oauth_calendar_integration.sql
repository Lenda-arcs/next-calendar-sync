-- Add OAuth calendar integration support
-- This table stores encrypted OAuth tokens and calendar metadata

CREATE TABLE IF NOT EXISTS oauth_calendar_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('google', 'outlook', 'apple', 'yahoo')),
    provider_user_id TEXT NOT NULL, -- The user ID from the OAuth provider
    access_token TEXT NOT NULL, -- Encrypted OAuth access token
    refresh_token TEXT, -- Encrypted OAuth refresh token (nullable for some providers)
    calendar_ids TEXT[] NOT NULL DEFAULT '{}', -- Array of calendar IDs from the provider
    scopes TEXT[] NOT NULL DEFAULT '{}', -- Array of granted OAuth scopes
    expires_at TIMESTAMPTZ, -- When the access token expires
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one integration per provider per user
    UNIQUE(user_id, provider)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_oauth_integrations_user_id ON oauth_calendar_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_integrations_provider ON oauth_calendar_integrations(provider);
CREATE INDEX IF NOT EXISTS idx_oauth_integrations_expires_at ON oauth_calendar_integrations(expires_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE oauth_calendar_integrations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own integrations
CREATE POLICY "Users can view their own OAuth integrations" ON oauth_calendar_integrations
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own integrations
CREATE POLICY "Users can insert their own OAuth integrations" ON oauth_calendar_integrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own integrations
CREATE POLICY "Users can update their own OAuth integrations" ON oauth_calendar_integrations
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own integrations
CREATE POLICY "Users can delete their own OAuth integrations" ON oauth_calendar_integrations
    FOR DELETE USING (auth.uid() = user_id);

-- Update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_oauth_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_oauth_integrations_updated_at
    BEFORE UPDATE ON oauth_calendar_integrations
    FOR EACH ROW
    EXECUTE FUNCTION update_oauth_integrations_updated_at(); 