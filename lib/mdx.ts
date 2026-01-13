import { posts } from '@/.velite';
import type { Post } from '@/.velite';

// Environment check for filtering unpublished posts
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Get all published posts sorted by date (newest first)
 */
export function getAllPosts(): Post[] {
    return posts
        .filter((post) => (isProduction ? post.published : true))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug: string): Post | undefined {
    return posts.find(
        (post) => post.slug === slug && (isProduction ? post.published : true)
    );
}

/**
 * Get recent posts with a limit
 */
export function getRecentPosts(limit: number = 5): Post[] {
    return getAllPosts().slice(0, limit);
}

/**
 * Get all unique tags from posts
 */
export function getAllTags(): string[] {
    const tags = posts
        .filter((post) => (isProduction ? post.published : true))
        .flatMap((post) => post.tags ?? []);
    return [...new Set(tags)].sort();
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): Post[] {
    return getAllPosts().filter((post) => post.tags?.includes(tag));
}

/**
 * Get all post slugs for static generation
 */
export function getAllPostSlugs(): { slug: string }[] {
    return posts
        .filter((post) => (isProduction ? post.published : true))
        .map((post) => ({ slug: post.slug }));
}
