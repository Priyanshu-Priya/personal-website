import { createClient } from '@/lib/supabase/server';
import { ProjectsGridClient } from './projects-client';
import { getPageContent, defaultProjectsContent } from '@/lib/content';
import type { ProjectsPageContent } from '@/types/content';

interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
    thumbnail_url: string | null;
    tech_stack: string[];
    is_featured: boolean;
}

export default async function ProjectsPage() {
    const supabase = await createClient();

    // Fetch CMS content and projects in parallel
    const [content, { data: projects, error }] = await Promise.all([
        getPageContent<'projects'>('projects'),
        supabase
            .from('projects')
            .select('id, title, slug, summary, thumbnail_url, tech_stack, is_featured, project_type, status, display_date, github_url, live_url, demo_url')
            .eq('is_published', true)
            .order('display_date', { ascending: false, nullsFirst: false }),
    ]);

    if (error) {
        console.error('Error fetching projects:', error);
    }

    // Use CMS content or fallback
    const pageContent: ProjectsPageContent = content || defaultProjectsContent;

    return <ProjectsGridClient content={pageContent} projects={(projects as Project[]) || []} />;
}
