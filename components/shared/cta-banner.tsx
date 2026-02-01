'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, User } from 'lucide-react';

interface CTABannerProps {
    message?: string;
    accentColor?: 'violet' | 'emerald' | 'indigo';
}

const accentColors = {
    violet: 'bg-violet-600 hover:bg-violet-500',
    emerald: 'bg-emerald-600 hover:bg-emerald-500',
    indigo: 'bg-indigo-600 hover:bg-indigo-500',
};

export function CTABanner({
    message = "Interested in working together?",
    accentColor = 'violet'
}: CTABannerProps) {
    return (
        <section className="border-t border-white/5">
            <div className="container max-w-3xl mx-auto px-6 py-12 lg:py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <p className="text-slate-500 mb-6">{message}</p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/80 text-white font-medium border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all hover:scale-105"
                        >
                            <User className="w-4 h-4" />
                            About Me
                        </Link>
                        <Link
                            href="/contact"
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all hover:scale-105 ${accentColors[accentColor]}`}
                        >
                            Get in Touch
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
