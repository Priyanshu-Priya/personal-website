'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github, Calendar, Linkedin, FileText, Layers, User } from 'lucide-react';
import { format } from 'date-fns';
import { GlowCard } from '@/components/ui/glow-card';
import { GradientOrb } from '@/components/ui/aurora-background';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { MarkdownViewer } from '@/components/ui/markdown-viewer';
import type { ProjectStatus } from '@/types/project';

interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
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

interface ProjectDetailProps {
    project: Project;
}

const statusStyles: Record<ProjectStatus, { bg: string; text: string; border: string }> = {
    'Completed': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    'In Progress': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    'Archived': { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' },
};

export function ProjectDetail({ project }: ProjectDetailProps) {
    const status = (project.status || 'Completed') as ProjectStatus;
    const statusStyle = statusStyles[status];

    const formattedDate = project.display_date
        ? format(new Date(project.display_date), 'MMMM yyyy')
        : format(new Date(project.created_at), 'MMMM yyyy');

    const hasLinks = project.demo_url || project.live_url || project.github_url || project.docs_url || project.linkedin_post_url;

    return (
        <main className="relative min-h-screen">
            {/* Background */}
            <GradientOrb className="-top-20 right-1/4" color="indigo" size="xl" />
            <GradientOrb className="top-1/2 -left-32" color="violet" size="lg" />

            <div
                className="absolute inset-0 -z-10 pointer-events-none opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16">
                {/* Back link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Link
                        href="/work/projects"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Projects
                    </Link>
                </motion.div>

                {/* Header Section (Compact - No tech/buttons) */}
                <motion.header
                    className="mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Meta Badges - Date on right */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <div className="flex flex-wrap items-center gap-2">
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
                        </div>
                        {/* Date on right */}
                        <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-800/50 text-slate-300 border border-slate-700/50 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            {formattedDate}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        {project.title}
                    </h1>

                    {/* Summary */}
                    <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
                        {project.summary}
                    </p>

                    {/* Tech Stack - Above Image */}
                    {project.tech_stack?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-5">
                            {project.tech_stack.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-800/60 text-slate-300 border border-slate-700/50"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}
                </motion.header>

                {/* Thumbnail */}
                {project.thumbnail_url && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="mb-6"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-indigo-500/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                            <div className="relative rounded-xl overflow-hidden border border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
                                <div className="relative aspect-[21/9]">
                                    <Image
                                        src={project.thumbnail_url}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Action Buttons - Below Image */}
                {hasLinks && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-10 flex flex-wrap gap-3"
                    >
                        {(project.demo_url || project.live_url) && (
                            <MagneticButton
                                href={project.demo_url || project.live_url || '#'}
                                className="px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-500 text-sm"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Live Demo
                            </MagneticButton>
                        )}
                        {project.github_url && (
                            <MagneticButton
                                href={project.github_url}
                                className="px-5 py-2.5 bg-slate-800/80 text-white border border-slate-700 text-sm"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="w-4 h-4" />
                                Source Code
                            </MagneticButton>
                        )}
                        {project.docs_url && (
                            <MagneticButton
                                href={project.docs_url}
                                className="px-5 py-2.5 bg-slate-800/80 text-white border border-slate-700 text-sm"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FileText className="w-4 h-4" />
                                Docs
                            </MagneticButton>
                        )}
                        {project.linkedin_post_url && (
                            <MagneticButton
                                href={project.linkedin_post_url}
                                className="px-5 py-2.5 bg-[#0077B5]/15 text-white border border-[#0077B5]/40 hover:bg-[#0077B5] hover:border-[#0077B5] text-sm transition-all"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Linkedin className="w-4 h-4" />
                                LinkedIn
                            </MagneticButton>
                        )}
                    </motion.div>
                )}

                {/* Content Section */}
                {project.content && (
                    <motion.article
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <GlowCard glowColor="violet">
                            <div className="p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full" />
                                    <h2 className="text-xl font-bold text-white">About This Project</h2>
                                </div>

                                <MarkdownViewer content={project.content} />
                            </div>
                        </GlowCard>
                    </motion.article>
                )}

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <p className="text-slate-500 mb-4">Interested in working together?</p>
                    <MagneticButton
                        href="/about"
                        className="px-6 py-3 bg-violet-600 text-white hover:bg-violet-500"
                    >
                        Get in Touch
                    </MagneticButton>
                </motion.div>
            </div>
        </main>
    );
}
