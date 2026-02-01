'use client';

import { motion } from 'framer-motion';
import { MarkdownViewer } from '@/components/ui/markdown-viewer';

interface ProjectContentProps {
    content: string;
}

export function ProjectContent({ content }: ProjectContentProps) {
    if (!content) return null;

    return (
        <section className="relative py-16 lg:py-24">
            {/* Background Pattern */}
            <div className="absolute inset-0 -z-10 opacity-50">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="container max-w-3xl mx-auto px-6">
                <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Glass Card Container */}
                    <div className="relative group">
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-linear-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-700" />

                        {/* Card */}
                        <div className="relative bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                            {/* Header Accent */}
                            <div className="h-1 bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500" />

                            {/* Content */}
                            <div className="p-6 md:p-8 lg:p-10">
                                {/* Section Title */}
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-1 h-6 bg-linear-to-b from-indigo-500 to-violet-500 rounded-full" />
                                    <h2 className="text-xl font-bold text-white">About This Project</h2>
                                </div>

                                {/* Markdown Content with prose styling */}
                                <div className="prose prose-invert prose-slate max-w-none
                                    prose-headings:text-white prose-headings:font-bold
                                    prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                                    prose-p:text-slate-300 prose-p:leading-relaxed
                                    prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300 hover:prose-a:underline
                                    prose-strong:text-white
                                    prose-code:text-indigo-300 prose-code:bg-slate-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                                    prose-pre:bg-slate-800/50 prose-pre:border prose-pre:border-slate-700/50
                                    prose-blockquote:border-indigo-500/50 prose-blockquote:text-slate-400
                                    prose-li:text-slate-300
                                    prose-img:rounded-xl prose-img:border prose-img:border-white/10
                                ">
                                    <MarkdownViewer content={content} />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.article>
            </div>
        </section>
    );
}
