'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface MagneticButtonProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    className?: string;
    strength?: number;
    onClick?: () => void;
    href?: string;
    target?: string;
    rel?: string;
}

export function MagneticButton({
    children,
    className,
    strength = 0.5,
    onClick,
    href,
    ...props
}: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 150, damping: 15 });
    const springY = useSpring(y, { stiffness: 150, damping: 15 });

    const handleMouseMove = (e: MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        x.set(distanceX * strength);
        y.set(distanceY * strength);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const Component = (href ? motion.a : motion.button) as any;

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            className="inline-block"
        >
            <Component
                href={href}
                onClick={onClick}
                style={{ x: springX, y: springY }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full',
                    'font-medium transition-all duration-300',
                    'before:absolute before:inset-0 before:bg-gradient-to-r before:from-violet-600 before:to-indigo-600',
                    'before:opacity-0 before:transition-opacity before:duration-300',
                    isHovered && 'before:opacity-100',
                    className
                )}
                {...props}
            >
                <span className="relative z-10 flex items-center gap-2">{children}</span>
            </Component>
        </div>
    );
}
