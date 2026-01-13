'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Youtube, Instagram } from 'lucide-react';
import type { SocialLink, GlobalConfig } from '@/types/content';
import { cn } from '@/lib/utils';

// Icon mapping for social platforms
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    email: Mail,
    youtube: Youtube,
    instagram: Instagram,
};

interface SocialLinksProps {
    links?: SocialLink[];
    config?: GlobalConfig;
    className?: string;
    itemClassName?: string;
    iconClassName?: string;
    showLabel?: boolean;
}

export function SocialLinks({
    links,
    config,
    className,
    itemClassName,
    iconClassName = "w-4 h-4",
    showLabel = false
}: SocialLinksProps) {
    const finalLinks = config?.social_links || links;

    if (!finalLinks?.length) return null;

    return (
        <div className={cn("flex gap-3", className)}>
            {finalLinks.map((social) => {
                const Icon = iconMap[social.platform.toLowerCase()] || Mail;
                return (
                    <motion.a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white hover:border-violet-500/50 transition-all flex items-center justify-center",
                            itemClassName
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={social.label}
                    >
                        <Icon className={iconClassName} />
                        {showLabel ? (
                            <span className="ml-2 text-sm font-medium">{social.label}</span>
                        ) : (
                            <span className="sr-only">{social.label}</span>
                        )}
                    </motion.a>
                );
            })}
        </div>
    );
}
