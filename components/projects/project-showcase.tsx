'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen } from 'lucide-react';
import { ShowcaseCard, type Project } from './showcase-card';
import { TextReveal } from '@/components/ui/text-reveal';
import { cn } from '@/lib/utils';
import type { ProjectsPageContent } from '@/types/content';

interface ProjectShowcaseProps {
    content: ProjectsPageContent;
    projects: Project[];
}

export function ProjectShowcase({ content, projects }: ProjectShowcaseProps) {
    const [activeFilter, setActiveFilter] = useState('All');

    // Sort projects with featured ones first
    const sortedProjects = useMemo(() => {
        return [...projects].sort((a, b) => {
            if (a.is_featured && !b.is_featured) return -1;
            if (!a.is_featured && b.is_featured) return 1;
            return 0;
        });
    }, [projects]);

    // Extract unique tags for filter
    const filters = useMemo(() => {
        const tags = new Set<string>();
        sortedProjects.forEach(p => p.tech_stack?.forEach(t => tags.add(t)));
        return ['All', ...Array.from(tags).sort()];
    }, [sortedProjects]);

    // Filter logic
    const filteredProjects = useMemo(() => {
        if (activeFilter === 'All') return sortedProjects;
        return sortedProjects.filter(p => p.tech_stack?.includes(activeFilter));
    }, [activeFilter, sortedProjects]);

    return (
        <main className="relative min-h-screen pb-32">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 -z-10 bg-slate-950" />
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950/50 to-slate-950" />

            <div className="container max-w-7xl mx-auto px-6 pt-24">
                {/* Header */}
                <motion.header
                    className="mb-10 md:mb-12 text-center max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-mono mb-6"
                    >
                        <FolderOpen className="w-4 h-4" />
                        {content.header.badge}
                    </motion.div>

                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        <TextReveal text={content.header.title} delay={0.3} />
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-xl text-slate-400 leading-relaxed"
                    >
                        {content.header.subtitle}
                    </motion.p>
                </motion.header>

                {/* Filter Bar */}
                <div className="sticky top-20 z-40 mb-8 py-2 bg-slate-950/80 backdrop-blur-xl border-y border-white/5 -mx-6 px-6 md:mx-0 md:px-0 md:bg-transparent md:backdrop-blur-none md:border-none md:static">
                    <div className="flex items-center overflow-x-auto overflow-y-hidden pb-2 md:pb-0 hide-scrollbar gap-2 md:flex-wrap md:justify-center">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
                                    activeFilter === filter
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-105"
                                        : "bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
                                )}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, index) => (
                            <ShowcaseCard key={project.id} project={project} priority={index < 3} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32"
                    >
                        <p className="text-slate-500 text-lg">No projects found for this category.</p>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
