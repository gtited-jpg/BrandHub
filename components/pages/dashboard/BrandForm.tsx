
import React, { useState, useEffect } from 'react';
// Fix: Added .ts extension
import { supabase } from '../../../lib/supabase.ts';
// Fix: Added .tsx extension
import { useAuth } from '../../../context/AuthContext.tsx';
// Fix: Added .tsx extension to the import path.
import { Brand } from '../DashboardPage.tsx';
import { Button } from '../../ui/Button.tsx';
import { Input } from '../../ui/Input.tsx';
import { Label } from '../../ui/Label.tsx';
import Spinner from '../../ui/Spinner.tsx';
import { CardTitle, CardDescription } from '../../ui/Card.tsx';

interface BrandFormProps {
  brandToEdit: Brand | null;
  onSave: () => void;
  onCancel: () => void;
}

const BrandForm: React.FC<BrandFormProps> = ({ brandToEdit, onSave, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    primary_color: '#8b5cf6',
    secondary_color: '#ffffff',
    font: '',
    website_url: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (brandToEdit) {
      setFormData({
        name: brandToEdit.name || '',
        description: brandToEdit.description || '',
        primary_color: brandToEdit.primary_color || '#8b5cf6',
        secondary_color: brandToEdit.secondary_color || '#ffffff',
        font: brandToEdit.font || '',
        website_url: brandToEdit.website_url || ''
      });
      setLogoPreview(brandToEdit.logo_url);
    } else {
        // Reset form for new brand
         setFormData({
            name: '',
            description: '',
            primary_color: '#8b5cf6',
            secondary_color: '#ffffff',
            font: '',
            website_url: ''
        });
        setLogoPreview(null);
        setLogoFile(null);
    }
  }, [brandToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
        setError('You must be logged in to save a brand.');
        return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    let logo_url = brandToEdit?.logo_url || null;

    try {
        if (logoFile) {
            const filePath = `${user.id}/${Date.now()}_${logoFile.name}`;
            const { error: uploadError } = await supabase.storage
                .from('brand_logos')
                .upload(filePath, logoFile, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
                .from('brand_logos')
                .getPublicUrl(filePath);
            
            logo_url = publicUrlData.publicUrl;
        }

        const brandData = { ...formData, user_id: user.id, logo_url };

        if (brandToEdit) {
            // Update existing brand
            const { error: updateError } = await supabase
                .from('brands')
                .update(brandData)
                .eq('id', brandToEdit.id);
            if (updateError) throw updateError;
        } else {
            // Create new brand
            const { error: insertError } = await supabase
                .from('brands')
                .insert(brandData);
            if (insertError) throw insertError;
        }
        onSave();
    } catch (err: any) {
        console.error("Error saving brand:", err);
        setError(err.message || 'An unexpected error occurred.');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <>
    <div className="text-center mb-6">
        <CardTitle>{brandToEdit ? 'Edit Brand' : 'Create New Brand'}</CardTitle>
        <CardDescription>{brandToEdit ? 'Update your brand details below.' : 'Add a new brand to your universe.'}</CardDescription>
    </div>
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
            <div className="w-20 h-20 flex-shrink-0">
                <label htmlFor="logo-upload" className="cursor-pointer block w-full h-full rounded-lg bg-slate-800 border-2 border-dashed border-slate-600 hover:border-primary transition-colors flex items-center justify-center">
                    {logoPreview ? (
                        <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain rounded-md"/>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    )}
                </label>
                <Input id="logo-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/svg+xml, image/webp" />
            </div>
            <div className="w-full">
                <Label htmlFor="name">Brand Name</Label>
                <Input id="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g., BrandHub"/>
            </div>
        </div>

        <div>
            <Label htmlFor="description">Description</Label>
            <textarea id="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full mt-1 rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white" placeholder="What is this brand about?"></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="primary_color">Primary Color</Label>
                <Input id="primary_color" type="color" value={formData.primary_color} onChange={handleInputChange} className="p-1 h-10"/>
            </div>
            <div>
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <Input id="secondary_color" type="color" value={formData.secondary_color} onChange={handleInputChange} className="p-1 h-10"/>
            </div>
        </div>
        
        <div>
            <Label htmlFor="font">Brand Font</Label>
            <Input id="font" value={formData.font} onChange={handleInputChange} placeholder="e.g., Poppins"/>
        </div>

        <div>
            <Label htmlFor="website_url">Website URL</Label>
            <Input id="website_url" type="url" value={formData.website_url} onChange={handleInputChange} placeholder="https://example.com"/>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        
        <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="w-28">
                {isSubmitting ? <Spinner /> : 'Save Brand'}
            </Button>
        </div>
    </form>
    </>
  );
};

export default BrandForm;
