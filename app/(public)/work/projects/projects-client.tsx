'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Code2 } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { GradientOrb } from '@/components/ui/aurora-background';
import { TextReveal } from '@/components/ui/text-reveal';
import type { ProjectsPageContent } from '@/types/content';

interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
    thumbnail_url: string | null;
    tech_stack: string[];
    is_featured: boolean;
}

interface ProjectsGridClientProps {
    content: ProjectsPageContent;
    projects: Project[];
}

export function ProjectsGridClient({ content, projects }: ProjectsGridClientProps) {
    return (
        <main className="relative min-h-screen">
            {/* Background orbs */}
            <GradientOrb className="-top-20 -right-20" color="indigo" size="xl" />
            <GradientOrb className="bottom-1/4 -left-32" color="violet" size="lg" />

            {/* Noise texture */}
            <div
                className="absolute inset-0 -z-10 pointer-events-none opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
                {/* Header */}
                {content.header.enabled && (
                    <motion.header
                        className="mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                <Code2 className="w-5 h-5 text-indigo-400" />
                            </div>
                            <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">{content.header.badge}</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                            <TextReveal text={content.header.title} delay={0.2} />
                        </h1>

                        <motion.p
                            className="text-xl text-slate-400 max-w-2xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {content.header.subtitle}
                        </motion.p>
                    </motion.header>
                )}

                {/* Projects Grid */}
                {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link href={`/work/projects/${project.slug}`} className="group block h-full">
                                    <GlowCard
                                        glowColor={project.is_featured ? 'indigo' : 'violet'}
                                        className="h-full"
                                    >
                                        <div className="p-6 h-full flex flex-col">
                                            {/* Image */}
                                            {project.thumbnail_url && (
                                                <div className="relative overflow-hidden rounded-xl mb-5 bg-slate-800 aspect-[16/10]">
                                                    <Image
                                                        src={project.thumbnail_url}
                                                        alt={project.title}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                    {/* Featured badge */}
                                                    {project.is_featured && (
                                                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-indigo-500/90 backdrop-blur-sm text-white text-xs font-medium">
                                                            {content.featured_badge}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="flex-1">
                                                <h2 className="font-semibold text-white group-hover:text-indigo-400 transition-colors mb-2 text-lg">
                                                    {project.title}
                                                </h2>
                                                <p className="text-slate-400 text-sm line-clamp-2">
                                                    {project.summary}
                                                </p>
                                            </div>

                                            {/* Tech stack */}
                                            {project.tech_stack?.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {project.tech_stack.slice(0, 3).map((tech) => (
                                                        <span
                                                            key={tech}
                                                            className="text-xs px-2.5 py-1 rounded-md bg-slate-800/50 text-slate-400 border border-slate-700/50"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Arrow */}
                                            <div className="flex justify-end mt-4">
                                                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </GlowCard>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 inline-block mb-4">
                            <Code2 className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="text-slate-500 text-lg">{content.empty_state.title}</p>
                        <p className="text-slate-600 text-sm mt-1">{content.empty_state.subtitle}</p>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
