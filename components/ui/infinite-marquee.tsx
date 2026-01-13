'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface InfiniteMarqueeProps {
    children: React.ReactNode;
    direction?: 'left' | 'right';
    speed?: number;
    pauseOnHover?: boolean;
    className?: string;
}

export function InfiniteMarquee({
    children,
    direction = 'left',
    speed = 30,
    pauseOnHover = true,
    className,
}: InfiniteMarqueeProps) {
    const [isPaused, setIsPaused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [start, setStart] = useState(false);

    useEffect(() => {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);
            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                scrollerRef.current?.appendChild(duplicatedItem);
            });
            setStart(true);
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]',
                className
            )}
            onMouseEnter={() => pauseOnHover && setIsPaused(true)}
            onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        >
            <motion.div
                ref={scrollerRef}
                className="flex min-w-full gap-4"
                animate={
                    start
                        ? {
                            x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
                        }
                        : {}
                }
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: speed,
                        ease: 'linear',
                    },
                }}
                style={{
                    animationPlayState: isPaused ? 'paused' : 'running',
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}

interface MarqueeItemProps {
    children: React.ReactNode;
    className?: string;
}

export function MarqueeItem({ children, className }: MarqueeItemProps) {
    return (
        <div
            className={cn(
                'flex shrink-0 items-center justify-center px-6 py-3',
                'rounded-xl bg-slate-900/50 border border-slate-800/50',
                'hover:border-violet-500/30 transition-colors duration-300',
                className
            )}
        >
            {children}
        </div>
    );
}
