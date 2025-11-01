'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { GoogleGenAI, Type } from "@google/genai";
import { Database } from '@/types/supabase';

type Brand = Database['public']['Tables']['brands']['Row'];

// --- UPLOAD ASSET ---
export async function uploadAsset(brandId: string, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in.' };

  const assetFile = formData.get('assetFile') as File;
  const assetName = formData.get('assetName') as string;
  const campaign = formData.get('campaign') as string;

  if (!assetFile || assetFile.size === 0) return { error: 'No file provided.'};

  const fileExtension = assetFile.name.split('.').pop();
  const filePath = `${user.id}/${brandId}/${Date.now()}.${fileExtension}`;

  const { error: uploadError } = await supabase.storage
    .from('brand_assets')
    .upload(filePath, assetFile);
  
  if (uploadError) return { error: `Storage Error: ${uploadError.message}`};

  const assetData = {
    user_id: user.id,
    brand_id: brandId,
    name: assetName || assetFile.name,
    file_path: filePath,
    file_type: assetFile.type,
    campaign: campaign || null,
  };

  const { error: dbError } = await supabase.from('assets').insert(assetData);
  if (dbError) return { error: `Database Error: ${dbError.message}` };

  revalidatePath(`/brand/${brandId}`);
  return { success: true };
}


// --- DELETE ASSET ---
export async function deleteAsset(assetId: string, filePath: string, brandId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'You must be logged in.' };

    const { error: storageError } = await supabase.storage.from('brand_assets').remove([filePath]);
    if (storageError) return { error: `Storage Error: ${storageError.message}` };

    const { error: dbError } = await supabase.from('assets').delete().eq('id', assetId);
    if (dbError) return { error: `Database Error: ${dbError.message}` };

    revalidatePath(`/brand/${brandId}`);
    return { success: true };
}


// --- AI STYLE CHECK ---
export async function performStyleCheck(brand: Brand, textInput: string, imageFile?: { base64: string; mimeType: string }) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return { error: "GEMINI_API_KEY is not configured on the server." };
    }

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
            Analyze the provided content against this brand style guide:
            ${brandDetails}

            Content to analyze:
            ${textInput ? `Text: "${textInput}"` : ''}
            ${imageFile ? `An image is attached.` : ''}

            Provide your analysis in the specified JSON format.
            - alignmentScore is a percentage from 0-100.
            - alignmentSummary is a concise summary.
            - suggestions lists specific, actionable feedback, marked as positive or for improvement.
        `;
        
        const parts: any[] = [{ text: userPrompt }];

        if (imageFile) {
            parts.push({
                inlineData: {
                    mimeType: imageFile.mimeType,
                    data: imageFile.base64,
                },
            });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        alignmentScore: { type: Type.NUMBER },
                        alignmentSummary: { type: Type.STRING },
                        suggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    isPositive: { type: Type.BOOLEAN },
                                    text: { type: Type.STRING }
                                },
                                required: ['isPositive', 'text']
                            }
                        }
                    },
                    required: ['alignmentScore', 'alignmentSummary', 'suggestions']
                },
            },
        });

        return { result: JSON.parse(response.text) };
    } catch (err: any) {
        console.error('AI Style Check Server Error:', err);
        return { error: err.message || 'An unexpected error occurred during AI analysis.' };
    }
}
