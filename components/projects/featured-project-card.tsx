'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Github, ExternalLink, Calendar, Layers } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { ProjectCardItem, ProjectStatus } from '@/types/project';

interface FeaturedProjectCardProps {
    project: ProjectCardItem;
    index?: number;
}

const statusStyles: Record<ProjectStatus, string> = {
    'Completed': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'In Progress': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Archived': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

function formatProjectDate(dateString: string | null): string | null {
    if (!dateString) return null;
    try {
        return format(new Date(dateString), 'MMM yyyy');
    } catch {
        return dateString;
    }
}

export function EditorialFeaturedCard({ project, index = 0 }: FeaturedProjectCardProps) {
    const status = (project.status || 'Completed') as ProjectStatus;
    const formattedDate = formatProjectDate(project.display_date);

    return (
        <motion.article
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group"
        >
            <Link href={`/work/projects/${project.slug}`}>
                <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10">

                    {/* Grid Layout - Image + Content side by side */}
                    <div className="grid md:grid-cols-[1.1fr,1fr] gap-0">

                        {/* Image Section - Compact */}
                        <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[280px] overflow-hidden">
                            {project.thumbnail_url ? (
                                <Image
                                    src={project.thumbnail_url}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    priority={index < 2}
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 to-slate-900 flex items-center justify-center">
                                    <span className="text-5xl text-slate-700 font-bold">
                                        {project.title.charAt(0)}
                                    </span>
                                </div>
                            )}
                            {/* Gradient overlay on right for blend */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/90 hidden md:block" />
                        </div>

                        {/* Content Section - Compact */}
                        <div className="p-6 flex flex-col justify-center space-y-4">
                            {/* Meta badges - Smaller */}
                            <div className="flex flex-wrap items-center gap-2">
                                {formattedDate && (
                                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formattedDate}
                                    </span>
                                )}
                                <span className={cn(
                                    'px-2.5 py-1 text-xs font-semibold rounded-full border',
                                    statusStyles[status]
                                )}>
                                    {status}
                                </span>
                                {project.project_type && (
                                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                                        <Layers className="w-3 h-3" />
                                        {project.project_type}
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight">
                                {project.title}
                            </h2>

                            {/* Summary */}
                            <p className="text-slate-400 line-clamp-2 leading-relaxed">
                                {project.summary}
                            </p>

                            {/* Tech Stack */}
                            {project.tech_stack && project.tech_stack.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {project.tech_stack.slice(0, 4).map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2 py-1 text-xs font-medium rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {project.tech_stack.length > 4 && (
                                        <span className="px-2 py-1 text-xs text-slate-500">
                                            +{project.tech_stack.length - 4}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Action Row */}
                            <div className="flex items-center gap-4 pt-2">
                                {project.github_url && (
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors"
                                    >
                                        <Github className="w-4 h-4" />
                                        <span>Source</span>
                                    </a>
                                )}
                                {(project.live_url || project.demo_url) && (
                                    <a
                                        href={project.demo_url || project.live_url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>Demo</span>
                                    </a>
                                )}
                                <div className="flex-1" />
                                <div className="flex items-center gap-1 text-sm text-indigo-400 font-medium">
                                    <span>View Project</span>
                                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article >
    );
}
