'use client';

import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateBlogPost } from '../../actions';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    cover_image: string | null;
    tags: string[];
    is_published: boolean;
    is_featured: boolean;
}

interface BlogEditFormProps {
    post: BlogPost;
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            disabled={pending}
            className="bg-indigo-600 hover:bg-indigo-500 w-full sm:w-auto"
        >
            {pending ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                </>
            ) : (
                'Save Changes'
            )}
        </Button>
    );
}

export function BlogEditForm({ post }: BlogEditFormProps) {
    // Bind post ID to the update action
    const updatePostWithId = updateBlogPost.bind(null, post.id);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
                href="/dashboard/blog"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
            </Link>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Edit Blog Post</h1>
                <p className="text-slate-400 mt-1">
                    Update your article content and settings.
                </p>
            </div>

            {/* Form */}
            <form action={updatePostWithId} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-300">
                        Title <span className="text-rose-400">*</span>
                    </Label>
                    <Input
                        id="title"
                        name="title"
                        type="text"
                        required
                        defaultValue={post.title}
                        placeholder="Sample Blog Post Title"
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                    />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                    <Label htmlFor="slug" className="text-slate-300">
                        Slug <span className="text-rose-400">*</span>
                    </Label>
                    <Input
                        id="slug"
                        name="slug"
                        type="text"
                        required
                        defaultValue={post.slug}
                        placeholder="sample-blog-post"
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                    />
                    <p className="text-xs text-slate-500">URL-friendly identifier (lowercase, hyphens)</p>
                </div>

                {/* Summary */}
                <div className="space-y-2">
                    <Label htmlFor="summary" className="text-slate-300">
                        Summary <span className="text-rose-400">*</span>
                    </Label>
                    <Textarea
                        id="summary"
                        name="summary"
                        required
                        rows={2}
                        defaultValue={post.summary}
                        placeholder="This is a short placeholder description..."
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 resize-none"
                    />
                </div>

                {/* Cover Image URL */}
                <div className="space-y-2">
                    <Label htmlFor="cover_image" className="text-slate-300">
                        Cover Image URL
                    </Label>
                    <Input
                        id="cover_image"
                        name="cover_image"
                        type="url"
                        defaultValue={post.cover_image || ''}
                        placeholder="https://..."
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                    />
                    <p className="text-xs text-slate-500">External URL or Supabase Storage link</p>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                    <Label htmlFor="tags" className="text-slate-300">
                        Tags
                    </Label>
                    <Input
                        id="tags"
                        name="tags"
                        type="text"
                        defaultValue={post.tags.join(', ')}
                        placeholder="TagOne, TagTwo, TagThree"
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                    />
                    <p className="text-xs text-slate-500">Comma-separated list of tags</p>
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <Label htmlFor="content" className="text-slate-300">
                        Content (Markdown) <span className="text-rose-400">*</span>
                    </Label>
                    <Textarea
                        id="content"
                        name="content"
                        required
                        rows={20}
                        defaultValue={post.content}
                        placeholder="## Introduction..."
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 resize-y font-mono text-sm"
                    />
                    <p className="text-xs text-slate-500">Supports Markdown formatting</p>
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    {/* Published */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_published"
                            name="is_published"
                            defaultChecked={post.is_published}
                            className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950"
                        />
                        <Label
                            htmlFor="is_published"
                            className="text-slate-400 font-normal cursor-pointer"
                        >
                            Published
                        </Label>
                    </div>

                    {/* Featured */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_featured"
                            name="is_featured"
                            defaultChecked={post.is_featured}
                            className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950"
                        />
                        <Label
                            htmlFor="is_featured"
                            className="text-slate-400 font-normal cursor-pointer"
                        >
                            Feature this post
                        </Label>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-6 border-t border-slate-800">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
