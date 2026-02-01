import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { BlogDetail } from '@/components/library/blog-detail';

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch the current post
    const { data: post, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error || !post) {
        notFound();
    }

    // Fetch all published posts for navigation (ordered by created_at)
    const { data: allPosts } = await supabase
        .from('blog_posts')
        .select('slug, title, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    // Find current post index and determine prev/next
    let previousPost = null;
    let nextPost = null;

    if (allPosts) {
        const currentIndex = allPosts.findIndex(p => p.slug === slug);

        if (currentIndex > 0) {
            previousPost = {
                slug: allPosts[currentIndex - 1].slug,
                title: allPosts[currentIndex - 1].title
            };
        }

        if (currentIndex < allPosts.length - 1) {
            nextPost = {
                slug: allPosts[currentIndex + 1].slug,
                title: allPosts[currentIndex + 1].title
            };
        }
    }

    return (
        <BlogDetail
            post={post}
            previousPost={previousPost}
            nextPost={nextPost}
        />
    );
}
