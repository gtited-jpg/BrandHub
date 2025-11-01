import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { redirect } from 'next/navigation';

async function LogoutButton() {
    const handleLogout = async () => {
        'use server';
        const supabase = createClient();
        await supabase.auth.signOut();
        return redirect('/');
    }
    return (
        <form action={handleLogout}>
            <Button variant="ghost" type="submit">Logout</Button>
        </form>
    );
}

export default async function Navbar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-6 w-6">
            <defs>
              <linearGradient id="logo-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
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
              <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary text-slate-300">Dashboard</Link>
              <Link href="/launches" className="text-sm font-medium transition-colors hover:text-primary text-slate-300">Launches</Link>
            </>
          )}
           <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-primary text-slate-300">Pricing</Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <LogoutButton />
          ) : (
            <>
              <Link href="/login"><Button variant="ghost">Login</Button></Link>
              <Link href="/signup"><Button>Sign Up</Button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
