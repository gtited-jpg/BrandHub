
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Fix: Added .tsx extension for module resolution.
import { Button } from './Button.tsx';

interface UpgradeCTAProps {
  featureName: string;
}

const UpgradeCTA: React.FC<UpgradeCTAProps> = ({ featureName }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center p-8 bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-700 mt-4">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
      </div>
      <h3 className="text-xl font-bold text-white">Upgrade to Pro to use the {featureName}</h3>
      <p className="text-slate-400 mt-2 max-w-md mx-auto">
        Our Pro plan unlocks advanced features like this one to supercharge your brand management.
      </p>
      <Button onClick={() => navigate('/pricing')} className="mt-6">
        View Pro Plan
      </Button>
    </div>
  );
};

export default UpgradeCTA;
