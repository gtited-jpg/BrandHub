'use client';

import UpgradeCTA from '@/components/ui/UpgradeCTA';

interface PaidFeatureGuardProps {
  children: React.ReactNode;
  featureName: string;
  hasActiveSubscription: boolean;
}

// Fix: Changed from `export default function` to a named export `export function`.
export function PaidFeatureGuard({ children, featureName, hasActiveSubscription }: PaidFeatureGuardProps) {
  if (hasActiveSubscription) {
    return <>{children}</>;
  }
  
  return <UpgradeCTA featureName={featureName} />;
}