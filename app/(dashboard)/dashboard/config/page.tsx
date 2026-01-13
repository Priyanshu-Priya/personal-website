import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ConfigEditor } from './config-editor';

export default async function ConfigPage() {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/dashboard/login');
    }

    // Fetch global config
    const { data: configData, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('config_key', 'global')
        .single();

    if (error || !configData) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-white mb-4">
                    Configuration Not Found
                </h1>
                <p className="text-slate-400">
                    Run the database migration to create initial configuration.
                </p>
            </div>
        );
    }

    return (
        <ConfigEditor
            initialConfig={configData.config_value as Record<string, unknown>}
            updatedAt={configData.updated_at}
        />
    );
}
