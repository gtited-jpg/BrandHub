'use client';

import { useState, useEffect, useTransition } from 'react';
import { createBrand, updateBrand } from '@/app/dashboard/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Spinner from '@/components/ui/Spinner';
import { CardTitle, CardDescription } from '@/components/ui/Card';
import type { Database } from '@/types/supabase';

type Brand = Database['public']['Tables']['brands']['Row'];

interface BrandFormProps {
  brandToEdit: Brand | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function BrandForm({ brandToEdit, onSave, onCancel }: BrandFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(brandToEdit?.logo_url || null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
        const result = brandToEdit 
            ? await updateBrand(brandToEdit.id, formData)
            : await createBrand(formData);
        
        if (result?.error) {
            setError(result.error);
        } else {
            onSave();
        }
    });
  };

  return (
    <>
    <div className="text-center mb-6">
        <CardTitle>{brandToEdit ? 'Edit Brand' : 'Create New Brand'}</CardTitle>
        <CardDescription>{brandToEdit ? 'Update your brand details below.' : 'Add a new brand to your universe.'}</CardDescription>
    </div>
    <form action={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
            <div className="w-20 h-20 flex-shrink-0">
                <label htmlFor="logo_url" className="cursor-pointer block w-full h-full rounded-lg bg-slate-800 border-2 border-dashed border-slate-600 hover:border-primary transition-colors flex items-center justify-center">
                    {logoPreview ? (
                        <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain rounded-md"/>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    )}
                </label>
                <Input id="logo_url" name="logo_url" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/svg+xml, image/webp" />
            </div>
            <div className="w-full">
                <Label htmlFor="name">Brand Name</Label>
                <Input id="name" name="name" required defaultValue={brandToEdit?.name} placeholder="e.g., BrandHub"/>
            </div>
        </div>

        <div>
            <Label htmlFor="description">Description</Label>
            <textarea id="description" name="description" defaultValue={brandToEdit?.description || ''} rows={3} className="w-full mt-1 rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white" placeholder="What is this brand about?"></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="primary_color">Primary Color</Label>
                <Input id="primary_color" name="primary_color" type="color" defaultValue={brandToEdit?.primary_color || '#8b5cf6'} className="p-1 h-10"/>
            </div>
            <div>
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <Input id="secondary_color" name="secondary_color" type="color" defaultValue={brandToEdit?.secondary_color || '#ffffff'} className="p-1 h-10"/>
            </div>
        </div>
        
        <div>
            <Label htmlFor="font">Brand Font</Label>
            <Input id="font" name="font" defaultValue={brandToEdit?.font || ''} placeholder="e.g., Poppins"/>
        </div>

        <div>
            <Label htmlFor="website_url">Website URL</Label>
            <Input id="website_url" name="website_url" type="url" defaultValue={brandToEdit?.website_url || ''} placeholder="https://example.com"/>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        
        <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="w-28">
                {isPending ? <Spinner /> : 'Save Brand'}
            </Button>
        </div>
    </form>
    </>
  );
}
