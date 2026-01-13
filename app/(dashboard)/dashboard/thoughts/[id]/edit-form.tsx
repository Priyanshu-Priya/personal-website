'use client';

import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateThought } from '../actions';

interface Thought {
    id: string;
    content: string;
    mood: string | null;
    is_published: boolean;
}

interface ThoughtEditFormProps {
    thought: Thought;
}

const moodOptions = [
    { value: '', label: 'No mood' },
    { value: 'productive', label: '🚀 Productive' },
    { value: 'pensive', label: '💭 Pensive' },
    { value: 'excited', label: '⚡ Excited' },
    { value: 'frustrated', label: '😤 Frustrated' },
    { value: 'calm', label: '🌊 Calm' },
];

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

export function ThoughtEditForm({ thought }: ThoughtEditFormProps) {
    const updateThoughtWithId = updateThought.bind(null, thought.id);

    return (
        <div className="max-w-2xl mx-auto">
            {/* Back Link */}
            <Link
                href="/dashboard/thoughts"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Thoughts
            </Link>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Edit Thought</h1>
                <p className="text-slate-400 mt-1">
                    Update your fleeting thought.
                </p>
            </div>

            {/* Form */}
            <form action={updateThoughtWithId} className="space-y-6">
                {/* Content */}
                <div className="space-y-2">
                    <Label htmlFor="content" className="text-slate-300">
                        Thought <span className="text-rose-400">*</span>
                    </Label>
                    <Textarea
                        id="content"
                        name="content"
                        required
                        rows={4}
                        defaultValue={thought.content}
                        placeholder="What's on your mind?"
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 resize-y"
                    />
                </div>

                {/* Mood */}
                <div className="space-y-2">
                    <Label htmlFor="mood" className="text-slate-300">
                        Mood
                    </Label>
                    <select
                        id="mood"
                        name="mood"
                        defaultValue={thought.mood || ''}
                        className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        {moodOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Published */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="is_published"
                        name="is_published"
                        defaultChecked={thought.is_published}
                        className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950"
                    />
                    <Label
                        htmlFor="is_published"
                        className="text-slate-400 font-normal cursor-pointer"
                    >
                        Published
                    </Label>
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-4">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
