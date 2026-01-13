'use client';

import { useState, useTransition, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Save, Loader2, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SectionSidebar } from '@/components/admin/SectionSidebar';
import { SectionEditor } from '@/components/admin/SectionEditor';
import type { PageSection } from '@/hooks/usePageSections';

interface ConfigEditorProps {
    initialConfig: Record<string, unknown>;
    updatedAt: string;
}

export function ConfigEditor({ initialConfig, updatedAt }: ConfigEditorProps) {
    const [config, setConfig] = useState(initialConfig);
    const [isPending, startTransition] = useTransition();
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [modifiedSections, setModifiedSections] = useState<Set<string>>(new Set());
    const router = useRouter();

    // Group config into virtual sections
    const sections: PageSection[] = useMemo(() => [
        {
            key: 'general',
            label: 'General Settings',
            fieldCount: 7,
            data: {
                site_name: config.site_name,
                site_tagline: config.site_tagline,
                contact_email: config.contact_email,
                owner_name: config.owner_name,
                owner_role: config.owner_role,
                seo_keywords: config.seo_keywords,
                resume_url: config.resume_url,
            }
        },
        {
            key: 'social_links',
            label: 'Social Media',
            fieldCount: Array.isArray(config.social_links) ? config.social_links.length : 0,
            data: {
                social_links: config.social_links
            }
        },
        {
            key: 'nav_items',
            label: 'Navigation',
            fieldCount: Array.isArray(config.nav_items) ? config.nav_items.length : 0,
            data: {
                nav_items: config.nav_items
            }
        },
        {
            key: 'footer',
            label: 'Footer',
            fieldCount: Object.keys(config.footer as object || {}).length,
            data: {
                ...(config.footer as Record<string, unknown> || {}),
                description: Array.isArray((config.footer as any)?.description)
                    ? (config.footer as any).description
                    : []
            }
        }
    ], [config]);

    const [activeSection, setActiveSection] = useState(sections[0].key);

    // Get active section data
    const activeSectionData = useMemo(() => {
        return sections.find(s => s.key === activeSection);
    }, [sections, activeSection]);

    // Handle section change from sidebar
    const handleSectionChange = useCallback((sectionKey: string) => {
        setActiveSection(sectionKey);
    }, []);

    // Handle field updates
    const handleSectionUpdate = useCallback((newSectionData: Record<string, unknown>) => {
        setConfig(prev => {
            let newConfig = { ...prev };

            if (activeSection === 'general') {
                newConfig = { ...newConfig, ...newSectionData };
            } else if (activeSection === 'footer') {
                newConfig = { ...newConfig, footer: newSectionData };
            } else {
                // For social_links and nav_items, the SectionEditor returns { social_links: [...] }
                // so we can just merge it.
                newConfig = { ...newConfig, ...newSectionData };
            }

            return newConfig;
        });

        setModifiedSections(prev => new Set(prev).add(activeSection));
    }, [activeSection]);

    const handleSave = async () => {
        setSaveStatus('saving');

        startTransition(async () => {
            try {
                const supabase = createClient();

                const { error } = await supabase
                    .from('site_config')
                    .update({
                        config_value: config,
                        updated_at: new Date().toISOString()
                    })
                    .eq('config_key', 'global');

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

    const isDirty = modifiedSections.size > 0;

    return (
        <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 -mx-4 px-4 sm:-mx-6 sm:px-6 py-4 mb-6 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
                            Global Configuration
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">
                            Last updated: {format(new Date(updatedAt), 'MMM dd, yyyy HH:mm')}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* View Live Page */}
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50 whitespace-nowrap"
                        >
                            View Live
                            <ExternalLink className="w-4 h-4" />
                        </a>

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
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

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

            {/* JSON Preview */}
            <details className="mt-8 px-4 sm:px-6">
                <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-400">
                    View Raw JSON
                </summary>
                <pre className="mt-4 p-4 rounded-lg bg-slate-900 text-xs text-slate-400 overflow-auto max-h-96">
                    {JSON.stringify(config, null, 2)}
                </pre>
            </details>
        </div>
    );
}
