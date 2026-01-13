import Link from 'next/link';
import { format } from 'date-fns';
import { Plus, Eye, EyeOff, Pencil } from 'lucide-react';
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

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    summary: string;
    is_published: boolean;
    is_featured: boolean;
    created_at: string;
}

export default async function DashboardBlogPage() {
    const supabase = await createClient();

    const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false });

    if (error) {
        console.error('Error fetching blog posts:', error);
    }

    const blogPosts = (posts as BlogPost[]) || [];

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
                    <p className="text-slate-400 mt-1">
                        Manage your articles and case studies
                    </p>
                </div>
                <Link href="/dashboard/blog/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-500">
                        <Plus className="w-4 h-4 mr-2" />
                        New Post
                    </Button>
                </Link>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-6 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-6">
                    <p>Could not load blog posts. Please try again.</p>
                </div>
            )}

            {/* Empty State */}
            {!error && blogPosts.length === 0 && (
                <div className="text-center py-16 bg-slate-900/50 rounded-lg border border-slate-800">
                    <p className="text-slate-400 mb-4">No blog posts yet.</p>
                    <Link href="/dashboard/blog/new">
                        <Button variant="outline">Write your first post</Button>
                    </Link>
                </div>
            )}

            {/* Data Table */}
            {blogPosts.length > 0 && (
                <div className="rounded-lg border border-slate-800 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Title</TableHead>
                                <TableHead className="text-slate-400 hidden md:table-cell">Status</TableHead>
                                <TableHead className="text-slate-400 hidden md:table-cell">Featured</TableHead>
                                <TableHead className="text-slate-400 hidden lg:table-cell">Date</TableHead>
                                <TableHead className="text-slate-400 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blogPosts.map((post) => (
                                <TableRow key={post.id} className="border-slate-800">
                                    <TableCell className="font-medium text-white whitespace-normal min-w-[200px]">
                                        <Link
                                            href={`/writing/blog/${post.slug}`}
                                            className="hover:text-indigo-400 transition-colors"
                                        >
                                            {post.title}
                                        </Link>
                                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                                            {post.summary}
                                        </p>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <span
                                            className={cn(
                                                'inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full',
                                                post.is_published
                                                    ? 'bg-emerald-500/10 text-emerald-400'
                                                    : 'bg-slate-800 text-slate-400'
                                            )}
                                        >
                                            {post.is_published ? (
                                                <>
                                                    <Eye className="w-3 h-3" />
                                                    Published
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="w-3 h-3" />
                                                    Draft
                                                </>
                                            )}
                                        </span>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {post.is_featured && (
                                            <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-400">
                                                Featured
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-slate-400 hidden lg:table-cell">
                                        {format(new Date(post.created_at), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/dashboard/blog/${post.id}/edit`}
                                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                                title="Edit post"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <DeleteButton id={post.id} />
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
