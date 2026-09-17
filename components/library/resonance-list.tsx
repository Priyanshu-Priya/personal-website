'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { BookOpen, ExternalLink, ChevronDown } from 'lucide-react';
import { GradientOrb } from '@/components/ui/aurora-background';
import { TextReveal } from '@/components/ui/text-reveal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { parseTags } from '@/lib/tags';
import { resonanceTypeConfig, fallbackResonanceType } from '@/lib/resonance-config';

interface ResonanceEntry {
    id: string;
    title: string;
    url: string | null;
    type: 'article' | 'book' | 'video' | 'podcast' | 'tweet';
    commentary: string | null;
    resonance_score: number;
    created_at: string;
    tags: string[] | null;
}

interface ResonanceListProps {
    entries: ResonanceEntry[];
}

const fallbackCfg = fallbackResonanceType;

// Commentary longer than this gets collapsed by default
const COLLAPSE_THRESHOLD = 300;

// ─── Per-card component ────────────────────────────────────────────────────────
function ResonanceCard({ entry, index }: { entry: ResonanceEntry; index: number }) {
    const cfg = resonanceTypeConfig[entry.type] ?? fallbackCfg;
    const TypeIcon = cfg.icon;
    const tags = parseTags(entry.tags);
    const scoreWidth = `${(entry.resonance_score / 5) * 100}%`;
    const isLong = (entry.commentary?.length ?? 0) > COLLAPSE_THRESHOLD;

    const [expanded, setExpanded] = useState<boolean>(() => {
        if (!isLong) return true;
        if (typeof window === 'undefined') return false;
        const hash = window.location.hash;
        return hash === `#item-${entry.id}`;
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
            {/* Timeline dot — amber thread */}
            <motion.div
                className="absolute -left-10 top-6 w-6 h-6 rounded-full border-2 border-amber-500/60 bg-amber-500/10 flex items-center justify-center"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 + 0.2, type: 'spring' }}
            >
                <TypeIcon className="w-3 h-3 text-amber-400" />
            </motion.div>

            {/* Card */}
            <div onClick={toggle} className={isLong ? 'cursor-pointer select-none' : ''}>
                <div className={`relative rounded-xl border border-slate-800 bg-slate-900/70 backdrop-blur-sm overflow-hidden transition-colors duration-300 hover:border-slate-700 border-l-2 ${cfg.accent}`}>

                    {/* Subtle type-tinted shimmer on the card bg */}
                    <div className={`absolute inset-0 pointer-events-none bg-gradient-to-br ${cfg.shimmer} to-transparent`} />

                    <div className="relative p-6">

                        {/* ── Top row: badge · date · chevron ── */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {/* Type badge with icon */}
                                <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${cfg.badge}`}>
                                    <TypeIcon className="w-3 h-3" />
                                    {entry.type}
                                </span>
                                {/* Date chip */}
                                <time className="inline-flex items-center text-xs text-slate-500 font-mono bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/40">
                                    {format(new Date(entry.created_at), 'MMM dd, yyyy')}
                                </time>
                            </div>

                            {/* Expand/collapse chevron */}
                            {isLong && (
                                <motion.span
                                    animate={{ rotate: expanded ? 180 : 0 }}
                                    transition={{ duration: 0.25 }}
                                    className={`inline-flex shrink-0 transition-colors ${expanded ? 'text-amber-400' : 'text-slate-600'} hover:text-slate-400`}
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </motion.span>
                            )}
                        </div>

                        {/* ── Title + external link ── */}
                        <h2 className="text-xl font-bold text-white mb-4 flex items-start gap-2 leading-snug">
                            <span className="flex-1">{entry.title}</span>
                            {entry.url && (
                                <a
                                    href={entry.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={e => e.stopPropagation()}
                                    className="shrink-0 mt-1 text-slate-600 hover:text-slate-300 transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </h2>

                        {/* ── Commentary — collapsible markdown ── */}
                        {entry.commentary && (
                            <div className="mb-5">
                                {/* Left quote accent bar */}
                                <div className={`relative border-l-2 pl-4 ${cfg.accent}`}>
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
                                                    'prose-p:text-slate-400 prose-p:my-1.5',
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
                                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none" />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── Footer: score bar + tags ── */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4 border-t border-slate-800/60">
                            {/* Animated score bar */}
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">resonance</span>
                                <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                    <motion.div
                                        className={`h-full rounded-full ${cfg.bar}`}
                                        initial={{ width: 0 }}
                                        whileInView={{ width: scoreWidth }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: index * 0.08 + 0.3, ease: 'easeOut' }}
                                    />
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono">{entry.resonance_score}/5</span>
                            </div>

                            {/* Tags */}
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 sm:ml-auto">
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50 font-mono"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
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
