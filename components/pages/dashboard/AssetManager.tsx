
import React, { useState, useEffect, useCallback } from 'react';
// Fix: Added .ts/.tsx extensions
import { supabase } from '../../../lib/supabase.ts';
import { useAuth } from '../../../context/AuthContext.tsx';
import { Button } from '../../ui/Button.tsx';
import { Dialog } from '../../ui/Dialog.tsx';
import AssetUploadForm from './AssetUploadForm.tsx';
import AssetCard from './AssetCard.tsx';
import type { Database } from '../../../types/supabase.ts';

type Asset = Database['public']['Tables']['assets']['Row'];

interface AssetManagerProps {
  brandId: string;
}

const AssetManager: React.FC<AssetManagerProps> = ({ brandId }) => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);

  const fetchAssets = useCallback(async () => {
    if (!user || !brandId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAssets(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, brandId]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleUploadSuccess = () => {
    setIsUploadFormOpen(false);
    fetchAssets();
  };

  const handleDeleteAsset = async (asset: Asset) => {
    if (!window.confirm(`Are you sure you want to delete "${asset.name}"?`)) return;

    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('brand_assets')
      .remove([asset.file_path]);

    if (storageError) {
      setError(`Failed to delete file from storage: ${storageError.message}`);
      return;
    }

    // Delete record from database
    const { error: dbError } = await supabase
      .from('assets')
      .delete()
      .eq('id', asset.id);

    if (dbError) {
      setError(`Failed to delete asset record: ${dbError.message}`);
    } else {
      fetchAssets();
    }
  };


  return (
    <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Brand Assets</h3>
        <Button onClick={() => setIsUploadFormOpen(true)}>Upload Asset</Button>
      </div>

      {loading && <div className="text-center text-white">Loading assets...</div>}
      {error && <div className="text-center text-red-400">{error}</div>}

      {!loading && assets.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-slate-700 rounded-lg">
          <h4 className="text-lg font-semibold text-white">No assets yet.</h4>
          <p className="text-slate-400 mt-1">Upload your first brand asset.</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {assets.map(asset => (
          <AssetCard key={asset.id} asset={asset} onDelete={() => handleDeleteAsset(asset)} />
        ))}
      </div>

      <Dialog isOpen={isUploadFormOpen} onClose={() => setIsUploadFormOpen(false)}>
        <AssetUploadForm brandId={brandId} onUploadSuccess={handleUploadSuccess} onCancel={() => setIsUploadFormOpen(false)} />
      </Dialog>
    </div>
  );
};

export default AssetManager;
