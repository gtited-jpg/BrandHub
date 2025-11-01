
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
// Fix: Added .ts extension for module resolution.
import { supabase } from '../../../lib/supabase.ts';
// Fix: Added .tsx extension for module resolution.
import { useAuth } from '../../../context/AuthContext.tsx';
// Fix: Added .ts extension for module resolution.
import type { Database } from '../../../types/supabase.ts';
// Fix: Added .tsx extension for module resolution.
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/Tabs.tsx';
// Fix: Added .tsx extension for module resolution.
import AssetManager from './AssetManager.tsx';
// Fix: Added .tsx extension for module resolution.
import StyleCheckPage from './StyleCheckPage.tsx';
// Fix: Added .tsx extension for module resolution.
import { PaidFeatureGuard } from '../../auth/PaidFeatureGuard.tsx';

type Brand = Database['public']['Tables']['brands']['Row'];

const BrandDetailPage = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const { user } = useAuth();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrand = async () => {
      if (!brandId || !user) return;
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .eq('id', brandId)
          .eq('user_id', user.id)
          .single();
        if (error) throw error;
        setBrand(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch brand details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBrand();
  }, [brandId, user]);

  const initials = useMemo(() => {
    return brand?.name?.charAt(0).toUpperCase() || '?';
  }, [brand]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-400">{error}</div>;
  }
  
  if (!brand) {
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white">Brand not found</h2>
            <p className="text-slate-400 mt-2">The brand you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link to="/dashboard" className="mt-6 inline-block text-primary hover:underline">
                &larr; Back to Dashboard
            </Link>
        </div>
    );
  }

  return (
    <div className="py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-6 items-start mb-8">
        <div 
            className="w-24 h-24 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0" 
            style={{ backgroundColor: brand.primary_color || '#8b5cf6' }}
        >
            {brand.logo_url ? (
              <img src={brand.logo_url} alt={`${brand.name} logo`} className="w-20 h-20 object-contain" />
            ) : (
              <span className="text-5xl font-bold" style={{color: brand.secondary_color || '#ffffff'}}>{initials}</span>
            )}
        </div>
        <div>
            <h1 className="text-4xl font-bold text-white">{brand.name}</h1>
            <p className="text-slate-300 mt-2 max-w-2xl">{brand.description}</p>
            {brand.website_url && (
                <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mt-2 inline-block">
                    {brand.website_url}
                </a>
            )}
        </div>
      </div>
      
      <Tabs defaultValue="assets">
        <TabsList>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="style-check">AI Style Check</TabsTrigger>
        </TabsList>
        <TabsContent value="assets">
          <AssetManager brandId={brand.id} />
        </TabsContent>
        <TabsContent value="style-check">
          <PaidFeatureGuard featureName="AI Style Checker">
            <StyleCheckPage brand={brand} />
          </PaidFeatureGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandDetailPage;
