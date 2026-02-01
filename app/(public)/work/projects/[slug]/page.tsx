import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/components/projects/project-detail';

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch the current project
    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error || !project) {
        notFound();
    }

    // Fetch all published projects for navigation (ordered by display_date or created_at)
    const { data: allProjects } = await supabase
        .from('projects')
        .select('slug, title, display_date, created_at')
        .eq('is_published', true)
        .order('display_date', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

    // Find current project index and determine prev/next
    let previousProject = null;
    let nextProject = null;

    if (allProjects) {
        const currentIndex = allProjects.findIndex(p => p.slug === slug);

        if (currentIndex > 0) {
            previousProject = {
                slug: allProjects[currentIndex - 1].slug,
                title: allProjects[currentIndex - 1].title
            };
        }

        if (currentIndex < allProjects.length - 1) {
            nextProject = {
                slug: allProjects[currentIndex + 1].slug,
                title: allProjects[currentIndex + 1].title
            };
        }
    }

    return (
        <ProjectDetail
            project={project}
            previousProject={previousProject}
            nextProject={nextProject}
        />
    );
}
