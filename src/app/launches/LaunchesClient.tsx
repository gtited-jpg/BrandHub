'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import Calendar from '@/components/launches/Calendar';
import LaunchForm from '@/components/launches/LaunchForm';
import { deleteLaunch } from './actions';
import type { Database } from '@/types/supabase';

export type Launch = Database['public']['Tables']['launches']['Row'];
export type Brand = Pick<Database['public']['Tables']['brands']['Row'], 'id' | 'name' | 'primary_color'>;

interface LaunchesClientProps {
  launches: Launch[];
  brands: Brand[];
}

export default function LaunchesClient({ launches, brands }: LaunchesClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [launchToEdit, setLaunchToEdit] = useState<Launch | null>(null);

  const handleCreateNew = () => {
    setLaunchToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (launch: Launch) => {
    setLaunchToEdit(launch);
    setIsFormOpen(true);
  };

  const handleDelete = async (launchId: string) => {
    if (!window.confirm('Are you sure you want to delete this launch?')) return;
    const result = await deleteLaunch(launchId);
    if (result.error) {
      alert(`Error: ${result.error}`);
    }
  };
  
  const handleSave = () => {
    setIsFormOpen(false);
    setLaunchToEdit(null);
  };

  return (
    <div className="py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Launch Calendar</h1>
          <p className="text-slate-400">Plan and visualize your upcoming product launches.</p>
        </div>
        <Button onClick={handleCreateNew} disabled={brands.length === 0}>
          {brands.length > 0 ? 'Schedule Launch' : 'Create a Brand First'}
        </Button>
      </div>

      <Calendar 
        launches={launches} 
        brands={brands}
        onEditLaunch={handleEdit}
        onDeleteLaunch={handleDelete}
      />
      
      <Dialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <LaunchForm
            brands={brands}
            launchToEdit={launchToEdit}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
        />
      </Dialog>
    </div>
  );
}
