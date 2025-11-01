
import React from 'react';
// Fix: Added .tsx extension for module resolution.
import { useAuth } from '../../context/AuthContext.tsx';
// Fix: Added .tsx extension for module resolution.
import UpgradeCTA from '../ui/UpgradeCTA.tsx';

interface PaidFeatureGuardProps {
  children: React.ReactNode;
  featureName: string;
}

export const PaidFeatureGuard: React.FC<PaidFeatureGuardProps> = ({ children, featureName }) => {
  const { subscriptionStatus } = useAuth();

  // 'pro' users get access
  if (subscriptionStatus === 'pro') {
    return <>{children}</>;
  }
  
  // 'free' or null users see the upgrade CTA
  return <UpgradeCTA featureName={featureName} />;
};
