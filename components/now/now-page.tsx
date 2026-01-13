'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import { Clock, Briefcase, BookOpen, Brain, Sparkles, ArrowRight } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { GradientOrb } from '@/components/ui/aurora-background';
import { TextReveal } from '@/components/ui/text-reveal';

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

interface NowPageProps {
    thoughts: Thought[];
    projects: Project[];
}

export function NowPage({ thoughts, projects }: NowPageProps) {
    const lastUpdated = new Date();

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
                {/* Header */}
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

                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            <TextReveal text="Now" delay={0.2} />
                        </span>
                    </h1>

                    <motion.p
                        className="text-xl text-slate-400 max-w-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        What I'm focused on right now. Inspired by{' '}
                        <a href="https://nownownow.com" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">
                            nownownow.com
                        </a>
                    </motion.p>
                </motion.header>

                {/* Current Focus */}
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
                        <h2 className="text-xl font-semibold text-white">Current Focus</h2>
                    </div>

                    <GlowCard glowColor="amber">
                        <div className="p-6">
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                                    Building production-ready full-stack applications
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                                    Exploring AI/ML integration in web applications
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                                    Preparing for campus placements
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                                    Contributing to open-source projects
                                </li>
                            </ul>
                        </div>
                    </GlowCard>
                </motion.section>

                {/* Projects */}
                {projects.length > 0 && (
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
                                <h2 className="text-xl font-semibold text-white">Working On</h2>
                            </div>
                            <Link
                                href="/work/projects"
                                className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                            >
                                View all
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
                )}

                {/* Learning */}
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
                        <h2 className="text-xl font-semibold text-white">Learning</h2>
                    </div>

                    <GlowCard glowColor="emerald">
                        <div className="p-6">
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                                    Advanced React patterns and performance optimization
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                                    System design fundamentals
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                                    Deep learning with PyTorch
                                </li>
                            </ul>
                        </div>
                    </GlowCard>
                </motion.section>

                {/* Recent Thoughts */}
                {thoughts.length > 0 && (
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
                                <h2 className="text-xl font-semibold text-white">Recent Thoughts</h2>
                            </div>
                            <Link
                                href="/library/thoughts"
                                className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                            >
                                View all
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
                )}
            </div>
        </main>
    );
}
