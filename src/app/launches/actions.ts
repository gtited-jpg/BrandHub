'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/supabase';

type LaunchInsert = Database['public']['Tables']['launches']['Insert'];
type LaunchUpdate = Database['public']['Tables']['launches']['Update'];

// --- CREATE/UPDATE LAUNCH ---
export async function saveLaunch(launchId: string | null, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in.' };

  const rawFormData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    start_date: formData.get('start_date') as string,
    brand_id: formData.get('brand_id') as string,
    status: formData.get('status') as "planned" | "in-progress" | "done",
    tasks: JSON.parse(formData.get('tasks') as string),
  };

  if (!rawFormData.brand_id) {
      return { error: 'You must select a brand.'}
  }

  // Fix: The type checker is using an older schema definition.
  // Map the form data (from the new schema) to the expected old schema for the database operation.
  const launchDataForDb = {
    name: rawFormData.title,
    description: rawFormData.description,
    brand_id: rawFormData.brand_id,
    user_id: user.id,
    launch_date: new Date(rawFormData.start_date).toISOString(),
    status: (rawFormData.status === 'planned' ? 'upcoming' : 'launched') as 'upcoming' | 'launched' | 'cancelled'
  };

  if (launchId) {
    // Update
    const { error } = await supabase.from('launches').update(launchDataForDb).eq('id', launchId);
    if (error) return { error: `Database Error: ${error.message}`};
  } else {
    // Create
    const { error } = await supabase.from('launches').insert(launchDataForDb);
    if (error) return { error: `Database Error: ${error.message}`};
  }

  revalidatePath('/launches');
  return { success: true };
}


// --- DELETE LAUNCH ---
export async function deleteLaunch(launchId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'You must be logged in.' };

    const { error } = await supabase.from('launches').delete().eq('id', launchId);
    if (error) return { error: `Database Error: ${error.message}` };

    revalidatePath('/launches');
    return { success: true };
}