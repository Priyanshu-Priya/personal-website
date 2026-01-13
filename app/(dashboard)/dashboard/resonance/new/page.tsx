'use client';

import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { createResonance } from '../actions';

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
                'Save Entry'
            )}
        </Button>
    );
}

export default function NewResonancePage() {
    return (
        <div className="max-w-2xl mx-auto">
            {/* Back Link */}
            <Link
                href="/dashboard/resonance"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Library
            </Link>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Add New Entry</h1>
                <p className="text-slate-400 mt-1">
                    Add a new article, book, or video to your resonance library.
                </p>
            </div>

            {/* Form */}
            <form action={createResonance} className="space-y-6">
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
                        placeholder="The article or book title"
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
                        placeholder="https://..."
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                    />
                </div>

                {/* Type and Score Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Type */}
                    <div className="space-y-2">
                        <Label htmlFor="type" className="text-slate-300">
                            Type <span className="text-rose-400">*</span>
                        </Label>
                        <Select name="type" required defaultValue="article">
                            <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                <SelectItem value="article">Article</SelectItem>
                                <SelectItem value="book">Book</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="podcast">Podcast</SelectItem>
                                <SelectItem value="tool">Tool</SelectItem>
                                <SelectItem value="tweet">Tweet</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Score */}
                    <div className="space-y-2">
                        <Label htmlFor="score" className="text-slate-300">
                            Resonance Score <span className="text-rose-400">*</span>
                        </Label>
                        <Select name="score" required defaultValue="3">
                            <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                                <SelectValue placeholder="Select score" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                <SelectItem value="1">1 — Interesting</SelectItem>
                                <SelectItem value="2">2 — Noteworthy</SelectItem>
                                <SelectItem value="3">3 — Valuable</SelectItem>
                                <SelectItem value="4">4 — Essential</SelectItem>
                                <SelectItem value="5">5 — Life-changing</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Commentary */}
                <div className="space-y-2">
                    <Label htmlFor="commentary" className="text-slate-300">
                        Commentary
                    </Label>
                    <Textarea
                        id="commentary"
                        name="commentary"
                        rows={4}
                        placeholder="What resonated with you? Your personal take..."
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
