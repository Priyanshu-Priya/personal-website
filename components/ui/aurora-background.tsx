'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AuroraBackgroundProps {
    className?: string;
    children?: React.ReactNode;
}

export function AuroraBackground({ className, children }: AuroraBackgroundProps) {
    return (
        <div className={cn('relative overflow-hidden', className)}>
            {/* Aurora gradients */}
            <div className="absolute inset-0 z-0">
                {/* Primary aurora */}
                <motion.div
                    className="absolute -top-1/2 -left-1/2 h-full w-full opacity-50"
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    <div className="h-full w-full bg-gradient-conic from-violet-500/40 via-transparent to-transparent" />
                </motion.div>

                {/* Secondary aurora */}
                <motion.div
                    className="absolute -bottom-1/2 -right-1/2 h-full w-full opacity-40"
                    animate={{
                        rotate: [360, 0],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    <div className="h-full w-full bg-gradient-conic from-indigo-500/30 via-transparent to-transparent" />
                </motion.div>

                {/* Amber accent */}
                <motion.div
                    className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full opacity-20"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    style={{
                        background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)',
                    }}
                />
            </div>

            {/* Noise texture overlay */}
            <div
                className="absolute inset-0 z-10 opacity-40"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Content */}
            <div className="relative z-20">{children}</div>
        </div>
    );
}

export function GradientOrb({
    className,
    color = 'violet',
    size = 'lg',
    blur = true,
    animate = true,
}: {
    className?: string;
    color?: 'violet' | 'indigo' | 'amber' | 'rose' | 'emerald';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    blur?: boolean;
    animate?: boolean;
}) {
    const colors = {
        violet: 'from-violet-500/30 to-purple-500/30',
        indigo: 'from-indigo-500/30 to-blue-500/30',
        amber: 'from-amber-500/20 to-orange-500/20',
        rose: 'from-rose-500/20 to-pink-500/20',
        emerald: 'from-emerald-500/30 to-green-500/30',
    };

    const sizes = {
        sm: 'h-32 w-32',
        md: 'h-64 w-64',
        lg: 'h-96 w-96',
        xl: 'h-[32rem] w-[32rem]',
    };

    return (
        <motion.div
            className={cn(
                'absolute rounded-full bg-gradient-to-br',
                colors[color],
                sizes[size],
                blur && 'blur-3xl',
                className
            )}
            animate={
                animate
                    ? {
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.7, 0.5],
                    }
                    : undefined
            }
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        />
    );
}
