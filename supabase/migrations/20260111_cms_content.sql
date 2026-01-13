-- =========================================
-- CMS CONTENT MANAGEMENT SCHEMA
-- =========================================

-- 1. SITE PAGES TABLE (Page-specific content)
-- Each page (home, about, etc.) has its own JSONB content
CREATE TABLE IF NOT EXISTS site_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_slug TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SITE CONFIG TABLE (Global configuration)
-- Stores global settings like social links, nav items, footer text
CREATE TABLE IF NOT EXISTS site_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    config_key TEXT UNIQUE NOT NULL,
    config_value JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view site content)
CREATE POLICY "Public read access for site_pages" ON site_pages
    FOR SELECT USING (true);

CREATE POLICY "Public read access for site_config" ON site_config
    FOR SELECT USING (true);

-- Authenticated users can update (for admin dashboard)
CREATE POLICY "Authenticated update for site_pages" ON site_pages
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update for site_config" ON site_config
    FOR ALL USING (auth.role() = 'authenticated');

-- =========================================
-- INITIAL DATA: GLOBAL CONFIG
-- =========================================

INSERT INTO site_config (config_key, config_value) VALUES
('global', '{
    "site_name": "Priyanshu Priya",
    "site_tagline": "Full-Stack Developer & AI/ML Enthusiast",
    "contact_email": "hello@priyanshu.dev",
    "social_links": [
        { "platform": "github", "url": "https://github.com/priyanshupriya", "label": "GitHub" },
        { "platform": "linkedin", "url": "https://linkedin.com/in/priyanshupriya", "label": "LinkedIn" },
        { "platform": "twitter", "url": "https://twitter.com/priyanshupriya", "label": "Twitter" },
        { "platform": "email", "url": "mailto:hello@priyanshu.dev", "label": "Email" }
    ],
    "nav_items": [
        { "href": "/", "label": "Home" },
        { "href": "/about", "label": "About" },
        { "href": "/work/projects", "label": "Projects" },
        { "href": "/library", "label": "Library" },
        { "href": "/now", "label": "Now" }
    ],
    "footer": {
        "copyright": "Priyanshu Priya. All rights reserved."
    }
}'::jsonb)
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value, updated_at = NOW();

-- =========================================
-- INITIAL DATA: HOME PAGE
-- =========================================

INSERT INTO site_pages (page_slug, content) VALUES
('home', '{
    "hero": {
        "enabled": true,
        "status_badge": "Available for opportunities",
        "name_line1": "Priyanshu",
        "name_line2": "Priya",
        "subtitle": "Full-Stack Developer crafting digital experiences at the intersection of design and technology.",
        "focus_label": "Focus:",
        "focus_value": "Process > Perfection",
        "cta_primary": "View My Work",
        "cta_primary_href": "/work/projects",
        "cta_secondary": "About Me",
        "cta_secondary_href": "/about",
        "latest_thought_label": "Latest thought"
    },
    "projects_section": {
        "enabled": true,
        "title": "Featured Work",
        "subtitle": "Projects I have built with passion",
        "view_all_text": "View all",
        "view_all_href": "/work/projects"
    },
    "blog_section": {
        "enabled": true,
        "title": "Latest from Blog",
        "read_all_text": "Read all",
        "read_all_href": "/library/blog"
    },
    "thoughts_section": {
        "enabled": true,
        "title": "Quick Thoughts",
        "view_all_text": "View all",
        "view_all_href": "/library/thoughts"
    },
    "resonance_section": {
        "enabled": true,
        "title": "What Resonates",
        "subtitle": "Content that inspires me",
        "view_all_text": "See collection",
        "view_all_href": "/library/resonance"
    },
    "tech_stack_section": {
        "enabled": true,
        "label": "Tech Stack"
    },
    "cta_section": {
        "enabled": true,
        "title": "Lets Build Something",
        "title_highlight": "Amazing",
        "subtitle": "I am always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
        "cta_primary": "Get in Touch",
        "cta_primary_href": "/about",
        "cta_secondary": "Explore Library",
        "cta_secondary_href": "/library"
    }
}'::jsonb)
ON CONFLICT (page_slug) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

-- =========================================
-- INITIAL DATA: ABOUT PAGE
-- =========================================

