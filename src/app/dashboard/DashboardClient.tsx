'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import BrandCard from '@/components/dashboard/BrandCard';
import BrandForm from '@/components/dashboard/BrandForm';
import { deleteBrand } from './actions';
import type { Database } from '@/types/supabase';

export type Brand = Database['public']['Tables']['brands']['Row'];

interface DashboardClientProps {
  brands: Brand[];
}

export default function DashboardClient({ brands }: DashboardClientProps) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);

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
    const result = await deleteBrand(brandId);
    if (result.error) {
      alert(`Error: ${result.error}`);
    }
  };
  
  const handleSave = () => {
    setIsFormOpen(false);
    setBrandToEdit(null);
    // Revalidation is handled by the server action, no need to manually refresh.
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

      {brands.length === 0 && (
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
            onEdit={(e) => { e.stopPropagation(); handleEdit(brand); }}
            onDelete={(e) => { e.stopPropagation(); handleDelete(brand.id); }}
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
}
