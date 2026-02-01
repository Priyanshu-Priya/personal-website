'use client';

import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CreatableSelect } from '@/components/ui/creatable-select';
import { createThought } from '../actions';

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
                    Posting...
                </>
            ) : (
                'Post Thought'
            )}
        </Button>
    );
}

export default function NewThoughtPage() {
    return (
        <div className="max-w-2xl mx-auto">
            {/* Back Link */}
            <Link
                href="/dashboard/thoughts"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Stream
            </Link>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">New Thought</h1>
                <p className="text-slate-400 mt-1">
                    Capture a fleeting observation or half-formed idea.
                </p>
            </div>

            {/* Form */}
            <form action={createThought} className="space-y-6">
                {/* Content */}
                <div className="space-y-2">
                    <Label htmlFor="content" className="text-slate-300">
                        What's on your mind? <span className="text-rose-400">*</span>
                    </Label>
                    <Textarea
                        id="content"
                        name="content"
                        required
                        rows={6}
                        placeholder="A thought, an observation, a question..."
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 resize-none text-lg leading-relaxed"
                    />
                </div>

                {/* Mood and Published Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Mood */}
                    <div className="space-y-2">
                        <Label htmlFor="mood" className="text-slate-300">
                            Mood
                        </Label>
                        <CreatableSelect
                            name="mood"
                            placeholder="Select or type a mood..."
                            options={[
                                { value: 'Productive', label: '🚀 Productive' },
                                { value: 'Pensive', label: '💭 Pensive' },
                                { value: 'Excited', label: '⚡ Excited' },
                                { value: 'Frustrated', label: '😤 Frustrated' },
                                { value: 'Calm', label: '🌊 Calm' },
                                { value: 'Curious', label: '🤔 Curious' },
                                { value: 'Grateful', label: '🙏 Grateful' },
                                { value: 'Tired', label: '😴 Tired' },
                            ]}
                        />
                    </div>

                    {/* Published Checkbox */}
                    <div className="space-y-2">
                        <Label className="text-slate-300">Visibility</Label>
                        <div className="flex items-center gap-3 h-10">
                            <input
                                type="checkbox"
                                id="is_published"
                                name="is_published"
                                defaultChecked
                                className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950"
                            />
                            <Label
                                htmlFor="is_published"
                                className="text-slate-400 font-normal cursor-pointer"
                            >
                                Publish immediately
                            </Label>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-4">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
