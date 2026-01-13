'use client';

import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
    staggerDelay?: number;
    as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
    gradient?: boolean;
}

export function TextReveal({
    text,
    className,
    delay = 0,
    duration = 0.05,
    staggerDelay = 0.02,
    as: Component = 'span',
    gradient = false,
}: TextRevealProps) {
    const words = text.split(' ');

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { delayChildren: delay, staggerChildren: staggerDelay },
        },
    };

    const child: Variants = {
        hidden: {
            opacity: 0,
            y: 20,
            filter: 'blur(10px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
        },
    };

    return (
        <motion.span
            className={cn(
                'inline-flex flex-wrap',
                gradient &&
                'bg-gradient-to-r from-white via-violet-200 to-indigo-200 bg-clip-text text-transparent',
                className
            )}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    className="mr-[0.25em] inline-block"
                    variants={child}
                >
                    {word}
                </motion.span>
            ))}
        </motion.span>
    );
}

interface CharacterRevealProps {
    text: string;
    className?: string;
    delay?: number;
    staggerDelay?: number;
}

export function CharacterReveal({
    text,
    className,
    delay = 0,
    staggerDelay = 0.03,
}: CharacterRevealProps) {
    const characters = text.split('');

    const container: Variants = {
        hidden: {},
        visible: {
            transition: { delayChildren: delay, staggerChildren: staggerDelay },
        },
    };

    const child: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] },
        },
    };

    return (
        <motion.span
            className={cn('inline-block', className)}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {characters.map((char, i) => (
                <motion.span key={i} className="inline-block" variants={child}>
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </motion.span>
    );
}

interface LineRevealProps {
    lines: string[];
    className?: string;
    lineClassName?: string;
    delay?: number;
    staggerDelay?: number;
}

export function LineReveal({
    lines,
    className,
    lineClassName,
    delay = 0,
    staggerDelay = 0.1,
}: LineRevealProps) {
    const container: Variants = {
        hidden: {},
        visible: {
            transition: { delayChildren: delay, staggerChildren: staggerDelay },
        },
    };

    const lineVariant: Variants = {
        hidden: { opacity: 0, y: 30, filter: 'blur(5px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
        },
    };

    return (
        <motion.div
            className={className}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {lines.map((line, i) => (
                <motion.div key={i} className={lineClassName} variants={lineVariant}>
                    {line}
                </motion.div>
            ))}
        </motion.div>
    );
}
