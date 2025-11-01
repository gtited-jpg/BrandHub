import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import BrandDetailClient from './BrandDetailClient';

export default async function BrandDetailPage({ params }: { params: { brandId: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .select('*')
    .eq('id', params.brandId)
    .eq('user_id', user.id)
    .single();

  if (brandError || !brand) {
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white">Brand not found</h2>
            <p className="text-slate-400 mt-2">The brand you're looking for doesn't exist or you don't have permission to view it.</p>
        </div>
    );
  }

  const { data: assets, error: assetsError } = await supabase
    .from('assets')
    .select('*')
    .eq('brand_id', params.brandId)
    .order('created_at', { ascending: false });

  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .select('status')
    .in('status', ['active', 'trialing'])
    .single();
    
  const hasActiveSubscription = !!subscription;

  if(assetsError) console.error("Error fetching assets:", assetsError.message);
  if(subError && subError.code !== 'PGRST116') console.error("Error fetching subscription:", subError.message);

  return (
    <BrandDetailClient 
        brand={brand} 
        assets={assets || []}
        hasActiveSubscription={hasActiveSubscription}
    />
  );
}
