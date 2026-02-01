'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ContactForm } from '@/components/home/contact-form';
import { SocialLinks } from '@/components/shared/SocialLinks';
import type { GlobalConfig } from '@/types/content';

interface ContactSectionProps {
    title: string;
    subtitle: string;
    buttonText: string;
    nameLabel?: string;
    emailLabel?: string;
    messageLabel?: string;
    namePlaceholder?: string;
    emailPlaceholder?: string;
    messagePlaceholder?: string;
    successMessage?: string;
    config: GlobalConfig;
}

export function ContactSection({
    title,
    subtitle,
    buttonText,
    nameLabel,
    emailLabel,
    messageLabel,
    namePlaceholder,
    emailPlaceholder,
    messagePlaceholder,
    successMessage,
    config
}: ContactSectionProps) {

    return (
        <section className="py-20 md:py-32 relative">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-5xl mx-auto px-6">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Left Side Group - Text & Socials */}
                    {/* On Desktop: Acts as a single column. On Mobile: Uses display: contents to unwrap children for independent ordering */}
                    <div className="contents lg:flex lg:flex-col lg:gap-8">
                        {/* 1. Header/Text (Order 1 on Mobile) */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="order-1 space-y-8"
                        >
                            <div>
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="inline-block px-3 py-1 mb-4 text-xs font-medium text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full"
                                >
                                    Get in Touch
                                </motion.span>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                                    {title.split(' ').map((word, i) => (
                                        <span key={i}>
                                            {i === title.split(' ').length - 1 ? (
                                                <span className="bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                                                    {word}
                                                </span>
                                            ) : (
                                                word + ' '
                                            )}
                                        </span>
                                    ))}
                                </h2>
                                <p className="text-lg text-slate-400 max-w-md">
                                    {subtitle}
                                </p>
                            </div>
                        </motion.div>

                        {/* 3. Socials & Email (Order 3 on Mobile) */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="order-3 space-y-8 w-full"
                        >
                            {/* Social Links */}
                            <div className="space-y-4 flex flex-col items-center lg:items-start text-center lg:text-left">
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                                    Connect with me
                                </p>
                                <div className="flex gap-3 justify-center lg:justify-start">
                                    <SocialLinks
                                        config={config}
                                        itemClassName="p-3 bg-slate-900/50 border-slate-800 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300"
                                        iconClassName="w-5 h-5"
                                    />
                                </div>
                            </div>

                            {/* Quick Email Link */}
                            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center lg:text-left hover:border-violet-500/30 transition-colors">
                                <p className="text-sm text-slate-500 mb-1">Email me directly</p>
                                <Link
                                    href={`mailto:${config.contact_email}`}
                                    className="text-white font-medium hover:text-violet-400 transition-colors block lg:inline"
                                >
                                    {config.contact_email}
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* 2. Right Side - Form (Order 2 on Mobile) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="order-2 w-full"
                    >
                        <div className="p-6 md:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Send a Message
                            </h3>
                            <p className="text-slate-400 text-sm mb-6">
                                Fill out the form and I&apos;ll respond within 24-48 hours.
                            </p>
                            <ContactForm
                                submitText={buttonText}
                                nameLabel={nameLabel}
                                emailLabel={emailLabel}
                                messageLabel={messageLabel}
                                namePlaceholder={namePlaceholder}
                                emailPlaceholder={emailPlaceholder}
                                messagePlaceholder={messagePlaceholder}
                                successMessage={successMessage}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
