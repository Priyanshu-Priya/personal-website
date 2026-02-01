'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { ContactForm } from '@/components/home/contact-form';
import type { ContactPageContent, GlobalConfig } from '@/types/content';

interface ContactPageClientProps {
    content: ContactPageContent;
    config: GlobalConfig;
}

import { SocialLinks } from '@/components/shared/SocialLinks';

export function ContactPageClient({ content, config }: ContactPageClientProps) {


    return (
        <main className="min-h-screen pt-20 lg:pt-28 pb-20">
            {/* Background Elements */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-8 lg:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full">
                        {content.header.badge}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        {content.header.title.split(' ').slice(0, -1).join(' ')}{' '}
                        <span className="bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                            {content.header.title.split(' ').slice(-1)}
                        </span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        {content.header.description}
                    </p>
                </motion.div>

                {/* Content Grid */}
                <div className="flex flex-col lg:grid lg:grid-cols-5 gap-8 lg:gap-16">
                    {/* Contact Info - Left Side (Order 2 on Mobile) */}
                    <motion.div
                        className="order-2 lg:order-1 lg:col-span-2 space-y-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {/* Quick Contact Cards (Email) */}
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-violet-500/30 transition-colors group"
                            >
                                <Link
                                    href={`mailto:${content.contact_info.email}`}
                                    className="flex items-center lg:items-start gap-4 flex-col lg:flex-row text-center lg:text-left"
                                >
                                    <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-500 mb-1">Email</p>
                                        <p className="text-white font-medium flex items-center justify-center lg:justify-start gap-1">
                                            {content.contact_info.email}
                                            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 text-center lg:text-left"
                        >
                            <h3 className="text-sm font-medium text-slate-400 mb-4">
                                Connect on Social
                            </h3>
                            <div className="flex justify-center lg:justify-start">
                                <SocialLinks
                                    config={config}
                                    itemClassName="p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all"
                                    iconClassName="w-5 h-5"
                                />
                            </div>
                        </motion.div>

                        {/* Regional Details Card (Location & Timezone) */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                            className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                                {/* Location Section */}
                                <div className="p-4 flex flex-col items-center lg:items-start text-center lg:text-left hover:bg-white/2 transition-colors">
                                    <div className="p-2 mb-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Location</p>
                                        <p className="text-white font-medium">
                                            {content.contact_info.location}
                                        </p>
                                    </div>
                                </div>

                                {/* Timezone Section */}
                                <div className="p-4 flex flex-col items-center lg:items-start text-center lg:text-left hover:bg-white/2 transition-colors">
                                    <div className="p-2 mb-3 rounded-lg bg-sky-500/10 text-sky-400">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Timezone</p>
                                        <p className="text-white font-medium">
                                            {content.contact_info.timezone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Availability Status */}
                        {content.availability.enabled && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.6 }}
                                className="p-6 rounded-xl bg-linear-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-center lg:text-left"
                            >
                                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                                    </span>
                                    <span className="text-emerald-400 font-medium">
                                        {content.availability.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400">
                                    {content.availability.message}
                                </p>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Contact Form - Right Side (Order 1 on Mobile) */}
                    <motion.div
                        className="order-1 lg:order-2 lg:col-span-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Send a Message
                            </h2>
                            <p className="text-slate-400 text-sm mb-8">
                                Fill out the form below and I&apos;ll respond within 24-48 hours.
                            </p>
                            <ContactForm
                                nameLabel={content.form.name_label}
                                emailLabel={content.form.email_label}
                                messageLabel={content.form.message_label}
                                namePlaceholder={content.form.name_placeholder}
                                emailPlaceholder={content.form.email_placeholder}
                                messagePlaceholder={content.form.message_placeholder}
                                submitText={content.form.submit_text}
                                successMessage={content.form.success_message}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
