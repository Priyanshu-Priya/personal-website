'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MapPin, GraduationCap, Code2, Brain, Sparkles } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';
import { GradientOrb } from '@/components/ui/aurora-background';
import { TextReveal } from '@/components/ui/text-reveal';
import { MagneticButton } from '@/components/ui/magnetic-button';
import type { AboutPageContent, SocialLink } from '@/types/content';
import { ReactNode } from 'react';

import { SocialLinks } from '@/components/shared/SocialLinks';
import { ResumeButton } from '@/components/ui/resume-button';

// Section keys for ordering
type SectionKey = 'header' | 'background' | 'skills' | 'focus' | 'connect';

interface SectionConfig {
    key: SectionKey;
    order: number;
    enabled: boolean;
    render: () => ReactNode;
}

interface AboutPageClientProps {
    content: AboutPageContent;
    socialLinks: SocialLink[];
    resumeUrl?: string | null;
}

export function AboutPageClient({ content, socialLinks, resumeUrl }: AboutPageClientProps) {
    // Header Section Component
    const renderHeader = () => (
        <motion.header
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-mono mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <MapPin className="w-4 h-4" />
                {content.header.location}
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                <TextReveal text={content.header.title} delay={0.3} />
            </h1>

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <motion.p
                    className="text-xl text-slate-400 leading-relaxed max-w-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    {content.header.intro}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <ResumeButton url={resumeUrl} />
                </motion.div>
            </div>
        </motion.header>
    );

    // Background Section Component
    const renderBackground = () => (
        <motion.section
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <GlowCard>
                <div className="p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                            <GraduationCap className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">{content.background.section_title}</h2>
                    </div>

                    <div className="space-y-4 text-slate-300 leading-relaxed">
                        {content.background.paragraphs.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </GlowCard>
        </motion.section>
    );

    // Skills Section Component
    const renderSkills = () => (
        <motion.section
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Code2 className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">{content.skills.section_title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.skills.categories.map((skillGroup, index) => (
                    <motion.div
                        key={skillGroup.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <GlowCard glowColor={index % 2 === 0 ? 'violet' : 'indigo'}>
                            <div className="p-6">
                                <h3 className="text-sm font-mono text-slate-500 uppercase tracking-wider mb-4">
                                    {skillGroup.name}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {skillGroup.items.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1.5 text-sm rounded-lg bg-slate-800/50 text-slate-300 border border-slate-700/50"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </GlowCard>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );

    // Focus Section Component
    const renderFocus = () => (
        <motion.section
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Brain className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">{content.focus.section_title}</h2>
            </div>

            <GlowCard glowColor="amber">
                <div className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <span className="text-amber-400 font-medium">{content.focus.badge}</span>
                    </div>
                    <ul className="space-y-3 text-slate-300">
                        {content.focus.items.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Link
                        href={content.focus.cta_href || "/now"}
                        className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg bg-amber-500/10 text-amber-400 font-medium border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 transition-all"
                    >
                        {content.focus.cta_button || "See What I'm Working On"}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </GlowCard>
        </motion.section>
    );

    // Connect Section Component
    const renderConnect = () => (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-xl font-semibold text-white mb-8 text-center">{content.connect.section_title}</h2>

            <div className="mb-8">
                <SocialLinks
                    links={socialLinks}
                    className="justify-center gap-4"
                    itemClassName="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-violet-500/50 transition-all"
                    iconClassName="w-6 h-6"
                />
            </div>

            <div className="text-center">
                <MagneticButton
                    href={content.connect.cta_href}
                    className="px-8 py-4 bg-white text-slate-950 hover:text-white"
                >
                    {content.connect.cta_button}
                    <ArrowRight className="w-4 h-4" />
                </MagneticButton>
            </div>
        </motion.section>
    );

    // Define all sections with their order and render functions
    const sections: SectionConfig[] = [
        {
            key: 'header',
            order: content.header.order ?? 1,
            enabled: content.header.enabled,
            render: renderHeader,
        },
        {
            key: 'background',
            order: content.background.order ?? 2,
            enabled: content.background.enabled,
            render: renderBackground,
        },
        {
            key: 'skills',
            order: content.skills.order ?? 3,
            enabled: content.skills.enabled,
            render: renderSkills,
        },
        {
            key: 'focus',
            order: content.focus.order ?? 4,
            enabled: content.focus.enabled,
            render: renderFocus,
        },
        {
            key: 'connect',
            order: content.connect.order ?? 5,
            enabled: content.connect.enabled,
            render: renderConnect,
        },
    ];

    // Sort sections by order and filter to enabled only
    const orderedSections = sections
        .filter((section) => section.enabled)
        .sort((a, b) => a.order - b.order);

    return (
        <main className="relative min-h-screen">
            {/* Background orbs - absolute, not fixed */}
            <GradientOrb className="-top-20 -right-20" color="violet" size="xl" />
            <GradientOrb className="top-1/2 -left-32" color="indigo" size="lg" />

            {/* Noise texture - absolute with negative z-index (never interferes with navbar) */}
            <div
                className="absolute inset-0 -z-10 pointer-events-none opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
                {orderedSections.map((section) => (
                    <div key={section.key}>{section.render()}</div>
                ))}
            </div>
        </main>
    );
}
