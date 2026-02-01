import { createClient } from '@/lib/supabase/server';
import { NowPageClient } from './now-client';
import { getPageContent, defaultNowContent } from '@/lib/content';
import type { NowPageContent } from '@/types/content';

interface Thought {
    id: string;
    content: string;
    mood: string | null;
    created_at: string;
}

interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
}

export default async function Now() {
    const supabase = await createClient();

    // Fetch CMS content and database data in parallel
    const [content, thoughtsResult, projectsResult] = await Promise.all([
        getPageContent<'now'>('now'),
        supabase
            .from('thoughts')
            .select('id, content, mood, created_at')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(3),
        supabase
            .from('projects')
            .select('id, title, slug, summary')
            .eq('is_published', true)
            .eq('working_on', true)
            .order('created_at', { ascending: false }),
    ]);

    // Use CMS content or fallback
    const pageContent: NowPageContent = content || defaultNowContent;

    return (
        <NowPageClient
            content={pageContent}
            thoughts={(thoughtsResult.data as Thought[]) || []}
            projects={(projectsResult.data as Project[]) || []}
        />
    );
}
