
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button.tsx';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 md:py-32 animate-fade-in-up">
      <div className="relative">
         <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-3xl opacity-50"></div>
         <h1 className="relative text-5xl md:text-7xl font-extrabold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">
            Manage all your brands <br /> in one <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">universe.</span>
         </h1>
      </div>
     
      <p className="mt-6 max-w-2xl text-lg md:text-xl text-slate-300">
        BrandHub is your central command for brand assets, guidelines, and collaboration. Streamline your workflow and maintain brand consistency with ease.
      </p>
      <div className="mt-10">
        <Button size="lg" onClick={() => navigate('/dashboard')}>
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default HomePage;