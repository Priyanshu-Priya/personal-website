-- =========================================
-- FRESH PROJECTS TABLE SCHEMA
-- Master Project Architecture
-- WARNING: This will DELETE all existing project data!
-- =========================================

-- Drop existing table (this will delete all data)
DROP TABLE IF EXISTS projects CASCADE;

-- Create new projects table with Master Architecture fields
CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Core Fields
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    content TEXT,
    
    -- Media
    thumbnail_url TEXT,
    
    -- Tech Stack (array for card display)
    tech_stack TEXT[] DEFAULT '{}',
    
    -- Card Layer Fields
    project_type TEXT,
    status TEXT DEFAULT 'Completed',
    role TEXT,
    display_date DATE,  -- Changed from TEXT to DATE for proper date handling
    
    -- Links
    github_url TEXT,
    live_url TEXT,
    demo_url TEXT,
    docs_url TEXT,
    linkedin_post_url TEXT,
    
    -- Display Settings
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_published ON projects(is_published);
CREATE INDEX idx_projects_featured ON projects(is_featured);
CREATE INDEX idx_projects_display_date ON projects(display_date);

-- Add RLS (Row Level Security) policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access for published projects
CREATE POLICY "Public can view published projects"
    ON projects FOR SELECT
    USING (is_published = true);

-- Allow authenticated users full access (for CMS)
CREATE POLICY "Authenticated users have full access"
    ON projects FOR ALL
    USING (auth.role() = 'authenticated');
