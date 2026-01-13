import { createClient } from '@/lib/supabase/server';
import { ResonanceList } from '@/components/library/resonance-list';

export default async function ResonancePage() {
    const supabase = await createClient();

    const { data: entries, error } = await supabase
        .from('resonance')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching resonance:', error);
    }

    return <ResonanceList entries={entries || []} />;
}
