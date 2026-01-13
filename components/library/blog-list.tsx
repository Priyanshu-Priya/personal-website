'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ArrowRight, FileText } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight';
import { GradientOrb } from '@/components/ui/aurora-background';
import { TextReveal } from '@/components/ui/text-reveal';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    summary: string;
    cover_image: string | null;
    tags: string[];
    created_at: string;
}

interface BlogListProps {
    posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
    return (
        <main className="relative min-h-screen">
            {/* Background orbs */}
            <GradientOrb className="-top-20 -right-20" color="emerald" size="xl" />
            <GradientOrb className="top-1/2 -left-32" color="violet" size="lg" />

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
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <FileText className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">Library</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                        <TextReveal text="Blog" delay={0.2} />
                    </h1>

                    <motion.p
                        className="text-xl text-slate-400 max-w-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Long-form articles on development, AI/ML, and building products.
                    </motion.p>
                </motion.header>

                {/* Posts */}
                {posts.length > 0 ? (
                    <div className="space-y-6">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link href={`/library/blog/${post.slug}`}>
                                    <SpotlightCard className="group">
                                        <div className="p-6 md:flex gap-6">
                                            {post.cover_image && (
                                                <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden bg-slate-800 mb-4 md:mb-0 shrink-0">
                                                    <Image
                                                        src={post.cover_image}
                                                        alt={post.title}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, 200px"
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <time className="text-xs text-slate-500 font-mono">
                                                        {format(new Date(post.created_at), 'MMM dd, yyyy')}
                                                    </time>
                                                    {post.tags?.length > 0 && (
                                                        <>
                                                            <span className="w-1 h-1 rounded-full bg-slate-600" />
                                                            <span className="text-xs text-emerald-400">{post.tags[0]}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <h2 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors mb-2">
                                                    {post.title}
                                                </h2>
                                                <p className="text-slate-400 line-clamp-2">{post.summary}</p>
                                                {post.tags?.length > 1 && (
                                                    <div className="flex flex-wrap gap-2 mt-4">
                                                        {post.tags.slice(1, 4).map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-400"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="hidden md:flex items-center">
                                                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </SpotlightCard>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 inline-block mb-4">
                            <FileText className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="text-slate-500 text-lg">No blog posts yet. Check back soon!</p>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
