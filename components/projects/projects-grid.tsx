'use client';

import { motion } from 'framer-motion';
import { Code2, Archive, Star } from 'lucide-react';
import { GradientOrb } from '@/components/ui/aurora-background';
import { TextReveal } from '@/components/ui/text-reveal';
import { ProjectCard } from '@/components/projects/project-card';
import type { ProjectCardItem, ProjectStatus } from '@/types/project';

interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
    thumbnail_url: string | null;
    tech_stack: string[];
    is_featured: boolean;
    project_type?: string | null;
    status?: string | null;
    display_date?: string | null;
    github_url?: string | null;
    live_url?: string | null;
    demo_url?: string | null;
}

interface ProjectsGridProps {
    projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
    // Separate featured and archive projects
    const featuredProjects = projects.filter((p) => p.is_featured);
    const archiveProjects = projects.filter((p) => !p.is_featured);

    // Convert to ProjectCardItem format
    const toCardItem = (project: Project): ProjectCardItem => ({
        id: project.id,
        title: project.title,
        slug: project.slug,
        project_type: project.project_type || null,
        thumbnail_url: project.thumbnail_url,
        summary: project.summary,
        display_date: project.display_date || null,
        status: (project.status as ProjectStatus) || 'Completed',
        tech_stack: project.tech_stack,
        github_url: project.github_url || null,
        live_url: project.live_url || null,
        demo_url: project.demo_url || null,
        is_featured: project.is_featured,
    });

    // Determine grid columns based on count
    const getGridClass = (count: number) => {
        if (count === 1) return 'grid-cols-1 max-w-md mx-auto';
        if (count === 2) return 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto';
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    };

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
                        <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">Portfolio</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            <TextReveal text="Projects" delay={0.2} />
                        </span>
                    </h1>

                    <motion.p
                        className="text-xl text-slate-400 max-w-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        A collection of projects I've built, from web applications to AI experiments.
                    </motion.p>
                </motion.header>

                {projects.length > 0 ? (
                    <div className="space-y-12">

                        {/* FEATURED SECTION - Same card size as normal */}
                        {featuredProjects.length > 0 && (
                            <section>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-center gap-2 mb-6"
                                >
                                    <Star className="w-4 h-4 text-indigo-400" />
                                    <span className="text-sm font-mono text-indigo-400 uppercase tracking-wider">
                                        Featured Work
                                    </span>
                                </motion.div>

                                {/* Fixed 3-column grid - same as archive */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {featuredProjects.map((project, index) => (
                                        <ProjectCard
                                            key={project.id}
                                            project={toCardItem(project)}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* SECTION DIVIDER */}
                        {featuredProjects.length > 0 && archiveProjects.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-800" />
                                </div>
                                <div className="relative flex justify-center">
                                    <div className="px-6 py-2 bg-slate-950 flex items-center gap-2">
                                        <Archive className="w-4 h-4 text-slate-500" />
                                        <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">
                                            All Projects
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ARCHIVE SECTION - Same grid */}
                        {archiveProjects.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                            >
                                <div className={`grid gap-6 ${getGridClass(archiveProjects.length)}`}>
                                    {archiveProjects.map((project, index) => (
                                        <ProjectCard
                                            key={project.id}
                                            project={toCardItem(project)}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </motion.section>
                        )}
                    </div>
                ) : (
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p className="text-slate-500">No projects yet. Check back soon!</p>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
