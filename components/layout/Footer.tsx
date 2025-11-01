import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 mt-20">
      <div className="container mx-auto flex flex-col sm:flex-row h-auto sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-0 gap-4">
        <p className="text-sm text-slate-400 text-center sm:text-left">
          © {new Date().getFullYear()} BrandHub by DaemonCore Labs.
        </p>
        <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="mailto:contact@daemoncore.app" className="hover:text-primary transition-colors">contact@daemoncore.app</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;