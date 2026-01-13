'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function createBlogPost(formData: FormData) {
    const supabase = await createClient();

    // Extract form data
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const summary = formData.get('summary') as string;
    const content = formData.get('content') as string;
    const cover_image = formData.get('cover_image') as string;
    const tagsRaw = formData.get('tags') as string;
    const is_published = formData.get('is_published') === 'on';
    const is_featured = formData.get('is_featured') === 'on';

    // Validation
    if (!title || !slug || !summary || !content) {
        throw new Error('Title, slug, summary, and content are required');
    }

    // Parse tags (comma separated -> array)
    const tags = tagsRaw
        ? tagsRaw.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [];

    try {
        const { error } = await supabase.from('blog_posts').insert({
            title,
            slug,
            summary,
            content,
            cover_image: cover_image || null,
            tags,
            is_published,
            is_featured,
        });

        if (error) {
            console.error('Error creating blog post:', error);
            throw new Error(`Failed to create blog post: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

    // Revalidate paths
    revalidatePath('/writing/blog');
    revalidatePath('/dashboard/blog');

    // Redirect back to the manager
    redirect('/dashboard/blog');
}

export async function updateBlogPost(id: string, formData: FormData) {
    const supabase = await createClient();

    // Extract form data
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const summary = formData.get('summary') as string;
    const content = formData.get('content') as string;
    const cover_image = formData.get('cover_image') as string;
    const tagsRaw = formData.get('tags') as string;
    const is_published = formData.get('is_published') === 'on';
    const is_featured = formData.get('is_featured') === 'on';

    // Validation
    if (!title || !slug || !summary || !content) {
        throw new Error('Title, slug, summary, and content are required');
    }

    // Parse tags
    const tags = tagsRaw
        ? tagsRaw.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [];

    try {
        const { error } = await supabase
            .from('blog_posts')
            .update({
                title,
                slug,
                summary,
                content,
                cover_image: cover_image || null,
                tags,
                is_published,
                is_featured,
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating blog post:', error);
            throw new Error(`Failed to update blog post: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

    // Revalidate paths
    revalidatePath('/writing/blog');
    revalidatePath('/dashboard/blog');

    redirect('/dashboard/blog');
}

export async function deleteBlogPost(id: string) {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting blog post:', error);
            throw new Error('Failed to delete blog post');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

    // Revalidate paths
    revalidatePath('/writing/blog');
    revalidatePath('/dashboard/blog');
}
