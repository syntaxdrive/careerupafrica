-- =============================================
-- GRANT ADMIN ROLE TO EXISTING USER
-- =============================================
-- This script allows you to upgrade an existing user to admin role
-- Run this in Supabase SQL Editor after a user has registered

-- Replace 'user@example.com' with the actual email address
-- of the user you want to make an admin

UPDATE profiles 
SET 
  user_type = 'admin',
  updated_at = now()
WHERE email = 'user@example.com';

-- Example: Make multiple users admins
-- UPDATE profiles 
-- SET 
--   user_type = 'admin',
--   updated_at = now()
-- WHERE email IN ('admin1@example.com', 'admin2@example.com');

-- Verify the change
SELECT id, email, full_name, user_type, created_at, updated_at
FROM profiles
WHERE user_type = 'admin';
