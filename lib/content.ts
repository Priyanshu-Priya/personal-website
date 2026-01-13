import { createClient } from '@/lib/supabase/server';
import type {
    GlobalConfig,
    PageSlug,
    PageContentMap,
    HomePageContent,
    AboutPageContent,
    LibraryPageContent,
    NowPageContent,
    ProjectsPageContent,
    ContactPageContent,
} from '@/types/content';

// =========================================
// GET PAGE CONTENT
// Fetches typed content for a specific page
// =========================================

export async function getPageContent<T extends PageSlug>(
    slug: T
): Promise<PageContentMap[T] | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('site_pages')
        .select('content')
        .eq('page_slug', slug)
        .single();

    if (error || !data) {
        console.error(`Failed to fetch content for page: ${slug}`, error);
        return null;
    }

    return data.content as PageContentMap[T];
}

// =========================================
// GET SITE CONFIG
// Fetches global configuration (social links, nav, etc.)
// =========================================

export async function getSiteConfig(): Promise<GlobalConfig | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('site_config')
        .select('config_value')
        .eq('config_key', 'global')
        .single();

    if (error || !data) {
        console.error('Failed to fetch site config', error);
        return null;
    }

    return data.config_value as GlobalConfig;
}

// =========================================
// DEFAULT FALLBACK CONTENT
// Used when database fetch fails (prevents crashes)
// =========================================

export const defaultHomeContent: HomePageContent = {
    hero: {
        enabled: true,
        order: 1,
        status_badge: 'Available for opportunities',
        name_line1: 'Priyanshu',
        name_line2: 'Priya',
        subtitle: 'Full-Stack Developer crafting digital experiences.',
        focus_label: 'Focus:',
        focus_value: 'Process > Perfection',
        cta_primary: 'View My Work',
        cta_primary_href: '/work/projects',
        cta_secondary: 'About Me',
        cta_secondary_href: '/about',
        latest_thought_label: 'Latest thought',
    },
    projects_section: {
        enabled: true,
        order: 2,
        title: 'Featured Work',
        subtitle: 'Projects I have built with passion',
        view_all_text: 'View all',
        view_all_href: '/work/projects',
    },
    blog_section: {
        enabled: true,
        order: 3,
        title: 'Latest from Blog',
        read_all_text: 'Read all',
        read_all_href: '/library/blog',
    },
    thoughts_section: {
        enabled: true,
        order: 4,
        title: 'Quick Thoughts',
        view_all_text: 'View all',
        view_all_href: '/library/thoughts',
    },
    resonance_section: {
        enabled: true,
        order: 5,
        title: 'What Resonates',
        subtitle: 'Content that inspires me',
        view_all_text: 'View all',
        view_all_href: '/library/resonance',
    },
    tech_stack_section: {
        enabled: true,
        order: 6,
        label: 'Tech Stack',
        items: [
            { name: 'TypeScript', color: 'text-blue-400' },
            { name: 'React', color: 'text-cyan-400' },
            { name: 'Next.js', color: 'text-white' },
            { name: 'Python', color: 'text-yellow-400' },
            { name: 'Supabase', color: 'text-emerald-400' },
            { name: 'TailwindCSS', color: 'text-teal-400' },
            { name: 'Node.js', color: 'text-green-400' },
            { name: 'PostgreSQL', color: 'text-blue-300' },
            { name: 'Framer Motion', color: 'text-pink-400' },
            { name: 'C++', color: 'text-violet-400' },
        ],
    },
    cta_section: {
        enabled: true,
        order: 7,
        title: 'Lets Build Something',
        title_highlight: 'Amazing',
        subtitle: 'I am always open to discussing new projects.',
        cta_primary: 'Get in Touch',
        cta_primary_href: '/contact',
        cta_secondary: 'Explore Library',
        cta_secondary_href: '/library',
    },
    contact_section: {
        enabled: true,
        order: 8,
        title: "Let's Build Together",
        subtitle: 'Have an idea or project in mind? Drop me a message.',
        button_text: 'Send Message',
    },
};

export const defaultAboutContent: AboutPageContent = {
    header: {
        enabled: true,
        order: 1,
        location: 'Punjab, India',
        title: 'About Me',
        intro: 'Full-stack developer passionate about building impactful digital experiences.',
    },
    background: {
        enabled: true,
        order: 2,
        section_title: 'Background',
        paragraphs: ['My programming journey started with curiosity and grew into passion.'],
    },
    skills: {
        enabled: true,
        order: 3,
        section_title: 'Skills & Technologies',
        categories: [
            { name: 'Languages', items: ['TypeScript', 'Python', 'JavaScript'] },
            { name: 'Frontend', items: ['React', 'Next.js', 'TailwindCSS'] },
        ],
    },
    focus: {
        enabled: true,
        order: 4,
        section_title: 'Current Focus',
        badge: 'What I am Working On',
        items: ['Building full-stack applications', 'Exploring AI/ML'],
    },
    connect: {
        enabled: true,
        order: 5,
        section_title: 'Lets Connect',
        cta_button: 'Get in Touch',
        cta_href: 'mailto:hello@priyanshu.dev',
    },
};

