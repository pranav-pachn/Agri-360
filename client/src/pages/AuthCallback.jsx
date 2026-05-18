import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Supabase handles the OAuth callback automatically through auth state listener
    // This page just waits for the user to be set, then redirects to dashboard
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '18px',
      color: '#666'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '20px', fontSize: '24px' }}>🔐 Completing sign-in...</div>
        <p>Please wait while we verify your authentication.</p>
      </div>
    </div>
  );
}
