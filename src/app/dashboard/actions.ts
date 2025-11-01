'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/supabase';

type BrandInsert = Database['public']['Tables']['brands']['Insert'];
type BrandUpdate = Database['public']['Tables']['brands']['Update'];

// --- CREATE BRAND ---
export async function createBrand(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in to create a brand.' };
  
  const rawFormData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    primary_color: formData.get('primary_color') as string,
    secondary_color: formData.get('secondary_color') as string,
    font: formData.get('font') as string,
    website_url: formData.get('website_url') as string,
    logoFile: formData.get('logo_url') as File,
  };

  let logo_url: string | null = null;
  
  if (rawFormData.logoFile && rawFormData.logoFile.size > 0) {
    const filePath = `${user.id}/${Date.now()}_${rawFormData.logoFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('brand_logos')
      .upload(filePath, rawFormData.logoFile);
    
    if (uploadError) return { error: `Storage Error: ${uploadError.message}` };
    
    logo_url = supabase.storage.from('brand_logos').getPublicUrl(filePath).data.publicUrl;
  }
  
  const brandData: BrandInsert = {
    name: rawFormData.name,
    description: rawFormData.description,
    primary_color: rawFormData.primary_color,
    secondary_color: rawFormData.secondary_color,
    font: rawFormData.font,
    website_url: rawFormData.website_url,
    logo_url: logo_url,
    user_id: user.id,
  };

  const { error } = await supabase.from('brands').insert(brandData);
  if (error) return { error: `Database Error: ${error.message}` };

  revalidatePath('/dashboard');
  return { success: true };
}


// --- UPDATE BRAND ---
export async function updateBrand(brandId: string, formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'You must be logged in to update a brand.' };
    
    const { data: currentBrand, error: fetchError } = await supabase.from('brands').select('logo_url').eq('id', brandId).single();
    if(fetchError) return { error: `Could not fetch current brand: ${fetchError.message}`};
    
    const rawFormData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        primary_color: formData.get('primary_color') as string,
        secondary_color: formData.get('secondary_color') as string,
        font: formData.get('font') as string,
        website_url: formData.get('website_url') as string,
        logoFile: formData.get('logo_url') as File,
    };

    let logo_url: string | null = currentBrand.logo_url;

    if (rawFormData.logoFile && rawFormData.logoFile.size > 0) {
        const filePath = `${user.id}/${Date.now()}_${rawFormData.logoFile.name}`;
        const { error: uploadError } = await supabase.storage
        .from('brand_logos')
        .upload(filePath, rawFormData.logoFile);
        
        if (uploadError) return { error: `Storage Error: ${uploadError.message}` };
        
        logo_url = supabase.storage.from('brand_logos').getPublicUrl(filePath).data.publicUrl;
    }

    const brandData: BrandUpdate = {
        name: rawFormData.name,
        description: rawFormData.description,
        primary_color: rawFormData.primary_color,
        secondary_color: rawFormData.secondary_color,
        font: rawFormData.font,
        website_url: rawFormData.website_url,
        logo_url: logo_url,
    };
    
    const { error } = await supabase.from('brands').update(brandData).eq('id', brandId);
    if (error) return { error: `Database Error: ${error.message}` };
    
    revalidatePath('/dashboard');
    revalidatePath(`/brand/${brandId}`);
    return { success: true };
}


// --- DELETE BRAND ---
export async function deleteBrand(brandId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'You must be logged in to delete a brand.' };
    
    // First, delete all associated assets from storage
    const { data: assets, error: assetsError } = await supabase
        .from('assets')
        .select('file_path')
        .eq('brand_id', brandId);

    if (assetsError) return { error: `Could not fetch assets for deletion: ${assetsError.message}`};

    if (assets && assets.length > 0) {
        const filePaths = assets.map(a => a.file_path);
        const { error: storageError } = await supabase.storage.from('brand_assets').remove(filePaths);
        if (storageError) console.error("Non-critical error deleting assets from storage:", storageError.message);
    }

    // Then, delete the brand record (DB cascade should handle related table rows)
    const { error } = await supabase.from('brands').delete().eq('id', brandId);
    if (error) return { error: `Database Error: ${error.message}` };

    revalidatePath('/dashboard');
    return { success: true };
}
