-- Add working_on column to projects table
ALTER TABLE projects 
ADD COLUMN working_on BOOLEAN DEFAULT false;

-- Policy to ensure it's updatable (if specific column RLS exists, otherwise usually covered by general update policy)
-- No specific action needed if RLS is row-based 'ALL' for authenticated users.

-- Optional: Set some existing recent projects to true likely for testing (uncomment if needed)
-- UPDATE projects SET working_on = true ORDER BY created_at DESC LIMIT 1;
