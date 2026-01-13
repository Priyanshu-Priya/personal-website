import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText, Settings, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const PAGES = [
    { slug: 'home', title: 'Home Page', description: 'Hero, CTA, and section labels' },
    { slug: 'about', title: 'About Page', description: 'Bio, skills, and focus areas' },
    { slug: 'library', title: 'Library Page', description: 'Section headers and labels' },
    { slug: 'now', title: 'Now Page', description: 'Current focus sections' },
    { slug: 'projects', title: 'Projects Page', description: 'Filter labels and headers' },
    { slug: 'contact', title: 'Contact Page', description: 'Form labels, contact info, and availability' },
];

export default async function PagesListPage() {
    const supabase = await createClient();

    // Fetch all pages
    const { data: pages } = await supabase
        .from('site_pages')
        .select('page_slug, updated_at')
        .order('page_slug');

    const pageMap = new Map(pages?.map(p => [p.page_slug, p.updated_at]) || []);

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Page Content</h1>
                <p className="text-slate-400">Edit text content for each page of your site</p>
            </div>

            {/* Pages Grid */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-violet-400" />
                    <h2 className="text-lg font-semibold text-white">Pages</h2>
                </div>
                <div className="grid gap-4">
                    {PAGES.map((page) => {
                        const lastUpdated = pageMap.get(page.slug);
                        return (
                            <Link
                                key={page.slug}
                                href={`/dashboard/pages/${page.slug}`}
                                className="group p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-violet-500/50 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-white group-hover:text-violet-300 transition-colors">
                                            {page.title}
                                        </h3>
                                        <p className="text-sm text-slate-500">{page.description}</p>
                                        {lastUpdated && (
                                            <p className="text-xs text-slate-600 mt-1">
                                                Last updated: {format(new Date(lastUpdated), 'MMM dd, yyyy')}
                                            </p>
                                        )}
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Global Config */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-5 h-5 text-amber-400" />
                    <h2 className="text-lg font-semibold text-white">Global Settings</h2>
                </div>
                <Link
                    href="/dashboard/config"
                    className="group p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all block"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-white group-hover:text-amber-300 transition-colors">
                                Site Configuration
                            </h3>
                            <p className="text-sm text-slate-500">
                                Social links, navigation, footer, and global settings
                            </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
