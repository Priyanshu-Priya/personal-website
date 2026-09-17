'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Brain, ChevronDown, Quote } from 'lucide-react';
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

// Thoughts longer than this get collapsed by default
const COLLAPSE_THRESHOLD = 300;

// ─── Per-card component ────────────────────────────────────────────────────────
function ThoughtCard({ thought, index }: { thought: Thought; index: number }) {
    const isLong = thought.content.length > COLLAPSE_THRESHOLD;

    /**
     * Read window.location.hash synchronously in the useState initializer —
     * runs at mount time before any useEffect fires, so the deep-linked card
     * from the home screen is already open with zero timing gap.
     */
    const [expanded, setExpanded] = useState<boolean>(() => {
        if (!isLong) return true;
        if (typeof window === 'undefined') return false;
        return window.location.hash === `#item-${thought.id}`;
    });

    const toggle = () => {
        if (isLong) setExpanded(prev => !prev);
    };

    return (
        <motion.div
            id={`item-${thought.id}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
        >
            {/* Timeline dot */}
            <motion.div
                className="absolute -left-10 top-5 w-6 h-6 rounded-full bg-purple-500/10 border-2 border-purple-500/60 flex items-center justify-center"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
            >
                <div className="w-2 h-2 rounded-full bg-purple-400" />
            </motion.div>

            {/* Card */}
            <div onClick={toggle} className={isLong ? 'cursor-pointer select-none' : ''}>
                <div className="relative rounded-xl border border-slate-800 border-l-2 border-l-purple-500/40 bg-slate-900/70 backdrop-blur-sm overflow-hidden transition-colors duration-300 hover:border-slate-700 hover:border-l-purple-400/60">

                    {/* Subtle shimmer */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-purple-500/3 to-transparent" />

                    <div className="relative p-6">

                        {/* Content block */}
                        <div className="relative">
                            {/* Chevron for long thoughts */}
                            {isLong && (
                                <motion.span
                                    animate={{ rotate: expanded ? 180 : 0 }}
                                    transition={{ duration: 0.25 }}
                                    className={`absolute top-0 right-0 inline-flex shrink-0 transition-colors ${expanded ? 'text-purple-400' : 'text-slate-600'}`}
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </motion.span>
                            )}

                            {/* Quote icon accent */}
                            <Quote className="w-6 h-6 text-purple-500/30 mb-3" />

                            {/* Left accent bar wrapping the content */}
                            <div className="border-l-2 border-purple-500/30 pl-4">
                                <AnimatePresence initial={false} mode="wait">
                                    <motion.div
                                        key={expanded ? 'open' : 'closed'}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <p className={[
                                            'text-slate-200 leading-relaxed text-lg',
                                            isLong && !expanded ? 'line-clamp-4' : '',
                                        ].join(' ')}>
                                            {thought.content}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Fade overlay when collapsed */}
                                {isLong && !expanded && (
                                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none" />
                                )}
                            </div>
                        </div>

                        {/* Footer: date + mood */}
                        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-800/60">
                            <time className="text-xs text-slate-500 font-mono bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/40">
                                {format(new Date(thought.created_at), 'MMM dd, yyyy')}
                            </time>
                            {thought.mood && (
                                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 ml-auto">
                                    {thought.mood}
                                </span>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Main list component ───────────────────────────────────────────────────────
export function ThoughtsList({ thoughts }: ThoughtsListProps) {
    const highlightedRef = useRef<string | null>(null);

    useEffect(() => {
        const hash = window.location.hash;
        if (!hash) return;
        const targetId = hash.slice(1); // strip '#'
        const el = document.getElementById(targetId);
        if (!el) return;

        // Delay slightly so Framer Motion entrance animations settle first
        const timer = setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-2', 'ring-purple-400', 'ring-offset-2', 'ring-offset-slate-950', 'rounded-xl');
            highlightedRef.current = targetId;
            const removeRing = setTimeout(() => {
                el.classList.remove('ring-2', 'ring-purple-400', 'ring-offset-2', 'ring-offset-slate-950', 'rounded-xl');
            }, 2000);
            return () => clearTimeout(removeRing);
        }, 600);

        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="relative min-h-screen">
            <GradientOrb className="-top-20 -right-20" color="violet" size="xl" />
            <GradientOrb className="bottom-1/4 -left-32" color="indigo" size="lg" />

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
                        <motion.div
                            className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-violet-500/30 to-transparent"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{ transformOrigin: 'top' }}
                        />
                        <div className="space-y-8 pl-10">
                            {thoughts.map((thought, index) => (
                                <ThoughtCard key={thought.id} thought={thought} index={index} />
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
