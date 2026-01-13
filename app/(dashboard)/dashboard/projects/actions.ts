'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
}

export async function createProject(formData: FormData) {
    const supabase = await createClient();

    // Extract form data
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const summary = formData.get('summary') as string;
    const content = formData.get('content') as string;
    const techStackRaw = formData.get('tech_stack') as string;
    const github_url = formData.get('github_url') as string;
    const live_url = formData.get('live_url') as string;
    const demo_url = formData.get('demo_url') as string;
    const docs_url = formData.get('docs_url') as string;
    const linkedin_post_url = formData.get('linkedin_post_url') as string;
    const is_featured = formData.get('is_featured') === 'on';
    const is_published = formData.get('is_published') === 'on';
    const thumbnail = formData.get('thumbnail') as File | null;
    const created_at_raw = formData.get('created_at') as string;
    const project_type = formData.get('project_type') as string;
    const status = formData.get('status') as string;
    const role = formData.get('role') as string;
    const display_date = formData.get('display_date') as string;

    // Validation
    if (!title || !slug || !summary) {
        throw new Error('Title, slug, and summary are required');
    }

    // Parse tech stack (comma separated -> array)
    const tech_stack = techStackRaw
        ? techStackRaw.split(',').map((tech) => tech.trim()).filter(Boolean)
        : [];

    let thumbnail_url: string | null = null;

    // Handle image upload
    if (thumbnail && thumbnail.size > 0) {
        const filename = generateUniqueFilename(thumbnail.name);
        const filePath = `projects/${filename}`;

        const { error: uploadError } = await supabase.storage
            .from('project-images')
            .upload(filePath, thumbnail, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw new Error('Failed to upload image');
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('project-images')
            .getPublicUrl(filePath);

        thumbnail_url = urlData.publicUrl;
    }

    try {
        const insertData: Record<string, unknown> = {
            title,
            slug,
            summary,
            content: content || null,
            tech_stack,
            github_url: github_url || null,
            live_url: live_url || null,
            demo_url: demo_url || null,
            docs_url: docs_url || null,
            linkedin_post_url: linkedin_post_url || null,
            thumbnail_url,
            is_featured,
            is_published,
            project_type: project_type || null,
            status: status || 'Completed',
            role: role || null,
            display_date: display_date || null,
        };

        // Only include created_at if user provided a custom date
        if (created_at_raw) {
            insertData.created_at = new Date(created_at_raw).toISOString();
        }

        const { error } = await supabase.from('projects').insert(insertData);

        if (error) {
            console.error('Error creating project:', error);
            throw new Error(`Failed to create project: ${error.message} (Code: ${error.code})`);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

    // Revalidate paths
    revalidatePath('/work/projects');
    revalidatePath('/dashboard/projects');

    // Redirect back to the manager
    redirect('/dashboard/projects');
}

export async function deleteProject(id: string) {
    const supabase = await createClient();

    try {
        // First, get the project to find its thumbnail
        const { data: project } = await supabase
            .from('projects')
            .select('thumbnail_url')
            .eq('id', id)
            .single();

        // Delete the image from storage if it exists
        if (project?.thumbnail_url) {
            const urlParts = project.thumbnail_url.split('/project-images/');
            if (urlParts[1]) {
                await supabase.storage
                    .from('project-images')
                    .remove([urlParts[1]]);
            }
        }

        // Delete the project record
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting project:', error);
            throw new Error('Failed to delete project');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

    // Revalidate paths
    revalidatePath('/work/projects');
    revalidatePath('/dashboard/projects');
}

export async function updateProject(id: string, formData: FormData) {
    const supabase = await createClient();

    // Extract form data
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const summary = formData.get('summary') as string;
    const content = formData.get('content') as string;
    const techStackRaw = formData.get('tech_stack') as string;
    const github_url = formData.get('github_url') as string;
    const live_url = formData.get('live_url') as string;
    const demo_url = formData.get('demo_url') as string;
    const docs_url = formData.get('docs_url') as string;
    const linkedin_post_url = formData.get('linkedin_post_url') as string;
    const is_featured = formData.get('is_featured') === 'on';
    const is_published = formData.get('is_published') === 'on';
    const thumbnail = formData.get('thumbnail') as File | null;
    const remove_thumbnail = formData.get('remove_thumbnail') === 'true';
    const created_at_raw = formData.get('created_at') as string;
    const project_type = formData.get('project_type') as string;
    const status = formData.get('status') as string;
    const role = formData.get('role') as string;
    const display_date = formData.get('display_date') as string;

    // Validation
    if (!title || !slug || !summary) {
        throw new Error('Title, slug, and summary are required');
    }

    // Parse tech stack (comma separated -> array)
    const tech_stack = techStackRaw
        ? techStackRaw.split(',').map((tech) => tech.trim()).filter(Boolean)
        : [];

    // Get current project to check existing thumbnail
    const { data: currentProject } = await supabase
        .from('projects')
        .select('thumbnail_url')
        .eq('id', id)
        .single();

    let thumbnail_url: string | null = currentProject?.thumbnail_url || null;

    // Handle image removal
    if (remove_thumbnail && currentProject?.thumbnail_url) {
        const urlParts = currentProject.thumbnail_url.split('/project-images/');
        if (urlParts[1]) {
            await supabase.storage
                .from('project-images')
                .remove([urlParts[1]]);
        }
        thumbnail_url = null;
    }

    // Handle new image upload
    if (thumbnail && thumbnail.size > 0) {
        // Delete old image if exists
        if (currentProject?.thumbnail_url) {
            const urlParts = currentProject.thumbnail_url.split('/project-images/');
            if (urlParts[1]) {
                await supabase.storage
                    .from('project-images')
                    .remove([urlParts[1]]);
            }
        }

        const filename = generateUniqueFilename(thumbnail.name);
        const filePath = `projects/${filename}`;

        const { error: uploadError } = await supabase.storage
            .from('project-images')
            .upload(filePath, thumbnail, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw new Error('Failed to upload image');
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('project-images')
            .getPublicUrl(filePath);

        thumbnail_url = urlData.publicUrl;
    }

    try {
        const updateData: Record<string, unknown> = {
            title,
            slug,
            summary,
            content: content || null,
            tech_stack,
            github_url: github_url || null,
            live_url: live_url || null,
            demo_url: demo_url || null,
            docs_url: docs_url || null,
            linkedin_post_url: linkedin_post_url || null,
            thumbnail_url,
            is_featured,
            is_published,
            project_type: project_type || null,
            status: status || 'Completed',
            role: role || null,
            display_date: display_date || null,
        };

        // Include created_at if user provided it
        if (created_at_raw) {
            updateData.created_at = new Date(created_at_raw).toISOString();
        }

        const { error } = await supabase
            .from('projects')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error('Error updating project:', error);
            throw new Error(`Failed to update project: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

    // Revalidate paths
    revalidatePath('/work/projects');
    revalidatePath(`/work/projects/${slug}`);
    revalidatePath('/dashboard/projects');

    // Redirect back
    redirect('/dashboard/projects');
}
