'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function createThought(formData: FormData) {
    const supabase = await createClient();

    // Extract form data
    const content = formData.get('content') as string;
    const mood = formData.get('mood') as string;
    // Checkbox returns 'on' if checked, null if not
    const is_published = formData.get('is_published') === 'on';

    // Validation
    if (!content || content.trim().length === 0) {
        throw new Error('Content is required');
    }

    try {
        const { error } = await supabase.from('thoughts').insert({
            content: content.trim(),
            mood: mood || null,
            is_published,
        });

        if (error) {
            console.error('Error creating thought:', error);
            throw new Error('Failed to create thought');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

    // Revalidate paths
    revalidatePath('/writing/thoughts');
    revalidatePath('/dashboard/thoughts');

    // Redirect back to the manager
    redirect('/dashboard/thoughts');
}

export async function deleteThought(id: string) {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from('thoughts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting thought:', error);
            throw new Error('Failed to delete thought');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

    // Revalidate paths
    revalidatePath('/writing/thoughts');
    revalidatePath('/dashboard/thoughts');
}

export async function updateThought(id: string, formData: FormData) {
    const supabase = await createClient();

    // Extract form data
    const content = formData.get('content') as string;
    const mood = formData.get('mood') as string;
    const is_published = formData.get('is_published') === 'on';

    // Validation
    if (!content || content.trim().length === 0) {
        throw new Error('Content is required');
    }

    try {
        const { error } = await supabase
            .from('thoughts')
            .update({
                content: content.trim(),
                mood: mood || null,
                is_published,
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating thought:', error);
            throw new Error('Failed to update thought');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

    // Revalidate paths
    revalidatePath('/writing/thoughts');
    revalidatePath('/dashboard/thoughts');

    redirect('/dashboard/thoughts');
}
