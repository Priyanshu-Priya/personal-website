'use client';

import { motion } from 'framer-motion';
import { InfiniteMarquee, MarqueeItem } from '@/components/ui/infinite-marquee';
import type { HomePageContent } from '@/types/content';

interface TechStackSectionProps {
    content: HomePageContent['tech_stack_section'];
}

export function TechStackSection({ content }: TechStackSectionProps) {
    // Use items from CMS content
    const techStack = content.items || [];

    return (
        <section className="py-24 overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-8 px-6"
            >
                <p className="text-center text-sm text-slate-500 uppercase tracking-widest font-mono">
                    {content.label}
                </p>
            </motion.div>

            {/* First row - left */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <InfiniteMarquee direction="left" speed={40}>
                    {techStack.map((tech) => (
                        <MarqueeItem key={tech.name}>
                            <span className={`font-medium ${tech.color}`}>{tech.name}</span>
                        </MarqueeItem>
                    ))}
                </InfiniteMarquee>
            </motion.div>

            {/* Second row - right */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-4"
            >
                <InfiniteMarquee direction="right" speed={35}>
                    {[...techStack].reverse().map((tech) => (
                        <MarqueeItem key={tech.name}>
                            <span className={`font-medium ${tech.color}`}>{tech.name}</span>
                        </MarqueeItem>
                    ))}
                </InfiniteMarquee>
            </motion.div>
        </section>
    );
}
