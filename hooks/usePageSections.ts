'use client';

import { useMemo } from 'react';

export interface PageSection {
    key: string;
    label: string;
    data: Record<string, unknown>;
    fieldCount: number;
}

/**
 * Parses JSON content into organized sections for the editor
 */
export function usePageSections(content: Record<string, unknown>) {
    const sections = useMemo(() => {
        const result: PageSection[] = [];

        for (const [key, value] of Object.entries(content)) {
            // Only treat objects as sections (not primitives at top level)
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                result.push({
                    key,
                    label: formatSectionLabel(key),
                    data: value as Record<string, unknown>,
                    fieldCount: Object.keys(value as object).length,
                });
            }
        }

        // Sort by order field if present
        result.sort((a, b) => {
            const orderA = (a.data.order as number) ?? 999;
            const orderB = (b.data.order as number) ?? 999;
            return orderA - orderB;
        });

        return result;
    }, [content]);

    return sections;
}

/**
 * Formats section key to human-readable label
 * hero_section → "Hero Section"
 * cta_section → "CTA Section"
 */
function formatSectionLabel(key: string): string {
    // Handle common abbreviations
    const abbreviations: Record<string, string> = {
        cta: 'CTA',
        seo: 'SEO',
        api: 'API',
        url: 'URL',
    };

    return key
        .split('_')
        .map((word) => {
            const lower = word.toLowerCase();
            return abbreviations[lower] || word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}
