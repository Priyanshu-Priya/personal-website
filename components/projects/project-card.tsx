'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { ProjectCardItem, ProjectStatus } from '@/types/project';

interface ProjectCardProps {
    project: ProjectCardItem;
    index?: number;
}

const statusStyles: Record<ProjectStatus, string> = {
    'Completed': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'In Progress': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Archived': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

// Format date to "MMM yyyy" (e.g., "Jan 2026")
function formatProjectDate(dateString: string | null): string | null {
    if (!dateString) return null;
    try {
        return format(new Date(dateString), 'MMM yyyy');
    } catch {
        return dateString;
    }
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
    const status = (project.status || 'Completed') as ProjectStatus;
    const formattedDate = formatProjectDate(project.display_date);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
        >
            <Link href={`/work/projects/${project.slug}`}>
                <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:border-slate-700/80 hover:shadow-2xl hover:shadow-indigo-500/5">

                    {/* Image Section */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                        {project.thumbnail_url ? (
                            <Image
                                src={project.thumbnail_url}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                <span className="text-4xl text-slate-700 font-bold">
                                    {project.title.charAt(0)}
                                </span>
                            </div>
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />

                        {/* Status & Date Pills */}
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                            {/* Status Badge */}
                            <span className={cn(
                                'px-2.5 py-1 text-xs font-medium rounded-full border backdrop-blur-sm',
                                statusStyles[status]
                            )}>
                                {status}
                            </span>

                            {/* Date Badge */}
                            {formattedDate && (
                                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-900/60 text-slate-300 border border-slate-700/50 backdrop-blur-sm">
                                    {formattedDate}
                                </span>
                            )}
                        </div>


                    </div>

                    {/* Content Section */}
                    <div className="p-5 space-y-3">
                        {/* Project Type */}
                        {project.project_type && (
                            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                {project.project_type}
                            </span>
                        )}

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                            {project.title}
                        </h3>

                        {/* Summary */}
                        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                            {project.summary}
                        </p>

                        {/* Tech Stack Pills */}
                        {project.tech_stack && project.tech_stack.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                                {project.tech_stack.slice(0, 4).map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50"
                                    >
                                        {tech}
                                    </span>
                                ))}
                                {project.tech_stack.length > 4 && (
                                    <span className="px-2 py-0.5 text-xs font-medium text-slate-500">
                                        +{project.tech_stack.length - 4}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer with Links */}
                    <div className="px-5 pb-4 flex items-center justify-between border-t border-slate-800/50 pt-4">
                        {/* Action Icons */}
                        <div className="flex items-center gap-2">
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                                    title="View Source"
                                >
                                    <Github className="w-4 h-4" />
                                </a>
                            )}
                            {(project.live_url || project.demo_url) && (
                                <a
                                    href={project.demo_url || project.live_url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                                    title="Live Demo"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>

                        {/* View Details Arrow */}
                        <div className="flex items-center gap-1 text-sm text-slate-500 group-hover:text-indigo-400 transition-colors">
                            <span className="text-xs">View Details</span>
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

/**
 * Featured Project Card - Larger variant for hero projects
 */
export function FeaturedProjectCard({ project, index = 0 }: ProjectCardProps) {
    const status = (project.status || 'Completed') as ProjectStatus;
    const formattedDate = formatProjectDate(project.display_date);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="group relative col-span-2"
        >
            <Link href={`/work/projects/${project.slug}`}>
                <div className="relative overflow-hidden rounded-3xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10">

                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
                            {project.thumbnail_url ? (
                                <Image
                                    src={project.thumbnail_url}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 to-slate-900 flex items-center justify-center">
                                    <span className="text-6xl text-slate-700 font-bold">
                                        {project.title.charAt(0)}
                                    </span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/80 hidden md:block" />
                        </div>

                        {/* Content Section */}
                        <div className="p-8 flex flex-col justify-center space-y-4">
                            {/* Badges Row */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={cn(
                                    'px-2.5 py-1 text-xs font-medium rounded-full border',
                                    statusStyles[status]
                                )}>
                                    {status}
                                </span>
                                {formattedDate && (
                                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                        {formattedDate}
                                    </span>
                                )}
                                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    Featured
                                </span>
                            </div>

                            {/* Type & Title */}
                            {project.project_type && (
                                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                    {project.project_type}
                                </span>
                            )}
                            <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                                {project.title}
                            </h3>

                            {/* Summary */}
                            <p className="text-slate-400 line-clamp-3 leading-relaxed">
                                {project.summary}
                            </p>

                            {/* Tech Stack */}
                            {project.tech_stack && project.tech_stack.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {project.tech_stack.slice(0, 5).map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Action Icons */}
                            <div className="flex items-center gap-4 pt-4">
                                {project.github_url && (
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors"
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
                                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>Demo</span>
                                    </a>
                                )}
                                <div className="flex-1" />
                                <div className="flex items-center gap-1 text-indigo-400">
                                    <span className="text-sm font-medium">View Project</span>
                                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
