'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Code2 } from 'lucide-react';
import { BentoGrid } from '@/components/ui/bento-grid';
import type { HomePageContent } from '@/types/content';

interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
    thumbnail_url: string | null;
    tech_stack: string[];
    is_featured?: boolean;
    display_date?: string | null;
}

interface ProjectsSectionProps {
    content: HomePageContent['projects_section'];
    projects: Project[];
}

export function ProjectsSection({ content, projects }: ProjectsSectionProps) {
    // Sort to put featured project first
    const sortedProjects = [...projects].sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return 0;
    });

    return (
        <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="flex items-center justify-between mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                            <Code2 className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{content.title}</h2>
                            <p className="text-sm text-slate-500 mt-0.5">
                                {content.subtitle}
                            </p>
                        </div>
                    </div>
                    <Link
                        href={content.view_all_href}
                        className="group text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                        {content.view_all_text}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Bento Grid */}
                <BentoGrid projects={sortedProjects} />
            </div>
        </section>
    );
}
