'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function createResonance(formData: FormData) {
    const supabase = await createClient();

    // Extract form data
    const title = formData.get('title') as string;
    const url = formData.get('url') as string;
    const type = formData.get('type') as string;
    const resonance_score = parseInt(formData.get('score') as string, 10);
    const commentary = formData.get('commentary') as string;

    // Validation
    if (!title || !url || !type || !resonance_score) {
        throw new Error('Missing required fields');
    }

    try {
        const { error } = await supabase.from('resonance').insert({
            title,
            url,
            type,
            resonance_score,
            commentary: commentary || null,
        });

        if (error) {
            console.error('Error creating resonance:', error);
            throw new Error('Failed to create resonance entry');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

    // Revalidate the public resonance page
    revalidatePath('/resonance');
    revalidatePath('/dashboard/resonance');

    // Redirect back to the manager
    redirect('/dashboard/resonance');
}

export async function deleteResonance(id: string) {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from('resonance')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting resonance:', error);
            throw new Error('Failed to delete resonance entry');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

    // Revalidate paths
    revalidatePath('/resonance');
    revalidatePath('/dashboard/resonance');
}

export async function updateResonance(id: string, formData: FormData) {
    const supabase = await createClient();

    // Extract form data
    const title = formData.get('title') as string;
    const url = formData.get('url') as string;
    const type = formData.get('type') as string;
    const resonance_score = parseInt(formData.get('score') as string, 10);
    const commentary = formData.get('commentary') as string;

    // Validation
    if (!title || !url || !type || !resonance_score) {
        throw new Error('Missing required fields');
    }

    try {
        const { error } = await supabase
            .from('resonance')
            .update({
                title,
                url,
                type,
                resonance_score,
                commentary: commentary || null,
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating resonance:', error);
            throw new Error('Failed to update resonance entry');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

    // Revalidate paths
    revalidatePath('/resonance');
    revalidatePath('/dashboard/resonance');

    redirect('/dashboard/resonance');
}
