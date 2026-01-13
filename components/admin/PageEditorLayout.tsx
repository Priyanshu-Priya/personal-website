'use client';

import { useState, useTransition, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, Loader2, ExternalLink, ChevronRight, LayoutGrid, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePageSections } from '@/hooks/usePageSections';
import { SectionSidebar } from './SectionSidebar';
import { SectionEditor } from './SectionEditor';
import { SectionOrderEditor } from './SectionOrderEditor';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PageEditorLayoutProps {
    pageSlug: string;
    pageId: string;
    initialContent: Record<string, unknown>;
    updatedAt: string;
}

// Pages that have section ordering capability
const PAGES_WITH_ORDERING = ['home', 'about', 'library', 'now'];

// Preview routes mapping
const PREVIEW_ROUTES: Record<string, string> = {
    home: '/',
    about: '/about',
    library: '/library',
    now: '/now',
    projects: '/work/projects',
    contact: '/contact',
};

export function PageEditorLayout({
    pageSlug,
    pageId,
    initialContent,
    updatedAt,
}: PageEditorLayoutProps) {
    const [content, setContent] = useState(initialContent);
    const [isPending, startTransition] = useTransition();
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [modifiedSections, setModifiedSections] = useState<Set<string>>(new Set());
    const router = useRouter();

    // Parse sections from content
    const sections = usePageSections(content);
    const [activeSection, setActiveSection] = useState(sections[0]?.key || '');

    // Tab state for pages with ordering
    const hasOrdering = PAGES_WITH_ORDERING.includes(pageSlug);
    const [activeTab, setActiveTab] = useState<'order' | 'content'>(hasOrdering ? 'order' : 'content');

    // Dirty state tracking
    const isDirty = modifiedSections.size > 0;

    // Get active section data
    const activeSectionData = useMemo(() => {
        return sections.find(s => s.key === activeSection);
    }, [sections, activeSection]);

    // Handle section change from sidebar
    const handleSectionChange = useCallback((sectionKey: string) => {
        setActiveSection(sectionKey);
    }, []);

    // Handle field changes within a section
    const handleSectionUpdate = useCallback((newSectionData: Record<string, unknown>) => {
        setContent(prev => ({
            ...prev,
            [activeSection]: newSectionData,
        }));
        setModifiedSections(prev => new Set(prev).add(activeSection));
    }, [activeSection]);

    // Save handler
    const handleSave = async () => {
        setSaveStatus('saving');

        startTransition(async () => {
            try {
                const supabase = createClient();

                const { error } = await supabase
                    .from('site_pages')
                    .update({
                        content,
                        updated_at: new Date().toISOString()
                    })
                    .eq('page_slug', pageSlug);

                if (error) throw error;

                setSaveStatus('saved');
                setModifiedSections(new Set());
                router.refresh();

                setTimeout(() => setSaveStatus('idle'), 3000);
            } catch (error) {
                console.error('Failed to save:', error);
                setSaveStatus('error');
            }
        });
    };

    const previewUrl = PREVIEW_ROUTES[pageSlug] || '/';
    const pageTitle = pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1);

    return (
        <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 -mx-4 px-4 sm:-mx-6 sm:px-6 py-4 mb-6 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="min-w-0">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1 overflow-x-auto no-scrollbar whitespace-nowrap">
                            <Link href="/dashboard/pages" className="hover:text-slate-300 transition-colors">
                                Pages
                            </Link>
                            <ChevronRight className="w-4 h-4 shrink-0" />
                            <span className="text-slate-300">{pageTitle}</span>
                            <ChevronRight className="w-4 h-4 shrink-0" />
                            <span className="text-indigo-400">Edit</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
                            Edit {pageTitle} Page
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">
                            Last updated: {format(new Date(updatedAt), 'MMM dd, yyyy HH:mm')}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        {/* View Live Page */}
                        <Link
                            href={previewUrl}
                            target="_blank"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50 whitespace-nowrap"
                        >
                            View Live
                            <ExternalLink className="w-4 h-4" />
                        </Link>

                        {/* Save Button */}
                        <Button
                            onClick={handleSave}
                            disabled={isPending || saveStatus === 'saving' || !isDirty}
                            className={cn(
                                'transition-all flex-1 sm:flex-none justify-center',
                                isDirty
                                    ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/25'
                                    : 'bg-slate-800 text-slate-400'
                            )}
                        >
                            {saveStatus === 'saving' ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : saveStatus === 'saved' ? (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Saved!
                                </>
                            ) : saveStatus === 'error' ? (
                                'Error - Retry'
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save
                                    <span className="hidden sm:inline ml-1">Changes</span>
                                    {isDirty && (
                                        <span className="ml-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    )}
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Tabs for pages with ordering */}
                {hasOrdering && (
                    <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
                        <button
                            onClick={() => setActiveTab('order')}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0',
                                activeTab === 'order'
                                    ? 'bg-violet-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            Section Order
                        </button>
                        <button
                            onClick={() => setActiveTab('content')}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0',
                                activeTab === 'content'
                                    ? 'bg-violet-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                            )}
                        >
                            <Settings className="w-4 h-4" />
                            Edit Content
                        </button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            {hasOrdering && activeTab === 'order' ? (
                <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 min-w-0 mx-4 sm:mx-6">
                    <SectionOrderEditor
                        content={initialContent}
                        pageId={pageId}
                        pageSlug={pageSlug}
                    />
                </div>
            ) : (
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 min-w-0 px-4 sm:px-6">
                    {/* Sidebar - Section Navigation */}
                    <div className="lg:col-span-3 z-30 bg-slate-950/80 backdrop-blur-md lg:bg-transparent sticky top-[73px] lg:static lg:border-none min-w-0 py-2 lg:py-0">
                        <SectionSidebar
                            sections={sections}
                            activeSection={activeSection}
                            onSectionChange={handleSectionChange}
                            modifiedSections={modifiedSections}
                        />
                    </div>

                    {/* Main Editor */}
                    <div className="lg:col-span-9 pb-20 lg:pb-0 min-w-0">
                        {activeSectionData ? (
                            <SectionEditor
                                section={activeSectionData}
                                onChange={handleSectionUpdate}
                            />
                        ) : (
                            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 text-center">
                                <p className="text-slate-400">Select a section to edit</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* JSON Preview (for debugging) */}
            <details className="mt-8">
                <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-400">
                    View Raw JSON
                </summary>
                <pre className="mt-4 p-4 rounded-lg bg-slate-900 text-xs text-slate-400 overflow-auto max-h-96">
                    {JSON.stringify(content, null, 2)}
                </pre>
            </details>
        </div>
    );
}
