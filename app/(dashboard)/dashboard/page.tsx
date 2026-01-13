import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getSentEmails } from '@/actions/resend';
import {
    Rocket,
    Brain,
    Radio,
    FileText,
    Mail,
    LayoutTemplate,
    ArrowUpRight
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface RecentItem {
    id: string;
    title: string;
    type: 'Project' | 'Blog' | 'Thought' | 'Resonance' | 'Message';
    status: string;
    date: string;
    slug?: string; // For linking
}

export default async function DashboardPage() {
    const supabase = await createClient();

    // 1. Parallel Data Fetching (including emails)
    const [
        { count: projectsCount },
        { count: blogCount },
        { count: thoughtsCount },
        { count: resonanceCount },
        { data: recentProjects },
        { data: recentBlogPosts },
        { data: recentThoughts },
        { data: recentResonance },
        { emails: recentEmails }
    ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('thoughts').select('*', { count: 'exact', head: true }),
        supabase.from('resonance').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('id, title, slug, is_published, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('blog_posts').select('id, title, slug, is_published, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('thoughts').select('id, content, is_published, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('resonance').select('id, title, type, created_at').order('created_at', { ascending: false }).limit(5),
        getSentEmails(),
    ]);

    // Helper to extract sender name from email subject
    const extractSenderName = (subject: string): string => {
        const match = subject.match(/from\s+(.+)$/i);
        return match ? match[1] : 'Unknown Sender';
    };

    // Combine and process recent activity (including emails)
    const activity: RecentItem[] = [
        ...(recentProjects || []).map(p => ({
            id: p.id,
            title: p.title,
            type: 'Project' as const,
            status: p.is_published ? 'Published' : 'Draft',
            date: p.created_at,
            slug: p.slug
        })),
        ...(recentBlogPosts || []).map(b => ({
            id: b.id,
            title: b.title,
            type: 'Blog' as const,
            status: b.is_published ? 'Published' : 'Draft',
            date: b.created_at,
            slug: b.slug
        })),
        ...(recentThoughts || []).map(t => ({
            id: t.id,
            title: t.content.length > 40 ? t.content.substring(0, 40) + '...' : t.content,
            type: 'Thought' as const,
            status: t.is_published ? 'Published' : 'Draft',
            date: t.created_at,
        })),
        ...(recentResonance || []).map(r => ({
            id: r.id,
            title: r.title,
            type: 'Resonance' as const,
            status: r.type, // e.g. 'Article', 'Video'
            date: r.created_at,
        })),
        ...(recentEmails || []).slice(0, 5).map(e => ({
            id: e.id,
            title: `Message from ${extractSenderName(e.subject)}`,
            type: 'Message' as const,
            status: e.last_event || 'delivered',
            date: e.created_at,
        })),
    ].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }).slice(0, 15);


    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Mission Control</h1>
                <p className="text-slate-400 mt-1">
                    System status and intelligence overview
                </p>
            </div>

            {/* Section A: Vital Signs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard
                    title="Projects"
                    value={projectsCount || 0}
                    icon={Rocket}
                    href="/dashboard/projects"
                />
                <StatCard
                    title="Blog Posts"
                    value={blogCount || 0}
                    icon={FileText}
                    href="/dashboard/blog"
                />
                <StatCard
                    title="Thoughts"
                    value={thoughtsCount || 0}
                    icon={Brain}
                    href="/dashboard/thoughts"
                />
                <StatCard
                    title="Resonance"
                    value={resonanceCount || 0}
                    icon={Radio}
                    href="/dashboard/resonance"
                />
                <StatCard
                    title="Messages"
                    value={recentEmails?.length || 0}
                    icon={Mail}
                    href="/dashboard/communication"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Section B: Quick Actions */}
                <div className="lg:col-span-1 space-y-4 lg:order-last">
                    <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                        <Link href="/dashboard/projects/new" className="block">
                            <Button variant="outline" className="w-full h-auto p-4 flex items-center justify-start gap-4 border-slate-800 hover:bg-slate-800/50 hover:border-indigo-500/50 transition-all group">
                                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                                    <Rocket className="h-5 w-5 text-indigo-400" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-white">New Project</div>
                                    <div className="text-xs text-slate-500">Launch a new case study</div>
                                </div>
                            </Button>
                        </Link>

                        <Link href="/dashboard/blog/new" className="block">
                            <Button variant="outline" className="w-full h-auto p-4 flex items-center justify-start gap-4 border-slate-800 hover:bg-slate-800/50 hover:border-pink-500/50 transition-all group">
                                <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                                    <FileText className="h-5 w-5 text-pink-400" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-white">New Blog Post</div>
                                    <div className="text-xs text-slate-500">Write a long-form article</div>
                                </div>
                            </Button>
                        </Link>

                        <Link href="/dashboard/thoughts/new" className="block">
                            <Button variant="outline" className="w-full h-auto p-4 flex items-center justify-start gap-4 border-slate-800 hover:bg-slate-800/50 hover:border-purple-500/50 transition-all group">
                                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                    <Brain className="h-5 w-5 text-purple-400" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-white">New Thought</div>
                                    <div className="text-xs text-slate-500">Share a fleeting idea</div>
                                </div>
                            </Button>
                        </Link>

                        <Link href="/dashboard/resonance/new" className="block">
                            <Button variant="outline" className="w-full h-auto p-4 flex items-center justify-start gap-4 border-slate-800 hover:bg-slate-800/50 hover:border-amber-500/50 transition-all group">
                                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                                    <Radio className="h-5 w-5 text-amber-400" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-white">New Resonance</div>
                                    <div className="text-xs text-slate-500">Curate a new item</div>
                                </div>
                            </Button>
                        </Link>

                        <Link href="/dashboard/pages" className="block sm:col-span-2 lg:col-span-1">
                            <Button variant="outline" className="w-full h-auto p-4 flex items-center justify-start gap-4 border-slate-800 hover:bg-slate-800/50 hover:border-emerald-500/50 transition-all group">
                                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                    <LayoutTemplate className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-white">Edit Pages</div>
                                    <div className="text-xs text-slate-500">Update home or about</div>
                                </div>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Section C: Recent Intelligence */}
                <div className="lg:col-span-2 lg:order-first">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Recent Intelligence</h2>

                    </div>

                    <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/50 backdrop-blur-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-transparent bg-slate-900/50">
                                    <TableHead className="text-slate-400">Title</TableHead>
                                    <TableHead className="text-slate-400">Type</TableHead>
                                    <TableHead className="text-slate-400">Status</TableHead>
                                    <TableHead className="text-slate-400 text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activity.map((item) => (
                                    <TableRow key={`${item.type}-${item.id}`} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                                        <TableCell className="font-medium text-white">
                                            {item.title}
                                        </TableCell>
                                        <TableCell>
                                            <span className={cn(
                                                "text-xs px-2 py-1 rounded-full border",
                                                item.type === 'Project'
                                                    ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                                    : item.type === 'Blog'
                                                        ? "bg-pink-500/10 text-pink-400 border-pink-500/20"
                                                        : item.type === 'Thought'
                                                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                                            : item.type === 'Message'
                                                                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                                                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                            )}>
                                                {item.type}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {item.type === 'Resonance' ? (
                                                <span className="text-sm text-slate-400 capitalize">{item.status}</span>
                                            ) : item.type === 'Message' ? (
                                                <span className="text-sm text-slate-400 capitalize">{item.status}</span>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "h-1.5 w-1.5 rounded-full",
                                                        item.status === 'Published' ? "bg-emerald-500" : "bg-slate-500"
                                                    )} />
                                                    <span className="text-sm text-slate-400">{item.status}</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-400 text-right font-mono text-xs">
                                            {format(new Date(item.date), 'MMM d')}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {activity.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                                            No recent activity detected.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}
