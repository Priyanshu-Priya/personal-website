import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ThoughtEditForm } from './edit-form';

interface Thought {
    id: string;
    content: string;
    mood: string | null;
    is_published: boolean;
}

interface EditThoughtPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditThoughtPage({ params }: EditThoughtPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: thought, error } = await supabase
        .from('thoughts')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !thought) {
        notFound();
    }

    return <ThoughtEditForm thought={thought as Thought} />;
}
