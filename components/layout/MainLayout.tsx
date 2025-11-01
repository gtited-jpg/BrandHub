
import React from 'react';
import { Outlet } from 'react-router-dom';
// Fix: Added .tsx extension for module resolution.
import Navbar from './Navbar.tsx';
// Fix: Added .tsx extension for module resolution.
import Footer from './Footer.tsx';
// Fix: Added .tsx extension for module resolution.
import Starfield from '../misc/Starfield.tsx';

const MainLayout = () => {
  return (
    <div className="relative min-h-screen text-slate-200 flex flex-col">
      <Starfield />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;