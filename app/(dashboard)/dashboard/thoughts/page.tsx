import Link from 'next/link';
import { format } from 'date-fns';
import { Plus, Pencil } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DeleteButton } from './delete-button';
import { cn } from '@/lib/utils';

interface ThoughtEntry {
    id: string;
    content: string;
    mood: string | null;
    is_published: boolean;
    created_at: string;
}

const moodStyles: Record<string, string> = {
    productive: 'bg-emerald-500/10 text-emerald-400',
    pensive: 'bg-indigo-500/10 text-indigo-400',
    excited: 'bg-amber-500/10 text-amber-400',
    frustrated: 'bg-rose-500/10 text-rose-400',
    calm: 'bg-sky-500/10 text-sky-400',
};

function truncate(str: string, length: number) {
    return str.length > length ? str.slice(0, length) + '...' : str;
}

export default async function DashboardThoughtsPage() {
    const supabase = await createClient();

    const { data: entries, error } = await supabase
        .from('thoughts')
        .select('*')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false });

    if (error) {
        console.error('Error fetching thoughts:', error);
    }

    const thoughts = (entries as ThoughtEntry[]) || [];

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Thoughts Stream</h1>
                    <p className="text-slate-400 mt-1">
                        Manage your fleeting thoughts and observations
                    </p>
                </div>
                <Link href="/dashboard/thoughts/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-500">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New
                    </Button>
                </Link>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-6 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-6">
                    <p>Could not load thoughts. Please try again.</p>
                </div>
            )}

            {/* Empty State */}
            {!error && thoughts.length === 0 && (
                <div className="text-center py-16 bg-slate-900/50 rounded-lg border border-slate-800">
                    <p className="text-slate-400 mb-4">No thoughts yet. The mind is quiet.</p>
                    <Link href="/dashboard/thoughts/new">
                        <Button variant="outline">Post your first thought</Button>
                    </Link>
                </div>
            )}

            {/* Data Table */}
            {thoughts.length > 0 && (
                <div className="rounded-lg border border-slate-800 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Content</TableHead>
                                <TableHead className="text-slate-400 hidden md:table-cell">Mood</TableHead>
                                <TableHead className="text-slate-400 hidden md:table-cell">Status</TableHead>
                                <TableHead className="text-slate-400 hidden lg:table-cell">Date</TableHead>
                                <TableHead className="text-slate-400 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {thoughts.map((thought) => (
                                <TableRow key={thought.id} className="border-slate-800">
                                    <TableCell className="font-medium text-white max-w-md whitespace-normal min-w-[200px]">
                                        <div className="line-clamp-2" title={thought.content}>
                                            {thought.content}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {thought.mood ? (
                                            <span
                                                className={cn(
                                                    'text-xs px-2 py-1 rounded-full capitalize',
                                                    moodStyles[thought.mood.toLowerCase()] || 'bg-slate-800 text-slate-400'
                                                )}
                                            >
                                                {thought.mood}
                                            </span>
                                        ) : (
                                            <span className="text-slate-600">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <span
                                            className={cn(
                                                'text-xs px-2 py-1 rounded-full',
                                                thought.is_published
                                                    ? 'bg-emerald-500/10 text-emerald-400'
                                                    : 'bg-slate-800 text-slate-400'
                                            )}
                                        >
                                            {thought.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-400 hidden lg:table-cell">
                                        {format(new Date(thought.created_at), 'MMM d, h:mm a')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/dashboard/thoughts/${thought.id}`}
                                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                                title="Edit thought"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <DeleteButton id={thought.id} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
