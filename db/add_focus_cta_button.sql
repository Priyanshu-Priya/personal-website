-- Add CTA button and href to About page focus section
-- Run this in Supabase SQL Editor

UPDATE site_pages
SET content = jsonb_set(
    jsonb_set(
        content,
        '{focus,cta_button}',
        '"See What I''m Working On"'::jsonb
    ),
    '{focus,cta_href}',
    '"/now"'::jsonb
)
WHERE page_slug = 'about';

-- Verify the update
SELECT 
    page_slug, 
    content->'focus'->'cta_button' as cta_button,
    content->'focus'->'cta_href' as cta_href
FROM site_pages 
WHERE page_slug = 'about';
