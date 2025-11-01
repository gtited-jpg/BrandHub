import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
// Fix: Changed to a named import for PaidFeatureGuard.
import { PaidFeatureGuard } from '@/components/auth/PaidFeatureGuard';
import LaunchesClient from './LaunchesClient';

export default async function LaunchCalendarPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .in('status', ['active', 'trialing'])
        .single();
    
    const hasActiveSubscription = !!subscription;

    const [launchesRes, brandsRes] = await Promise.all([
        supabase.from('launches').select('*').eq('user_id', user.id),
        supabase.from('brands').select('id, name, primary_color').eq('user_id', user.id)
    ]);

    return (
        <PaidFeatureGuard 
            featureName="Launch Calendar" 
            hasActiveSubscription={hasActiveSubscription}
        >
            <LaunchesClient 
                launches={launchesRes.data || []} 
                brands={brandsRes.data || []} 
            />
        </PaidFeatureGuard>
    );
}