import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ResonanceEditForm } from './edit-form';

interface Resonance {
    id: string;
    title: string;
    url: string;
    type: string;
    resonance_score: number;
    commentary: string | null;
}

interface EditResonancePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditResonancePage({ params }: EditResonancePageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: entry, error } = await supabase
        .from('resonance')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !entry) {
        notFound();
    }

    return <ResonanceEditForm entry={entry as Resonance} />;
}
