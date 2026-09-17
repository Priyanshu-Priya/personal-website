import { FileText, BookMarked, Video, Podcast, MessageCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ResonanceTypeConfig {
    icon: LucideIcon;
    badge: string;
    accent: string;
    bar: string;
    shimmer: string;
}

export const resonanceTypeConfig: Record<string, ResonanceTypeConfig> = {
    article: { icon: FileText,      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', accent: 'border-emerald-500/40', bar: 'bg-emerald-400', shimmer: 'from-emerald-500/5' },
    book:    { icon: BookMarked,    badge: 'bg-amber-500/10  text-amber-400  border-amber-500/20',   accent: 'border-amber-500/40',   bar: 'bg-amber-400',   shimmer: 'from-amber-500/5'   },
    video:   { icon: Video,         badge: 'bg-rose-500/10   text-rose-400   border-rose-500/20',    accent: 'border-rose-500/40',    bar: 'bg-rose-400',    shimmer: 'from-rose-500/5'    },
    podcast: { icon: Podcast,       badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20', accent: 'border-purple-500/40', bar: 'bg-purple-400',  shimmer: 'from-purple-500/5'  },
    tweet:   { icon: MessageCircle, badge: 'bg-sky-500/10    text-sky-400    border-sky-500/20',    accent: 'border-sky-500/40',    bar: 'bg-sky-400',     shimmer: 'from-sky-500/5'    },
};

export const fallbackResonanceType = resonanceTypeConfig.article;
