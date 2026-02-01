'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import 'highlight.js/styles/github-dark.css'; // Syntax highlighting theme
import { cn } from '@/lib/utils';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { useState, useRef } from 'react';

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css'; // LaTeX styles

interface MarkdownViewerProps {
    content: string;
    className?: string;
}

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
    return (
        <div className={cn("prose prose-lg prose-invert max-w-none", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[
                    rehypeRaw,
                    rehypeHighlight,
                    rehypeSlug,
                    rehypeKatex,
                    [rehypeAutolinkHeadings, { behavior: 'wrap' }]
                ]}
                components={{
                    // ... existing components (re-include them if not using multi-replace, but here I'm replacing the whole component logic if easier, or just inserting)
                    // Wait, replace_file_content replaces a BLOCK. I need to be careful to include everything or just the changed parts.
                    // The user wants ALL these features. I will update the component prop entirely to be safe and comprehensive.

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
                    pre: ({ node, children, ...props }) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const [isCopied, setIsCopied] = useState(false);
                        const preRef = useRef<HTMLPreElement>(null);

                        const handleCopy = async () => {
                            if (preRef.current) {
                                const codeElement = preRef.current.querySelector('code');
                                const text = codeElement?.innerText || '';
                                await navigator.clipboard.writeText(text);
                                setIsCopied(true);
                                setTimeout(() => setIsCopied(false), 2000);
                            }
                        };

                        return (
                            <div className="relative group my-6 first:mt-0">
                                <button
                                    onClick={handleCopy}
                                    className="absolute right-3 top-3 p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all opacity-100 focus:opacity-100 z-10"
                                    title="Copy code"
                                >
                                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <pre
                                    ref={preRef}
                                    className="relative p-0 overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117] text-sm"
                                    {...props}
                                >
                                    {children}
                                </pre>
                            </div>
                        );
                    },
                    code: ({ node, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return (
                            <code className={cn(className, "font-mono text-sm px-1.5 py-0.5 rounded-md bg-slate-800/50 text-indigo-300")} {...props}>
                                {children}
                            </code>
                        );
                    },

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

                    // --- NEW FEATURES ---

                    // Details / Summary
                    details: ({ node, ...props }) => (
                        <details className="my-4 border border-slate-800 rounded-lg bg-slate-900/30 open:bg-slate-900/50 transition-colors" {...props} />
                    ),
                    summary: ({ node, ...props }) => (
                        <summary className="cursor-pointer px-4 py-3 font-medium text-slate-200 hover:text-white focus:outline-none" {...props} />
                    ),

                    // Keyboard Input
                    kbd: ({ node, ...props }) => (
                        <kbd className="px-2 py-1 text-xs font-semibold text-slate-200 bg-slate-800 border border-slate-700 rounded-lg shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)] inline-block mx-0.5 align-middle font-mono" {...props} />
                    ),

                    // Inputs (Checkbox for Task Lists)
                    input: ({ node, ...props }) => {
                        if (props.type === 'checkbox') {
                            return (
                                <input
                                    type="checkbox"
                                    className="appearance-none h-4 w-4 border border-slate-600 rounded bg-slate-900 checked:bg-indigo-600 checked:border-indigo-600 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all mr-2 cursor-pointer relative top-[2px]"
                                    {...props}
                                />
                            )
                        }
                        return <input {...props} />
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
