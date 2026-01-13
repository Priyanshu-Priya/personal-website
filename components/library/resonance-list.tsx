'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import { BookOpen, ExternalLink, BookMarked, FileText, Video, Podcast, MessageCircle } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { GradientOrb } from '@/components/ui/aurora-background';
import { TextReveal } from '@/components/ui/text-reveal';

interface ResonanceEntry {
    id: string;
    title: string;
    url: string | null;
    type: 'article' | 'book' | 'video' | 'podcast' | 'tweet';
    commentary: string | null;
    resonance_score: number;
    created_at: string;
}

interface ResonanceListProps {
    entries: ResonanceEntry[];
}

const typeIcons = {
    article: FileText,
    book: BookMarked,
    video: Video,
    podcast: Podcast,
    tweet: MessageCircle,
};

const typeColors = {
    article: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    book: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    video: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    podcast: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    tweet: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
};

export function ResonanceList({ entries }: ResonanceListProps) {
    return (
        <main className="relative min-h-screen">
            {/* Background orbs */}
            <GradientOrb className="-top-20 -right-20" color="amber" size="xl" />
            <GradientOrb className="bottom-1/3 -left-32" color="violet" size="lg" />

            {/* Noise texture */}
            <div
                className="absolute inset-0 -z-10 pointer-events-none opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
                {/* Header */}
                <motion.header
                    className="mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <BookOpen className="w-5 h-5 text-amber-400" />
                        </div>
                        <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">Library</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                        <TextReveal text="Resonance" delay={0.2} />
                    </h1>

                    <motion.p
                        className="text-xl text-slate-400 max-w-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        A curated timeline of ideas, articles, books, and conversations that shaped my thinking.
                    </motion.p>
                </motion.header>

                {/* Entries */}
                {entries.length > 0 ? (
                    <div className="relative">
                        {/* Timeline line */}
                        <motion.div
                            className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/50 via-amber-500/30 to-transparent"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{ transformOrigin: 'top' }}
                        />

                        <div className="space-y-6 pl-10">
                            {entries.map((entry, index) => {
                                const TypeIcon = typeIcons[entry.type] || FileText;

                                return (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.08 }}
                                        className="relative"
                                    >
                                        {/* Timeline dot */}
                                        <motion.div
                                            className="absolute -left-10 top-6 w-6 h-6 rounded-full bg-slate-900 border-2 border-amber-500/50 flex items-center justify-center"
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.08 + 0.2, type: 'spring' }}
                                        >
                                            <TypeIcon className="w-3 h-3 text-amber-400" />
                                        </motion.div>

                                        <GlowCard glowColor="amber">
                                            <div className="p-6">
                                                {/* Type and date */}
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${typeColors[entry.type] || typeColors.article}`}>
                                                        {entry.type}
                                                    </span>
                                                    <time className="text-xs text-slate-500 font-mono">
                                                        {format(new Date(entry.created_at), 'MMM dd, yyyy')}
                                                    </time>
                                                </div>

                                                {/* Title */}
                                                <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                                    {entry.title}
                                                    {entry.url && (
                                                        <a
                                                            href={entry.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-slate-500 hover:text-amber-400 transition-colors"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </h2>

                                                {/* Commentary */}
                                                {entry.commentary && (
                                                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                                        {entry.commentary}
                                                    </p>
                                                )}

                                                {/* Score */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-500">Resonance:</span>
                                                    <div className="flex gap-1">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <motion.span
                                                                key={i}
                                                                className={`w-2.5 h-2.5 rounded-full ${i < entry.resonance_score ? 'bg-amber-400' : 'bg-slate-700'
                                                                    }`}
                                                                initial={{ scale: 0 }}
                                                                whileInView={{ scale: 1 }}
                                                                viewport={{ once: true }}
                                                                transition={{ delay: index * 0.08 + i * 0.05 }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </GlowCard>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 inline-block mb-4">
                            <BookOpen className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="text-slate-500 text-lg">No entries yet. The collection is growing.</p>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
