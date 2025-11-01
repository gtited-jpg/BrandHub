import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={cn("h-5 w-5", className)}
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

export default async function PricingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: subscription } = user ? await supabase.from('subscriptions').select('status, plan_id').single() : { data: null };
  
  // Replace with your actual LemonSqueezy Product Variant IDs
  const proPlanVariantId = '441000';
  const agencyPlanVariantId = '441001';

  const getCheckoutURL = (variantId: string) => {
    const storeUrl = process.env.LEMONSQUEEZY_STORE_ID;
    if(!storeUrl) return '/login'; // Fallback
    
    let checkoutUrl = `https://${storeUrl}.lemonsqueezy.com/buy/${variantId}?embed=1`;
    if(user) {
        checkoutUrl += `&checkout[email]=${user.email}&checkout[custom][user_id]=${user.id}`;
    }
    return checkoutUrl;
  }
  
  const tiers = [
    {
      name: 'Starter',
      price: '$0',
      description: 'For individuals and small teams getting started.',
      features: ['Up to 3 brands', '25 asset uploads per brand', 'Basic brand guidelines'],
      cta: user ? 'Current Plan' : 'Get Started',
      href: '/signup',
      isCurrent: !subscription || !['active', 'trialing'].includes(subscription.status!),
    },
    {
      name: 'Pro',
      price: '$39',
      description: 'For growing businesses that need more power.',
      features: ['Unlimited brands', 'Unlimited asset uploads', 'Launch Calendar', 'AI Brand Style Checker', 'Priority support'],
      cta: 'Upgrade to Pro',
      href: getCheckoutURL(proPlanVariantId),
      isCurrent: subscription?.plan_id === proPlanVariantId,
      isFeatured: true,
    },
     {
      name: 'Agency',
      price: '$99',
      description: 'For agencies managing multiple clients.',
      features: ['Everything in Pro', 'Team member access (coming soon)', 'Client-specific dashboards (coming soon)', 'White-labeling options (coming soon)'],
      cta: 'Upgrade to Agency',
      href: getCheckoutURL(agencyPlanVariantId),
      isCurrent: subscription?.plan_id === agencyPlanVariantId,
    },
  ];

  return (
    <div className="py-12 md:py-20 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight text-white">
          Choose the plan that's right for you
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
          Unlock more features and power up your brand management workflow.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tiers.map((tier) => (
          <Card key={tier.name} className={`flex flex-col ${tier.isFeatured ? 'border-primary ring-2 ring-primary shadow-primary/20' : ''}`}>
            <CardHeader>
              <CardTitle className="font-display">{tier.name}</CardTitle>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                {tier.price !== '$0' && <span className="text-slate-400">/ month</span>}
              </div>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckIcon className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link href={tier.href} className="w-full">
                <Button size="lg" className="w-full" disabled={tier.isCurrent}>
                  {tier.isCurrent ? 'Current Plan' : tier.cta}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
