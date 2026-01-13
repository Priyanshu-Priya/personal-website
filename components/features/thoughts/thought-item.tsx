'use client';

import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ThoughtItemProps {
    content: string;
    mood: string | null;
    created_at: string;
}

const moodStyles: Record<string, string> = {
    contemplative: 'bg-indigo-500/10 text-indigo-400',
    excited: 'bg-amber-500/10 text-amber-400',
    frustrated: 'bg-rose-500/10 text-rose-400',
    grateful: 'bg-emerald-500/10 text-emerald-400',
    curious: 'bg-sky-500/10 text-sky-400',
    focused: 'bg-violet-500/10 text-violet-400',
};

export function ThoughtItem({ content, mood, created_at }: ThoughtItemProps) {
    const formattedDate = format(new Date(created_at), 'MMM d, h:mm a');

    return (
        <article className="group py-6">
            {/* Content */}
            <p className="text-white leading-relaxed whitespace-pre-wrap">{content}</p>

            {/* Metadata */}
            <div className="flex items-center gap-3 mt-4">
                <time className="text-sm text-slate-500 font-mono">{formattedDate}</time>
                {mood && (
                    <span
                        className={cn(
                            'text-xs px-2 py-0.5 rounded-full font-medium capitalize',
                            moodStyles[mood] || 'bg-slate-800 text-slate-400'
                        )}
                    >
                        {mood}
                    </span>
                )}
            </div>
        </article>
    );
}
