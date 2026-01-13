import { createClient } from '@/lib/supabase/server';
import { ThoughtsList } from '@/components/library/thoughts-list';

export default async function ThoughtsPage() {
    const supabase = await createClient();

    const { data: thoughts, error } = await supabase
        .from('thoughts')
        .select('id, content, mood, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching thoughts:', error);
    }

    return <ThoughtsList thoughts={thoughts || []} />;
}
