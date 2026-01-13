'use client';

import { useState, useTransition, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// Page-specific section configurations
const PAGE_SECTIONS: Record<string, { keys: string[]; names: Record<string, string>; colors: Record<string, string> }> = {
    home: {
        keys: ['hero', 'projects_section', 'blog_section', 'thoughts_section', 'resonance_section', 'tech_stack_section', 'cta_section', 'contact_section'],
        names: {
            hero: 'Hero Section',
            projects_section: 'Featured Projects',
            blog_section: 'Blog Posts',
            thoughts_section: 'Quick Thoughts',
            resonance_section: 'Resonance',
            tech_stack_section: 'Tech Stack',
            cta_section: 'Call to Action',
            contact_section: 'Contact Form',
        },
        colors: {
            hero: 'bg-violet-500/10 border-violet-500/30',
            projects_section: 'bg-indigo-500/10 border-indigo-500/30',
            blog_section: 'bg-emerald-500/10 border-emerald-500/30',
            thoughts_section: 'bg-purple-500/10 border-purple-500/30',
            resonance_section: 'bg-amber-500/10 border-amber-500/30',
            tech_stack_section: 'bg-cyan-500/10 border-cyan-500/30',
            cta_section: 'bg-pink-500/10 border-pink-500/30',
            contact_section: 'bg-teal-500/10 border-teal-500/30',
        },
    },
    about: {
        keys: ['header', 'background', 'skills', 'focus', 'connect'],
        names: {
            header: 'Header',
            background: 'Background',
            skills: 'Skills & Technologies',
            focus: 'Current Focus',
            connect: 'Connect',
        },
        colors: {
            header: 'bg-violet-500/10 border-violet-500/30',
            background: 'bg-indigo-500/10 border-indigo-500/30',
            skills: 'bg-emerald-500/10 border-emerald-500/30',
            focus: 'bg-amber-500/10 border-amber-500/30',
            connect: 'bg-pink-500/10 border-pink-500/30',
        },
    },
    library: {
        keys: ['header', 'blog_section', 'thoughts_section', 'resonance_section'],
        names: {
            header: 'Header',
            blog_section: 'Blog Posts',
            thoughts_section: 'Thoughts',
            resonance_section: 'Resonance',
        },
        colors: {
            header: 'bg-violet-500/10 border-violet-500/30',
            blog_section: 'bg-emerald-500/10 border-emerald-500/30',
            thoughts_section: 'bg-purple-500/10 border-purple-500/30',
            resonance_section: 'bg-amber-500/10 border-amber-500/30',
        },
    },
    now: {
        keys: ['header', 'current_focus', 'working_on', 'learning', 'recent_thoughts'],
        names: {
            header: 'Header',
            current_focus: 'Current Focus',
            working_on: 'Working On',
            learning: 'Learning',
            recent_thoughts: 'Recent Thoughts',
        },
        colors: {
            header: 'bg-violet-500/10 border-violet-500/30',
            current_focus: 'bg-amber-500/10 border-amber-500/30',
            working_on: 'bg-indigo-500/10 border-indigo-500/30',
            learning: 'bg-emerald-500/10 border-emerald-500/30',
            recent_thoughts: 'bg-purple-500/10 border-purple-500/30',
        },
    },
};

interface SectionItem {
    key: string;
    order: number;
    enabled: boolean;
}

interface SectionOrderEditorProps {
    content: Record<string, unknown>;
    pageId: string;
    pageSlug: string;
}

export function SectionOrderEditor({ content, pageId, pageSlug }: SectionOrderEditorProps) {
    const [isPending, startTransition] = useTransition();
    const [isSaved, setIsSaved] = useState(false);
    const [sections, setSections] = useState<SectionItem[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const pageConfig = PAGE_SECTIONS[pageSlug];

    // Initialize sections from content
    useEffect(() => {
        if (!pageConfig) return;

        const items: SectionItem[] = pageConfig.keys.map((key) => {
            const section = content[key] as { order?: number; enabled?: boolean } | undefined;
            return {
                key,
                order: section?.order ?? 0,
                enabled: section?.enabled ?? true,
            };
        });

        // Sort by order
        items.sort((a, b) => a.order - b.order);
        setSections(items);
    }, [content, pageConfig]);

    if (!isMounted) return null;

    if (!pageConfig) {
        return <div className="text-slate-400">Section ordering not available for this page.</div>;
    }

    // Handle drag end
    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(sections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update order values based on new positions
        const updatedItems = items.map((item, index) => ({
            ...item,
            order: index + 1,
        }));

        setSections(updatedItems);
        setIsSaved(false);
    };

    // Toggle section visibility
    const toggleEnabled = (key: string) => {
        setSections((prev) =>
            prev.map((item) =>
                item.key === key ? { ...item, enabled: !item.enabled } : item
            )
        );
        setIsSaved(false);
    };

    // Save changes to database
    const handleSave = () => {
        startTransition(async () => {
            const supabase = createClient();

            // Build updated content with new order values
            const updatedContent = { ...content };
            sections.forEach((section) => {
                const sectionData = updatedContent[section.key] as Record<string, unknown>;
                if (sectionData) {
                    sectionData.order = section.order;
                    sectionData.enabled = section.enabled;
                }
            });

            const { error } = await supabase
                .from('site_pages')
                .update({ content: updatedContent, updated_at: new Date().toISOString() })
                .eq('id', pageId);

            if (error) {
                console.error('Failed to save:', error);
                alert('Failed to save changes');
            } else {
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2000);
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white">Section Order</h3>
                    <p className="text-sm text-slate-400">Drag to reorder, click eye to toggle visibility</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                    {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {isSaved ? 'Saved!' : 'Save Order'}
                </button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2"
                        >
                            {sections.map((section, index) => (
                                <Draggable key={section.key} draggableId={section.key} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${pageConfig.colors[section.key] || 'bg-slate-800/50 border-slate-700'} ${snapshot.isDragging ? 'shadow-xl shadow-violet-500/20 scale-[1.02]' : ''
                                                } ${!section.enabled ? 'opacity-50' : ''}`}
                                        >
                                            {/* Drag handle */}
                                            <div
                                                {...provided.dragHandleProps}
                                                className="p-1 rounded hover:bg-white/10 cursor-grab active:cursor-grabbing"
                                            >
                                                <GripVertical className="w-5 h-5 text-slate-400" />
                                            </div>

                                            {/* Order number */}
                                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-white text-sm font-mono">
                                                {section.order}
                                            </span>

                                            {/* Section name */}
                                            <span className="flex-1 font-medium text-white">
                                                {pageConfig.names[section.key] || section.key}
                                            </span>

                                            {/* Visibility toggle */}
                                            <button
                                                onClick={() => toggleEnabled(section.key)}
                                                className={`p-2 rounded-lg transition-colors ${section.enabled
                                                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                                    : 'bg-slate-700/50 text-slate-500 hover:bg-slate-700'
                                                    }`}
                                                title={section.enabled ? 'Click to hide' : 'Click to show'}
                                            >
                                                {section.enabled ? (
                                                    <Eye className="w-5 h-5" />
                                                ) : (
                                                    <EyeOff className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}
