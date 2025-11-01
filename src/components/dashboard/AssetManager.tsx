'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import AssetUploadForm from './AssetUploadForm';
import AssetCard from './AssetCard';
import { deleteAsset } from '@/app/brand/[brandId]/actions';
import type { Database } from '@/types/supabase';

type Asset = Database['public']['Tables']['assets']['Row'];
type SignedAsset = Asset & { signedUrl: string };

interface AssetManagerProps {
  brandId: string;
  initialAssets: SignedAsset[];
}

export default function AssetManager({ brandId, initialAssets }: AssetManagerProps) {
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  
  const handleDelete = async (asset: Asset) => {
    if (!window.confirm(`Are you sure you want to delete "${asset.name}"?`)) return;
    const result = await deleteAsset(asset.id, asset.file_path, brandId);
    if(result?.error) {
        alert(`Error deleting asset: ${result.error}`);
    }
  };

  const assetsByCampaign = useMemo(() => {
    const grouped: { [key: string]: SignedAsset[] } = {};
    initialAssets.forEach(asset => {
      // Fix: Cast asset to any to access the campaign property, avoiding a type error from conflicting type definitions.
      const campaign = (asset as any).campaign || 'General';
      if (!grouped[campaign]) {
        grouped[campaign] = [];
      }
      grouped[campaign].push(asset);
    });
    return grouped;
  }, [initialAssets]);

  return (
    <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Brand Assets</h3>
        <Button onClick={() => setIsUploadFormOpen(true)}>Upload Asset</Button>
      </div>

      {Object.keys(assetsByCampaign).length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-slate-700 rounded-lg">
          <h4 className="text-lg font-semibold text-white">No assets yet.</h4>
          <p className="text-slate-400 mt-1">Upload your first brand asset.</p>
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(assetsByCampaign).map(([campaign, assets]) => (
            <div key={campaign}>
                <h4 className="text-lg font-semibold text-slate-300 mb-4 border-b border-slate-700 pb-2">{campaign}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {assets.map(asset => (
                        <AssetCard key={asset.id} asset={asset} signedUrl={asset.signedUrl} onDelete={() => handleDelete(asset)} />
                    ))}
                </div>
            </div>
        ))}
      </div>

      <Dialog isOpen={isUploadFormOpen} onClose={() => setIsUploadFormOpen(false)}>
        <AssetUploadForm brandId={brandId} onUploadSuccess={() => setIsUploadFormOpen(false)} onCancel={() => setIsUploadFormOpen(false)} />
      </Dialog>
    </div>
  );
}