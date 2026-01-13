'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import type { HomePageContent } from '@/types/content';

interface ResonanceItem {
    id: string;
    title: string;
    type: string;
    url: string | null;
    commentary: string | null;
    resonance_score: number;
    created_at: string;
}

interface ResonanceSectionProps {
    content: HomePageContent['resonance_section'];
    resonance: ResonanceItem[];
}

export function ResonanceSection({ content, resonance }: ResonanceSectionProps) {
    if (resonance.length === 0) return null;

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
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <BookOpen className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{content.title}</h2>
                            {content.subtitle && (
                                <p className="text-sm text-slate-500">{content.subtitle}</p>
                            )}
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

                {/* Resonance Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {resonance.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <GlowCard glowColor="amber" className="h-full">
                                <div className="p-5 h-full flex flex-col">
                                    {/* Type badge */}
                                    <span className="inline-flex self-start text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 capitalize mb-3">
                                        {item.type}
                                    </span>

                                    {/* Title */}
                                    <h3 className="text-white font-medium flex-1 line-clamp-2 mb-2">
                                        {item.title}
                                    </h3>

                                    {/* Commentary */}
                                    {item.commentary && (
                                        <p className="text-xs text-slate-500 line-clamp-1 mb-3">
                                            {item.commentary}
                                        </p>
                                    )}

                                    {/* Score */}
                                    <div className="flex gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <motion.span
                                                key={i}
                                                className={`w-2 h-2 rounded-full ${i < item.resonance_score
                                                    ? 'bg-amber-400'
                                                    : 'bg-slate-700'
                                                    }`}
                                                initial={{ scale: 0 }}
                                                whileInView={{ scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.1 + i * 0.05 }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </GlowCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
