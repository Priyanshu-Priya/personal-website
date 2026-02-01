'use client';

import { useFormStatus } from 'react-dom';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreatableSelect } from '@/components/ui/creatable-select';
import { Switch } from '@/components/ui/switch';
import { updateProject } from '../actions';
import { PROJECT_TYPE_OPTIONS, PROJECT_STATUS_OPTIONS, PROJECT_ROLE_OPTIONS } from '@/types/project';

interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string | null;
    tech_stack: string[];
    github_url: string | null;
    live_url: string | null;
    demo_url: string | null;
    docs_url: string | null;
    linkedin_post_url: string | null;
    thumbnail_url: string | null;
    is_featured: boolean;
    is_published: boolean;
    working_on: boolean;
    created_at: string;
    project_type: string | null;
    status: string | null;
    role: string | null;
    display_date: string | null;
}

interface ProjectEditFormProps {
    project: Project;
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

export function ProjectEditForm({ project }: ProjectEditFormProps) {
    const [preview, setPreview] = useState<string | null>(project.thumbnail_url);
    const [removeThumbnail, setRemoveThumbnail] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                setRemoveThumbnail(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setPreview(null);
        setRemoveThumbnail(true);
        const input = document.getElementById('thumbnail') as HTMLInputElement;
        if (input) input.value = '';
    };

    // Bind project ID to the update action
    const updateProjectWithId = updateProject.bind(null, project.id);

    return (
        <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link
                href="/dashboard/projects"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
            </Link>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Edit Project</h1>
                <p className="text-slate-400 mt-1">
                    Update project details and save changes.
                </p>
            </div>

            {/* Form */}
            <form action={updateProjectWithId} className="space-y-8">
                {/* Hidden field for remove thumbnail flag */}
                <input type="hidden" name="remove_thumbnail" value={removeThumbnail ? 'true' : 'false'} />

                {/* ===== SECTION: Basic Info ===== */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
                        Basic Information
                    </h2>

                    {/* Title & Slug Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-slate-300">
                                Title <span className="text-rose-400">*</span>
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                required
                                defaultValue={project.title}
                                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug" className="text-slate-300">
                                Slug <span className="text-rose-400">*</span>
                            </Label>
                            <Input
                                id="slug"
                                name="slug"
                                type="text"
                                required
                                defaultValue={project.slug}
                                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                            />
                        </div>
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
                            maxLength={150}
                            defaultValue={project.summary}
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 resize-none"
                        />
                    </div>

                    {/* Content/Description */}
                    <div className="space-y-2">
                        <Label htmlFor="content" className="text-slate-300">
                            Description <span className="text-slate-500">(Markdown supported)</span>
                        </Label>
                        <Textarea
                            id="content"
                            name="content"
                            rows={6}
                            defaultValue={project.content || ''}
                            placeholder="Write a detailed description..."
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 resize-none"
                        />
                    </div>

                    {/* Type, Status, Role Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="project_type" className="text-slate-300">
                                Project Type
                            </Label>
                            <CreatableSelect
                                name="project_type"
                                value={project.project_type || ''}
                                options={PROJECT_TYPE_OPTIONS.map(opt => ({ value: opt, label: opt }))}
                                placeholder="Select or type..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-slate-300">
                                Status
                            </Label>
                            <CreatableSelect
                                name="status"
                                value={project.status || 'Completed'}
                                options={PROJECT_STATUS_OPTIONS.map(opt => ({ value: opt, label: opt }))}
                                placeholder="Select or type..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-slate-300">
                                Role
                            </Label>
                            <CreatableSelect
                                name="role"
                                value={project.role || ''}
                                options={PROJECT_ROLE_OPTIONS.map(opt => ({ value: opt, label: opt }))}
                                placeholder="Select or type..."
                            />
                        </div>
                    </div>

                    {/* Display Date & Tech Stack */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="display_date" className="text-slate-300">
                                Project Date
                            </Label>
                            <Input
                                id="display_date"
                                name="display_date"
                                type="date"
                                defaultValue={project.display_date ? new Date(project.display_date).toISOString().split('T')[0] : ''}
                                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tech_stack" className="text-slate-300">
                                Tech Stack
                            </Label>
                            <Input
                                id="tech_stack"
                                name="tech_stack"
                                type="text"
                                defaultValue={project.tech_stack.join(', ')}
                                placeholder="Next.js, Supabase, TailwindCSS"
                                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* ===== SECTION: Links ===== */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
                        Links
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="github_url" className="text-slate-300">
                                GitHub URL
                            </Label>
                            <Input
                                id="github_url"
                                name="github_url"
                                type="url"
                                defaultValue={project.github_url || ''}
                                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="live_url" className="text-slate-300">
                                Live URL
                            </Label>
                            <Input
                                id="live_url"
                                name="live_url"
                                type="url"
                                defaultValue={project.live_url || ''}
                                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="demo_url" className="text-slate-300">
                                Demo URL
                            </Label>
                            <Input
                                id="demo_url"
                                name="demo_url"
                                type="url"
                                defaultValue={project.demo_url || ''}
                                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="docs_url" className="text-slate-300">
                                Documentation URL
                            </Label>
                            <Input
                                id="docs_url"
                                name="docs_url"
                                type="url"
                                defaultValue={project.docs_url || ''}
                                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="linkedin_post_url" className="text-slate-300">
                                LinkedIn Post URL
                            </Label>
                            <Input
                                id="linkedin_post_url"
                                name="linkedin_post_url"
                                type="url"
                                defaultValue={project.linkedin_post_url || ''}
                                placeholder="https://linkedin.com/posts/..."
                                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* ===== SECTION: Thumbnail ===== */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
                        Thumbnail
                    </h2>

                    <div className="space-y-4">
                        {preview ? (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-800">
                                <Image
                                    src={preview}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label
                                htmlFor="thumbnail"
                                className="flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed border-slate-700 hover:border-slate-600 cursor-pointer transition-colors bg-slate-900/50"
                            >
                                <Upload className="w-8 h-8 text-slate-500 mb-2" />
                                <span className="text-sm text-slate-400">Click to upload image</span>
                            </label>
                        )}
                        <input
                            id="thumbnail"
                            name="thumbnail"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* ===== SECTION: Settings ===== */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
                        Settings
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <Switch
                                id="is_featured"
                                name="is_featured"
                                defaultChecked={project.is_featured}
                            />
                            <Label
                                htmlFor="is_featured"
                                className="text-slate-400 font-normal cursor-pointer"
                            >
                                Feature this project
                            </Label>
                        </div>

                        <div className="flex items-center gap-3">
                            <Switch
                                id="is_published"
                                name="is_published"
                                defaultChecked={project.is_published}
                            />
                            <Label
                                htmlFor="is_published"
                                className="text-slate-400 font-normal cursor-pointer"
                            >
                                Publish project
                            </Label>
                        </div>

                        {/* Working On */}
                        <div className="flex items-center gap-3 sm:col-span-2">
                            <Switch
                                id="working_on"
                                name="working_on"
                                defaultChecked={project.working_on}
                            />
                            <Label
                                htmlFor="working_on"
                                className="text-slate-400 font-normal cursor-pointer"
                            >
                                Mark as &quot;Working On&quot; (Show on Now page)
                            </Label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="created_at" className="text-slate-300">
                            Created Date
                        </Label>
                        <Input
                            id="created_at"
                            name="created_at"
                            type="datetime-local"
                            defaultValue={project.created_at ? new Date(project.created_at).toISOString().slice(0, 16) : ''}
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-4 border-t border-slate-800">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
