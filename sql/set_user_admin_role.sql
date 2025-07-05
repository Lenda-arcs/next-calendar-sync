-- Set a user as admin
-- Replace 'your-user-id-here' with your actual user ID from Supabase Auth

-- Method 1: If you know your user ID
-- UPDATE users SET role = 'admin' WHERE id = 'your-user-id-here';

-- Method 2: If you know your email address
-- UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';

-- Method 3: To see all users and their current roles
SELECT id, email, name, role FROM users ORDER BY email;

-- Method 4: To set the first user as admin (if you only have one user)
-- UPDATE users SET role = 'admin' WHERE id = (SELECT id FROM users LIMIT 1);

-- Method 5: To create a moderator instead of admin
-- UPDATE users SET role = 'moderator' WHERE email = 'your-email@example.com'; 