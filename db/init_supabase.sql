-- =========================================
-- PERSONAL WEBSITE - SUPABASE INITIALIZATION
-- Complete database schema and seed data
-- =========================================

-- =========================================
-- 1. SITE CONFIG TABLE
-- =========================================

DROP TABLE IF EXISTS site_config CASCADE;

CREATE TABLE site_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key TEXT UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default global config
INSERT INTO site_config (config_key, config_value)
VALUES ('global', '{
    "site_name": "Priyanshu Priya",
    "site_tagline": "Full-Stack Developer",
    "contact_email": "hello@priyanshu.dev",
    "owner_name": "Priyanshu Priya",
    "owner_role": "Full Stack Engineer",
    "seo_keywords": ["Developer", "Portfolio", "Next.js", "React", "TypeScript", "AI", "Machine Learning"],
    "resume_url": null,
    "social_links": [
        { "platform": "github", "url": "https://github.com", "label": "GitHub" },
        { "platform": "linkedin", "url": "https://linkedin.com", "label": "LinkedIn" },
        { "platform": "twitter", "url": "https://twitter.com", "label": "Twitter" },
        { "platform": "email", "url": "mailto:hello@priyanshu.dev", "label": "Email" }
    ],
    "nav_items": [
        { "href": "/", "label": "Home" },
        { "href": "/about", "label": "About" },
        { "href": "/work/projects", "label": "Projects" },
        {
            "href": "/library",
            "label": "Library",
            "items": [
                { "href": "/library/blog", "label": "Blog" },
                { "href": "/library/thoughts", "label": "Thoughts" },
                { "href": "/library/resonance", "label": "Resonance" }
            ]
        },
        { "href": "/now", "label": "Now" },
        { "href": "/contact", "label": "Contact", "is_cta": true }
    ],
    "footer": {
        "copyright": "Priyanshu Priya. All rights reserved.",
        "description": ["Full-Stack Developer", "Crafting digital experiences"]
    }
}'::jsonb);

-- =========================================
-- 2. SITE PAGES TABLE
-- =========================================

DROP TABLE IF EXISTS site_pages CASCADE;

CREATE TABLE site_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_slug TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- 3. PROJECTS TABLE
-- =========================================

DROP TABLE IF EXISTS projects CASCADE;

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT, -- Markdown/MDX content
    thumbnail_url TEXT,
    tech_stack TEXT[],
    project_type TEXT, -- e.g., "Web App", "Mobile", "AI/ML"
    github_url TEXT,
    live_url TEXT,
    demo_url TEXT,
    linkedin_post_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    working_on BOOLEAN DEFAULT false, -- Show in "Working On" section
    display_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- 4. BLOG POSTS TABLE
-- =========================================

DROP TABLE IF EXISTS blog_posts CASCADE;

CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT, -- Markdown/MDX
    cover_image TEXT,
    tags TEXT[],
    view_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- 5. THOUGHTS TABLE (Micro-blogging)
-- =========================================

DROP TABLE IF EXISTS thoughts CASCADE;

CREATE TABLE thoughts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    mood TEXT, -- e.g., "Excited", "Pensive"
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- 6. RESONANCE TABLE (Curated Resources)
-- =========================================

DROP TABLE IF EXISTS resonance CASCADE;

CREATE TABLE resonance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL, -- "Article", "Video", "Book", "Tool"
    commentary TEXT,
    resonance_score INTEGER DEFAULT 50, -- 0 to 100
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- 7. ENABLE ROW LEVEL SECURITY
-- =========================================

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resonance ENABLE ROW LEVEL SECURITY;

-- =========================================
-- 8. RLS POLICIES
-- =========================================

-- Site Config
CREATE POLICY "Public Read config" ON site_config FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin Update config" ON site_config FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Insert config" ON site_config FOR INSERT TO authenticated WITH CHECK (true);

-- Site Pages
CREATE POLICY "Public Read pages" ON site_pages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin Update pages" ON site_pages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Insert pages" ON site_pages FOR INSERT TO authenticated WITH CHECK (true);

-- Projects
CREATE POLICY "Public Read projects" ON projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin All projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Blog Posts
CREATE POLICY "Public Read blog" ON blog_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin All blog" ON blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Thoughts (Fixed: Authenticated users can do everything)
CREATE POLICY "Public Read thoughts" ON thoughts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated All thoughts" ON thoughts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Resonance
CREATE POLICY "Public Read resonance" ON resonance FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin All resonance" ON resonance FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================
-- NOTES FOR CONTENT UPDATES
-- =========================================
-- 
-- About page focus section now supports these fields in content JSON:
--   focus.cta_button: "See What I'm Working On"
--   focus.cta_href: "/now"
--
-- Home page contact_section supports these fields:
--   name_label, email_label, message_label
--   name_placeholder, email_placeholder, message_placeholder
--   success_message
--
-- =========================================
