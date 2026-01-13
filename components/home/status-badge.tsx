'use client';

import { format } from 'date-fns';
import { FadeIn } from '@/components/ui/fade-in';

interface StatusBadgeProps {
    thought: {
        content: string;
        mood: string | null;
        created_at: string;
    } | null;
}

export function StatusBadge({ thought }: StatusBadgeProps) {
    if (!thought) {
        return null;
    }

    // Truncate to ~80 chars
    const truncatedContent =
        thought.content.length > 80
            ? thought.content.slice(0, 80) + '...'
            : thought.content;

    return (
        <FadeIn delay={0.4}>
            <div className="inline-flex items-start gap-3 px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl max-w-lg">
                {/* Pulsing dot */}
                <div className="relative mt-1.5 flex-shrink-0">
                    <span className="absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 leading-relaxed">
                        {truncatedContent}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <time className="text-xs text-slate-500 font-mono">
                            {format(new Date(thought.created_at), 'MMM d, h:mm a')}
                        </time>
                        {thought.mood && (
                            <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full capitalize">
                                {thought.mood}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </FadeIn>
    );
}
