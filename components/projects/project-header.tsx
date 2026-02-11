'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Globe, Github, FileText, Linkedin, Calendar, Layers, User } from 'lucide-react';
import { format } from 'date-fns';
import type { ProjectStatus } from '@/types/project';

interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
    thumbnail_url: string | null;
    tech_stack: string[];
    demo_url: string | null;
    github_url: string | null;
    live_url: string | null;
    docs_url: string | null;
    linkedin_post_url: string | null;
    created_at: string;
    project_type: string | null;
    status: string | null;
    role: string | null;
    display_date: string | null;
}

interface ProjectHeaderProps {
    project: Project;
}

const statusStyles: Record<ProjectStatus, { bg: string; text: string; border: string }> = {
    'Completed': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    'In Progress': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    'Archived': { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' },
};

// Floating animation for the image
const floatAnimation = {
    y: [0, -10, 0],
    transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const
    }
};

export function ProjectHeader({ project }: ProjectHeaderProps) {
    const status = (project.status || 'Completed') as ProjectStatus;
    const statusStyle = statusStyles[status];

    const formattedDate = project.display_date
        ? format(new Date(project.display_date), 'MMMM yyyy')
        : format(new Date(project.created_at), 'MMMM yyyy');

    const hasLinks = project.demo_url || project.live_url || project.github_url || project.docs_url || project.linkedin_post_url;

    return (
        <section className="relative min-h-[85vh] flex items-center">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
            </div>

            <div className="container max-w-7xl mx-auto px-6 pt-24 pb-16 lg:py-24">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-10 lg:mb-12"
                >
                    <Link
                        href="/work/projects"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Projects
                    </Link>
                </motion.div>

                {/* Split Layout Grid */}
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">
                    {/* Left Side - Context */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="order-2 lg:order-1"
                    >
                        {/* Meta Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            <span className={`px-3 py-1.5 text-xs font-semibold rounded-full border backdrop-blur-sm ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                ● {status}
                            </span>
                            {project.project_type && (
                                <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5">
                                    <Layers className="w-3 h-3" />
                                    {project.project_type}
                                </span>
                            )}
                            {project.role && (
                                <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 flex items-center gap-1.5">
                                    <User className="w-3 h-3" />
                                    {project.role}
                                </span>
                            )}
                            <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-800/50 text-slate-400 border border-slate-700/50 flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" />
                                {formattedDate}
                            </span>
                        </div>

                        {/* Title with Gradient */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            <span className="bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                                {project.title}
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-8 max-w-xl">
                            {project.summary}
                        </p>

                        {/* Tech Stack - Glowing Badges */}
                        {project.tech_stack?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8">
                                {project.tech_stack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300 transition-all duration-300"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Action Buttons - Responsive sizing */}
                        {hasLinks && (
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {(project.demo_url || project.live_url) && (
                                    <a
                                        href={project.demo_url || project.live_url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative inline-flex items-center gap-1.5 md:gap-2 px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl bg-indigo-600 text-white text-sm md:text-base font-medium overflow-hidden transition-all hover:bg-indigo-500 hover:scale-105"
                                    >
                                        {/* Glow Effect */}
                                        <div className="absolute inset-0 bg-linear-to-r from-indigo-400/0 via-indigo-400/30 to-indigo-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 relative z-10" />
                                        <span className="relative z-10">Live Demo</span>
                                    </a>
                                )}
                                {project.github_url && (
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 md:gap-2 px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl bg-slate-800/80 text-white text-sm md:text-base font-medium border border-slate-700 backdrop-blur-sm hover:bg-slate-700 hover:border-slate-600 transition-all"
                                    >
                                        <Github className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        <span className="hidden sm:inline">Source Code</span>
                                        <span className="sm:hidden">Code</span>
                                    </a>
                                )}
                                {project.docs_url && (
                                    <a
                                        href={project.docs_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 md:gap-2 px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl bg-slate-800/80 text-white text-sm md:text-base font-medium border border-slate-700 backdrop-blur-sm hover:bg-slate-700 hover:border-slate-600 transition-all"
                                    >
                                        <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        Docs
                                    </a>
                                )}
                                {project.linkedin_post_url && (
                                    <a
                                        href={project.linkedin_post_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 md:gap-2 px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl bg-[#0077B5]/15 text-white text-sm md:text-base font-medium border border-[#0077B5]/40 hover:bg-[#0077B5] hover:border-[#0077B5] transition-all"
                                    >
                                        <Linkedin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        <span className="hidden sm:inline">LinkedIn Post</span>
                                        <span className="sm:hidden">Post</span>
                                    </a>
                                )}
                            </div>
                        )}
                    </motion.div>

                    {/* Right Side - Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="order-1 lg:order-2"
                    >
                        {project.thumbnail_url && (
                            <motion.div
                                animate={floatAnimation}
                                className="relative group"
                            >
                                {/* Glow Background */}
                                <div className="absolute -inset-4 bg-linear-to-r from-indigo-500/20 via-violet-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-700" />

                                {/* Image Container */}
                                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-sm shadow-2xl">
                                    <div className="relative aspect-video">
                                        <Image
                                            src={project.thumbnail_url}
                                            alt={project.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority
                                        />
                                    </div>

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
