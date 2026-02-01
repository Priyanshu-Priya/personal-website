import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProjectEditForm } from './edit-form';

interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string | null;
    tech_stack: string[];
    github_url: string | null;
    live_url: string | null;
    thumbnail_url: string | null;
    is_featured: boolean;
    is_published: boolean;
    created_at: string;
    // New Master Architecture fields
    project_type: string | null;
    status: string | null;
    role: string | null;
    display_date: string | null;
    demo_url: string | null;
    docs_url: string | null;
    linkedin_post_url: string | null;
    working_on: boolean;
    problem_statement: string | null;
    solution_approach: string | null;
    key_features: string[] | null;
    learnings: string[] | null;
    future_scope: string[] | null;
}

interface EditProjectPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch project data
    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !project) {
        notFound();
    }

    return <ProjectEditForm project={project as Project} />;
}
