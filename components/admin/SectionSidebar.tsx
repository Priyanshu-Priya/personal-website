'use client';

import { cn } from '@/lib/utils';
import { Circle, Check } from 'lucide-react';
import type { PageSection } from '@/hooks/usePageSections';

interface SectionSidebarProps {
    sections: PageSection[];
    activeSection: string;
    onSectionChange: (sectionKey: string) => void;
    modifiedSections?: Set<string>;
}

export function SectionSidebar({
    sections,
    activeSection,
    onSectionChange,
    modifiedSections = new Set(),
}: SectionSidebarProps) {
    return (
        <nav className="lg:sticky lg:top-24 flex flex-wrap lg:flex-col lg:flex-nowrap gap-2 lg:gap-1 pb-4 lg:pb-0">
            <p className="hidden lg:block text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 px-3">
                Sections
            </p>
            {sections.map((section) => {
                const isActive = section.key === activeSection;
                const isModified = modifiedSections.has(section.key);

                return (
                    <button
                        key={section.key}
                        onClick={() => onSectionChange(section.key)}
                        className={cn(
                            'shrink-0 flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 border',
                            isActive
                                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800/50'
                        )}
                    >
                        {/* Modified indicator */}
                        <div className="shrink-0">
                            {isModified ? (
                                <Circle className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" />
                            ) : isActive ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                            ) : (
                                <div className="w-2.5 h-2.5 rounded-full border border-slate-600" />
                            )}
                        </div>

                        {/* Section name */}
                        <div className="flex-1 min-w-0">
                            <p className={cn(
                                'text-sm font-medium whitespace-nowrap lg:whitespace-normal',
                                isActive ? 'text-indigo-300' : 'text-slate-300'
                            )}>
                                {section.label}
                            </p>
                            <p className="hidden lg:block text-xs text-slate-500 truncate">
                                {section.fieldCount} fields
                            </p>
                        </div>

                        {/* Check mark for modified */}
                        {isModified && (
                            <Check className="hidden lg:block w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                    </button>
                );
            })}
        </nav>
    );
}
