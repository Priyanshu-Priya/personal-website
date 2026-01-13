-- Migration: Add owner_role and seo_keywords to global config
-- Description: Adds new fields for detailed identity and SEO management

DO $$
DECLARE
    config_json jsonb;
BEGIN
    SELECT config_value INTO config_json FROM site_config WHERE config_key = 'global';
    
    -- Add owner_role if missing
    IF (config_json->>'owner_role') IS NULL THEN
        config_json := config_json || '{"owner_role": "Full Stack Engineer"}';
    END IF;

    -- Add seo_keywords if missing
    IF (config_json->>'seo_keywords') IS NULL THEN
        config_json := config_json || '{"seo_keywords": ["Developer", "Portfolio", "Next.js", "React", "TypeScript"]}';
    END IF;

    UPDATE site_config SET config_value = config_json WHERE config_key = 'global';
END $$;
