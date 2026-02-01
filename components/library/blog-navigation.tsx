'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

interface NavigationPost {
    slug: string;
    title: string;
}

interface BlogNavigationProps {
    previousPost: NavigationPost | null;
    nextPost: NavigationPost | null;
}

export function BlogNavigation({ previousPost, nextPost }: BlogNavigationProps) {
    return (
        <section className="relative border-t border-white/5">
            <div className="container max-w-3xl mx-auto px-6 py-12 lg:py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {/* Previous Post */}
                    <div className="flex justify-start">
                        {previousPost ? (
                            <Link
                                href={`/library/blog/${previousPost.slug}`}
                                className="group flex flex-col items-start p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 hover:border-emerald-500/30 hover:bg-slate-800/50 transition-all duration-300 w-full max-w-xs"
                            >
                                <span className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider mb-2">
                                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                                    Previous
                                </span>
                                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors line-clamp-1">
                                    {previousPost.title}
                                </span>
                            </Link>
                        ) : (
                            <div className="w-full max-w-xs" />
                        )}
                    </div>

                    {/* Back to Blog */}
                    <div className="flex justify-center">
                        <Link
                            href="/library/blog"
                            className="group flex flex-col items-center p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 hover:border-emerald-500/30 hover:bg-slate-800/50 transition-all duration-300"
                        >
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700/50 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-all mb-2">
                                <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                            </span>
                            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                                All Posts
                            </span>
                        </Link>
                    </div>

                    {/* Next Post */}
                    <div className="flex justify-end">
                        {nextPost ? (
                            <Link
                                href={`/library/blog/${nextPost.slug}`}
                                className="group flex flex-col items-end p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 hover:border-emerald-500/30 hover:bg-slate-800/50 transition-all duration-300 w-full max-w-xs"
                            >
                                <span className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider mb-2">
                                    Next
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors line-clamp-1">
                                    {nextPost.title}
                                </span>
                            </Link>
                        ) : (
                            <div className="w-full max-w-xs" />
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
