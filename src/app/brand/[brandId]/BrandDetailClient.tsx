'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import AssetManager from '@/components/dashboard/AssetManager';
import StyleCheckPage from '@/components/dashboard/StyleCheckPage';
// Fix: Changed to a named import for PaidFeatureGuard.
import { PaidFeatureGuard } from '@/components/auth/PaidFeatureGuard';
import type { Database } from '@/types/supabase';

type Brand = Database['public']['Tables']['brands']['Row'];
type Asset = Database['public']['Tables']['assets']['Row'];

interface BrandDetailClientProps {
  brand: Brand;
  assets: Asset[];
  hasActiveSubscription: boolean;
}

export default function BrandDetailClient({ brand, assets, hasActiveSubscription }: BrandDetailClientProps) {

  const initials = useMemo(() => {
    return brand?.name?.charAt(0).toUpperCase() || '?';
  }, [brand]);
  
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
          <AssetManager brandId={brand.id} initialAssets={assets} />
        </TabsContent>
        <TabsContent value="style-check">
          <PaidFeatureGuard 
            featureName="AI Style Checker" 
            hasActiveSubscription={hasActiveSubscription}
          >
            <StyleCheckPage brand={brand} />
          </PaidFeatureGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
}