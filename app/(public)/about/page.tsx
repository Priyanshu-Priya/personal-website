import { AboutPageClient } from './about-client';
import { getPageContent, getSiteConfig, defaultAboutContent, defaultGlobalConfig } from '@/lib/content';
import type { AboutPageContent, GlobalConfig } from '@/types/content';

export default async function AboutPage() {
    // Fetch CMS content
    const [content, globalConfig] = await Promise.all([
        getPageContent<'about'>('about'),
        getSiteConfig(),
    ]);

    // Use CMS content or fallback to defaults
    const pageContent: AboutPageContent = content || defaultAboutContent;
    const siteConfig: GlobalConfig = globalConfig || defaultGlobalConfig;

    return (
        <AboutPageClient
            content={pageContent}
            socialLinks={siteConfig.social_links}
            resumeUrl={siteConfig.resume_url}
        />
    );
}
