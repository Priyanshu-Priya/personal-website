'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
    BookOpen, ExternalLink, BookMarked, FileText,
    Video, Podcast, MessageCircle, ChevronDown,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { GradientOrb } from '@/components/ui/aurora-background';
import { TextReveal } from '@/components/ui/text-reveal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

// Commentary longer than this gets collapsed by default
const COLLAPSE_THRESHOLD = 300;

// ─── Per-card component ────────────────────────────────────────────────────────
function ResonanceCard({ entry, index }: { entry: ResonanceEntry; index: number }) {
    const TypeIcon = typeIcons[entry.type] || FileText;
    const isLong = (entry.commentary?.length ?? 0) > COLLAPSE_THRESHOLD;

    /**
     * Read window.location.hash synchronously inside the useState initializer.
     * This runs at mount time — before any useEffect fires — so the card that
     * was deep-linked from the home screen opens immediately with zero timing gap.
     */
    const [expanded, setExpanded] = useState<boolean>(() => {
        if (!isLong) return true; // short commentary is always fully visible
        if (typeof window === 'undefined') return false;
        const hash = window.location.hash; // e.g. "#item-<uuid>"
        return hash === `#item-${entry.id}`; // true only for the linked card
    });

    const toggle = () => {
        if (isLong) setExpanded(prev => !prev);
    };

    return (
        <motion.div
            id={`item-${entry.id}`}
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

            {/* Entire card is the toggle target */}
            <div onClick={toggle} className={isLong ? 'cursor-pointer select-none' : ''}>
                <GlowCard glowColor="amber">
                    <div className="p-6">

                        {/* Type · Date · Chevron */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${typeColors[entry.type] || typeColors.article}`}>
                                    {entry.type}
                                </span>
                                <time className="text-xs text-slate-500 font-mono">
                                    {format(new Date(entry.created_at), 'MMM dd, yyyy')}
                                </time>
                            </div>

                            {isLong && (
                                <motion.span
                                    animate={{ rotate: expanded ? 180 : 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="inline-flex shrink-0 text-amber-400/50 hover:text-amber-400 transition-colors"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </motion.span>
                            )}
                        </div>

                        {/* Title + external link */}
                        <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                            {entry.title}
                            {entry.url && (
                                <a
                                    href={entry.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={e => e.stopPropagation()} // don't toggle card
                                    className="text-slate-500 hover:text-amber-400 transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </h2>

                        {/* Commentary — collapsible markdown */}
                        {entry.commentary && (
                            <div className="mb-4">
                                <div className="relative">
                                    {/* AnimatePresence key trick: swap key so height animates */}
                                    <AnimatePresence initial={false} mode="wait">
                                        <motion.div
                                            key={expanded ? 'open' : 'closed'}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div
                                                className={[
                                                    'prose prose-sm prose-invert max-w-none text-sm leading-relaxed',
                                                    'prose-p:text-slate-400 prose-p:my-1',
                                                    'prose-strong:text-slate-200 prose-strong:font-semibold',
                                                    'prose-em:text-slate-300',
                                                    'prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline',
                                                    'prose-code:text-amber-300 prose-code:bg-amber-500/10 prose-code:px-1 prose-code:rounded prose-code:text-xs prose-code:font-mono',
                                                    'prose-ul:my-1 prose-li:my-0.5 prose-li:text-slate-400',
                                                    'prose-blockquote:border-amber-500/40 prose-blockquote:text-slate-400 prose-blockquote:not-italic',
                                                    isLong && !expanded ? 'line-clamp-4' : '',
                                                ].join(' ')}
                                            >
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {entry.commentary}
                                                </ReactMarkdown>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Fade overlay when collapsed */}
                                    {isLong && !expanded && (
                                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Resonance score */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Resonance:</span>
                            <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <motion.span
                                        key={i}
                                        className={`w-2.5 h-2.5 rounded-full ${i < entry.resonance_score ? 'bg-amber-400' : 'bg-slate-700'}`}
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
            </div>
        </motion.div>
    );
}

// ─── Main list component ───────────────────────────────────────────────────────
export function ResonanceList({ entries }: ResonanceListProps) {
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
            el.classList.add('ring-2', 'ring-amber-400', 'ring-offset-2', 'ring-offset-slate-950', 'rounded-xl');
            highlightedRef.current = targetId;
            const removeRing = setTimeout(() => {
                el.classList.remove('ring-2', 'ring-amber-400', 'ring-offset-2', 'ring-offset-slate-950', 'rounded-xl');
            }, 2000);
            return () => clearTimeout(removeRing);
        }, 600);

        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="relative min-h-screen">
            <GradientOrb className="-top-20 -right-20" color="amber" size="xl" />
            <GradientOrb className="bottom-1/3 -left-32" color="violet" size="lg" />

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
                        <motion.div
                            className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/50 via-amber-500/30 to-transparent"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{ transformOrigin: 'top' }}
                        />
                        <div className="space-y-6 pl-10">
                            {entries.map((entry, index) => (
                                <ResonanceCard key={entry.id} entry={entry} index={index} />
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
                            <BookOpen className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="text-slate-500 text-lg">No entries yet. The collection is growing.</p>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
