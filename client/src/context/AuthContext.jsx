import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to sync farmer profile to database
  const syncFarmerProfile = async (authUser) => {
    if (!authUser) return;

    try {
      const response = await fetch('/api/v1/farmers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.name || authUser.email.split('@')[0],
          location: authUser.user_metadata?.location || null,
        }),
      });

      if (!response.ok) {
        console.error('Failed to sync farmer profile:', response.statusText);
      } else {
        console.log('Farmer profile synced successfully');
      }
    } catch (error) {
      console.error('Error syncing farmer profile:', error);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        syncFarmerProfile(session.user);
      }
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        syncFarmerProfile(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUpWithSync = async (data) => {
    const result = await supabase.auth.signUp(data);
    if (result.data?.user) {
      await syncFarmerProfile(result.data.user);
    }
    return result;
  };

  const signInWithSync = async (data) => {
    const result = await supabase.auth.signInWithPassword(data);
    if (result.data?.user) {
      await syncFarmerProfile(result.data.user);
    }
    return result;
  };

  const value = {
    signUp: signUpWithSync,
    signIn: signInWithSync,
    signInWithGoogle: () =>
      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Ensure OAuth callback lands on app dashboard instead of public landing route.
          redirectTo: `${window.location.origin}/dashboard`,
        },
      }),
    signOut: () => supabase.auth.signOut(),
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
