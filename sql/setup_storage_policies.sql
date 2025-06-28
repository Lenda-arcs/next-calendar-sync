-- Storage Policies Setup for Profile Assets
-- Run this in your Supabase SQL Editor to set up proper storage security

-- Enable RLS on storage.objects (should already be enabled by default)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running this script)
DROP POLICY IF EXISTS "Users can view own profile assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own profile assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own profile assets with limits" ON storage.objects;
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

-- Policy 2: Users can upload profile assets with count limits
-- This policy enforces limits at the database level
CREATE POLICY "Users can upload own profile assets with limits" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-assets' AND
  (storage.foldername(name))[1] = 'users' AND
  (storage.foldername(name))[2] = auth.uid()::text AND
  
  -- Check count limits: avatars (5), tag-images (10), others (5)
  (
    SELECT COUNT(*) 
    FROM storage.objects existing
    WHERE existing.bucket_id = 'profile-assets' 
      AND (storage.foldername(existing.name))[1] = 'users'
      AND (storage.foldername(existing.name))[2] = auth.uid()::text
      AND (storage.foldername(existing.name))[3] = (storage.foldername(name))[3]
  ) < 
  CASE (storage.foldername(name))[3]
    WHEN 'avatars' THEN 5
    WHEN 'tag-images' THEN 10
    ELSE 5
  END
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

-- Create a helper function to check current image counts (optional, for debugging)
CREATE OR REPLACE FUNCTION get_user_image_count(
  user_id TEXT,
  folder_type TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  image_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO image_count
  FROM storage.objects
  WHERE bucket_id = 'profile-assets'
    AND (storage.foldername(name))[1] = 'users'
    AND (storage.foldername(name))[2] = user_id
    AND (folder_type IS NULL OR (storage.foldername(name))[3] = folder_type);
  
  RETURN COALESCE(image_count, 0);
END;
$$;

-- Grant execute permission on the helper function
GRANT EXECUTE ON FUNCTION get_user_image_count TO authenticated;

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

-- Test queries to verify limits are working
-- (Run these after trying to upload images)

-- Check current counts for authenticated user
-- SELECT 
--   (storage.foldername(name))[3] as folder_type,
--   COUNT(*) as current_count,
--   CASE 
--     WHEN (storage.foldername(name))[3] = 'avatars' THEN 5
--     WHEN (storage.foldername(name))[3] = 'tag-images' THEN 10
--     ELSE 5
--   END as limit
-- FROM storage.objects 
-- WHERE bucket_id = 'profile-assets'
--   AND (storage.foldername(name))[1] = 'users'
--   AND (storage.foldername(name))[2] = auth.uid()::text
-- GROUP BY (storage.foldername(name))[3];

-- Test the helper function
-- SELECT get_user_image_count(auth.uid()::text, 'avatars') as avatar_count;
-- SELECT get_user_image_count(auth.uid()::text, 'tag-images') as tag_count;

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