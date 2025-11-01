
import React, { useState, useEffect, useCallback } from 'react';
// Fix: Added .ts extension
import { supabase } from '../../lib/supabase.ts';
// Fix: Added .tsx extension to ensure module resolution.
import { useAuth } from '../../context/AuthContext.tsx';
import BrandCard from './dashboard/BrandCard.tsx';
import BrandForm from './dashboard/BrandForm.tsx';
import { Button } from '../ui/Button.tsx';
import { Dialog } from '../ui/Dialog.tsx';
// Fix: Added .ts extension to ensure module resolution.
import type { Database } from '../../types/supabase.ts';

export type Brand = Database['public']['Tables']['brands']['Row'];

const DashboardPage = () => {
  const { user } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);

  const fetchBrands = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBrands(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleCreateNew = () => {
    setBrandToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setBrandToEdit(brand);
    setIsFormOpen(true);
  };

  const handleDelete = async (brandId: string) => {
    if (!window.confirm('Are you sure you want to delete this brand? This will also delete all associated assets and cannot be undone.')) return;

    // First delete assets associated with the brand from storage
    const { data: assets, error: assetsError } = await supabase
        .from('assets')
        .select('file_path')
        .eq('brand_id', brandId);

    if (assetsError) {
        console.error('Error fetching assets for deletion:', assetsError);
        setError('Could not delete brand assets. Please try again.');
        return;
    }

    if (assets && assets.length > 0) {
        const filePaths = assets.map(asset => asset.file_path);
        const { error: storageError } = await supabase.storage.from('brand_assets').remove(filePaths);
        if (storageError) {
             console.error('Error deleting assets from storage:', storageError);
            // Non-critical, so we can continue to delete DB record.
        }
    }
    
    // Then delete from database (assets will be deleted by cascade if set up in DB)
    const { error: deleteError } = await supabase.from('brands').delete().eq('id', brandId);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      fetchBrands();
    }
  };

  const handleSave = () => {
    setIsFormOpen(false);
    setBrandToEdit(null);
    fetchBrands();
  };

  return (
    <div className="py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Brands</h1>
          <p className="text-slate-400">Manage all your brand identities in one place.</p>
        </div>
        <Button onClick={handleCreateNew}>Create New Brand</Button>
      </div>

      {loading && <div className="text-center text-white">Loading your universe...</div>}
      {error && <div className="text-center text-red-400">{error}</div>}

      {!loading && brands.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-slate-700 rounded-lg">
          <h2 className="text-xl font-semibold text-white">Your universe is empty.</h2>
          <p className="text-slate-400 mt-2">Create your first brand to get started.</p>
          <Button onClick={handleCreateNew} className="mt-4">Create Brand</Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {brands.map(brand => (
          <BrandCard
            key={brand.id}
            brand={brand}
            onEdit={() => handleEdit(brand)}
            onDelete={() => handleDelete(brand.id)}
          />
        ))}
      </div>

      <Dialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <BrandForm 
          brandToEdit={brandToEdit}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default DashboardPage;
