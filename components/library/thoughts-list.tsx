'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Brain } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { GradientOrb } from '@/components/ui/aurora-background';
import { TextReveal } from '@/components/ui/text-reveal';

interface Thought {
    id: string;
    content: string;
    mood: string | null;
    created_at: string;
}

interface ThoughtsListProps {
    thoughts: Thought[];
}

export function ThoughtsList({ thoughts }: ThoughtsListProps) {
    return (
        <main className="relative min-h-screen">
            {/* Background orbs */}
            <GradientOrb className="-top-20 -right-20" color="violet" size="xl" />
            <GradientOrb className="bottom-1/4 -left-32" color="indigo" size="lg" />

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
                        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <Brain className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">Library</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                        <TextReveal text="Thoughts" delay={0.2} />
                    </h1>

                    <motion.p
                        className="text-xl text-slate-400 max-w-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Quick observations, ideas, and unfiltered musings.
                    </motion.p>
                </motion.header>

                {/* Timeline */}
                {thoughts.length > 0 ? (
                    <div className="relative">
                        {/* Timeline line */}
                        <motion.div
                            className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-violet-500/30 to-transparent"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{ transformOrigin: 'top' }}
                        />

                        <div className="space-y-8 pl-10">
                            {thoughts.map((thought, index) => (
                                <motion.div
                                    key={thought.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative"
                                >
                                    {/* Timeline dot */}
                                    <motion.div
                                        className="absolute -left-10 top-5 w-6 h-6 rounded-full bg-slate-900 border-2 border-purple-500/50 flex items-center justify-center"
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                                    >
                                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                                    </motion.div>

                                    <GlowCard glowColor="violet">
                                        <div className="p-6">
                                            <p className="text-slate-200 leading-relaxed text-lg">
                                                {thought.content}
                                            </p>
                                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-800/50">
                                                <time className="text-sm text-slate-500 font-mono">
                                                    {format(new Date(thought.created_at), 'MMM dd, yyyy')}
                                                </time>
                                                {thought.mood && (
                                                    <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                        {thought.mood}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </GlowCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 inline-block mb-4">
                            <Brain className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="text-slate-500 text-lg">No thoughts yet. The mind is quiet.</p>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
