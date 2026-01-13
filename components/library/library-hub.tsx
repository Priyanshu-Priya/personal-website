'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight, FileText, Brain, BookOpen } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { GradientOrb } from '@/components/ui/aurora-background';
import { TextReveal } from '@/components/ui/text-reveal';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    summary: string;
    created_at: string;
}

interface Thought {
    id: string;
    content: string;
    mood: string | null;
    created_at: string;
}

interface ResonanceItem {
    id: string;
    title: string;
    type: string;
    resonance_score: number;
    created_at: string;
}

interface LibraryHubProps {
    posts: BlogPost[];
    thoughts: Thought[];
    resonance: ResonanceItem[];
}

export function LibraryHub({ posts, thoughts, resonance }: LibraryHubProps) {
    return (
        <main className="relative min-h-screen">
            {/* Background orbs */}
            <GradientOrb className="-top-20 -right-20" color="violet" size="xl" />
            <GradientOrb className="top-1/3 -left-32" color="indigo" size="lg" />
            <GradientOrb className="bottom-1/4 right-1/4" color="amber" size="md" />

            {/* Noise texture */}
            <div
                className="absolute inset-0 -z-10 pointer-events-none opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">
                {/* Header */}
                <motion.header
                    className="mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            <TextReveal text="Library" delay={0.2} />
                        </span>
                    </h1>
                    <motion.p
                        className="text-xl text-slate-400 max-w-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Long-form articles, quick thoughts, and things that resonate with me.
                    </motion.p>
                </motion.header>

                {/* Blog Section */}
                <motion.section
                    className="mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <FileText className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">Blog</h2>
                        </div>
                        <Link
                            href="/library/blog"
                            className="group text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                        >
                            View all
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {posts.length > 0 ? (
                        <div className="space-y-4">
                            {posts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={`/library/blog/${post.slug}`}>
                                        <GlowCard glowColor="emerald">
                                            <div className="p-5">
                                                <time className="text-xs text-slate-500 font-mono">
                                                    {format(new Date(post.created_at), 'MMM dd, yyyy')}
                                                </time>
                                                <h3 className="text-white font-medium mt-1 group-hover:text-emerald-400 transition-colors">
                                                    {post.title}
                                                </h3>
                                                <p className="text-sm text-slate-400 mt-1 line-clamp-1">{post.summary}</p>
                                            </div>
                                        </GlowCard>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500">No blog posts yet.</div>
                    )}
                </motion.section>

                {/* Thoughts Section */}
                <motion.section
                    className="mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                <Brain className="w-5 h-5 text-purple-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">Thoughts</h2>
                        </div>
                        <Link
                            href="/library/thoughts"
                            className="group text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                        >
                            View all
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {thoughts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {thoughts.map((thought, index) => (
                                <motion.div
                                    key={thought.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <GlowCard glowColor="violet">
                                        <div className="p-5 h-full">
                                            <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">
                                                {thought.content}
                                            </p>
                                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/50">
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
                    ) : (
                        <div className="text-center py-8 text-slate-500">No thoughts yet.</div>
                    )}
                </motion.section>

                {/* Resonance Section */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                <BookOpen className="w-5 h-5 text-amber-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">Resonance</h2>
                        </div>
                        <Link
                            href="/library/resonance"
                            className="group text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                        >
                            View all
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {resonance.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {resonance.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <GlowCard glowColor="amber">
                                        <div className="p-5">
                                            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 capitalize">
                                                {item.type}
                                            </span>
                                            <h3 className="text-white font-medium mt-3 line-clamp-2">{item.title}</h3>
                                            <div className="flex gap-1 mt-3">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={`w-2 h-2 rounded-full ${i < item.resonance_score ? 'bg-amber-400' : 'bg-slate-700'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </GlowCard>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500">No resonance items yet.</div>
                    )}
                </motion.section>
            </div>
        </main>
    );
}
