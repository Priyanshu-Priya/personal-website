'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Brain, Quote } from 'lucide-react';
import { format } from 'date-fns';
import type { HomePageContent } from '@/types/content';

interface Thought {
    id: string;
    content: string;
    mood: string | null;
    created_at: string;
}

interface ThoughtsSectionProps {
    content: HomePageContent['thoughts_section'];
    thoughts: Thought[];
}

export function ThoughtsSection({ content, thoughts }: ThoughtsSectionProps) {
    if (thoughts.length === 0) return null;

    return (
        <section className="py-24 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    className="flex items-center justify-between mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <Brain className="w-5 h-5 text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">{content.title}</h2>
                    </div>
                    <Link
                        href={content.view_all_href}
                        className="group text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                        {content.view_all_text}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Thoughts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {thoughts.map((thought, index) => (
                        <motion.div
                            key={thought.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: index * 0.08 }}
                        >
                            <Link
                                href={`/library/thoughts#item-${thought.id}`}
                                className="group/card block h-full"
                            >
                                <div className="relative h-full rounded-xl border border-slate-800 border-l-2 border-l-purple-500/40 bg-slate-900/60 backdrop-blur-sm overflow-hidden transition-all duration-300 group-hover/card:border-slate-700 group-hover/card:border-l-purple-400/60 group-hover/card:-translate-y-1 group-hover/card:shadow-xl group-hover/card:shadow-black/30">

                                    {/* Hover shimmer */}
                                    <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-purple-500/4 to-transparent" />

                                    <div className="relative p-5 flex flex-col h-full">
                                        {/* Opening quote */}
                                        <Quote className="w-5 h-5 text-purple-500/40 mb-2 shrink-0" />

                                        {/* Content */}
                                        <p className="text-slate-300 text-sm leading-relaxed flex-1 line-clamp-4 group-hover/card:text-slate-200 transition-colors duration-200">
                                            {thought.content}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/60">
                                            <time className="text-xs text-slate-500 font-mono bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/40">
                                                {format(new Date(thought.created_at), 'MMM dd')}
                                            </time>
                                            {thought.mood && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 ml-auto">
                                                    {thought.mood}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

