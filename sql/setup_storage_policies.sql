-- Storage Policies Setup for Profile Assets
-- Run this in your Supabase SQL Editor to set up proper storage security

-- Enable RLS on storage.objects (should already be enabled by default)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running this script)
DROP POLICY IF EXISTS "Users can view own profile assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own profile assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can view profile images" ON storage.objects;

-- Policy 1: Users can view their own profile assets
CREATE POLICY "Users can view own profile assets" ON storage.objects
FOR SELECT USING (
  bucket_id = 'profile-assets' AND
  (storage.foldername(name))[1] = 'users' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Policy 2: Users can upload their own profile assets
CREATE POLICY "Users can upload own profile assets" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-assets' AND
  (storage.foldername(name))[1] = 'users' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Policy 3: Users can update their own profile assets
CREATE POLICY "Users can update own profile assets" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-assets' AND
  (storage.foldername(name))[1] = 'users' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Policy 4: Users can delete their own profile assets
CREATE POLICY "Users can delete own profile assets" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-assets' AND
  (storage.foldername(name))[1] = 'users' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Policy 5: Public can view profile avatars (for public profile pages)
-- This allows public access to profile pictures when users share their profile URLs
CREATE POLICY "Public can view profile images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'profile-assets' AND
  (storage.foldername(name))[1] = 'users' AND
  (storage.foldername(name))[3] = 'avatars'
);

-- Verify policies were created successfully
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%profile%'
ORDER BY policyname;

-- Test query to verify folder structure (run after uploading some images)
-- SELECT 
--   name,
--   bucket_id,
--   owner,
--   created_at
-- FROM storage.objects 
-- WHERE bucket_id = 'profile-assets'
-- ORDER BY created_at DESC
-- LIMIT 10; 