'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import type { HomePageContent } from '@/types/content';
import { parseTags } from '@/lib/tags';
import { resonanceTypeConfig, fallbackResonanceType } from '@/lib/resonance-config';

const fallback = fallbackResonanceType;

interface ResonanceItem {
    id: string;
    title: string;
    type: string;
    url: string | null;
    commentary: string | null;
    resonance_score: number;
    created_at: string;
    tags: string[] | null;
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

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {resonance.map((item, index) => {
                        const cfg = resonanceTypeConfig[item.type] ?? fallback;
                        const Icon = cfg.icon;
                        const tags = parseTags(item.tags);
                        const scoreWidth = `${(item.resonance_score / 5) * 100}%`;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: index * 0.08 }}
                            >
                                <Link href={`/library/resonance#item-${item.id}`} className="group/card block h-full">
                                    <div className="relative h-full rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden transition-all duration-300 group-hover/card:border-slate-700 group-hover/card:-translate-y-1 group-hover/card:shadow-xl group-hover/card:shadow-black/30">

                                        {/* Hover shimmer overlay */}
                                        <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br ${cfg.shimmer} to-transparent`} />

                                        <div className="relative p-5 flex flex-col h-full gap-3">
                                            {/* Type badge + link icon */}
                                            <div className="flex items-start justify-between">
                                                <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${cfg.badge}`}>
                                                    <Icon className="w-3 h-3" />
                                                    {item.type}
                                                </span>
                                                {item.url && (
                                                    <span className="opacity-0 group-hover/card:opacity-50 transition-opacity text-slate-400 mt-0.5">
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-sm font-semibold text-slate-200 line-clamp-3 leading-snug group-hover/card:text-white transition-colors flex-1">
                                                {item.title}
                                            </h3>

                                            {/* Commentary snippet */}
                                            {item.commentary && (
                                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed italic">
                                                    &ldquo;{item.commentary}&rdquo;
                                                </p>
                                            )}

                                            {/* Score bar + tags */}
                                            <div className="flex flex-col gap-2 pt-1 border-t border-slate-800/60">
                                                <div className="flex items-center gap-2 pt-2">
                                                    <span className="text-[10px] text-slate-600 font-mono shrink-0 uppercase tracking-wider">resonance</span>
                                                    <div className="flex-1 h-1 rounded-full bg-slate-800 overflow-hidden">
                                                        <motion.div
                                                            className={`h-full rounded-full ${cfg.bar}`}
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: scoreWidth }}
                                                            viewport={{ once: true }}
                                                            transition={{ duration: 0.7, delay: index * 0.08 + 0.2, ease: 'easeOut' }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 font-mono shrink-0">{item.resonance_score}/5</span>
                                                </div>

                                                {tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {tags.slice(0, 3).map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-500 border border-slate-700/50 font-mono"
                                                            >
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

