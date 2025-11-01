
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
// Fix: Added .tsx extension for module resolution.
import { useAuth } from '../../context/AuthContext.tsx';
// Fix: Added .ts extension for module resolution.
import { supabase } from '../../lib/supabase.ts';
// Fix: Added .tsx extension for module resolution.
import { Button } from '../ui/Button.tsx';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      isActive ? 'text-primary' : 'text-slate-300'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-6 w-6">
            <defs>
              <linearGradient id="logo-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#8b5cf6" />
                <stop offset="100%" stop-color="#ec4899" />
              </linearGradient>
            </defs>
            <g fill="url(#logo-gradient)">
              <rect x="2" y="16" width="14" height="14" rx="2" transform="rotate(-20 9 23)" />
              <rect x="9" y="9" width="14" height="14" rx="2" transform="rotate(-20 16 16)" />
              <rect x="16" y="2" width="14" height="14" rx="2" transform="rotate(-20 23 9)" />
            </g>
          </svg>
          <span className="font-bold font-display text-lg text-white">BrandHub</span>
        </Link>
        <nav className="flex items-center space-x-6">
          {user && (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/launches" className={navLinkClass}>Launches</NavLink>
            </>
          )}
           <NavLink to="/pricing" className={navLinkClass}>Pricing</NavLink>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
              <Button onClick={() => navigate('/signup')}>Sign Up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
