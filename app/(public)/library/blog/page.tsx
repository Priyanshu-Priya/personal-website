import { createClient } from '@/lib/supabase/server';
import { BlogList } from '@/components/library/blog-list';

export default async function BlogPage() {
    const supabase = await createClient();

    const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, summary, cover_image, tags, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching blog posts:', error);
    }

    return <BlogList posts={posts || []} />;
}
