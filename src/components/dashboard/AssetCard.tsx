'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Database } from '@/types/supabase';

type Asset = Database['public']['Tables']['assets']['Row'];

interface AssetCardProps {
  asset: Asset;
  signedUrl: string;
  onDelete: () => void;
}

const isImage = (fileType: string) => fileType.startsWith('image/');

export default function AssetCard({ asset, signedUrl, onDelete }: AssetCardProps) {
  const handleDownload = () => {
    // We use the signedUrl for secure downloading
    const link = document.createElement('a');
    link.href = signedUrl;
    link.setAttribute('download', asset.name || 'download'); 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="group overflow-hidden">
      <CardHeader className="p-0">
        <div className="aspect-square bg-slate-800 flex items-center justify-center">
          {isImage(asset.file_type) ? (
            <img src={signedUrl} alt={asset.name} className="w-full h-full object-contain" />
          ) : (
             <div className="text-center p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                    <path d="M8 8a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                </svg>
                <p className="text-xs text-slate-400 truncate mt-2">{asset.file_type}</p>
             </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <p className="text-sm font-medium text-white truncate text-center">{asset.name}</p>
         {/* Fix: Temporarily cast asset to any to access campaign property. This avoids a type error due to mismatched Supabase types. */}
         {(asset as any).campaign && <p className="text-xs text-slate-400 truncate text-center">{(asset as any).campaign}</p>}
      </CardContent>
      <CardFooter className="p-2 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center gap-1">
        <Button size="sm" variant="ghost" onClick={handleDownload}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </Button>
        <Button size="sm" variant="ghost" onClick={onDelete} className="text-red-400 hover:text-red-400 hover:bg-red-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </Button>
      </CardFooter>
    </Card>
  );
}