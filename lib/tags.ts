/**
 * Safely parse the `tags` column which Supabase returns as either:
 *  - null / undefined
 *  - an already-parsed string[]
 *  - a raw JSON string e.g. '["tag1","tag2"]'
 */
export function parseTags(tags: string[] | string | null | undefined): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try { return JSON.parse(tags); } catch { return []; }
}
