-- Create user_invitations table for teacher invitation system
-- This allows admins to invite teachers who can bypass beta protection

CREATE TABLE user_invitations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Invitation details
  email text NOT NULL,
  token text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  
  -- Invitation metadata
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  invited_name text, -- Optional name for the invited person
  personal_message text, -- Optional personal message from inviter
  
  -- Expiration and usage tracking
  expires_at timestamp with time zone NOT NULL,
  used_at timestamp with time zone,
  used_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Admin tracking
  notes text -- Internal notes about the invitation
);

-- Create indexes for performance
CREATE INDEX idx_user_invitations_email ON user_invitations(email);
CREATE INDEX idx_user_invitations_token ON user_invitations(token);
CREATE INDEX idx_user_invitations_status ON user_invitations(status);
CREATE INDEX idx_user_invitations_expires_at ON user_invitations(expires_at);

-- Enable RLS
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Admins can manage all invitations
CREATE POLICY "Admins can manage invitations" ON user_invitations
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- Users can view their own invitations (by email)
CREATE POLICY "Users can view own invitations" ON user_invitations
  FOR SELECT USING (
    email = auth.email()
  );

-- Allow anonymous access to validate tokens (needed for registration)
CREATE POLICY "Anonymous can validate tokens" ON user_invitations
  FOR SELECT USING (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON user_invitations TO authenticated;
GRANT SELECT ON user_invitations TO anon; -- Needed for token validation

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_invitations_updated_at BEFORE UPDATE
  ON user_invitations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 