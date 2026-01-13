'use client';

import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import {
    Home,
    User,
    Briefcase,
    BookOpen,
    Clock,
    Menu,
    X,
    ChevronDown,
    Book,
    Sparkles,
    Radio,
    type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { GlobalConfig, NavItem } from '@/types/content';

// ============================================
// TOP NAVBAR - CONSISTENT ACROSS ALL PAGES
// ============================================

const iconMap: Record<string, LucideIcon> = {
    'Home': Home,
    'About': User,
    'Projects': Briefcase,
    'Library': BookOpen,
    'Now': Clock,
    // Sub-items
    'Blog': Book,
    'Thoughts': Sparkles,
    'Resonance': Radio,
};

interface NavbarUIProps {
    config: GlobalConfig;
}

function NavbarUI({ config }: NavbarUIProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [libraryHover, setLibraryHover] = useState(false);
    const [mobileLibraryOpen, setMobileLibraryOpen] = useState(false);

    // Auto-close on navigation
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setLibraryHover(false); // Ensure dropdown closes on nav
    }, [pathname]);

    const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
    const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);

    // Escape key handler
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsMobileMenuOpen(false);
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    // Body scroll lock when menu is open
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    // Hide on dashboard routes
    if (pathname.startsWith('/dashboard')) {
        return null;
    }

    const { nav_items } = config;

    return (
        <>
            {/* ===== TOP NAVBAR ===== */}
            <header
                className="fixed top-0 left-0 right-0 z-[99999] bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50"
            >
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 box-border">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo / Name */}
                        <Link
                            href="/"
                            className="text-lg font-bold text-white hover:text-violet-300 transition-colors"
                        >
                            {config.site_name.split(' ')[0]}<span className="text-violet-400">.</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {nav_items.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                const hasSubItems = item.items && item.items.length > 0;

                                // CTA Button (Contact)
                                if (item.is_cta) {
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="ml-2 px-4 py-2 rounded-lg text-sm font-medium bg-white text-slate-900 hover:bg-slate-100 transition-all duration-200 flex items-center gap-1.5"
                                        >
                                            {item.label}
                                            <ChevronDown className="w-4 h-4 -rotate-90" />
                                        </Link>
                                    );
                                }

                                if (hasSubItems) {
                                    return (
                                        <div
                                            key={item.href}
                                            className="relative"
                                            onMouseEnter={() => setLibraryHover(true)}
                                            onMouseLeave={() => setLibraryHover(false)}
                                        >
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1',
                                                    isActive
                                                        ? 'bg-violet-500/20 text-violet-300'
                                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                                )}
                                            >
                                                {item.label}
                                                <ChevronDown className={cn(
                                                    'w-4 h-4 transition-transform duration-200',
                                                    libraryHover && 'rotate-180'
                                                )} />
                                            </Link>

                                            <AnimatePresence>
                                                {libraryHover && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute top-full right-0 w-56 pt-2"
                                                    >
                                                        <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-xl shadow-xl overflow-hidden p-1">
                                                            {item.items?.map((subItem) => {
                                                                const Icon = iconMap[subItem.label];
                                                                const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href + '/');
                                                                return (
                                                                    <Link
                                                                        key={subItem.href}
                                                                        href={subItem.href}
                                                                        onClick={() => setLibraryHover(false)} // Close on click
                                                                        className={cn(
                                                                            'flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors hover:bg-slate-800/50',
                                                                            isSubActive ? 'text-white bg-slate-800/30' : 'text-slate-400 hover:text-white'
                                                                        )}
                                                                    >
                                                                        {Icon && <Icon className="w-4 h-4" />}
                                                                        {subItem.label}
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                                            isActive
                                                ? 'bg-violet-500/20 text-violet-300'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Mobile Hamburger */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* ===== MOBILE MENU (slides down from top) ===== */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -20, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="md:hidden border-t border-slate-800/50 bg-slate-950/98 backdrop-blur-xl max-h-[calc(100vh-64px)] overflow-y-auto"
                        >
                            <nav className="px-4 py-4 space-y-1">
                                {nav_items.filter(item => !item.is_cta).map((item) => {
                                    // Standard Links
                                    if (!item.items || item.items.length === 0) {
                                        const Icon = iconMap[item.label] || Home;
                                        return (
                                            <MobileLink
                                                key={item.href}
                                                href={item.href}
                                                onOpenChange={setIsMobileMenuOpen}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white text-slate-400 transition-all duration-200"
                                                activeClassName="bg-violet-500/20 text-violet-300 border border-violet-500/30"
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="font-medium">{item.label}</span>
                                            </MobileLink>
                                        );
                                    }

                                    // Library Section (Grouped & Collapsible)
                                    return (
                                        <div key={item.href} className="flex flex-col space-y-1 pt-2 pb-2">
                                            {/* Header Row: Link + Toggle Arrow */}
                                            <div className="flex items-center justify-between pr-2">
                                                <MobileLink
                                                    href={item.href}
                                                    onOpenChange={setIsMobileMenuOpen}
                                                    className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white text-slate-400 transition-all duration-200"
                                                    activeClassName="bg-violet-500/20 text-violet-300 border border-violet-500/30"
                                                >
                                                    <BookOpen className="w-5 h-5" />
                                                    <span className="font-medium">{item.label}</span>
                                                </MobileLink>

                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setMobileLibraryOpen(!mobileLibraryOpen);
                                                    }}
                                                    className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                                                    aria-label={mobileLibraryOpen ? "Collapse menu" : "Expand menu"}
                                                >
                                                    <ChevronDown className={cn(
                                                        "w-5 h-5 transition-transform duration-200",
                                                        mobileLibraryOpen && "rotate-180"
                                                    )} />
                                                </button>
                                            </div>

                                            {/* Sub-Links: Collapsible Container */}
                                            <AnimatePresence initial={false}>
                                                {mobileLibraryOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="flex flex-col gap-1 pl-6 ml-4 border-l border-slate-800 space-y-1 mt-1 mb-2">
                                                            {item.items.map((subItem) => {
                                                                const SubIcon = iconMap[subItem.label];
                                                                return (
                                                                    <MobileLink
                                                                        key={subItem.href}
                                                                        href={subItem.href}
                                                                        onOpenChange={setIsMobileMenuOpen}
                                                                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:text-white text-slate-400 transition-colors"
                                                                        activeClassName="text-white bg-slate-800/40"
                                                                    >
                                                                        {SubIcon && <SubIcon className="w-4 h-4" />}
                                                                        <span>{subItem.label}</span>
                                                                    </MobileLink>
                                                                );
                                                            })}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}

                                {/* CTA Button at bottom */}
                                {nav_items.filter(item => item.is_cta).map((ctaItem) => (
                                    <div key={ctaItem.href} className="pt-4 mt-2 border-t border-slate-800">
                                        <Link
                                            href={ctaItem.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors"
                                        >
                                            {ctaItem.label}
                                            <ChevronDown className="w-4 h-4 -rotate-90" />
                                        </Link>
                                    </div>
                                ))}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* ===== MOBILE BACKDROP (when menu is open) ===== */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={closeMobileMenu}
                        className="fixed inset-0 z-[99998] bg-black/50 md:hidden"
                        style={{ top: '64px' }} // Below the header
                    />
                )}
            </AnimatePresence>
        </>
    );
}

// MobileLink Helper Component
interface MobileLinkProps extends React.PropsWithChildren {
    href: string;
    onOpenChange?: (open: boolean) => void;
    className?: string;
    activeClassName?: string;
}

function MobileLink({
    href,
    onOpenChange,
    className,
    activeClassName,
    children,
    ...props
}: MobileLinkProps) {
    const pathname = usePathname();
    // Strict equality for home, prefix for others to handle nested routes? 
    // Or strict equality for exact highlighting? 
    // Using startsWith for sub-sections usually better for UX if hierarchical.
    // For specific links like /library/blog, we want strict or startsWith unique prefix.
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

    return (
        <Link
            href={href}
            onClick={() => {
                onOpenChange?.(false);
            }}
            className={cn(className, isActive && activeClassName)}
            {...props}
        >
            {children}
        </Link>
    );
}

export function FloatingDock({ config }: { config: GlobalConfig }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(<NavbarUI config={config} />, document.body);
}
