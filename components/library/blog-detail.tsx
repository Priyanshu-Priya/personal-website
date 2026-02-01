'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { GlowCard } from '@/components/ui/glow-card';
import { GradientOrb } from '@/components/ui/aurora-background';
import { MarkdownViewer } from '@/components/ui/markdown-viewer';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    cover_image: string | null;
    tags: string[];
    created_at: string;
}

interface BlogDetailProps {
    post: BlogPost;
}

export function BlogDetail({ post }: BlogDetailProps) {
    // Estimate reading time
    const wordsPerMinute = 200;
    const wordCount = post.content?.split(/\s+/).length || 0;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    return (
        <main className="relative min-h-screen">
            {/* Background orbs */}
            <GradientOrb className="-top-20 right-1/4" color="emerald" size="xl" />
            <GradientOrb className="top-1/2 -left-32" color="violet" size="lg" />

            {/* Noise texture */}
            <div
                className="absolute inset-0 -z-10 pointer-events-none opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative z-10 max-w-3xl mx-auto px-6 py-24">
                {/* Back link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Link
                        href="/library/blog"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-12"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.header
                    className="mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(post.created_at), 'MMMM dd, yyyy')}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {readingTime} min read
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <p className="text-xl text-slate-400 mb-6">{post.summary}</p>

                    {/* Tags */}
                    {post.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1.5 text-sm rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </motion.header>

                {/* Cover image */}
                {post.cover_image && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-12"
                    >
                        <GlowCard glowColor="emerald">
                            <div className="relative aspect-video rounded-xl overflow-hidden">
                                <Image
                                    src={post.cover_image}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </GlowCard>
                    </motion.div>
                )}

                {/* Content */}
                <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <GlowCard>
                        <div className="p-6 md:p-8">
                            <MarkdownViewer content={post.content} />
                        </div>
                    </GlowCard>
                </motion.article>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 pt-8 border-t border-slate-800 text-center"
                >
                    <Link
                        href="/library/blog"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Browse all posts
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
