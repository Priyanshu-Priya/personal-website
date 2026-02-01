import { HeroSection } from '@/components/home/hero-section-new';
import { ProjectsSection } from '@/components/home/projects-section';
import { BlogSection } from '@/components/home/blog-section';
import { ThoughtsSection } from '@/components/home/thoughts-section';
import { ResonanceSection } from '@/components/home/resonance-section';
import { TechStackSection } from '@/components/home/tech-stack-section';
import { CTASection } from '@/components/home/cta-section';
import { ContactSection } from '@/components/sections/contact-section';
import { createClient } from '@/lib/supabase/server';
import { getPageContent, getSiteConfig, defaultHomeContent, defaultGlobalConfig } from '@/lib/content';
import type { HomePageContent } from '@/types/content';
import { ReactNode } from 'react';

interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
    thumbnail_url: string | null;
    tech_stack: string[];
}

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    summary: string;
    cover_image: string | null;
    tags: string[];
    created_at: string;
}

interface Thought {
    id: string;
    content: string;
    mood: string | null;
    created_at: string;
}

interface ResonanceItem {
    id: string;
    title: string;
    type: string;
    url: string | null;
    commentary: string | null;
    resonance_score: number;
    created_at: string;
}

// Section configuration for dynamic ordering
type SectionKey = 'hero' | 'projects_section' | 'blog_section' | 'thoughts_section' | 'resonance_section' | 'tech_stack_section' | 'cta_section' | 'contact_section';

interface SectionConfig {
    key: SectionKey;
    order: number;
    enabled: boolean;
    render: () => ReactNode;
}

export default async function HomePage() {
    const supabase = await createClient();

    // Fetch CMS content and database data in parallel
    const [
        content,
        siteConfig,
        thoughtResult,
        projectsResult,
        postsResult,
        thoughtsResult,
        resonanceResult
    ] = await Promise.all([
        getPageContent<'home'>('home'),
        getSiteConfig(),
        supabase
            .from('thoughts')
            .select('content, mood, created_at')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single(),
        supabase
            .from('projects')
            .select('id, title, slug, summary, thumbnail_url, tech_stack, is_featured')
            .eq('is_published', true)
            .eq('is_featured', true)
            .order('display_date', { ascending: false, nullsFirst: false })
            .limit(6),
        supabase
            .from('blog_posts')
            .select('id, title, slug, summary, cover_image, tags, created_at')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(3),
        supabase
            .from('thoughts')
            .select('id, content, mood, created_at')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(3),
        supabase
            .from('resonance')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(4),
    ]);

    // Use CMS content or fallback to defaults
    const pageContent: HomePageContent = content || defaultHomeContent;
    const globalConfig = siteConfig || defaultGlobalConfig;

    const latestThought = thoughtResult.data;
    const projects = (projectsResult.data as Project[]) || [];
    const posts = (postsResult.data as BlogPost[]) || [];
    const thoughts = (thoughtsResult.data as Thought[]) || [];
    const resonance = (resonanceResult.data as ResonanceItem[]) || [];

    // Define all sections with their order and render functions
    const sections: SectionConfig[] = [
        {
            key: 'hero',
            order: pageContent.hero.order ?? 1,
            enabled: pageContent.hero.enabled,
            render: () => <HeroSection content={pageContent.hero} latestThought={latestThought} />,
        },
        {
            key: 'projects_section',
            order: pageContent.projects_section.order ?? 2,
            enabled: pageContent.projects_section.enabled,
            render: () => <ProjectsSection content={pageContent.projects_section} projects={projects} />,
        },
        {
            key: 'blog_section',
            order: pageContent.blog_section.order ?? 3,
            enabled: pageContent.blog_section.enabled,
            render: () => <BlogSection content={pageContent.blog_section} posts={posts} />,
        },
        {
            key: 'thoughts_section',
            order: pageContent.thoughts_section.order ?? 4,
            enabled: pageContent.thoughts_section.enabled,
            render: () => <ThoughtsSection content={pageContent.thoughts_section} thoughts={thoughts} />,
        },
        {
            key: 'resonance_section',
            order: pageContent.resonance_section.order ?? 5,
            enabled: pageContent.resonance_section.enabled,
            render: () => <ResonanceSection content={pageContent.resonance_section} resonance={resonance} />,
        },
        {
            key: 'tech_stack_section',
            order: pageContent.tech_stack_section.order ?? 6,
            enabled: pageContent.tech_stack_section.enabled,
            render: () => <TechStackSection content={pageContent.tech_stack_section} />,
        },
        {
            key: 'cta_section',
            order: pageContent.cta_section.order ?? 7,
            enabled: pageContent.cta_section.enabled,
            render: () => <CTASection content={pageContent.cta_section} socialLinks={globalConfig.social_links} />,
        },
        {
            key: 'contact_section',
            order: pageContent.contact_section?.order ?? 8,
            enabled: pageContent.contact_section?.enabled ?? true,
            render: () => (
                <ContactSection
                    title={pageContent.contact_section?.title ?? "Let's Build Together"}
                    subtitle={pageContent.contact_section?.subtitle ?? 'Have an idea or project in mind?'}
                    buttonText={pageContent.contact_section?.button_text ?? 'Send Message'}
                    nameLabel={pageContent.contact_section?.name_label}
                    emailLabel={pageContent.contact_section?.email_label}
                    messageLabel={pageContent.contact_section?.message_label}
                    namePlaceholder={pageContent.contact_section?.name_placeholder}
                    emailPlaceholder={pageContent.contact_section?.email_placeholder}
                    messagePlaceholder={pageContent.contact_section?.message_placeholder}
                    successMessage={pageContent.contact_section?.success_message}
                    config={globalConfig}
                />
            ),
        },
    ];

    // Sort sections by order and filter to enabled only
    const orderedSections = sections
        .filter((section) => section.enabled)
        .sort((a, b) => a.order - b.order);

    return (
        <main className="relative">
            {/* Noise texture overlay */}
            <div
                className="absolute inset-0 -z-10 pointer-events-none opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Content - sections rendered dynamically based on order */}
            <div className="relative z-10">
                {orderedSections.map((section) => (
                    <div key={section.key}>{section.render()}</div>
                ))}
            </div>
        </main>
    );
}
