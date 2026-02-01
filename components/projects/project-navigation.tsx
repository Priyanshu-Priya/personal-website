'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';

interface NavigationProject {
    slug: string;
    title: string;
}

interface ProjectNavigationProps {
    previousProject: NavigationProject | null;
    nextProject: NavigationProject | null;
}

export function ProjectNavigation({ previousProject, nextProject }: ProjectNavigationProps) {
    return (
        <section className="relative border-t border-white/5">
            <div className="container max-w-5xl mx-auto px-6 py-12 lg:py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {/* Previous Project */}
                    <div className="flex justify-start">
                        {previousProject ? (
                            <Link
                                href={`/work/projects/${previousProject.slug}`}
                                className="group flex flex-col items-start p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 hover:border-indigo-500/30 hover:bg-slate-800/50 transition-all duration-300 w-full max-w-xs"
                            >
                                <span className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider mb-2">
                                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                                    Previous
                                </span>
                                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors line-clamp-1">
                                    {previousProject.title}
                                </span>
                            </Link>
                        ) : (
                            <div className="w-full max-w-xs" /> /* Spacer */
                        )}
                    </div>

                    {/* Back to Projects */}
                    <div className="flex justify-center">
                        <Link
                            href="/work/projects"
                            className="group flex flex-col items-center p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 hover:border-violet-500/30 hover:bg-slate-800/50 transition-all duration-300"
                        >
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700/50 group-hover:border-violet-500/30 group-hover:bg-violet-500/10 transition-all mb-2">
                                <Home className="w-4 h-4 text-slate-400 group-hover:text-violet-400 transition-colors" />
                            </span>
                            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                                All Projects
                            </span>
                        </Link>
                    </div>

                    {/* Next Project */}
                    <div className="flex justify-end">
                        {nextProject ? (
                            <Link
                                href={`/work/projects/${nextProject.slug}`}
                                className="group flex flex-col items-end p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 hover:border-indigo-500/30 hover:bg-slate-800/50 transition-all duration-300 w-full max-w-xs"
                            >
                                <span className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider mb-2">
                                    Next
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors line-clamp-1">
                                    {nextProject.title}
                                </span>
                            </Link>
                        ) : (
                            <div className="w-full max-w-xs" /> /* Spacer */
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
