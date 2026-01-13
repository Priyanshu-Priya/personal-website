'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, MouseEvent } from 'react';

interface GlowCardProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: 'violet' | 'indigo' | 'amber' | 'emerald';
}

export function GlowCard({ children, className, glowColor = 'violet' }: GlowCardProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const glowColors = {
        violet: 'rgba(139, 92, 246, 0.5)',
        indigo: 'rgba(99, 102, 241, 0.5)',
        amber: 'rgba(251, 191, 36, 0.5)',
        emerald: 'rgba(52, 211, 153, 0.5)',
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <motion.div
            className={cn(
                'group relative rounded-2xl overflow-hidden',
                className
            )}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
        >
            {/* Animated border glow */}
            <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: isHovered
                        ? `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColors[glowColor]}, transparent 40%)`
                        : '',
                }}
            />

            {/* Border */}
            <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                    background: isHovered
                        ? `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColors[glowColor]}, transparent 40%)`
                        : 'transparent',
                    padding: '1px',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'xor',
                    WebkitMaskComposite: 'xor',
                }}
            />

            {/* Card background */}
            <div className="relative z-10 h-full rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-800/50">
                {children}
            </div>
        </motion.div>
    );
}

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    colSpan?: 1 | 2;
    rowSpan?: 1 | 2;
}

export function BentoCard({ children, className, colSpan = 1, rowSpan = 1 }: BentoCardProps) {
    const spanClasses = {
        col: {
            1: 'md:col-span-1',
            2: 'md:col-span-2',
        },
        row: {
            1: 'row-span-1',
            2: 'row-span-2',
        },
    };

    return (
        <GlowCard
            className={cn(
                'col-span-1',
                spanClasses.col[colSpan],
                spanClasses.row[rowSpan],
                className
            )}
        >
            {children}
        </GlowCard>
    );
}
