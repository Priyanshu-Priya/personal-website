// =========================================
// CMS CONTENT TYPES
// Strict TypeScript interfaces for page content
// =========================================

// =========================================
// GLOBAL CONFIG TYPES
// =========================================

export interface SocialLink {
    platform: 'github' | 'linkedin' | 'twitter' | 'email' | 'youtube' | 'instagram';
    url: string;
    label: string;
}

export interface NavItem {
    href: string;
    label: string;
    is_cta?: boolean;
    items?: NavItem[];
}

export interface GlobalConfig {
    site_name: string;
    site_tagline: string;
    contact_email: string;
    owner_name: string;
    owner_role: string;
    seo_keywords: string[];
    resume_url?: string | null;
    social_links: SocialLink[];
    nav_items: NavItem[];
    footer: {
        copyright: string;
        description: string[];
    };
}

// =========================================
// HOME PAGE CONTENT
// =========================================

export interface HomePageContent {
    hero: {
        enabled: boolean;
        order: number;
        status_badge: string;
        name_line1: string;
        name_line2: string;
        subtitle: string;
        focus_label: string;
        focus_value: string;
        cta_primary: string;
        cta_primary_href: string;
        cta_secondary: string;
        cta_secondary_href: string;
        latest_thought_label: string;
    };
    projects_section: {
        enabled: boolean;
        order: number;
        title: string;
        subtitle: string;
        view_all_text: string;
        view_all_href: string;
    };
    blog_section: {
        enabled: boolean;
        order: number;
        title: string;
        read_all_text: string;
        read_all_href: string;
    };
    thoughts_section: {
        enabled: boolean;
        order: number;
        title: string;
        view_all_text: string;
        view_all_href: string;
    };
    resonance_section: {
        enabled: boolean;
        order: number;
        title: string;
        subtitle: string;
        view_all_text: string;
        view_all_href: string;
    };
    tech_stack_section: {
        enabled: boolean;
        order: number;
        label: string;
        items: {
            name: string;
            color: string;
        }[];
    };
    cta_section: {
        enabled: boolean;
        order: number;
        title: string;
        title_highlight: string;
        subtitle: string;
        cta_primary: string;
        cta_primary_href: string;
        cta_secondary: string;
        cta_secondary_href: string;
    };
    contact_section: {
        enabled: boolean;
        order: number;
        title: string;
        subtitle: string;
        button_text: string;
        name_label: string;
        email_label: string;
        message_label: string;
        name_placeholder: string;
        email_placeholder: string;
        message_placeholder: string;
        success_message: string;
    };
}

// =========================================
// ABOUT PAGE CONTENT
// =========================================

export interface SkillCategory {
    name: string;
    items: string[];
}

export interface AboutPageContent {
    header: {
        enabled: boolean;
        order: number;
        location: string;
        title: string;
        intro: string;
    };
    background: {
        enabled: boolean;
        order: number;
        section_title: string;
        paragraphs: string[];
    };
    skills: {
        enabled: boolean;
        order: number;
        section_title: string;
        categories: SkillCategory[];
    };
    focus: {
        enabled: boolean;
        order: number;
        section_title: string;
        badge: string;
        items: string[];
        cta_button?: string;
        cta_href?: string;
    };
    connect: {
        enabled: boolean;
        order: number;
        section_title: string;
        cta_button: string;
        cta_href: string;
    };
}

// =========================================
// LIBRARY PAGE CONTENT
// =========================================

export interface LibraryPageContent {
    header: {
        enabled: boolean;
        order: number;
        title: string;
        subtitle: string;
    };
    blog_section: {
        enabled: boolean;
        order: number;
        section_title: string;
        view_all_text: string;
        view_all_href: string;
        empty_text: string;
    };
    thoughts_section: {
        enabled: boolean;
        order: number;
        section_title: string;
        view_all_text: string;
        view_all_href: string;
        empty_text: string;
    };
    resonance_section: {
        enabled: boolean;
        order: number;
        section_title: string;
        view_all_text: string;
        view_all_href: string;
        empty_text: string;
    };
}

// =========================================
// NOW PAGE CONTENT
// =========================================

export interface NowPageContent {
    header: {
        enabled: boolean;
        order: number;
        title: string;
        subtitle: string;
        inspired_by_text: string;
        inspired_by_url: string;
    };
    current_focus: {
        enabled: boolean;
        order: number;
        section_title: string;
        items: string[];
    };
    working_on: {
        enabled: boolean;
        order: number;
        section_title: string;
        view_all_text: string;
        view_all_href: string;
    };
    learning: {
        enabled: boolean;
        order: number;
        section_title: string;
        items: string[];
    };
    recent_thoughts: {
        enabled: boolean;
        order: number;
        section_title: string;
        view_all_text: string;
        view_all_href: string;
    };
}

// =========================================
// PROJECTS PAGE CONTENT
// =========================================

export interface ProjectsPageContent {
    header: {
        enabled: boolean;
        badge: string;
        title: string;
        subtitle: string;
    };
    featured_badge: string;
    empty_state: {
        title: string;
        subtitle: string;
    };
}

// =========================================
// PAGE SLUG TO CONTENT TYPE MAPPING
// =========================================

export type PageSlug = 'home' | 'about' | 'library' | 'now' | 'projects' | 'contact';

export interface ContactPageContent {
    header: {
        enabled: boolean;
        title: string;
        badge: string;
        description: string;
    };
    form: {
        name_label: string;
        email_label: string;
        message_label: string;
        name_placeholder: string;
        email_placeholder: string;
        message_placeholder: string;
        submit_text: string;
        success_message: string;
    };
    contact_info: {
        email: string;
        location: string;
        timezone: string;
    };
    availability: {
        enabled: boolean;
        status: string;
        message: string;
    };
}

export type PageContentMap = {
    home: HomePageContent;
    about: AboutPageContent;
    library: LibraryPageContent;
    now: NowPageContent;
    projects: ProjectsPageContent;
    contact: ContactPageContent;
};

// =========================================
// DATABASE ROW TYPES
// =========================================

export interface SitePageRow {
    id: string;
    page_slug: string;
    content: Record<string, unknown>;
    updated_at: string;
    created_at: string;
}

export interface SiteConfigRow {
    id: string;
    config_key: string;
    config_value: Record<string, unknown>;
    updated_at: string;
    created_at: string;
}
