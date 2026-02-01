-- Fix RLS Policies for Thoughts Table

-- 1. Ensure RLS is enabled
ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts or stale definitions
DROP POLICY IF EXISTS "Public Read thoughts" ON thoughts;
DROP POLICY IF EXISTS "Admin All thoughts" ON thoughts;
DROP POLICY IF EXISTS "Authenticated All thoughts" ON thoughts;

-- 3. Create permissive policies for authenticated users
-- Allow everyone to read (public)
CREATE POLICY "Public Read thoughts" 
ON thoughts FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow authenticated users to do EVERYTHING (Insert, Update, Delete)
CREATE POLICY "Authenticated All thoughts" 
ON thoughts FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
