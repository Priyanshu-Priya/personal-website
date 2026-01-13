import Link from 'next/link';
import Image from 'next/image';
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

interface ProjectEntry {
    id: string;
    title: string;
    slug: string;
    summary: string;
    thumbnail_url: string | null;
    is_featured: boolean;
    is_published: boolean;
    created_at: string;
}

export default async function DashboardProjectsPage() {
    const supabase = await createClient();

    const { data: entries, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false });

    if (error) {
        console.error('Error fetching projects:', error);
    }

    const projects = (entries as ProjectEntry[]) || [];

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Projects</h1>
                    <p className="text-slate-400 mt-1">
                        Manage your portfolio projects
                    </p>
                </div>
                <Link href="/dashboard/projects/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-500">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New
                    </Button>
                </Link>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-6 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-6">
                    <p>Could not load projects. Please try again.</p>
                </div>
            )}

            {/* Empty State */}
            {!error && projects.length === 0 && (
                <div className="text-center py-16 bg-slate-900/50 rounded-lg border border-slate-800">
                    <p className="text-slate-400 mb-4">No projects yet.</p>
                    <Link href="/dashboard/projects/new">
                        <Button variant="outline">Add your first project</Button>
                    </Link>
                </div>
            )}

            {/* Data Table */}
            {projects.length > 0 && (
                <div className="rounded-lg border border-slate-800 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400 w-20 hidden min-[830px]:table-cell">Image</TableHead>
                                <TableHead className="text-slate-400">Title</TableHead>
                                <TableHead className="text-slate-400 hidden min-[830px]:table-cell">Status</TableHead>
                                <TableHead className="text-slate-400 hidden min-[830px]:table-cell">Featured</TableHead>
                                <TableHead className="text-slate-400 hidden lg:table-cell">Date</TableHead>
                                <TableHead className="text-slate-400 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.map((project) => (
                                <TableRow key={project.id} className="border-slate-800">
                                    <TableCell className="hidden min-[830px]:table-cell">
                                        {project.thumbnail_url ? (
                                            <div className="relative w-16 h-10 rounded overflow-hidden bg-slate-800">
                                                <Image
                                                    src={project.thumbnail_url}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-10 rounded bg-slate-800 flex items-center justify-center">
                                                <span className="text-xs text-slate-600">No image</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium text-white whitespace-normal min-w-[200px]">
                                        <Link
                                            href={`/work/projects/${project.slug}`}
                                            className="hover:text-indigo-400 transition-colors"
                                        >
                                            {project.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="hidden min-[830px]:table-cell">
                                        <span
                                            className={cn(
                                                'text-xs px-2 py-1 rounded-full',
                                                project.is_published
                                                    ? 'bg-emerald-500/10 text-emerald-400'
                                                    : 'bg-slate-800 text-slate-400'
                                            )}
                                        >
                                            {project.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="hidden min-[830px]:table-cell">
                                        {project.is_featured && (
                                            <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-400">
                                                Featured
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-slate-400 hidden lg:table-cell">
                                        {format(new Date(project.created_at), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/dashboard/projects/${project.id}`}
                                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                                title="Edit project"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <DeleteButton id={project.id} />
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
