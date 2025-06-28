-- Rollback: Remove is_featured field from users table
DROP INDEX IF EXISTS idx_users_is_featured;
ALTER TABLE users DROP COLUMN IF EXISTS is_featured;
