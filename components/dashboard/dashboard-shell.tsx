'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, LayoutDashboard, FolderKanban, FileText, Mail, MoreHorizontal } from 'lucide-react';
import { DashboardSidebar } from './dashboard-sidebar';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface DashboardShellProps {
    children: React.ReactNode;
    user: any;
}

// Bottom nav items for mobile
const BOTTOM_NAV_ITEMS = [
    { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
    { href: '/dashboard/blog', label: 'Blog', icon: FileText },
    { href: '/dashboard/communication', label: 'Messages', icon: Mail },
];

export function DashboardShell({ children, user }: DashboardShellProps) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-slate-950">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col z-30">
                <DashboardSidebar user={user} />
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">S</span>
                    </div>
                    <span className="font-bold text-white">Studio</span>
                </Link>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                            <Menu className="w-5 h-5" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="right" className="p-0 border-l-slate-800 bg-slate-900 w-80">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <DashboardSidebar user={user} onLinkClick={() => setOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 pt-14 pb-20 md:pt-0 md:pb-0">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 safe-area-inset-bottom">
                <div className="flex items-center justify-around h-16">
                    {BOTTOM_NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href ||
                            (item.href !== '/dashboard' && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]",
                                    isActive
                                        ? "text-indigo-400"
                                        : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                <Icon className={cn(
                                    "w-5 h-5 transition-transform",
                                    isActive && "scale-110"
                                )} />
                                <span className={cn(
                                    "text-[10px] font-medium",
                                    isActive && "text-indigo-400"
                                )}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}

                    {/* More button to open full menu */}
                    <button
                        onClick={() => setOpen(true)}
                        className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-300 transition-colors min-w-[60px]"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                        <span className="text-[10px] font-medium">More</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}
