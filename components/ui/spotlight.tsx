'use client';

import { cn } from '@/lib/utils';
import { useMotionValue, motion, useSpring, useTransform } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

interface SpotlightProps {
    className?: string;
    fill?: string;
}

export function Spotlight({ className, fill = 'white' }: SpotlightProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = useCallback(
        (event: MouseEvent) => {
            mouseX.set(event.clientX);
            mouseY.set(event.clientY);
        },
        [mouseX, mouseY]
    );

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    const springX = useSpring(mouseX, { stiffness: 500, damping: 50 });
    const springY = useSpring(mouseY, { stiffness: 500, damping: 50 });

    return (
        <motion.div
            className={cn(
                'pointer-events-none fixed inset-0 z-30 opacity-0 transition-opacity duration-300',
                className
            )}
            style={{
                background: `radial-gradient(600px circle at ${springX}px ${springY}px, rgba(120, 80, 255, 0.15), transparent 40%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        />
    );
}

export function SpotlightCard({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div
            className={cn(
                'group relative rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden',
                className
            )}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Spotlight gradient */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: isHovered
                        ? `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`
                        : '',
                }}
            />
            {/* Glow border */}
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: isHovered
                        ? `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.4), transparent 40%)`
                        : '',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'xor',
                    WebkitMaskComposite: 'xor',
                    padding: '1px',
                    borderRadius: '12px',
                }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}
