'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { SpotlightCard } from '@/components/ui/spotlight';
import type { HomePageContent } from '@/types/content';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    summary: string;
    cover_image: string | null;
    tags: string[];
    created_at: string;
}

interface BlogSectionProps {
    content: HomePageContent['blog_section'];
    posts: BlogPost[];
}

export function BlogSection({ content, posts }: BlogSectionProps) {
    if (posts.length === 0) return null;

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
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <FileText className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">{content.title}</h2>
                    </div>
                    <Link
                        href={content.read_all_href}
                        className="group text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                        {content.read_all_text}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Posts Grid */}
                <div className="space-y-4">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link href={`/library/blog/${post.slug}`}>
                                <SpotlightCard className="group">
                                    <div className="p-6 flex gap-6">
                                        {post.cover_image && (
                                            <div className="hidden sm:block relative w-40 h-24 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                                                <Image
                                                    src={post.cover_image}
                                                    alt={post.title}
                                                    fill
                                                    sizes="(max-width: 640px) 0vw, 160px"
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
                                                        <span className="text-xs text-emerald-400">
                                                            {post.tags[0]}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors mb-1">
                                                {post.title}
                                            </h3>
                                            <p className="text-sm text-slate-400 line-clamp-2">
                                                {post.summary}
                                            </p>
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
            </div>
        </section>
    );
}
