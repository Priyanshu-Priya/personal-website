import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BlogEditForm } from './edit-form';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    cover_image: string | null;
    tags: string[];
    is_published: boolean;
    is_featured: boolean;
}

interface EditBlogPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch blog post data
    const { data: post, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !post) {
        notFound();
    }

    return <BlogEditForm post={post as BlogPost} />;
}
