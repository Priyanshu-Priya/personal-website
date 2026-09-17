'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight, FileText, Brain, BookOpen, ExternalLink, Quote } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { GradientOrb } from '@/components/ui/aurora-background';
import { TextReveal } from '@/components/ui/text-reveal';
import type { LibraryPageContent } from '@/types/content';
import { ReactNode } from 'react';
import { parseTags } from '@/lib/tags';
import { resonanceTypeConfig, fallbackResonanceType } from '@/lib/resonance-config';

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
    tags: string[] | null;
    url?: string | null;
    commentary?: string | null;
}

// Section keys for ordering
type SectionKey = 'header' | 'blog_section' | 'thoughts_section' | 'resonance_section';

interface SectionConfig {
    key: SectionKey;
    order: number;
    enabled: boolean;
    render: () => ReactNode;
}

interface LibraryHubClientProps {
    content: LibraryPageContent;
    posts: BlogPost[];
    thoughts: Thought[];
    resonance: ResonanceItem[];
}

export function LibraryHubClient({ content, posts, thoughts, resonance }: LibraryHubClientProps) {
    // Header Section Component
    const renderHeader = () => (
        <motion.header
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                <TextReveal text={content.header.title} delay={0.2} />
            </h1>
            <motion.p
                className="text-xl text-slate-400 max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                {content.header.subtitle}
            </motion.p>
        </motion.header>
    );

    // Blog Section Component
    const renderBlogSection = () => (
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
                    <h2 className="text-xl font-semibold text-white">{content.blog_section.section_title}</h2>
                </div>
                <Link
                    href={content.blog_section.view_all_href}
                    className="group text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                    {content.blog_section.view_all_text}
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
                <div className="text-center py-8 text-slate-500">{content.blog_section.empty_text}</div>
            )}
        </motion.section>
    );

    // Thoughts Section Component
    const renderThoughtsSection = () => (
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
                    <h2 className="text-xl font-semibold text-white">{content.thoughts_section.section_title}</h2>
                </div>
                <Link
                    href={content.thoughts_section.view_all_href}
                    className="group text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                    {content.thoughts_section.view_all_text}
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
                            transition={{ delay: index * 0.08 }}
                        >
                            <Link href={`/library/thoughts#item-${thought.id}`} className="group/card block h-full">
                                <div className="relative h-full rounded-xl border border-slate-800 border-l-2 border-l-purple-500/40 bg-slate-900/60 backdrop-blur-sm overflow-hidden transition-all duration-300 group-hover/card:border-slate-700 group-hover/card:border-l-purple-400/60 group-hover/card:-translate-y-1 group-hover/card:shadow-xl group-hover/card:shadow-black/30">
                                    <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-purple-500/4 to-transparent" />
                                    <div className="relative p-5 flex flex-col h-full">
                                        <Quote className="w-5 h-5 text-purple-500/40 mb-2 shrink-0" />
                                        <p className="text-slate-300 text-sm leading-relaxed line-clamp-4 flex-1 group-hover/card:text-slate-200 transition-colors">
                                            {thought.content}
                                        </p>
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
            ) : (
                <div className="text-center py-8 text-slate-500">{content.thoughts_section.empty_text}</div>
            )}
        </motion.section>
    );

    // Resonance Section Component
    const renderResonanceSection = () => (
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
                    <h2 className="text-xl font-semibold text-white">{content.resonance_section.section_title}</h2>
                </div>
                <Link
                    href={content.resonance_section.view_all_href}
                    className="group text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                    {content.resonance_section.view_all_text}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {resonance.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {resonance.map((item, index) => {
                        const cfg = resonanceTypeConfig[item.type] ?? fallbackResonanceType;
                        const Icon = cfg.icon;
                        const tags = parseTags(item.tags);
                        const scoreWidth = `${(item.resonance_score / 5) * 100}%`;
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                            >
                                <Link href={`/library/resonance#item-${item.id}`} className="group/card block h-full">
                                    <div className="relative h-full rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden transition-all duration-300 group-hover/card:border-slate-700 group-hover/card:-translate-y-1 group-hover/card:shadow-xl group-hover/card:shadow-black/30">
                                        <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br ${cfg.shimmer} to-transparent`} />
                                        <div className="relative p-5 flex flex-col h-full gap-3">
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
                                            <h3 className="text-sm font-semibold text-slate-200 line-clamp-3 leading-snug group-hover/card:text-white transition-colors flex-1">
                                                {item.title}
                                            </h3>
                                            {item.commentary && (
                                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed italic">
                                                    &ldquo;{item.commentary}&rdquo;
                                                </p>
                                            )}
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
                                                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-500 border border-slate-700/50 font-mono">
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
            ) : (
                <div className="text-center py-8 text-slate-500">{content.resonance_section.empty_text}</div>
            )}
        </motion.section>
    );

    // Define all sections with their order and render functions
    const sections: SectionConfig[] = [
        {
            key: 'header',
            order: content.header.order ?? 1,
            enabled: content.header.enabled,
            render: renderHeader,
        },
        {
            key: 'blog_section',
            order: content.blog_section.order ?? 2,
            enabled: content.blog_section.enabled,
            render: renderBlogSection,
        },
        {
            key: 'thoughts_section',
            order: content.thoughts_section.order ?? 3,
            enabled: content.thoughts_section.enabled,
            render: renderThoughtsSection,
        },
        {
            key: 'resonance_section',
            order: content.resonance_section.order ?? 4,
            enabled: content.resonance_section.enabled,
            render: renderResonanceSection,
        },
    ];

    // Sort sections by order and filter to enabled only
    const orderedSections = sections
        .filter((section) => section.enabled)
        .sort((a, b) => a.order - b.order);

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
                {orderedSections.map((section) => (
                    <div key={section.key}>{section.render()}</div>
                ))}
            </div>
        </main>
    );
}
