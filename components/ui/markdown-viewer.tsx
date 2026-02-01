'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import 'highlight.js/styles/github-dark.css'; // Syntax highlighting theme
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface MarkdownViewerProps {
    content: string;
    className?: string;
}

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
    return (
        <div className={cn("prose prose-lg prose-invert max-w-none", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                    rehypeHighlight,
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: 'wrap' }]
                ]}
                components={{
                    // Responsive Table Wrapper
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-8 first:mt-0 border border-slate-800 rounded-lg shadow-sm">
                            <table className="min-w-full divide-y divide-slate-800 text-left text-sm" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => (
                        <thead className="bg-slate-900/50" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                        <th className="px-4 py-3 font-semibold text-slate-200" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="px-4 py-3 text-slate-400 border-t border-slate-800/50" {...props} />
                    ),
                    // Custom Image (Responsive)
                    img: ({ node, ...props }) => {
                        return (
                            <span className="block my-8 first:mt-0 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50">
                                <img
                                    {...props}
                                    className="w-full h-auto object-cover"
                                    alt={props.alt || 'Blog image'}
                                    loading="lazy"
                                />
                            </span>
                        );
                    },
                    // Links
                    a: ({ node, children, ...props }) => {
                        const isExternal = props.href?.startsWith('http');
                        return (
                            <a
                                {...props}
                                target={isExternal ? '_blank' : undefined}
                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                className="text-indigo-400 hover:text-indigo-300 transition-colors no-underline hover:underline inline-flex items-center gap-1"
                            >
                                {children}
                                {isExternal && <ExternalLink className="w-3 h-3 opacity-50" />}
                            </a>
                        );
                    },
                    // Code Blocks
                    pre: ({ node, ...props }) => (
                        <pre className="relative p-0 overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117] my-6 first:mt-0 text-sm" {...props} />
                    ),
                    code: ({ node, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match && !JSON.stringify(props).includes("node"); // Simplified check 
                        // Actually react-markdown passes `inline` prop usually, but it's not in the types by default?
                        // Let's rely on grandparent being 'pre'? No.
                        // Usually if it has no className and isn't a block, it is inline.

                        // Robust inline check: if parent is NOT pre. But we don't have parent here easily.
                        // The simpler way: if className is missing, treat as inline (usually).
                        // But `rehype-highlight` might add className.

                        // Best approach with react-markdown v9+:
                        // It renders `pre > code` for blocks.

                        return (
                            <code className={cn(className, "font-mono")} {...props}>
                                {children}
                            </code>
                        );
                    },
                    // Inline Code (Override if not handled above correctly by prose)
                    // Actually prose handles basic inline code well. We just want to ensure colors.

                    // Blockquotes
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-indigo-500 bg-indigo-500/5 pl-6 py-4 my-8 first:mt-0 italic text-slate-300 rounded-r-lg" {...props} />
                    ),
                    // Headings
                    h1: ({ node, ...props }) => <h1 className="text-3xl md:text-4xl font-bold text-white mt-12 first:mt-0 mb-6 scroll-mt-24" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 first:mt-0 mb-6 pb-2 border-b border-slate-800 scroll-mt-24 group flex items-center gap-2" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-xl md:text-2xl font-bold text-white mt-8 first:mt-0 mb-4 scroll-mt-24" {...props} />,
                    h4: ({ node, ...props }) => <h4 className="text-lg md:text-xl font-bold text-white mt-6 first:mt-0 mb-3 scroll-mt-24" {...props} />,

                    // Lists
                    ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 space-y-2 my-4 first:mt-0 text-slate-300" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-6 space-y-2 my-4 first:mt-0 text-slate-300" {...props} />,
                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,

                    // Paragraphs
                    p: ({ node, ...props }) => <p className="leading-relaxed text-slate-300 my-4 first:mt-0" {...props} />,

                    // Horizontal Rule
                    hr: ({ node, ...props }) => <hr className="my-12 border-slate-800" {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
