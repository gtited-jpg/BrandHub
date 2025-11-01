import React, { createContext, useState, useEffect, useContext } from 'react';
// Fix: Added .ts extension for module resolution.
import { supabase } from '../lib/supabase.ts';
import type { Session, User } from '@supabase/supabase-js';

type SubscriptionStatus = 'free' | 'pro' | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscriptionStatus: SubscriptionStatus;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  subscriptionStatus: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>(null);
  
  const fetchSubscriptionStatus = async (user: User) => {
    try {
      // In a real app, you'd fetch this from your `users` or `subscriptions` table.
      // For this demo, we will treat logged-in users as having a 'pro' plan
      // to allow access to paid features.
      const { data, error } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
        throw error;
      }

      if (data) {
        setSubscriptionStatus('pro');
      } else {
        setSubscriptionStatus('free');
      }

    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setSubscriptionStatus('free'); // Default to free on error
    }
  };


  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          await fetchSubscriptionStatus(currentUser);
        } else {
          setSubscriptionStatus(null);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        setSession(null);
        setUser(null);
        setSubscriptionStatus(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await fetchSubscriptionStatus(currentUser);
        } else {
          setSubscriptionStatus(null);
        }
        
        // Ensure loading is false after auth state changes
        if(loading) setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);


  const value = {
    user,
    session,
    loading,
    subscriptionStatus,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};