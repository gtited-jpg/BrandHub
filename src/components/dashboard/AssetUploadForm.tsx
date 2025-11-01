'use client';

import { useState, useTransition } from 'react';
import { uploadAsset } from '@/app/brand/[brandId]/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Spinner from '@/components/ui/Spinner';
import { CardTitle, CardDescription } from '@/components/ui/Card';

interface AssetUploadFormProps {
  brandId: string;
  onUploadSuccess: () => void;
  onCancel: () => void;
}

export default function AssetUploadForm({ brandId, onUploadSuccess, onCancel }: AssetUploadFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
        const result = await uploadAsset(brandId, formData);
        if (result?.error) {
            setError(result.error);
        } else {
            onUploadSuccess();
        }
    });
  };

  return (
    <>
      <div className="text-center mb-6">
        <CardTitle>Upload New Asset</CardTitle>
        <CardDescription>Add a new file to your brand's asset library.</CardDescription>
      </div>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="assetFile">Asset File</Label>
          <Input id="assetFile" name="assetFile" type="file" required className="file:text-primary file:font-semibold" />
        </div>
        
        <div>
            <Label htmlFor="assetName">Asset Name</Label>
            <Input id="assetName" name="assetName" required placeholder="e.g., Primary Logo"/>
        </div>

        <div>
            <Label htmlFor="campaign">Campaign (optional)</Label>
            <Input id="campaign" name="campaign" placeholder="e.g., Summer 2024 Launch"/>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        
        <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="w-28">
                {isPending ? <Spinner /> : 'Upload'}
            </Button>
        </div>
      </form>
    </>
  );
}
