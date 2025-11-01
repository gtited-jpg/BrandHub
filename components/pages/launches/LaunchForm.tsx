import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase.ts';
// Fix: Added .tsx extension to ensure module resolution.
import { useAuth } from '../../../context/AuthContext.tsx';
// Fix: Added .tsx extension to ensure module resolution.
import type { Launch, Brand } from '../LaunchCalendarPage.tsx';
import { Button } from '../../ui/Button.tsx';
import { Input } from '../../ui/Input.tsx';
import { Label } from '../../ui/Label.tsx';
import Spinner from '../../ui/Spinner.tsx';
import { CardTitle, CardDescription } from '../../ui/Card.tsx';

interface LaunchFormProps {
  launchToEdit: Launch | null;
  brands: Brand[];
  onSave: () => void;
  onCancel: () => void;
}

const LaunchForm: React.FC<LaunchFormProps> = ({ launchToEdit, brands, onSave, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    launch_date: '',
    brand_id: '',
    // Fix: Widened the type of status to match the Launch type from the database.
    status: 'upcoming' as 'upcoming' | 'launched' | 'cancelled',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (launchToEdit) {
      setFormData({
        name: launchToEdit.name,
        description: launchToEdit.description || '',
        launch_date: launchToEdit.launch_date.substring(0, 10), // Format for date input
        brand_id: launchToEdit.brand_id,
        status: launchToEdit.status,
      });
    } else {
        // Reset form
         setFormData({
            name: '',
            description: '',
            launch_date: '',
            brand_id: brands[0]?.id || '',
            status: 'upcoming',
        });
    }
  }, [launchToEdit, brands]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !formData.brand_id) {
        setError('You must be logged in and select a brand.');
        return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
        const launchData = { 
            ...formData, 
            user_id: user.id,
            // Ensure launch_date is in ISO 8601 format with timezone
            launch_date: new Date(formData.launch_date).toISOString(),
        };

        if (launchToEdit) {
            const { error: updateError } = await supabase
                .from('launches')
                .update(launchData)
                .eq('id', launchToEdit.id);
            if (updateError) throw updateError;
        } else {
            const { error: insertError } = await supabase
                .from('launches')
                .insert(launchData);
            if (insertError) throw insertError;
        }
        onSave();
    } catch (err: any) {
        console.error("Error saving launch:", err);
        setError(err.message || 'An unexpected error occurred.');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <>
    <div className="text-center mb-6">
        <CardTitle>{launchToEdit ? 'Edit Launch' : 'Schedule New Launch'}</CardTitle>
        <CardDescription>{launchToEdit ? 'Update your launch details.' : 'Add a new launch to your calendar.'}</CardDescription>
    </div>
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <Label htmlFor="name">Launch Name</Label>
            <Input id="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g., Summer Collection 2024"/>
        </div>
        
        <div>
            <Label htmlFor="brand_id">Brand</Label>
            <select
              id="brand_id"
              value={formData.brand_id}
              onChange={handleInputChange}
              required
              className="w-full mt-1 rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white h-10"
            >
              <option value="" disabled>Select a brand</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
        </div>

        <div>
            <Label htmlFor="launch_date">Launch Date</Label>
            <Input id="launch_date" type="date" value={formData.launch_date} onChange={handleInputChange} required />
        </div>

        <div>
            <Label htmlFor="description">Description</Label>
            <textarea id="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full mt-1 rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white" placeholder="Details about this launch..."></textarea>
        </div>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}
        
        <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || !formData.brand_id} className="w-32">
                {isSubmitting ? <Spinner /> : launchToEdit ? 'Save Changes' : 'Schedule Launch'}
            </Button>
        </div>
    </form>
    </>
  );
};

export default LaunchForm;