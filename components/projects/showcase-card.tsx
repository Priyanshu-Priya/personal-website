'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Github, Globe, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
    thumbnail_url: string | null;
    tech_stack: string[];
    is_featured: boolean;
    display_date?: string | null;
    github_url?: string | null;
    live_url?: string | null;
    demo_url?: string | null;
}

interface ShowcaseCardProps {
    project: Project;
    priority?: boolean;
}

// Format help
function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return null;
    try {
        return format(new Date(dateStr), 'MMM yyyy');
    } catch {
        return null;
    }
}

export function ShowcaseCard({ project, priority = false }: ShowcaseCardProps) {
    const formattedDate = formatDate(project.display_date);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -8 }}
            className="group relative h-full"
        >
            <div className={cn(
                "relative h-full flex flex-col rounded-2xl overflow-hidden",
                "bg-slate-900/40 border border-slate-800/50",
                "backdrop-blur-sm transition-colors duration-500",
                "hover:bg-slate-800/60 hover:border-slate-700/60",
                "hover:shadow-2xl hover:shadow-indigo-500/10"
            )}>
                {/* Image Section */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    {project.thumbnail_url ? (
                        <Image
                            src={project.thumbnail_url}
                            alt={project.title}
                            fill
                            priority={priority}
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center text-slate-700">
                            No Image
                        </div>
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Featured Badge (Top Left) */}
                    {project.is_featured && (
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-linear-to-r from-indigo-500/90 to-violet-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20 shadow-lg shadow-indigo-500/20 z-20">
                            Featured
                        </div>
                    )}

                    {/* Date Pill (Top Right) */}
                    {formattedDate && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-800/50 text-[10px] font-medium text-slate-300 flex items-center gap-1.5 z-10">
                            <Calendar className="w-3 h-3" />
                            {formattedDate}
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 p-5 flex flex-col">
                    <div className="flex-1">
                        <Link href={`/work/projects/${project.slug}`} className="block group/title focus:outline-none">
                            <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover/title:text-indigo-400 transition-colors flex items-center gap-2">
                                <span className="absolute inset-0 z-0" /> {/* Stretched Link */}
                                {project.title}
                                <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 translate-x-1 group-hover/title:opacity-100 group-hover/title:translate-y-0 group-hover/title:translate-x-0 transition-all duration-300" />
                            </h3>
                        </Link>

                        <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                            {project.summary}
                        </p>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2 mb-4 pointer-events-none">
                            {project.tech_stack?.slice(0, 3).map(tech => (
                                <span key={tech} className="px-2 py-0.5 rounded-md bg-slate-800/50 border border-slate-700/50 text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                                    {tech}
                                </span>
                            ))}
                            {project.tech_stack?.length > 3 && (
                                <span className="px-2 py-0.5 rounded-md bg-slate-800/30 text-[10px] text-slate-500">
                                    +{project.tech_stack.length - 3}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions (Z-Index above stretched link) */}
                    <div className="relative z-10 pt-4 mt-auto border-t border-slate-800/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                    title="Github"
                                >
                                    <Github className="w-4 h-4" />
                                </a>
                            )}
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                                    title="Live Site"
                                >
                                    <Globe className="w-4 h-4" />
                                </a>
                            )}
                        </div>

                        {/* View Details Link */}
                        <Link
                            href={`/work/projects/${project.slug}`}
                            className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors group/details"
                        >
                            View
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/details:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* Glow Effect Layer */}
                <div
                    className="absolute inset-0 rounded-2xl bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ filter: 'blur(20px)' }}
                />
            </div>
        </motion.div>
    );
}
