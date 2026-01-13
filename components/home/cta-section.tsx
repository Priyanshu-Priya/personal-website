'use client';

import { motion } from 'framer-motion';
import { SocialLinks } from '@/components/shared/SocialLinks';
import { ArrowRight } from 'lucide-react';
import { MagneticButton } from '@/components/ui/magnetic-button';
import Link from 'next/link';
import type { HomePageContent, SocialLink } from '@/types/content';

interface CTASectionProps {
    content: HomePageContent['cta_section'];
    socialLinks: SocialLink[];
}

export function CTASection({ content, socialLinks }: CTASectionProps) {
    return (
        <section className="py-32 px-6 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-violet-500/5 via-transparent to-transparent" />

            <motion.div
                className="max-w-3xl mx-auto text-center relative z-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {content.title}{' '}
                    <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                        {content.title_highlight}
                    </span>
                </h2>
                <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
                    {content.subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
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
                </div>

                {/* Social Links */}
                <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <SocialLinks
                        links={socialLinks}
                        className="gap-4"
                        itemClassName="p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors"
                        iconClassName="w-5 h-5"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
