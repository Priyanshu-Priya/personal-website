'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import { Clock, Briefcase, BookOpen, Brain, Sparkles, ArrowRight } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { GradientOrb } from '@/components/ui/aurora-background';
import { TextReveal } from '@/components/ui/text-reveal';
import type { NowPageContent } from '@/types/content';
import { ReactNode } from 'react';

interface Thought {
    id: string;
    content: string;
    mood: string | null;
    created_at: string;
}

interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
}

// Section keys for ordering
type SectionKey = 'header' | 'current_focus' | 'working_on' | 'learning' | 'recent_thoughts';

interface SectionConfig {
    key: SectionKey;
    order: number;
    enabled: boolean;
    render: () => ReactNode;
}

interface NowPageClientProps {
    content: NowPageContent;
    thoughts: Thought[];
    projects: Project[];
}

export function NowPageClient({ content, thoughts, projects }: NowPageClientProps) {
    const lastUpdated = new Date();

    // Header Section Component
    const renderHeader = () => (
        <motion.header
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                    <Clock className="w-5 h-5 text-violet-400" />
                </div>
                <span className="text-sm font-mono text-slate-500">
                    Updated {format(lastUpdated, 'MMMM yyyy')}
                </span>
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
                {content.header.subtitle}{' '}
                <a
                    href={content.header.inspired_by_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:underline"
                >
                    {content.header.inspired_by_text}
                </a>
            </motion.p>
        </motion.header>
    );

    // Current Focus Section Component
    const renderCurrentFocus = () => (
        <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">{content.current_focus.section_title}</h2>
            </div>

            <GlowCard glowColor="amber">
                <div className="p-6">
                    <ul className="space-y-3 text-slate-300">
                        {content.current_focus.items.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </GlowCard>
        </motion.section>
    );

    // Working On Section Component
    const renderWorkingOn = () => {
        if (projects.length === 0) return null;
        return (
            <motion.section
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                            <Briefcase className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">{content.working_on.section_title}</h2>
                    </div>
                    <Link
                        href={content.working_on.view_all_href}
                        className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                        {content.working_on.view_all_text}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="space-y-4">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/work/projects/${project.slug}`}>
                                <GlowCard glowColor="indigo">
                                    <div className="p-5">
                                        <h3 className="font-medium text-white mb-1">{project.title}</h3>
                                        <p className="text-sm text-slate-400 line-clamp-1">{project.summary}</p>
                                    </div>
                                </GlowCard>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
        );
    };

    // Learning Section Component
    const renderLearning = () => (
        <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">{content.learning.section_title}</h2>
            </div>

            <GlowCard glowColor="emerald">
                <div className="p-6">
                    <ul className="space-y-3 text-slate-300">
                        {content.learning.items.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </GlowCard>
        </motion.section>
    );

    // Recent Thoughts Section Component
    const renderRecentThoughts = () => {
        if (thoughts.length === 0) return null;
        return (
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <Brain className="w-5 h-5 text-purple-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">{content.recent_thoughts.section_title}</h2>
                    </div>
                    <Link
                        href={content.recent_thoughts.view_all_href}
                        className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                        {content.recent_thoughts.view_all_text}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="space-y-4">
                    {thoughts.map((thought, index) => (
                        <motion.div
                            key={thought.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GlowCard glowColor="violet">
                                <div className="p-5">
                                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                                        {thought.content}
                                    </p>
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/50">
                                        <time className="text-xs text-slate-500 font-mono">
                                            {format(new Date(thought.created_at), 'MMM dd')}
                                        </time>
                                        {thought.mood && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">
                                                {thought.mood}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </GlowCard>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
        );
    };

    // Define all sections with their order and render functions
    const sections: SectionConfig[] = [
        {
            key: 'header',
            order: content.header.order ?? 1,
            enabled: content.header.enabled,
            render: renderHeader,
        },
        {
            key: 'current_focus',
            order: content.current_focus.order ?? 2,
            enabled: content.current_focus.enabled,
            render: renderCurrentFocus,
        },
        {
            key: 'working_on',
            order: content.working_on.order ?? 3,
            enabled: content.working_on.enabled,
            render: renderWorkingOn,
        },
        {
            key: 'learning',
            order: content.learning.order ?? 4,
            enabled: content.learning.enabled,
            render: renderLearning,
        },
        {
            key: 'recent_thoughts',
            order: content.recent_thoughts.order ?? 5,
            enabled: content.recent_thoughts.enabled,
            render: renderRecentThoughts,
        },
    ];

    // Sort sections by order and filter to enabled only
    const orderedSections = sections
        .filter((section) => section.enabled)
        .sort((a, b) => a.order - b.order);

    return (
        <main className="relative min-h-screen">
            {/* Background orbs */}
            <GradientOrb className="-top-20 -right-20" color="violet" size="xl" />
            <GradientOrb className="top-1/2 -left-32" color="amber" size="lg" />

            {/* Noise texture */}
            <div
                className="absolute inset-0 -z-10 pointer-events-none opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative z-10 max-w-3xl mx-auto px-6 py-24">
                {orderedSections.map((section) => (
                    <div key={section.key}>{section.render()}</div>
                ))}
            </div>
        </main>
    );
}
