-- Migration: Add Contact to navigation and update CTA links
-- Run this in your Supabase SQL Editor

-- 1. Update site_config with Contact in nav_items
UPDATE site_config
SET config_value = jsonb_set(
    config_value,
    '{nav_items}',
    (
        SELECT jsonb_agg(item)
        FROM (
            SELECT item
            FROM jsonb_array_elements(config_value->'nav_items') AS item
            UNION ALL
            SELECT '{"href": "/contact", "label": "Contact", "is_cta": true}'::jsonb
            WHERE NOT EXISTS (
                SELECT 1 FROM jsonb_array_elements(config_value->'nav_items') AS existing
                WHERE existing->>'href' = '/contact'
            )
        ) AS combined
    )
)
WHERE config_key = 'global';

-- 2. Update home page content with contact_section and fix CTA link
UPDATE site_pages
SET content = content || '{
    "contact_section": {
        "enabled": true,
        "order": 8,
        "title": "Lets Build Together",
        "subtitle": "Have an idea or project in mind? Drop me a message.",
        "button_text": "Send Message"
    }
}'::jsonb
WHERE page_slug = 'home'
AND NOT (content ? 'contact_section');

-- 3. Update CTA section to link to /contact instead of /about
UPDATE site_pages
SET content = jsonb_set(
    content,
    '{cta_section,cta_primary_href}',
    '"/contact"'::jsonb
)
WHERE page_slug = 'home';

-- 4. Create contact page content if it doesn't exist
INSERT INTO site_pages (page_slug, content)
SELECT 'contact', '{
    "header": {
        "enabled": true,
        "title": "Get in Touch",
        "badge": "Lets Connect",
        "description": "Have a project in mind or just want to say hello? Id love to hear from you. Fill out the form below and Ill get back to you as soon as possible."
    },
    "form": {
        "name_label": "Name",
        "email_label": "Email",
        "message_label": "Message",
        "name_placeholder": "Your name",
        "email_placeholder": "your@email.com",
        "message_placeholder": "Tell me about your project or just say hello...",
        "submit_text": "Send Message",
        "success_message": "Thank you! Your message has been sent successfully."
    },
    "contact_info": {
        "email": "priyanshupriyacodes@gmail.com",
        "location": "India",
        "timezone": "IST (UTC+5:30)"
    },
    "availability": {
        "enabled": true,
        "status": "Available for Work",
        "message": "Im currently open to new opportunities and interesting projects."
    }
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM site_pages WHERE page_slug = 'contact');