INSERT INTO site_pages (page_slug, content) VALUES
('about', '{
    "header": {
        "enabled": true,
        "location": "Punjab, India",
        "title": "About Me",
        "intro": "Full-stack developer passionate about building impactful digital experiences. Currently exploring AI/ML while maintaining a foundation in modern web technologies."
    },
    "background": {
        "enabled": true,
        "section_title": "Background",
        "paragraphs": [
            "My programming journey started with curiosity about how things work and evolved into a passion for building them. I believe in the power of clean code, thoughtful design, and continuous learning.",
            "When I am not coding, you will find me exploring new technologies, contributing to open source, or diving deep into the latest AI/ML research."
        ]
    },
    "skills": {
        "enabled": true,
        "section_title": "Skills & Technologies",
        "categories": [
            { "name": "Languages", "items": ["TypeScript", "Python", "JavaScript", "SQL"] },
            { "name": "Frontend", "items": ["React", "Next.js", "TailwindCSS", "Framer Motion"] },
            { "name": "Backend", "items": ["Node.js", "Express", "FastAPI", "Supabase"] },
            { "name": "Tools", "items": ["Git", "Docker", "Vercel", "Figma"] }
        ]
    },
    "focus": {
        "enabled": true,
        "section_title": "Current Focus",
        "badge": "What I am Working On",
        "items": [
            "Building production-ready full-stack applications",
            "Exploring AI/ML integration in web applications",
            "Preparing for campus placements",
            "Contributing to open-source projects"
        ]
    },
    "connect": {
        "enabled": true,
        "section_title": "Lets Connect",
        "cta_button": "Get in Touch",
        "cta_href": "mailto:hello@priyanshu.dev"
    }
}'::jsonb)
ON CONFLICT (page_slug) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

-- =========================================
-- INITIAL DATA: LIBRARY PAGE
-- =========================================

INSERT INTO site_pages (page_slug, content) VALUES
('library', '{
    "header": {
        "enabled": true,
        "title": "Library",
        "subtitle": "Long-form articles, quick thoughts, and things that resonate with me."
    },
    "blog_section": {
        "enabled": true,
        "section_title": "Blog",
        "view_all_text": "View all",
        "view_all_href": "/library/blog",
        "empty_text": "No blog posts yet."
    },
    "thoughts_section": {
        "enabled": true,
        "section_title": "Thoughts",
        "view_all_text": "View all",
        "view_all_href": "/library/thoughts",
        "empty_text": "No thoughts yet."
    },
    "resonance_section": {
        "enabled": true,
        "section_title": "Resonance",
        "view_all_text": "View all",
        "view_all_href": "/library/resonance",
        "empty_text": "No resonance items yet."
    }
}'::jsonb)
ON CONFLICT (page_slug) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

-- =========================================
-- INITIAL DATA: NOW PAGE
-- =========================================

INSERT INTO site_pages (page_slug, content) VALUES
('now', '{
    "header": {
        "enabled": true,
        "title": "Now",
        "subtitle": "What I am focused on right now.",
        "inspired_by_text": "Inspired by nownownow.com",
        "inspired_by_url": "https://nownownow.com"
    },
    "current_focus": {
        "enabled": true,
        "section_title": "Current Focus",
        "items": [
            "Building production-ready full-stack applications",
            "Exploring AI/ML integration in web applications",
            "Preparing for campus placements",
            "Contributing to open-source projects"
        ]
    },
    "working_on": {
        "enabled": true,
        "section_title": "Working On",
        "view_all_text": "View all",
        "view_all_href": "/work/projects"
    },
    "learning": {
        "enabled": true,
        "section_title": "Learning",
        "items": [
            "Advanced React patterns and performance optimization",
            "System design fundamentals",
            "Deep learning with PyTorch"
        ]
    },
    "recent_thoughts": {
        "enabled": true,
        "section_title": "Recent Thoughts",
        "view_all_text": "View all",
        "view_all_href": "/library/thoughts"
    }
}'::jsonb)
ON CONFLICT (page_slug) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

-- =========================================
-- INITIAL DATA: PROJECTS PAGE
-- =========================================

INSERT INTO site_pages (page_slug, content) VALUES
('projects', '{
    "header": {
        "enabled": true,
        "badge": "Portfolio",
        "title": "Projects",
        "subtitle": "A collection of projects I have built, from web applications to AI experiments."
    },
    "featured_badge": "Featured",
    "empty_state": {
        "title": "No projects yet",
        "subtitle": "Check back soon!"
    }
}'::jsonb)
ON CONFLICT (page_slug) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();
