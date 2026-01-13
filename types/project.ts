// =========================================
// PROJECT TYPES
// Master Project Architecture - 3 Layer Data Model
// =========================================

/**
 * Project status options
 */
export type ProjectStatus = 'Completed' | 'In Progress' | 'Archived';

/**
 * Project role/ownership options
 */
export type ProjectRole = 'Solo Project' | 'Team Project' | 'Hackathon' | 'Open Source' | 'Freelance';

/**
 * Categorized tech stack structure
 */
export interface TechStackCategories {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    tools?: string[];
    apis?: string[];
    deployment?: string[];
}

/**
 * Project links structure
 */
export interface ProjectLinks {
    github_url: string | null;
    live_url: string | null;
    demo_url: string | null;
    docs_url: string | null;
    linkedin_post_url: string | null;
}

/**
 * Full Project Item interface
 * Supports 3-layer data model: Card → Preview → Detail
 */
export interface ProjectItem {
    // ===== Identity =====
    id: string;
    title: string;
    slug: string;

    // ===== Card Layer (Scan) =====
    project_type: string | null;           // "Full-Stack App", "Dashboard", etc.
    thumbnail_url: string | null;
    summary: string;
    display_date: string | null;           // "Nov 2024" for clean display
    status: ProjectStatus;
    tech_stack: string[];                   // Max 4 primary techs for card

    // ===== Links =====
    github_url: string | null;
    live_url: string | null;
    demo_url: string | null;
    docs_url: string | null;
    linkedin_post_url: string | null;

    // ===== Preview Layer (Hover/Focus) =====
    role: string | null;                    // "Solo Project", "Team Project", etc.

    // ===== Deep Dive Layer (Detail Page) =====
    full_tech_stack: TechStackCategories | null;
    problem_statement: string | null;
    solution_approach: string | null;
    key_features: string[] | null;
    learnings: string[] | null;
    future_scope: string[] | null;

    // ===== Metadata =====
    is_featured: boolean;
    is_published: boolean;
    created_at: string;
}

/**
 * Minimal project for card display only
 */
export interface ProjectCardItem {
    id: string;
    title: string;
    slug: string;
    project_type: string | null;
    thumbnail_url: string | null;
    summary: string;
    display_date: string | null;
    status: ProjectStatus;
    tech_stack: string[];
    github_url: string | null;
    live_url: string | null;
    demo_url: string | null;
    is_featured: boolean;
}

/**
 * Project type options for dropdowns
 */
export const PROJECT_TYPE_OPTIONS = [
    'Full-Stack App',
    'Dashboard',
    'API / Backend',
    'CLI Tool',
    'Library / Package',
    'Mobile App',
    'AI / ML Project',
    'Browser Extension',
    'Mini Project',
    'Research',
    'Other',
] as const;

/**
 * Status options for dropdowns
 */
export const PROJECT_STATUS_OPTIONS: ProjectStatus[] = [
    'Completed',
    'In Progress',
    'Archived',
];

/**
 * Role options for dropdowns
 */
export const PROJECT_ROLE_OPTIONS: ProjectRole[] = [
    'Solo Project',
    'Team Project',
    'Hackathon',
    'Open Source',
    'Freelance',
];
