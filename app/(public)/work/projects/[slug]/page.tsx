import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/components/projects/project-detail';

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error || !project) {
        notFound();
    }

    return <ProjectDetail project={project} />;
}
