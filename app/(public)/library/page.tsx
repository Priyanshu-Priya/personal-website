import { createClient } from '@/lib/supabase/server';
import { LibraryHubClient } from './library-client';
import { getPageContent, defaultLibraryContent } from '@/lib/content';
import type { LibraryPageContent } from '@/types/content';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    summary: string;
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
    resonance_score: number;
    created_at: string;
}

export default async function LibraryPage() {
    const supabase = await createClient();

    // Fetch CMS content and database data in parallel
    const [content, postsResult, thoughtsResult, resonanceResult] = await Promise.all([
        getPageContent<'library'>('library'),
        supabase
            .from('blog_posts')
            .select('id, title, slug, summary, created_at')
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
            .select('id, title, type, resonance_score, created_at')
            .order('created_at', { ascending: false })
            .limit(4),
    ]);

    // Use CMS content or fallback
    const pageContent: LibraryPageContent = content || defaultLibraryContent;

    return (
        <LibraryHubClient
            content={pageContent}
            posts={(postsResult.data as BlogPost[]) || []}
            thoughts={(thoughtsResult.data as Thought[]) || []}
            resonance={(resonanceResult.data as ResonanceItem[]) || []}
        />
    );
}
