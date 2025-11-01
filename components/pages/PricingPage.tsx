
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Fix: Added .tsx extension for module resolution.
import { Button } from '../ui/Button.tsx';
// Fix: Added .tsx extension for module resolution.
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card.tsx';
// Fix: Added .tsx extension for module resolution.
import { useAuth } from '../../context/AuthContext.tsx';
// Fix: Added .ts extension for module resolution.
import { cn } from '../../lib/utils.ts';

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

const PricingPage = () => {
  const navigate = useNavigate();
  const { user, subscriptionStatus } = useAuth();

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'For individuals and small teams getting started.',
      features: [
        'Up to 3 brands',
        '25 asset uploads',
        'Launch calendar',
        'Basic brand guidelines',
      ],
      cta: 'Get Started',
      isCurrent: subscriptionStatus === 'free' || !subscriptionStatus,
    },
    {
      name: 'Pro',
      price: '$25',
      description: 'For growing businesses that need more power.',
      features: [
        'Unlimited brands',
        'Unlimited asset uploads',
        'Launch calendar',
        'Advanced brand guidelines',
        'AI Brand Style Checker',
        'Priority support',
      ],
      cta: 'Upgrade to Pro',
      isCurrent: subscriptionStatus === 'pro',
      isFeatured: true,
    },
  ];

  const handleCTAClick = (tierName: string) => {
    if (!user) {
        navigate('/signup');
    } else if(tierName === 'Pro') {
        // In a real application, this would redirect to a Stripe checkout page.
        alert('This is a demo. Redirect to payment processor would happen here.');
    }
  };

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
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {tiers.map((tier) => (
          <Card key={tier.name} className={`flex flex-col ${tier.isFeatured ? 'border-primary ring-2 ring-primary shadow-primary/20' : ''}`}>
            <CardHeader>
              <CardTitle className="font-display">{tier.name}</CardTitle>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                <span className="text-slate-400">/ month</span>
              </div>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckIcon className="text-green-400 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                size="lg"
                className="w-full"
                onClick={() => handleCTAClick(tier.name)}
                disabled={tier.isCurrent}
              >
                {tier.isCurrent ? 'Current Plan' : tier.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