export const defaultGlobalConfig: GlobalConfig = {
    site_name: 'Priyanshu Priya',
    site_tagline: 'Full-Stack Developer',
    contact_email: 'hello@priyanshu.dev',
    owner_name: 'Priyanshu Priya',
    owner_role: 'Full Stack Engineer',
    seo_keywords: ['Developer', 'Portfolio', 'Next.js', 'React', 'TypeScript', 'AI', 'Machine Learning'],
    resume_url: null,
    social_links: [
        { platform: 'github', url: 'https://github.com', label: 'GitHub' },
        { platform: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
        { platform: 'twitter', url: 'https://twitter.com', label: 'Twitter' },
        { platform: 'email', url: 'mailto:hello@priyanshu.dev', label: 'Email' },
    ],
    nav_items: [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/work/projects', label: 'Projects' },
        {
            href: '/library',
            label: 'Library',
            items: [
                { href: '/library/blog', label: 'Blog' },
                { href: '/library/thoughts', label: 'Thoughts' },
                { href: '/library/resonance', label: 'Resonance' },
            ],
        },
        { href: '/now', label: 'Now' },
        { href: '/contact', label: 'Contact', is_cta: true },
    ],
    footer: {
        copyright: 'Priyanshu Priya. All rights reserved.',
        description: ['Full-Stack Developer', 'Crafting digital experiences'],
    },
};

export const defaultNowContent: NowPageContent = {
    header: {
        enabled: true,
        order: 1,
        title: 'Now',
        subtitle: "What I'm focused on right now.",
        inspired_by_text: 'Inspired by nownownow.com',
        inspired_by_url: 'https://nownownow.com',
    },
    current_focus: {
        enabled: true,
        order: 2,
        section_title: 'Current Focus',
        items: [
            'Building production-ready full-stack applications',
            'Exploring AI/ML integration in web applications',
            'Preparing for campus placements',
            'Contributing to open-source projects',
        ],
    },
    working_on: {
        enabled: true,
        order: 3,
        section_title: 'Working On',
        view_all_text: 'View all',
        view_all_href: '/work/projects',
    },
    learning: {
        enabled: true,
        order: 4,
        section_title: 'Learning',
        items: [
            'Advanced React patterns and performance optimization',
            'System design fundamentals',
            'Deep learning with PyTorch',
        ],
    },
    recent_thoughts: {
        enabled: true,
        order: 5,
        section_title: 'Recent Thoughts',
        view_all_text: 'View all',
        view_all_href: '/library/thoughts',
    },
};

export const defaultLibraryContent: LibraryPageContent = {
    header: {
        enabled: true,
        order: 1,
        title: 'Library',
        subtitle: 'Long-form articles, quick thoughts, and things that resonate with me.',
    },
    blog_section: {
        enabled: true,
        order: 2,
        section_title: 'Blog',
        view_all_text: 'View all',
        view_all_href: '/library/blog',
        empty_text: 'No blog posts yet.',
    },
    thoughts_section: {
        enabled: true,
        order: 3,
        section_title: 'Thoughts',
        view_all_text: 'View all',
        view_all_href: '/library/thoughts',
        empty_text: 'No thoughts yet.',
    },
    resonance_section: {
        enabled: true,
        order: 4,
        section_title: 'Resonance',
        view_all_text: 'View all',
        view_all_href: '/library/resonance',
        empty_text: 'No resonance items yet.',
    },
};

export const defaultProjectsContent: ProjectsPageContent = {
    header: {
        enabled: true,
        badge: 'Portfolio',
        title: 'Projects',
        subtitle: 'A collection of projects I have built, from web applications to AI experiments.',
    },
    featured_badge: 'Featured',
    empty_state: {
        title: 'No projects yet',
        subtitle: 'Check back soon!',
    },
};

export const defaultContactContent: ContactPageContent = {
    header: {
        enabled: true,
        title: 'Get in Touch',
        badge: "Let's Connect",
        description: "Have a project in mind or just want to say hello? I'd love to hear from you. Fill out the form below and I'll get back to you as soon as possible.",
    },
    form: {
        name_label: 'Name',
        email_label: 'Email',
        message_label: 'Message',
        name_placeholder: 'Your name',
        email_placeholder: 'your@email.com',
        message_placeholder: 'Tell me about your project or just say hello...',
        submit_text: 'Send Message',
        success_message: 'Thank you! Your message has been sent successfully.',
    },
    contact_info: {
        email: 'priyanshupriyacodes@gmail.com',
        location: 'India',
        timezone: 'IST (UTC+5:30)',
    },
    availability: {
        enabled: true,
        status: 'Available for Work',
        message: "I'm currently open to new opportunities and interesting projects.",
    },
};

