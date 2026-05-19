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
        if (import.meta.env.PROD) {
          window.location.replace(`${window.location.origin}/dashboard`);
        } else {
          // Replace the URL with the app hash route so HashRouter works normally
          window.location.replace(`${window.location.origin}/#/dashboard`);
        }
      }
    };

    const handleOAuthFromUrl = async () => {
      if (window.location.hash.includes('access_token=')) {
        console.debug('[Auth] OAuth fragment detected in URL, attempting to parse session');
        try {
          const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
          console.debug('[Auth] getSessionFromUrl returned', { data, error });
          if (error) {
            console.error('Error parsing session from URL:', error);
          } else if (data?.session) {
            const session = data.session;
            setUser(session?.user ?? null);
            if (session?.user) {
              await syncFarmerProfile(session.user);
            }
          } else {
            console.warn('[Auth] getSessionFromUrl returned no session object');
          }
        } catch (e) {
          console.error('Exception parsing session from URL:', e);
        } finally {
          cleanupOAuthHash();
        }
      }
    };

    // First handle any OAuth fragment in the URL
    handleOAuthFromUrl().finally(() => {
      // Then check active sessions and set the user as usual
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          syncFarmerProfile(session.user);
        }
        setLoading(false);
      });
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
      // Use a real callback path in production so the browser router can own the callback route.
      // Keep the bare origin in development so HashRouter continues to work locally.
      const redirectTo = import.meta.env.PROD
        ? `${window.location.origin}/auth/callback`
        : window.location.origin;

      return supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
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
