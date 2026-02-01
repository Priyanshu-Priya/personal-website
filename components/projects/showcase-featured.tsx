'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Github, ExternalLink, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from './showcase-card';

interface ShowcaseFeaturedProps {
    project: Project;
}

export function ShowcaseFeatured({ project }: ShowcaseFeaturedProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="group relative w-full mb-16"
        >
            {/* Spotlight Glow Background */}
            <div className="absolute -inset-1 rounded-[2rem] bg-linear-to-r from-indigo-500/20 via-violet-500/20 to-fuchsia-500/20 opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-700" />

            <div className={cn(
                "relative grid lg:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-10",
                "bg-slate-900/80 backdrop-blur-xl",
                "border border-white/10 rounded-3xl",
                "overflow-hidden"
            )}>
                {/* Decorative Grid Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

                {/* Content Side */}
                <div className="flex flex-col justify-center order-2 lg:order-1 relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <Sparkles className="w-3 h-3" />
                            Featured Project
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        <Link href={`/work/projects/${project.slug}`} className="hover:text-indigo-400 transition-colors">
                            {project.title}
                        </Link>
                    </h1>

                    <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-xl">
                        {project.summary}
                    </p>

                    <div className="flex flex-wrap gap-3 mb-10">
                        {project.tech_stack?.map((tech) => (
                            <span
                                key={tech}
                                className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 text-sm font-medium"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href={`/work/projects/${project.slug}`}
                            className="px-6 py-3 rounded-xl bg-white text-slate-950 font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2"
                        >
                            View Case Study
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700">
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-slate-400 hover:text-white transition-colors"
                                    title="Github"
                                >
                                    <Github className="w-5 h-5" />
                                </a>
                            )}
                            {project.live_url && (
                                <div className="w-px h-4 bg-slate-700 mx-1" />
                            )}
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"
                                    title="Live Site"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Image Side */}
                <div className="order-1 lg:order-2 relative group/image">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[16/10] bg-slate-950">
                        {project.thumbnail_url && (
                            <Image
                                src={project.thumbnail_url}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover/image:scale-105"
                                sizes="(max-width: 1200px) 100vw, 50vw"
                                priority
                            />
                        )}
                        <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay group-hover/image:opacity-0 transition-opacity" />
                    </div>
                    {/* Floating decoration */}
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-indigo-600/20 backdrop-blur-xl rounded-2xl border border-white/10 -z-10 animate-pulse" />
                </div>
            </div>
        </motion.div>
    );
}
