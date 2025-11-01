
import React, { useState, useEffect, useCallback } from 'react';
// Fix: Added .ts extension for module resolution.
import { supabase } from '../../lib/supabase.ts';
// Fix: Added .tsx extension for module resolution.
import { useAuth } from '../../context/AuthContext.tsx';
// Fix: Added .ts extension for module resolution.
import type { Database } from '../../types/supabase.ts';
// Fix: Added .tsx extension for module resolution.
import { Button } from '../ui/Button.tsx';
// Fix: Added .tsx extension for module resolution.
import { Dialog } from '../ui/Dialog.tsx';
// Fix: Added .tsx extension for module resolution.
import Calendar from './launches/Calendar.tsx';
// Fix: Added .tsx extension for module resolution.
import LaunchForm from './launches/LaunchForm.tsx';

export type Launch = Database['public']['Tables']['launches']['Row'];
export type Brand = Database['public']['Tables']['brands']['Row'];

const LaunchCalendarPage = () => {
  const { user } = useAuth();
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [launchToEdit, setLaunchToEdit] = useState<Launch | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const [launchesRes, brandsRes] = await Promise.all([
        supabase.from('launches').select('*').eq('user_id', user.id),
        supabase.from('brands').select('id, name, primary_color').eq('user_id', user.id)
      ]);
      
      if (launchesRes.error) throw launchesRes.error;
      if (brandsRes.error) throw brandsRes.error;

      setLaunches(launchesRes.data || []);
      setBrands(brandsRes.data || []);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

    const { error } = await supabase.from('launches').delete().eq('id', launchId);

    if (error) {
      setError(error.message);
    } else {
      fetchData();
    }
  };
  
  const handleSave = () => {
    setIsFormOpen(false);
    setLaunchToEdit(null);
    fetchData();
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

      {loading && <div className="text-center text-white">Loading calendar...</div>}
      {error && <div className="text-center text-red-400">{error}</div>}

      {!loading && (
        <Calendar 
          launches={launches} 
          brands={brands}
          onEditLaunch={handleEdit}
          onDeleteLaunch={handleDelete}
        />
      )}
      
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
};

export default LaunchCalendarPage;
