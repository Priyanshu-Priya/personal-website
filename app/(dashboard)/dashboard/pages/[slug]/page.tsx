import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { PageContentEditor } from './page-editor';

// Page slugs that can be edited
const EDITABLE_PAGES = ['home', 'about', 'library', 'now', 'projects', 'contact'];

interface PageEditorPageProps {
    params: Promise<{ slug: string }>;
}

export default async function PageEditorPage({ params }: PageEditorPageProps) {
    const { slug } = await params;

    // Validate slug
    if (!EDITABLE_PAGES.includes(slug)) {
        notFound();
    }

    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/dashboard/login');
    }

    // Fetch current page content
    const { data: pageData, error } = await supabase
        .from('site_pages')
        .select('*')
        .eq('page_slug', slug)
        .single();

    if (error || !pageData) {
        // Page doesn't exist yet, create with empty content
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-white mb-4">
                    Page Not Found: {slug}
                </h1>
                <p className="text-slate-400">
                    This page hasn&apos;t been configured yet. Run the database migration to create initial content.
                </p>
            </div>
        );
    }

    return (
        <PageContentEditor
            pageSlug={slug}
            pageId={pageData.id}
            initialContent={pageData.content as Record<string, unknown>}
            updatedAt={pageData.updated_at}
        />
    );
}

// Generate static params for known pages
export function generateStaticParams() {
    return EDITABLE_PAGES.map((slug) => ({ slug }));
}
