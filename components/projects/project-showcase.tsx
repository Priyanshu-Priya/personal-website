'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react';
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
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Drag-to-scroll state
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const dragScrollLeft = useRef(0);
    const hasDragged = useRef(false);

    // Check scroll state
    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 2);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
    }, []);

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

    useEffect(() => {
        updateScrollState();
        const el = scrollRef.current;
        if (!el) return;
        const observer = new ResizeObserver(updateScrollState);
        observer.observe(el);
        return () => observer.disconnect();
    }, [updateScrollState, filters]);

    const scroll = useCallback((direction: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
    }, []);

    // Drag-to-scroll handlers (YouTube-style)
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        const el = scrollRef.current;
        if (!el) return;
        isDragging.current = true;
        hasDragged.current = false;
        dragStartX.current = e.pageX - el.offsetLeft;
        dragScrollLeft.current = el.scrollLeft;
        el.style.cursor = 'grabbing';
        el.style.userSelect = 'none';
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging.current) return;
        const el = scrollRef.current;
        if (!el) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = x - dragStartX.current;
        if (Math.abs(walk) > 5) hasDragged.current = true;
        el.scrollLeft = dragScrollLeft.current - walk;
    }, []);

    const handleMouseUp = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        isDragging.current = false;
        el.style.cursor = 'grab';
        el.style.userSelect = '';
    }, []);

    const handleFilterClick = useCallback((filter: string) => {
        if (hasDragged.current) return; // Ignore click after drag
        setActiveFilter(filter);
    }, []);

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
                <div className="sticky top-20 z-40 mb-8 py-2.5 bg-slate-950/80 backdrop-blur-xl border-y border-white/5 -mx-6 px-2">
                    <div className="relative flex items-center gap-1">
                        {/* Left scroll button */}
                        <button
                            onClick={() => scroll('left')}
                            className={cn(
                                "flex shrink-0 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 overflow-hidden",
                                canScrollLeft ? "w-7 h-7 border border-slate-700/50" : "w-0 h-7 opacity-0 pointer-events-none border-0 p-0"
                            )}
                            aria-label="Scroll filters left"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Scrollable filters */}
                        <div className="relative flex-1 min-w-0">
                            {/* Left fade */}
                            <div className={cn(
                                "absolute left-0 top-0 bottom-0 w-6 bg-linear-to-r from-slate-950/80 to-transparent z-10 pointer-events-none transition-opacity duration-200",
                                canScrollLeft ? "opacity-100" : "opacity-0"
                            )} />
                            {/* Right fade */}
                            <div className={cn(
                                "absolute right-0 top-0 bottom-0 w-6 bg-linear-to-l from-slate-950/80 to-transparent z-10 pointer-events-none transition-opacity duration-200",
                                canScrollRight ? "opacity-100" : "opacity-0"
                            )} />

                            <div
                                ref={scrollRef}
                                onScroll={updateScrollState}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                className="flex items-center overflow-x-auto overflow-y-hidden gap-1.5 px-1 cursor-grab active:cursor-grabbing"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {filters.map((filter) => {
                                    const count = filter === 'All'
                                        ? projects.length
                                        : projects.filter(p => p.tech_stack?.includes(filter)).length;

                                    return (
                                        <button
                                            key={filter}
                                            onClick={() => handleFilterClick(filter)}
                                            className={cn(
                                                "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 shrink-0",
                                                activeFilter === filter
                                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                                                    : "bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700/50"
                                            )}
                                        >
                                            {filter}
                                            <span className={cn(
                                                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center transition-colors",
                                                activeFilter === filter
                                                    ? "bg-white/20 text-white"
                                                    : "bg-slate-800 text-slate-500"
                                            )}>
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right scroll button */}
                        <button
                            onClick={() => scroll('right')}
                            className={cn(
                                "flex shrink-0 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 overflow-hidden",
                                canScrollRight ? "w-7 h-7 border border-slate-700/50" : "w-0 h-7 opacity-0 pointer-events-none border-0 p-0"
                            )}
                            aria-label="Scroll filters right"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
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
