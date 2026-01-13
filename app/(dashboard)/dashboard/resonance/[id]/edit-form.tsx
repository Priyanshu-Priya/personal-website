'use client';

import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateResonance } from '../actions';

interface Resonance {
    id: string;
    title: string;
    url: string;
    type: string;
    resonance_score: number;
    commentary: string | null;
}

interface ResonanceEditFormProps {
    entry: Resonance;
}

const typeOptions = [
    { value: 'article', label: '📄 Article' },
    { value: 'book', label: '📚 Book' },
    { value: 'video', label: '🎥 Video' },
    { value: 'podcast', label: '🎙️ Podcast' },
    { value: 'music', label: '🎵 Music' },
    { value: 'other', label: '✨ Other' },
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

export function ResonanceEditForm({ entry }: ResonanceEditFormProps) {
    const updateResonanceWithId = updateResonance.bind(null, entry.id);

    return (
        <div className="max-w-2xl mx-auto">
            {/* Back Link */}
            <Link
                href="/dashboard/resonance"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Resonance
            </Link>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Edit Resonance</h1>
                <p className="text-slate-400 mt-1">
                    Update this curated influence.
                </p>
            </div>

            {/* Form */}
            <form action={updateResonanceWithId} className="space-y-6">
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
                        defaultValue={entry.title}
                        placeholder="Title of the content"
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                    />
                </div>

                {/* URL */}
                <div className="space-y-2">
                    <Label htmlFor="url" className="text-slate-300">
                        URL <span className="text-rose-400">*</span>
                    </Label>
                    <Input
                        id="url"
                        name="url"
                        type="url"
                        required
                        defaultValue={entry.url}
                        placeholder="https://..."
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                    />
                </div>

                {/* Type */}
                <div className="space-y-2">
                    <Label htmlFor="type" className="text-slate-300">
                        Type <span className="text-rose-400">*</span>
                    </Label>
                    <select
                        id="type"
                        name="type"
                        required
                        defaultValue={entry.type}
                        className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        {typeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Resonance Score */}
                <div className="space-y-2">
                    <Label htmlFor="score" className="text-slate-300">
                        Resonance Score <span className="text-rose-400">*</span>
                    </Label>
                    <select
                        id="score"
                        name="score"
                        required
                        defaultValue={entry.resonance_score.toString()}
                        className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        {[1, 2, 3, 4, 5].map((score) => (
                            <option key={score} value={score}>
                                {'●'.repeat(score) + '○'.repeat(5 - score)} ({score}/5)
                            </option>
                        ))}
                    </select>
                </div>

                {/* Commentary */}
                <div className="space-y-2">
                    <Label htmlFor="commentary" className="text-slate-300">
                        Commentary
                    </Label>
                    <Textarea
                        id="commentary"
                        name="commentary"
                        rows={3}
                        defaultValue={entry.commentary || ''}
                        placeholder="Why does this resonate with you?"
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 resize-none"
                    />
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-4">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
