'use client';

import { useState, useTransition } from 'react';
import { performStyleCheck } from '@/app/brand/[brandId]/actions';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import Spinner from '@/components/ui/Spinner';
import StyleCheckResultCard, { type StyleCheckResult } from './StyleCheckResultCard';
import { Input } from '@/components/ui/Input';
import type { Database } from '@/types/supabase';

type Brand = Database['public']['Tables']['brands']['Row'];

interface StyleCheckPageProps {
  brand: Brand;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result.split(',')[1]) : reject();
    reader.onerror = (error) => reject(error);
  });
};

export default function StyleCheckPage({ brand }: StyleCheckPageProps) {
  const [textInput, setTextInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StyleCheckResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setResult(null);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleStyleCheck = () => {
    if (!textInput && !imageFile) {
      setError('Please provide text or an image to check.');
      return;
    }
    
    setError(null);
    setResult(null);

    startTransition(async () => {
      let imagePayload;
      if (imageFile) {
        const base64 = await fileToBase64(imageFile);
        imagePayload = { base64, mimeType: imageFile.type };
      }
      
      const response = await performStyleCheck(brand, textInput, imagePayload);

      if (response.error) {
        setError(response.error);
      } else if (response.result) {
        setResult(response.result);
      }
    });
  };

  return (
    <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
      <h3 className="text-xl font-semibold text-white">AI Brand Style Checker</h3>
      <p className="text-slate-400 mt-1">
        Analyze text or images to see how well they align with <span className="font-bold text-white">{brand.name}</span>'s brand identity.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <Label htmlFor="style-check-text">Text Content (optional)</Label>
          <textarea
            id="style-check-text"
            rows={5}
            value={textInput}
            onChange={(e) => { setTextInput(e.target.value); setResult(null); }}
            className="w-full mt-1 rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm placeholder:text-slate-400"
            placeholder="Paste your marketing copy or any other text here..."
          />
        </div>
        <div>
          <Label htmlFor="style-check-image">Image Content (optional)</Label>
           <Input id="style-check-image" type="file" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" className="file:text-primary file:font-semibold" />
           {imagePreview && (
            <div className="mt-4 relative w-40 h-40 rounded-md overflow-hidden border border-slate-600">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover"/>
                <button 
                  onClick={() => { setImageFile(null); setImagePreview(null); }} 
                  className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-black/80"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
           )}
        </div>
      </div>
      
      <div className="mt-6">
        <Button onClick={handleStyleCheck} disabled={isPending || (!textInput && !imageFile)}>
          {isPending ? (
            <><Spinner className="mr-2 h-4 w-4" /> Analyzing...</>
          ) : ( 'Check Alignment' )}
        </Button>
      </div>

      {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
      {result && <StyleCheckResultCard result={result} />}
    </div>
  );
}
