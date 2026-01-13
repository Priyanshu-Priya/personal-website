-- Migration to update site_config with nested navigation structure
UPDATE site_config
SET config_value = jsonb_set(
    config_value,
    '{nav_items}',
    '[
        {"href": "/", "label": "Home"},
        {"href": "/about", "label": "About"},
        {"href": "/work/projects", "label": "Projects"},
        {
            "href": "/library", 
            "label": "Library", 
            "items": [
                {"href": "/library/blog", "label": "Blog"},
                {"href": "/library/thoughts", "label": "Thoughts"},
                {"href": "/library/resonance", "label": "Resonance"}
            ]
        },
        {"href": "/now", "label": "Now"}
    ]'::jsonb
)
WHERE config_key = 'global';
