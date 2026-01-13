import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { BlogDetail } from '@/components/library/blog-detail';

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: post, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error || !post) {
        notFound();
    }

    return <BlogDetail post={post} />;
}
