'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signup(formData: FormData) {
  const supabase = createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        // emailRedirectTo: `${origin}/auth/callback`, // Add this if you have email confirmation setup
    },
  });

  if (error) {
    return redirect(`/signup?message=${error.message}&type=error`);
  }

  return redirect(`/signup?message=Success! Please check your email for a confirmation link.&type=success`);
}
