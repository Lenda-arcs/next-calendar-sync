-- Migration: Add is_featured field to users table
ALTER TABLE users ADD COLUMN is_featured boolean DEFAULT false;
COMMENT ON COLUMN users.is_featured IS 'Marks a teacher profile as featured for highlighting on the /schedule page.';
CREATE INDEX idx_users_is_featured ON users (is_featured) WHERE is_featured = true;
