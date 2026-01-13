'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Code2, ChevronDown, Book, Sparkles, Radio, ArrowRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import type { GlobalConfig } from '@/types/content';

interface NavbarProps {
    config?: GlobalConfig;
}

const libraryLinks = [
    { href: '/library', label: 'All Content', icon: null },
    { href: '/library/blog', label: 'Blog', icon: Book },
    { href: '/library/thoughts', label: 'Thoughts', icon: Sparkles },
    { href: '/library/resonance', label: 'Resonance', icon: Radio },
];

export default function Navbar({ config }: NavbarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [libraryHover, setLibraryHover] = useState(false);
    const [mobileLibraryOpen, setMobileLibraryOpen] = useState(true);

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    const isLibraryActive = pathname.startsWith('/library');

    // Get nav items from config or use defaults
    const navItems = config?.nav_items || [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/work/projects', label: 'Projects' },
        { href: '/library', label: 'Library' },
        { href: '/now', label: 'Now' },
        { href: '/contact', label: 'Contact', is_cta: true },
    ];

    // Separate regular links from CTA
    const regularLinks = navItems.filter(item => !item.is_cta && item.href !== '/library');
    const ctaLink = navItems.find(item => item.is_cta);
    const libraryLink = navItems.find(item => item.href === '/library');

    return (
        <header className="sticky top-0 z-[9999] w-full border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-lg">
            <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between relative">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-white font-semibold"
                >
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Code2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-mono text-sm tracking-tight">{config?.site_name || 'Priyanshu P.'}</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {regularLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'text-sm font-medium transition-colors hover:text-white',
                                isActive(link.href) ? 'text-white' : 'text-slate-400'
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {/* Library Dropdown */}
                    {libraryLink && (
                        <div
                            className="relative"
                            onMouseEnter={() => setLibraryHover(true)}
                            onMouseLeave={() => setLibraryHover(false)}
                        >
                            <Link
                                href="/library"
                                className={cn(
                                    'text-sm font-medium transition-colors hover:text-white flex items-center gap-1 py-4',
                                    isLibraryActive ? 'text-white' : 'text-slate-400'
                                )}
                            >
                                {libraryLink.label}
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
                                            {libraryLinks.map((link) => {
                                                const Icon = link.icon;
                                                return (
                                                    <Link
                                                        key={link.href}
                                                        href={link.href}
                                                        onClick={() => setLibraryHover(false)}
                                                        className={cn(
                                                            'flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors hover:bg-slate-800/50',
                                                            isActive(link.href) ? 'text-white bg-slate-800/30' : 'text-slate-400 hover:text-white'
                                                        )}
                                                    >
                                                        {Icon && <Icon className="w-4 h-4" />}
                                                        {link.label}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* CTA Button */}
                    {ctaLink && (
                        <Link
                            href={ctaLink.href}
                            className="ml-2 px-4 py-2 text-sm font-medium rounded-lg bg-white text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                        >
                            {ctaLink.label}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Open navigation menu"
                                className="text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-80 bg-slate-950 border-slate-800 p-6"
                        >
                            <div className="flex flex-col gap-6 mt-8">
                                {regularLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            'text-lg font-medium transition-colors hover:text-white',
                                            isActive(link.href) ? 'text-white' : 'text-slate-400'
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}

                                {/* Library Accordion */}
                                {libraryLink && (
                                    <div className="border-t border-slate-800 pt-4">
                                        <button
                                            onClick={() => setMobileLibraryOpen(!mobileLibraryOpen)}
                                            className={cn(
                                                'flex items-center justify-between w-full text-lg font-medium transition-colors hover:text-white mb-2',
                                                isLibraryActive ? 'text-white' : 'text-slate-400'
                                            )}
                                        >
                                            {libraryLink.label}
                                            <ChevronDown className={cn(
                                                'w-5 h-5 transition-transform duration-200',
                                                mobileLibraryOpen && 'rotate-180'
                                            )} />
                                        </button>

                                        <AnimatePresence>
                                            {mobileLibraryOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="flex flex-col gap-2 pl-4 border-l border-slate-800 ml-1">
                                                        {libraryLinks.map((link) => {
                                                            const Icon = link.icon;
                                                            return (
                                                                <Link
                                                                    key={link.href}
                                                                    href={link.href}
                                                                    onClick={() => setIsOpen(false)}
                                                                    className={cn(
                                                                        'flex items-center gap-3 py-2 text-base transition-colors hover:text-white',
                                                                        isActive(link.href) ? 'text-white' : 'text-slate-400'
                                                                    )}
                                                                >
                                                                    {Icon && <Icon className="w-4 h-4" />}
                                                                    {link.label}
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* Mobile CTA */}
                                {ctaLink && (
                                    <div className="pt-4 border-t border-slate-800">
                                        <Link
                                            href={ctaLink.href}
                                            onClick={() => setIsOpen(false)}
                                            className="w-full py-3 px-4 text-center font-medium rounded-lg bg-white text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                                        >
                                            {ctaLink.label}
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}
