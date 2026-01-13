'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { CharacterReveal, TextReveal } from '@/components/ui/text-reveal';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { GradientOrb } from '@/components/ui/aurora-background';
import type { HomePageContent } from '@/types/content';

interface HeroSectionProps {
    content: HomePageContent['hero'];
    latestThought: {
        content: string;
        mood: string | null;
        created_at: string;
    } | null;
}

export function HeroSection({ content, latestThought }: HeroSectionProps) {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated background orbs */}
            <GradientOrb className="-top-32 -left-32" color="violet" size="xl" />
            <GradientOrb className="top-1/4 -right-20" color="indigo" size="lg" />
            <GradientOrb className="bottom-20 left-1/4" color="amber" size="md" />

            {/* Spotlight effect */}
            <motion.div
                className="absolute inset-0 z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-violet-500/20 via-transparent to-transparent blur-3xl" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">
                {/* Greeting */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-mono">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
                        </span>
                        {content.status_badge}
                    </span>
                </motion.div>

                {/* Name - Giant animated heading */}
                <motion.h1
                    className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <span className="bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        <CharacterReveal text={content.name_line1} delay={0.3} staggerDelay={0.04} />
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        <CharacterReveal text={content.name_line2} delay={0.7} staggerDelay={0.05} />
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                >
                    <TextReveal
                        text={content.subtitle}
                        delay={1.2}
                    />
                </motion.p>

                {/* Focus badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 mb-10 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-full"
                >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-slate-400">
                        {content.focus_label} <span className="text-amber-400 font-medium">{content.focus_value}</span>
                    </span>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.8 }}
                >
                    <MagneticButton
                        href={content.cta_primary_href}
                        className="px-8 py-4 bg-white text-slate-950 hover:text-white"
                    >
                        {content.cta_primary}
                        <ArrowRight className="w-4 h-4" />
                    </MagneticButton>

                    <MagneticButton
                        href={content.cta_secondary_href}
                        className="px-8 py-4 bg-slate-800/50 text-white border border-slate-700"
                    >
                        {content.cta_secondary}
                    </MagneticButton>
                </motion.div>

                {/* Latest thought */}
                {latestThought && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 2.2 }}
                        className="mt-16 max-w-xl mx-auto"
                    >
                        <div className="p-4 rounded-xl bg-slate-900/30 backdrop-blur-sm border border-slate-800/50">
                            <p className="text-sm text-slate-500 font-mono mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                {content.latest_thought_label}
                            </p>
                            <p className="text-slate-300 text-sm italic">&quot;{latestThought.content}&quot;</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-6 h-10 rounded-full border-2 border-slate-700 flex items-start justify-center p-2"
                >
                    <motion.div className="w-1 h-2 rounded-full bg-slate-500" />
                </motion.div>
            </motion.div>
        </section>
    );
}
