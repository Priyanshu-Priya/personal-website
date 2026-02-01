'use client';

import { ProjectHeader } from './project-header';
import { ProjectContent } from './project-content';
import { ProjectNavigation } from './project-navigation';
import { CTABanner } from '@/components/shared/cta-banner';

interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    thumbnail_url: string | null;
    tech_stack: string[];
    demo_url: string | null;
    github_url: string | null;
    live_url: string | null;
    docs_url: string | null;
    linkedin_post_url: string | null;
    created_at: string;
    project_type: string | null;
    status: string | null;
    role: string | null;
    display_date: string | null;
}

interface NavigationProject {
    slug: string;
    title: string;
}

interface ProjectDetailProps {
    project: Project;
    previousProject?: NavigationProject | null;
    nextProject?: NavigationProject | null;
}

export function ProjectDetail({ project, previousProject = null, nextProject = null }: ProjectDetailProps) {
    return (
        <main className="relative min-h-screen bg-slate-950">
            {/* Global Background */}
            <div className="fixed inset-0 -z-10 bg-slate-950" />
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950/50 to-slate-950" />

            {/* Noise Texture */}
            <div
                className="fixed inset-0 -z-10 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Split Hero Section */}
            <ProjectHeader project={project} />

            {/* Content Section */}
            <ProjectContent content={project.content} />

            {/* Navigation Footer */}
            <ProjectNavigation
                previousProject={previousProject}
                nextProject={nextProject}
            />

            {/* CTA Section */}
            <CTABanner
                message="Interested in working together?"
                accentColor="violet"
            />
        </main>
    );
}

