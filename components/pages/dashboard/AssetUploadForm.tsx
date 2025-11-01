
import React, { useState } from 'react';
// Fix: Added .ts/.tsx extensions
import { supabase } from '../../../lib/supabase.ts';
import { useAuth } from '../../../context/AuthContext.tsx';
import { Button } from '../../ui/Button.tsx';
import { Input } from '../../ui/Input.tsx';
import { Label } from '../../ui/Label.tsx';
import Spinner from '../../ui/Spinner.tsx';
import { CardTitle, CardDescription } from '../../ui/Card.tsx';

interface AssetUploadFormProps {
  brandId: string;
  onUploadSuccess: () => void;
  onCancel: () => void;
}

const AssetUploadForm: React.FC<AssetUploadFormProps> = ({ brandId, onUploadSuccess, onCancel }) => {
  const { user } = useAuth();
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [assetName, setAssetName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAssetFile(file);
      // Pre-fill asset name with file name without extension
      setAssetName(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !assetFile || !brandId) {
      setError('Missing required information to upload asset.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const fileExtension = assetFile.name.split('.').pop();
      const filePath = `${user.id}/${brandId}/${Date.now()}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from('brand_assets')
        .upload(filePath, assetFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('brand_assets')
        .getPublicUrl(filePath);
      
      const file_url = publicUrlData.publicUrl;

      const assetData = {
        user_id: user.id,
        brand_id: brandId,
        name: assetName || assetFile.name,
        file_url,
        file_path: filePath,
        file_type: assetFile.type,
      };

      const { error: insertError } = await supabase.from('assets').insert(assetData);

      if (insertError) throw insertError;

      onUploadSuccess();
    } catch (err: any) {
      console.error("Error uploading asset:", err);
      setError(err.message || 'An unexpected error occurred during upload.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <CardTitle>Upload New Asset</CardTitle>
        <CardDescription>Add a new file to your brand's asset library.</CardDescription>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="asset-file">Asset File</Label>
          <Input id="asset-file" type="file" onChange={handleFileChange} required className="file:text-primary file:font-semibold" />
        </div>
        
        {assetFile && (
            <div>
                <Label htmlFor="asset-name">Asset Name</Label>
                <Input id="asset-name" value={assetName} onChange={(e) => setAssetName(e.target.value)} required placeholder="e.g., Primary Logo"/>
            </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}
        
        <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || !assetFile} className="w-28">
                {isSubmitting ? <Spinner /> : 'Upload'}
            </Button>
        </div>
      </form>
    </>
  );
};

export default AssetUploadForm;
