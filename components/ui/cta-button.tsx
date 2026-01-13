import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface CtaButtonProps {
    href?: string;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    showArrow?: boolean;
}

export function CtaButton({
    href = '/contact',
    children,
    variant = 'primary',
    size = 'md',
    className,
    showArrow = false,
}: CtaButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200';

    const variants = {
        primary: 'bg-linear-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-violet-500/25',
        secondary: 'bg-white text-slate-900 hover:bg-slate-100',
        outline: 'border border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-2.5 text-sm',
        lg: 'px-8 py-3 text-base',
    };

    return (
        <Link
            href={href}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
        >
            {children}
            {showArrow && <ArrowRight className="w-4 h-4" />}
        </Link>
    );
}
