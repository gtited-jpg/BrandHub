import React, { useState, useCallback } from 'react';
// Fix: Import Gemini API and types.
import { GoogleGenAI, Type } from "@google/genai";
import type { Brand } from '../DashboardPage.tsx';
import { Button } from '../../ui/Button.tsx';
import { Label } from '../../ui/Label.tsx';
import Spinner from '../../ui/Spinner.tsx';
import StyleCheckResultCard, { type StyleCheckResult } from './StyleCheckResultCard.tsx';
import { Input } from '../../ui/Input.tsx';

interface StyleCheckPageProps {
  brand: Brand;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]); // remove data:mime/type;base64,
      } else {
        reject('Failed to read file as base64 string.');
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

const StyleCheckPage: React.FC<StyleCheckPageProps> = ({ brand }) => {
  const [textInput, setTextInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StyleCheckResult | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setResult(null);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleStyleCheck = useCallback(async () => {
    if (!textInput && !imageFile) {
      setError('Please provide text or an image to check.');
      return;
    }
    
    // Safely get the API Key, preventing a crash if process.env is not defined.
    const apiKey = (window as any).process?.env?.API_KEY;
    if (!apiKey) {
        setError("API_KEY is not configured. Please set it up to use the AI Style Checker.");
        return;
    }


    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey });

      const brandDetails = `
        - Brand Name: ${brand.name}
        - Description: ${brand.description}
        - Primary Color: ${brand.primary_color}
        - Secondary Color: ${brand.secondary_color}
        - Font: ${brand.font || 'Not specified'}
        - Website: ${brand.website_url || 'Not specified'}
      `;

      const userPrompt = `
        Here is the brand style guide:
        ${brandDetails}

        Please analyze the following content and determine its alignment with the brand style guide.

        Content to analyze:
        ${textInput ? `Text: "${textInput}"` : ''}
        ${imageFile ? `An image is attached.` : ''}

        Provide your analysis in JSON format according to the specified schema.
        - alignmentScore should be a percentage from 0-100.
        - alignmentSummary should be a concise one or two-sentence summary.
        - suggestions should be a list of specific, actionable feedback points. Each point should be marked as positive (isPositive: true) if it's a strength, or a suggestion for improvement (isPositive: false).
      `;
      
      const parts = [{ text: userPrompt }];

      if (imageFile) {
        const base64Image = await fileToBase64(imageFile);
        parts.push({
          inlineData: {
            mimeType: imageFile.type,
            data: base64Image,
          },
        } as any);
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro', // Using pro for complex reasoning
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              alignmentScore: { type: Type.NUMBER, description: 'A score from 0 to 100 representing brand alignment.' },
              alignmentSummary: { type: Type.STRING, description: 'A brief summary of the alignment analysis.' },
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    isPositive: { type: Type.BOOLEAN, description: 'True if this is a positive point, false if it is a suggestion for improvement.' },
                    text: { type: Type.STRING, description: 'The suggestion or positive point.' }
                  },
                  required: ['isPositive', 'text']
                }
              }
            },
            required: ['alignmentScore', 'alignmentSummary', 'suggestions']
          },
        },
      });

      const jsonResult = JSON.parse(response.text);
      setResult(jsonResult);

    } catch (err: any) {
      console.error('AI Style Check Error:', err);
      setError(err.message || 'An error occurred while analyzing the content.');
    } finally {
      setIsLoading(false);
    }
  }, [brand, textInput, imageFile]);

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
            className="w-full mt-1 rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white"
            placeholder="Paste your marketing copy, social media post, or any other text here..."
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
        <Button onClick={handleStyleCheck} disabled={isLoading || (!textInput && !imageFile)}>
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Analyzing...
            </>
          ) : (
            'Check Alignment'
          )}
        </Button>
      </div>

      {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

      {result && <StyleCheckResultCard result={result} />}

    </div>
  );
};

export default StyleCheckPage;