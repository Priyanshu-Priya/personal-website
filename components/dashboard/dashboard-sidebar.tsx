'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FolderKanban,
    Brain,
    Sparkles,
    FileText,
    LogOut,
    FileEdit,
    Mail,
    ChevronRight,
    LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signout } from '@/app/(public)/login/actions';

// --- Configuration ---

interface NavItem {
    href: string;
    label: string;
    icon: LucideIcon;
    badge?: string;
}

interface NavSection {
    title?: string;
    items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
    {
        items: [
            { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        ],
    },
    {
        title: 'Content',
        items: [
            { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
            { href: '/dashboard/blog', label: 'Blog', icon: FileText },
            { href: '/dashboard/thoughts', label: 'Thoughts', icon: Brain },
            { href: '/dashboard/resonance', label: 'Resonance', icon: Sparkles },
            { href: '/dashboard/pages', label: 'Pages', icon: FileEdit },
        ],
    },
    {
        title: 'Monitor',
        items: [
            { href: '/dashboard/communication', label: 'Messages', icon: Mail },
        ],
    },
];

// --- Sub-Components ---

function SidebarHeader({ onClick }: { onClick?: () => void }) {
    return (
        <div className="p-5 border-b border-slate-800/80">
            <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onClick}>
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">Studio</h1>
                    <p className="text-[11px] text-slate-500">Control Room</p>
                </div>
            </Link>
        </div>
    );
}

function SidebarNav({ sections, onClick }: { sections: NavSection[]; onClick?: () => void }) {
    const pathname = usePathname();

    return (
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
            {sections.map((section, idx) => (
                <div key={idx} className="mb-6 last:mb-0">
                    {section.title && (
                        <h4 className="px-3 mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                            {section.title}
                        </h4>
                    )}
                    <div className="space-y-1">
                        {section.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href ||
                                (item.href !== '/dashboard' && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClick}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                                        isActive
                                            ? "bg-indigo-500/10 text-white"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                                    )}
                                >
                                    {/* Active indicator */}
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-indigo-500" />
                                    )}

                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                        isActive
                                            ? "bg-indigo-500/20"
                                            : "bg-slate-800/50 group-hover:bg-slate-700/50"
                                    )}>
                                        <Icon className={cn(
                                            "w-4 h-4 transition-colors",
                                            isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-indigo-400"
                                        )} />
                                    </div>

                                    <span className="font-medium text-sm flex-1">{item.label}</span>

                                    {item.badge && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                                            {item.badge}
                                        </span>
                                    )}

                                    <ChevronRight className={cn(
                                        "w-4 h-4 opacity-0 -translate-x-2 transition-all",
                                        isActive ? "opacity-100 translate-x-0 text-indigo-400" : "group-hover:opacity-50 group-hover:translate-x-0"
                                    )} />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>
    );
}

interface SidebarFooterProps {
    user: any;
}

function SidebarFooter({ user }: SidebarFooterProps) {
    return (
        <div className="p-3 border-t border-slate-800/80">
            {/* User Card */}
            <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-slate-800/30">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/20">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                {/* Email */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                        {user.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-[11px] text-slate-500">Administrator</p>
                </div>
            </div>

            {/* Sign Out Button */}
            <form action={signout}>
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/20"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium text-sm">Sign Out</span>
                </button>
            </form>
        </div>
    );
}

// --- Main Component ---

interface DashboardSidebarProps {
    user: any;
    onLinkClick?: () => void;
}

export function DashboardSidebar({ user, onLinkClick }: DashboardSidebarProps) {
    return (
        <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800/80">
            <SidebarHeader onClick={onLinkClick} />
            <SidebarNav sections={NAV_SECTIONS} onClick={onLinkClick} />
            <SidebarFooter user={user} />
        </div>
    );
}
