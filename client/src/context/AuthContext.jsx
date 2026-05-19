import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { syncFarmerProfileRequest } from '../services/farmersApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to sync farmer profile to database
  const syncFarmerProfile = async (authUser) => {
    if (!authUser) return;

    try {
      const response = await syncFarmerProfileRequest({
        userId: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email.split('@')[0],
        location: authUser.user_metadata?.location || null,
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
    const cleanupOAuthHash = () => {
      if (window.location.hash.includes('access_token=')) {
        window.location.replace(`${window.location.origin}/#/dashboard`);
      }
    };

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        syncFarmerProfile(session.user);
        cleanupOAuthHash();
      }
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        syncFarmerProfile(session.user);
        cleanupOAuthHash();
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
    signInWithGoogle: () => {
      return supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
    },
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
