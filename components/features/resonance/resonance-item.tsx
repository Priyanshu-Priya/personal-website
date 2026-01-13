'use client';

import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResonanceItemProps {
    title: string;
    url: string;
    type: 'article' | 'book' | 'video' | 'podcast' | 'tweet';
    commentary: string | null;
    resonance_score: number;
    created_at: string;
}

const typeStyles: Record<string, string> = {
    article: 'bg-indigo-500/10 text-indigo-400',
    book: 'bg-amber-500/10 text-amber-400',
    video: 'bg-rose-500/10 text-rose-400',
    podcast: 'bg-emerald-500/10 text-emerald-400',
    tweet: 'bg-sky-500/10 text-sky-400',
};

function ResonanceScore({ score }: { score: number }) {
    return (
        <div className="flex gap-1" aria-label={`Resonance score: ${score} out of 5`}>
            {[1, 2, 3, 4, 5].map((dot) => (
                <span
                    key={dot}
                    className={cn(
                        'w-2 h-2 rounded-full transition-colors',
                        dot <= score ? 'bg-indigo-500' : 'bg-slate-700'
                    )}
                />
            ))}
        </div>
    );
}

export function ResonanceItem({
    title,
    url,
    type,
    commentary,
    resonance_score,
}: ResonanceItemProps) {
    return (
        <article className="group relative">
            {/* Timeline dot */}
            <div className="absolute left-0 top-2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-700 group-hover:border-indigo-500 transition-colors" />

            <div className="pl-8">
                {/* Header */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span
                        className={cn(
                            'text-xs px-2 py-0.5 rounded-full font-medium capitalize',
                            typeStyles[type] || 'bg-slate-800 text-slate-400'
                        )}
                    >
                        {type}
                    </span>
                    <ResonanceScore score={resonance_score} />
                </div>

                {/* Title Link */}
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-lg font-medium text-white hover:text-indigo-400 transition-colors"
                >
                    {title}
                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>

                {/* Commentary */}
                {commentary && (
                    <p className="mt-3 text-slate-400 leading-relaxed">{commentary}</p>
                )}
            </div>
        </article>
    );
}
