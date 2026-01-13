'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SocialLinks } from '@/components/shared/SocialLinks';
import type { GlobalConfig } from '@/types/content';


interface FooterProps {
    config: GlobalConfig;
}

export function FooterClient({ config }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center md:text-left"
                    >
                        <h3 className="text-lg font-bold text-white mb-2">{config.site_name}</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            {config.site_tagline}
                        </p>

                        {/* Dynamic Description */}
                        {config.footer.description?.map((line, index) => (
                            <motion.p
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                                className="text-sm text-slate-500 leading-relaxed"
                            >
                                {line}
                            </motion.p>
                        ))}
                    </motion.div>

                    {/* Navigation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-center md:text-left"
                    >
                        <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-4">Navigation</h4>
                        <ul className="space-y-2">
                            {config.nav_items.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors block"
                                    >
                                        {link.label}
                                    </Link>

                                    {/* Sub-items (like Library -> Blog, Thoughts, Resonance) */}
                                    {link.items && link.items.length > 0 && (
                                        <ul className="mt-2 space-y-2 md:ml-3 md:border-l md:border-slate-800 md:pl-3">
                                            {link.items.map((subItem) => (
                                                <li key={subItem.href}>
                                                    <Link
                                                        href={subItem.href}
                                                        className="text-sm text-slate-500 hover:text-slate-300 transition-colors block"
                                                    >
                                                        {subItem.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Social */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-center md:text-left"
                    >
                        <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-4">Connect</h4>
                        <SocialLinks
                            config={config}
                            className="justify-center md:justify-start"
                        />

                    </motion.div>
                </div>

                {/* Bottom */}
                <motion.div
                    className="pt-8 border-t border-slate-800/50 flex justify-center items-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <p className="text-sm text-slate-500 text-center">
                        © {currentYear} {config.owner_name}. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}
