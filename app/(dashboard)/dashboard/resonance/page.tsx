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

interface ResonanceEntry {
    id: string;
    title: string;
    url: string;
    type: string;
    resonance_score: number;
    created_at: string;
}

export default async function DashboardResonancePage() {
    const supabase = await createClient();

    const { data: entries, error } = await supabase
        .from('resonance')
        .select('*')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false });

    if (error) {
        console.error('Error fetching resonance:', error);
    }

    const resonanceEntries = (entries as ResonanceEntry[]) || [];

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Resonance Library</h1>
                    <p className="text-slate-400 mt-1">
                        Manage your curated influences and inspirations
                    </p>
                </div>
                <Link href="/dashboard/resonance/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-500">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New
                    </Button>
                </Link>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-6 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-6">
                    <p>Could not load entries. Please try again.</p>
                </div>
            )}

            {/* Empty State */}
            {!error && resonanceEntries.length === 0 && (
                <div className="text-center py-16 bg-slate-900/50 rounded-lg border border-slate-800">
                    <p className="text-slate-400 mb-4">No resonance entries yet.</p>
                    <Link href="/dashboard/resonance/new">
                        <Button variant="outline">Add your first entry</Button>
                    </Link>
                </div>
            )}

            {/* Data Table */}
            {resonanceEntries.length > 0 && (
                <div className="rounded-lg border border-slate-800 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Title</TableHead>
                                <TableHead className="text-slate-400 hidden md:table-cell">Type</TableHead>
                                <TableHead className="text-slate-400 hidden md:table-cell">Score</TableHead>
                                <TableHead className="text-slate-400 hidden lg:table-cell">Date</TableHead>
                                <TableHead className="text-slate-400 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {resonanceEntries.map((entry) => (
                                <TableRow key={entry.id} className="border-slate-800">
                                    <TableCell className="font-medium text-white whitespace-normal min-w-[200px]">
                                        <a
                                            href={entry.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-indigo-400 transition-colors line-clamp-2"
                                        >
                                            {entry.title}
                                        </a>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-400 capitalize">
                                            {entry.type}
                                        </span>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((dot) => (
                                                <span
                                                    key={dot}
                                                    className={`w-2 h-2 rounded-full ${dot <= entry.resonance_score
                                                        ? 'bg-indigo-500'
                                                        : 'bg-slate-700'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-400 hidden lg:table-cell">
                                        {format(new Date(entry.created_at), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/dashboard/resonance/${entry.id}`}
                                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                                title="Edit entry"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <DeleteButton id={entry.id} />
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
