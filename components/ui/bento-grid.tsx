'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Format date to "MMM yyyy" (e.g., "Jan 2026")
function formatProjectDate(dateString: string | null): string | null {
    if (!dateString) return null;
    try {
        return format(new Date(dateString), 'MMM yyyy');
    } catch {
        return dateString;
    }
}

interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
    thumbnail_url: string | null;
    tech_stack: string[];
    // New Master Architecture fields (optional for backwards compatibility)
    project_type?: string | null;
    status?: string | null;
    display_date?: string | null;
    is_featured?: boolean;
}

interface BentoGridProps {
    projects: Project[];
}

// Container animation
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

// Item animation
const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
    },
};

export function BentoGrid({ projects }: BentoGridProps) {
    if (projects.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 inline-block mb-4">
                    <Code2 className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-500">Projects coming soon...</p>
            </div>
        );
    }

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
        >
            {projects.slice(0, 6).map((project) => (
                <BentoCard
                    key={project.id}
                    project={project}
                    isFeatured={project.is_featured || false}
                />
            ))}
        </motion.div>
    );
}

interface BentoCardProps {
    project: Project;
    isFeatured: boolean;
}

function BentoCard({ project, isFeatured }: BentoCardProps) {
    return (
        <motion.div variants={itemVariants}>
            <Link href={`/work/projects/${project.slug}`} className="group block h-full">
                <div
                    className={cn(
                        'relative h-full overflow-hidden rounded-2xl',
                        'bg-slate-900/50 backdrop-blur-md',
                        'border border-slate-800/50',
                        'transition-all duration-500',
                        'hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/10',
                        'min-h-[360px]'
                    )}
                >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Image */}
                    {project.thumbnail_url && (
                        <div className="absolute inset-0 overflow-hidden opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                            <Image
                                src={project.thumbnail_url}
                                alt={project.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
                        </div>
                    )}

                    {/* Content */}
                    <div className="relative h-full p-6 flex flex-col justify-end">

                        {/* Date badge */}
                        {formatProjectDate(project.display_date) && (
                            <motion.div
                                className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-700/50 text-slate-300 text-xs font-medium backdrop-blur-sm"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                {formatProjectDate(project.display_date)}
                            </motion.div>
                        )}

                        {/* Arrow icon */}
                        <div className="absolute top-4 right-4">
                            <div className="p-2 rounded-full bg-slate-800/50 backdrop-blur-sm text-slate-400 group-hover:text-white group-hover:bg-violet-500/80 transition-all duration-300 transform group-hover:rotate-45">
                                <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Text content with slide-up animation */}
                        <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                            {/* Tech stack */}
                            {project.tech_stack?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {project.tech_stack.slice(0, 3).map((tech) => (
                                        <span
                                            key={tech}
                                            className="text-xs px-2 py-1 rounded-md bg-slate-800/80 text-slate-400 backdrop-blur-sm"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Title */}
                            <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                                {project.title}
                            </h3>

                            {/* Summary */}
                            <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                                {project.summary}
                            </p>

                            {/* Gradient line accent */}
                            <div className="mt-4 h-px w-12 bg-linear-to-r from-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                    </div>

                    {/* Animated border glow */}
                    <div className="absolute inset-0 rounded-2xl border border-violet-500/0 group-hover:border-violet-500/20 transition-colors duration-500" />
                </div>
            </Link>
        </motion.div>
    );
}
